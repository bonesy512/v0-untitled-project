"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { CheckCircle, Sparkles, Coins, CreditCard } from "lucide-react"

export default function SubscriptionPlans({ currentPlan }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubscribe = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/subscription/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          price: "price_monthly_subscription", // This would be your actual Stripe price ID
        }),
      })

      const data = await response.json()

      if (data.url) {
        router.push(data.url)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initiate subscription. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePurchaseTokens = async (amount) => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/tokens/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tokenAmount: amount }),
      })

      const data = await response.json()

      if (data.url) {
        router.push(data.url)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initiate token purchase. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
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

        <Card className={`shadow-md ${currentPlan === "premium" ? "border-purple-300" : "border-purple-200"}`}>
          <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <CardTitle>Premium Plan</CardTitle>
            </div>
            <CardDescription className="text-purple-100">Advanced relationship insights</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-3xl font-bold mb-1">$9.99</p>
            <p className="text-sm text-gray-500 mb-6">per month</p>
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
          <CardFooter>
            {currentPlan === "premium" ? (
              <Button variant="outline" className="w-full" disabled>
                Current Plan
              </Button>
            ) : (
              <Button
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                onClick={handleSubscribe}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Subscribe Now"}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>

      <Card className="shadow-md border-amber-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-amber-500" />
            <CardTitle>Insight Tokens</CardTitle>
          </div>
          <CardDescription>Purchase tokens for individual insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <Card className="border-amber-100">
              <CardHeader className="p-4">
                <CardTitle className="text-lg">5 Tokens</CardTitle>
                <CardDescription>$2.49</CardDescription>
              </CardHeader>
              <CardFooter className="p-4 pt-0">
                <Button
                  variant="outline"
                  className="w-full border-amber-200 hover:bg-amber-50"
                  onClick={() => handlePurchaseTokens(5)}
                  disabled={isLoading || currentPlan === "premium"}
                >
                  <Coins className="h-4 w-4 mr-2 text-amber-500" />
                  Buy
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-amber-100">
              <CardHeader className="p-4">
                <CardTitle className="text-lg">10 Tokens</CardTitle>
                <CardDescription>$4.99</CardDescription>
              </CardHeader>
              <CardFooter className="p-4 pt-0">
                <Button
                  variant="outline"
                  className="w-full border-amber-200 hover:bg-amber-50"
                  onClick={() => handlePurchaseTokens(10)}
                  disabled={isLoading || currentPlan === "premium"}
                >
                  <Coins className="h-4 w-4 mr-2 text-amber-500" />
                  Buy
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-amber-100">
              <CardHeader className="p-4">
                <CardTitle className="text-lg">25 Tokens</CardTitle>
                <CardDescription>$9.99</CardDescription>
              </CardHeader>
              <CardFooter className="p-4 pt-0">
                <Button
                  variant="outline"
                  className="w-full border-amber-200 hover:bg-amber-50"
                  onClick={() => handlePurchaseTokens(25)}
                  disabled={isLoading || currentPlan === "premium"}
                >
                  <Coins className="h-4 w-4 mr-2 text-amber-500" />
                  Buy
                </Button>
              </CardFooter>
            </Card>
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
  )
}
