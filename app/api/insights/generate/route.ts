import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { type } = body

    if (!type) {
      return new NextResponse("Insight type is required", { status: 400 })
    }

    // Define token costs for different insight types
    const tokenCosts: Record<string, number> = {
      daily: 1,
      weekly: 3,
      communication: 2,
      milestone: 2,
    }

    const tokenCost = tokenCosts[type] || 1

    // Check if user has enough tokens
    const user = await db.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        tokens: true,
      },
    })

    if (!user) {
      return new NextResponse("User not found", { status: 404 })
    }

    if (user.tokens < tokenCost) {
      return new NextResponse("Not enough tokens", { status: 402 })
    }

    // Fetch user data for generating insights
    const userData = await fetchUserData(session.user.id, type)

    // Generate insight using AI
    const insightContent = await generateInsight(type, userData)

    // Save the insight to the database
    const insight = await db.insight.create({
      data: {
        userId: session.user.id,
        type,
        content: insightContent,
        tokenUsed: true,
      },
    })

    // Deduct tokens from user
    await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        tokens: {
          decrement: tokenCost,
        },
      },
    })

    return NextResponse.json({
      success: true,
      insight: {
        id: insight.id,
        type: insight.type,
        content: insight.content,
        createdAt: insight.createdAt,
      },
    })
  } catch (error) {
    console.error("Insight generation error:", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

async function fetchUserData(userId: string, type: string) {
  // Fetch relevant user data based on insight type
  switch (type) {
    case "daily":
      // Fetch recent check-ins
      const recentCheckIns = await db.checkIn.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 3,
      })
      return { checkIns: recentCheckIns }

    case "weekly":
      // Fetch check-ins from the past week
      const weeklyCheckIns = await db.checkIn.findMany({
        where: {
          userId,
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      })

      // Fetch relationship data
      const relationshipData = await db.relationshipData.findUnique({
        where: {
          userId,
        },
      })

      return { checkIns: weeklyCheckIns, relationshipData }

    case "communication":
      // Fetch check-ins with focus on communication
      const communicationCheckIns = await db.checkIn.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      })

      return { checkIns: communicationCheckIns }

    case "milestone":
      // Fetch milestones
      const milestones = await db.milestone.findMany({
        where: {
          userId,
        },
        orderBy: {
          date: "desc",
        },
      })

      return { milestones }

    default:
      return {}
  }
}

async function generateInsight(type: string, userData: any) {
  try {
    // Define prompts based on insight type
    const prompts: Record<string, string> = {
      daily: `Based on the user's recent check-ins, provide a thoughtful insight about their relationship. 
              Focus on patterns in mood (${userData.checkIns?.[0]?.mood || "N/A"}), 
              connection (${userData.checkIns?.[0]?.connection || "N/A"}), and 
              communication (${userData.checkIns?.[0]?.communication || "N/A"}).
              Recent highlight: "${userData.checkIns?.[0]?.highlight || "None"}"
              Recent challenge: "${userData.checkIns?.[0]?.challenge || "None"}"
              Provide specific, actionable advice tailored to their situation.
              Keep your response under 200 words and make it personal and empathetic.`,

      weekly: `Analyze the user's relationship patterns over the past week.
               Look for trends in mood, connection, and communication.
               Identify areas of strength and opportunities for growth.
               Provide 3 specific, actionable recommendations to improve their relationship.
               Keep your response under 300 words and make it personal and empathetic.`,

      communication: `Based on the user's check-ins, provide specific communication tips tailored to their relationship.
                      Focus on improving their communication style, addressing challenges, and building stronger connection.
                      Provide 3-4 practical communication techniques they can implement immediately.
                      Keep your response under 250 words and make it personal and empathetic.`,

      milestone: `Analyze the user's relationship milestones and provide insights on their relationship journey.
                  Identify patterns in their milestone types (positive, challenging, etc.).
                  Comment on the progression of their relationship based on these milestones.
                  Provide guidance on how to create more positive milestones moving forward.
                  Keep your response under 250 words and make it personal and empathetic.`,
    }

    const prompt = prompts[type] || prompts.daily

    // Generate text using AI SDK
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      system:
        "You are a relationship coach with expertise in psychology and interpersonal dynamics. Provide thoughtful, personalized insights based on the user's relationship data. Be empathetic, specific, and actionable in your advice. Avoid generic platitudes and focus on practical guidance tailored to their unique situation.",
    })

    return text
  } catch (error) {
    console.error("AI generation error:", error)
    return "We couldn't generate a personalized insight at this time. Please try again later."
  }
}
