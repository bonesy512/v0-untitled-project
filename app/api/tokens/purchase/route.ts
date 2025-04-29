import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getStripe } from "@/lib/stripe"
import { absoluteUrl } from "@/lib/utils"
import prisma from "@/lib/db"

// Define the token packages with their Stripe price IDs
// Replace these with your actual Stripe price IDs
const TOKEN_PRICES = {
  price_5_tokens: "price_1OxYaJJHRTVHmbHmQwYgGjL2", // Replace with your actual Stripe price ID
  price_10_tokens: "price_1OxYaZJHRTVHmbHmQwYgGjL2", // Replace with your actual Stripe price ID
  price_25_tokens: "price_1OxYapJHRTVHmbHmQwYgGjL2", // Replace with your actual Stripe price ID
}

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
    const { tokenAmount, priceId } = body

    if (!tokenAmount || !priceId || !TOKEN_PRICES[priceId]) {
      return new NextResponse("Invalid request parameters", { status: 400 })
    }

    // Create a Stripe customer if one doesn't exist
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { subscription: true },
    })

    let customerId = user?.subscription?.stripeCustomerId

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email!,
        name: session.user.name || undefined,
        metadata: {
          userId: session.user.id,
        },
      })

      customerId = customer.id

      // Save the customer ID to the database
      await prisma.subscription.create({
        data: {
          userId: session.user.id,
          stripeCustomerId: customerId,
          status: "inactive",
        },
      })
    }

    // Create a checkout session
    const stripeSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      billing_address_collection: "auto",
      line_items: [
        {
          price: TOKEN_PRICES[priceId],
          quantity: 1,
        },
      ],
      mode: "payment",
      allow_promotion_codes: true,
      success_url: absoluteUrl(`/dashboard?success=true&tokens=${tokenAmount}`),
      cancel_url: absoluteUrl("/dashboard?canceled=true"),
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
