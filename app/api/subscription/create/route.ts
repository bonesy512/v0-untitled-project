import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getStripe } from "@/lib/stripe"
import { absoluteUrl } from "@/lib/utils"
import prisma from "@/lib/db"

// Define the subscription plans with their Stripe price IDs
// Replace these with your actual Stripe price IDs
const SUBSCRIPTION_PRICES = {
  price_monthly: "price_1OxYZ1JHRTVHmbHmZcGGQzYN", // Replace with your actual Stripe price ID
  price_yearly: "price_1OxYZJJHRTVHmbHmQwYgGjL2", // Replace with your actual Stripe price ID
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
    const { price } = body

    if (!price || !SUBSCRIPTION_PRICES[price]) {
      return new NextResponse("Invalid price ID", { status: 400 })
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
          price: SUBSCRIPTION_PRICES[price],
          quantity: 1,
        },
      ],
      mode: "subscription",
      allow_promotion_codes: true,
      success_url: absoluteUrl("/dashboard?success=true"),
      cancel_url: absoluteUrl("/dashboard?canceled=true"),
      metadata: {
        userId: session.user.id,
        priceId: SUBSCRIPTION_PRICES[price],
      },
    })

    return NextResponse.json({ url: stripeSession.url })
  } catch (error) {
    console.error("Subscription error:", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
