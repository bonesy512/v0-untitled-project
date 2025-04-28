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
    const { tokenAmount, returnUrl } = body

    if (!tokenAmount) {
      return new NextResponse("Token amount is required", { status: 400 })
    }

    // Calculate price based on token amount
    const pricePerToken = 0.5 // $0.50 per token
    const totalAmount = Math.round(tokenAmount * pricePerToken * 100) // in cents

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: returnUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?canceled=true`,
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${tokenAmount} Insight Tokens`,
              description: "Tokens for AI relationship insights",
            },
            unit_amount: totalAmount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: session.user.id,
        tokenAmount: tokenAmount.toString(),
        type: "token_purchase",
      },
    })

    return NextResponse.json({ url: stripeSession.url })
  } catch (error) {
    console.error("Token purchase error:", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
