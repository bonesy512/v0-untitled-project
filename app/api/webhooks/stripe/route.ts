import { NextResponse } from "next/server"
import { getStripe } from "@/lib/stripe"
import { db } from "@/lib/db"

// This is your Stripe webhook secret for testing your endpoint locally.
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req: Request) {
  try {
    const stripe = getStripe()
    if (!stripe) {
      return new NextResponse("Stripe is not configured", { status: 503 })
    }

    const body = await req.text()
    const signature = req.headers.get("stripe-signature") as string

    let event

    try {
      if (!webhookSecret) {
        return new NextResponse("Webhook secret is not configured", { status: 503 })
      }

      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error(`⚠️ Webhook signature verification failed.`, err)
      return new NextResponse(`Webhook Error: ${err instanceof Error ? err.message : "Unknown error"}`, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object

        // Handle subscription creation
        if (session.mode === "subscription" && session.metadata?.userId) {
          await db.subscription.upsert({
            where: {
              userId: session.metadata.userId,
            },
            update: {
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: session.subscription as string,
              stripePriceId: session.metadata.priceId,
              stripeCurrentPeriodEnd: new Date(
                (session.subscription_data?.trial_end || Date.now() / 1000 + 30 * 24 * 60 * 60) * 1000,
              ),
              status: "active",
            },
            create: {
              userId: session.metadata.userId,
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: session.subscription as string,
              stripePriceId: session.metadata.priceId,
              stripeCurrentPeriodEnd: new Date(
                (session.subscription_data?.trial_end || Date.now() / 1000 + 30 * 24 * 60 * 60) * 1000,
              ),
              status: "active",
            },
          })
        }

        // Handle token purchase
        if (session.mode === "payment" && session.metadata?.userId && session.metadata?.tokenAmount) {
          const tokenAmount = Number.parseInt(session.metadata.tokenAmount, 10)

          await db.user.update({
            where: {
              id: session.metadata.userId,
            },
            data: {
              tokens: {
                increment: tokenAmount,
              },
            },
          })
        }
        break

      case "invoice.payment_succeeded":
        const invoice = event.data.object

        // Update subscription period
        if (invoice.subscription && invoice.customer) {
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string)

          await db.subscription.updateMany({
            where: {
              stripeSubscriptionId: invoice.subscription as string,
            },
            data: {
              stripePriceId: subscription.items.data[0].price.id,
              stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
              status: "active",
            },
          })
        }
        break

      case "customer.subscription.deleted":
        const deletedSubscription = event.data.object

        await db.subscription.updateMany({
          where: {
            stripeSubscriptionId: deletedSubscription.id,
          },
          data: {
            status: "canceled",
            stripeCurrentPeriodEnd: new Date(deletedSubscription.current_period_end * 1000),
          },
        })
        break

      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return new NextResponse("Webhook error", { status: 500 })
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
