import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getStripe } from "@/lib/stripe"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const stripe = getStripe()
    if (!stripe) {
      return new NextResponse("Stripe is not configured", { status: 503 })
    }

    const body = await req.json()
    const { price, returnUrl } = body

    if (!price) {
      return new NextResponse("Price ID is required", { status: 400 })
    }

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: returnUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?canceled=true`,
      mode: "subscription",
      line_items: [
        {
          price,
          quantity: 1,
        },
      ],
      metadata: {
        userId: session.user.id,
      },
    })

    return NextResponse.json({ url: stripeSession.url })
  } catch (error) {
    console.error("Subscription error:", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
