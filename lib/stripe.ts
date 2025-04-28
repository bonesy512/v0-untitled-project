// This file provides a function to get the Stripe instance only at runtime
import Stripe from "stripe"

let stripeInstance: Stripe | null = null

export function getStripe(): Stripe | null {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.warn("STRIPE_SECRET_KEY is not defined")
    return null
  }

  if (!stripeInstance && process.env.STRIPE_SECRET_KEY) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16",
      typescript: true,
    })
  }

  return stripeInstance
}
