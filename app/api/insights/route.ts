import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const insights = await db.insight.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    })

    return NextResponse.json({
      insights: insights.map((insight) => ({
        id: insight.id,
        type: insight.type,
        content: insight.content,
        createdAt: insight.createdAt,
      })),
    })
  } catch (error) {
    console.error("Insights fetch error:", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
