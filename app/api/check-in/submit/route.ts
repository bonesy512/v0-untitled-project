import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { mood, connection, communication, highlight, challenge } = body

    // Validate required fields
    if (mood === undefined || connection === undefined || communication === undefined) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    // Get the user
    const user = await db.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        lastCheckIn: true,
        streakDays: true,
      },
    })

    if (!user) {
      return new NextResponse("User not found", { status: 404 })
    }

    // Calculate streak
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const lastCheckIn = user.lastCheckIn ? new Date(user.lastCheckIn) : null
    const lastCheckInDay = lastCheckIn
      ? new Date(lastCheckIn.getFullYear(), lastCheckIn.getMonth(), lastCheckIn.getDate())
      : null

    // Calculate if this is a new day compared to the last check-in
    const isNewDay = !lastCheckInDay || today.getTime() > lastCheckInDay.getTime()

    // Calculate if the streak continues (today or yesterday was the last check-in)
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const isStreakContinuing =
      lastCheckInDay &&
      (lastCheckInDay.getTime() === yesterday.getTime() || lastCheckInDay.getTime() === today.getTime())

    // Calculate new streak days
    let newStreakDays = user.streakDays
    if (isNewDay) {
      if (isStreakContinuing) {
        newStreakDays += 1
      } else {
        newStreakDays = 1
      }
    }

    // Create the check-in
    await db.checkIn.create({
      data: {
        userId: session.user.id,
        mood,
        connection,
        communication,
        highlight,
        challenge,
      },
    })

    // Update user's streak and last check-in
    const updatedUser = await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        lastCheckIn: now,
        streakDays: newStreakDays,
        // Add a token for completing a check-in if it's a new day
        tokens: isNewDay
          ? {
              increment: 1,
            }
          : undefined,
      },
    })

    return NextResponse.json({
      success: true,
      streakDays: updatedUser.streakDays,
      tokens: updatedUser.tokens,
    })
  } catch (error) {
    console.error("Check-in error:", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
