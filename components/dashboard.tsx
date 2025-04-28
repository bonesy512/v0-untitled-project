"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { useSubscription } from "@/components/subscription-provider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import SituationshipDecoder from "@/components/situationship-decoder"
import DailyCheckIn from "@/components/daily-check-in"
import RelationshipInsights from "@/components/relationship-insights"
import SubscriptionPlans from "@/components/subscription-plans"
import { CreditCard, LogOut, Award, Sparkles, Coins } from "lucide-react"

export default function Dashboard({ user, subscription }) {
  const router = useRouter()
  const { isSubscribed, tokens, refreshTokens } = useSubscription()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("decoder")
  const [streakDays, setStreakDays] = useState(0)
  const [lastCheckIn, setLastCheckIn] = useState(null)

  useEffect(() => {
    // Fetch user streak and last check-in data
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user/stats")
        const data = await response.json()
        setStreakDays(data.streakDays)
        setLastCheckIn(data.lastCheckIn)
      } catch (error) {
        console.error("Failed to fetch user stats:", error)
      }
    }

    fetchUserData()
  }, [])

  const handlePurchaseTokens = async (amount) => {
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
        description: "Failed to initiate token purchase",
        variant: "destructive",
      })
    }
  }

  const handleCheckInComplete = async () => {
    // Update streak and last check-in
    await refreshTokens()

    // Fetch updated stats
    try {
      const response = await fetch("/api/user/stats")
      const data = await response.json()
      setStreakDays(data.streakDays)
      setLastCheckIn(data.lastCheckIn)

      toast({
        title: "Check-in complete!",
        description: `You've maintained a ${data.streakDays}-day streak!`,
      })
    } catch (error) {
      console.error("Failed to update stats:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pb-12">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            Situationship Decoder
          </h1>

          <div className="flex items-center gap-4">
            {isSubscribed ? (
              <span className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full flex items-center">
                <Sparkles className="h-3 w-3 mr-1" /> Premium
              </span>
            ) : (
              <span className="text-xs flex items-center">
                <Coins className="h-3 w-3 mr-1 text-amber-500" /> {tokens} tokens
              </span>
            )}

            <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
              <LogOut className="h-4 w-4 mr-1" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Daily Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Award className="h-8 w-8 text-amber-500 mr-2" />
                <div>
                  <p className="text-2xl font-bold">{streakDays} days</p>
                  <p className="text-xs text-gray-500">
                    {lastCheckIn ? `Last check-in: ${new Date(lastCheckIn).toLocaleDateString()}` : "No check-ins yet"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Subscription</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CreditCard className="h-8 w-8 text-purple-500 mr-2" />
                <div>
                  <p className="text-lg font-bold">{isSubscribed ? "Premium" : "Free"}</p>
                  <p className="text-xs text-gray-500">{isSubscribed ? "Unlimited insights" : "Limited insights"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Insight Tokens</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Coins className="h-8 w-8 text-amber-500 mr-2" />
                  <p className="text-2xl font-bold">{tokens}</p>
                </div>
                <Button size="sm" onClick={() => handlePurchaseTokens(10)}>
                  Buy More
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="decoder">Decoder</TabsTrigger>
            <TabsTrigger value="check-in">Daily Check-in</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
          </TabsList>

          <TabsContent value="decoder">
            <SituationshipDecoder />
          </TabsContent>

          <TabsContent value="check-in">
            <DailyCheckIn onComplete={handleCheckInComplete} lastCheckIn={lastCheckIn} />
          </TabsContent>

          <TabsContent value="insights">
            <RelationshipInsights isSubscribed={isSubscribed} tokens={tokens} onTokensUpdated={refreshTokens} />
          </TabsContent>

          <TabsContent value="subscription">
            <SubscriptionPlans currentPlan={isSubscribed ? "premium" : "free"} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
