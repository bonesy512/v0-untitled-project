"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, Sparkles, Coins, CreditCard, Loader2 } from "lucide-react"

// Define the subscription plans
const SUBSCRIPTION_PLANS = {
  MONTHLY: {
    name: "Monthly",
    priceId: "price_monthly", // Replace with your actual Stripe price ID
    price: "$9.99",
    interval: "month",
  },
  YEARLY: {
    name: "Yearly",
    priceId: "price_yearly", // Replace with your actual Stripe price ID
    price: "$99.99",
    interval: "year",
    savings: "Save 17%",
  },
}

// Define token packages
const TOKEN_PACKAGES = [
  { amount: 5, price: 2.49, priceId: "price_5_tokens" }, // Replace with your actual Stripe price ID
  { amount: 10, price: 4.99, priceId: "price_10_tokens" }, // Replace with your actual Stripe price ID
  { amount: 25, price: 9.99, priceId: "price_25_tokens" }, // Replace with your actual Stripe price ID
]

interface SubscriptionPlansProps {
  currentPlan?: string
  tokens?: number
}

export default function SubscriptionPlans({ currentPlan = "free", tokens = 0 }: SubscriptionPlansProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const isPremium = currentPlan !== "free"

  const handleSubscribe = async (priceId: string) => {
    setIsLoading(priceId)

    try {
      const response = await fetch("/api/subscription/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          price: priceId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create subscription")
      }

      const data = await response.json()

      if (data.url) {
        router.push(data.url)
      }
    } catch (error) {
      console.error("Subscription error:", error)
      toast({
        title: "Error",
        description: "Failed to create subscription. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(null)
    }
  }

  const handlePurchaseTokens = async (amount: number, price: number, priceId: string) => {
    setIsLoading(priceId)

    try {
      const response = await fetch("/api/tokens/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tokenAmount: amount,
          price: price,
          priceId: priceId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to purchase tokens")
      }

      const data = await response.json()

      if (data.url) {
        router.push(data.url)
      }
    } catch (error) {
      console.error("Token purchase error:", error)
      toast({
        title: "Error",
        description: "Failed to purchase tokens. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-6">Subscription Plans</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className={`shadow-md ${currentPlan === "free" ? "border-gray-300" : "border-gray-200"}`}>
            <CardHeader>
              <CardTitle>Free Plan</CardTitle>
              <CardDescription>Basic relationship tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold mb-6">$0</p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Basic relationship decoder</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Daily check-ins</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Relationship timeline</span>
                </li>
                <li className="flex items-start text-gray-400">
                  <span className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5">✕</span>
                  <span>AI-powered insights (requires tokens)</span>
                </li>
                <li className="flex items-start text-gray-400">
                  <span className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5">✕</span>
                  <span>Advanced relationship analytics</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" disabled>
                Current Plan
              </Button>
            </CardFooter>
          </Card>

          <Card className={`shadow-md ${isPremium ? "border-purple-300" : "border-purple-200"}`}>
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                <CardTitle>Premium Plan</CardTitle>
              </div>
              <CardDescription className="text-purple-100">Advanced relationship insights</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-3xl font-bold">{SUBSCRIPTION_PLANS.MONTHLY.price}</p>
                  <p className="text-sm text-gray-500">per month</p>
                </div>
                <div>
                  <p className="text-xl font-bold">{SUBSCRIPTION_PLANS.YEARLY.price}</p>
                  <p className="text-sm text-green-600 font-medium">{SUBSCRIPTION_PLANS.YEARLY.savings}</p>
                </div>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Everything in Free plan</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Unlimited AI-powered insights</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Advanced relationship analytics</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Personalized growth recommendations</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Relationship pattern detection</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="flex flex-col space-y-3">
              {isPremium ? (
                <Button variant="outline" className="w-full" disabled>
                  Current Plan
                </Button>
              ) : (
                <>
                  <Button
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    onClick={() => handleSubscribe(SUBSCRIPTION_PLANS.MONTHLY.priceId)}
                    disabled={isLoading === SUBSCRIPTION_PLANS.MONTHLY.priceId}
                  >
                    {isLoading === SUBSCRIPTION_PLANS.MONTHLY.priceId ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>Subscribe Monthly</>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleSubscribe(SUBSCRIPTION_PLANS.YEARLY.priceId)}
                    disabled={isLoading === SUBSCRIPTION_PLANS.YEARLY.priceId}
                  >
                    {isLoading === SUBSCRIPTION_PLANS.YEARLY.priceId ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>Subscribe Yearly (Save 17%)</>
                    )}
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>

      {!isPremium && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Token Packages</h2>
          <Card className="shadow-md border-amber-200">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-amber-500" />
                <CardTitle>Insight Tokens</CardTitle>
              </div>
              <CardDescription>Purchase tokens for individual insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {TOKEN_PACKAGES.map((pkg) => (
                  <Card key={pkg.amount} className="border-amber-100">
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">{pkg.amount} Tokens</CardTitle>
                      <CardDescription>${pkg.price.toFixed(2)}</CardDescription>
                    </CardHeader>
                    <CardFooter className="p-4 pt-0">
                      <Button
                        variant="outline"
                        className="w-full border-amber-200 hover:bg-amber-50"
                        onClick={() => handlePurchaseTokens(pkg.amount, pkg.price, pkg.priceId)}
                        disabled={isLoading === pkg.priceId}
                      >
                        {isLoading === pkg.priceId ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Coins className="h-4 w-4 mr-2 text-amber-500" />
                            Buy Now
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
            <CardFooter className="bg-amber-50 border-t border-amber-100">
              <div className="flex items-center text-sm text-amber-700">
                <CreditCard className="h-4 w-4 mr-2" />
                <span>Secure payment processing with Stripe</span>
              </div>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}
