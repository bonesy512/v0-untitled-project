import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const user = await db.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        tokens: true,
        streakDays: true,
        lastCheckIn: true,
      },
    })

    if (!user) {
      return new NextResponse("User not found", { status: 404 })
    }

    return NextResponse.json({
      tokens: user.tokens,
      streakDays: user.streakDays,
      lastCheckIn: user.lastCheckIn,
    })
  } catch (error) {
    console.error("Stats fetch error:", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
