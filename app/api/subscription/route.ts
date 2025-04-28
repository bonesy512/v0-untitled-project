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

    const user = await db.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        tokens: true,
        subscription: {
          select: {
            status: true,
            stripeCurrentPeriodEnd: true,
          },
        },
      },
    })

    if (!user) {
      return new NextResponse("User not found", { status: 404 })
    }

    const subscription = user.subscription
    const isSubscribed =
      subscription?.status === "active" && (subscription.stripeCurrentPeriodEnd?.getTime() ?? 0) > Date.now()

    return NextResponse.json({
      status: subscription?.status || "inactive",
      isSubscribed,
      tokens: user.tokens || 0,
    })
  } catch (error) {
    console.error("Subscription error:", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
