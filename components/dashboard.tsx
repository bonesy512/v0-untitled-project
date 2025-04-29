"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import SituationshipDecoder from "@/components/situationship-decoder"
import DailyCheckIn from "@/components/daily-check-in"
import RelationshipInsights from "@/components/relationship-insights"
import SubscriptionPlans from "@/components/subscription/subscription-plans"
import UserProfile from "@/components/user/user-profile"
import { useSearchParams } from "next/navigation"

interface DashboardProps {
  user: {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
  }
  subscription: {
    isActive: boolean
    expiresAt?: Date | null
  }
}

export default function Dashboard({ user, subscription }: DashboardProps) {
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("decoder")
  const [tokens, setTokens] = useState(0)
  const [streakDays, setStreakDays] = useState(0)
  const [lastCheckIn, setLastCheckIn] = useState<string | null>(null)

  // Check for success or canceled URL parameters
  useEffect(() => {
    const success = searchParams.get("success")
    const canceled = searchParams.get("canceled")
    const tokensAdded = searchParams.get("tokens")

    if (success === "true") {
      if (tokensAdded) {
        toast({
          title: "Purchase Successful",
          description: `${tokensAdded} tokens have been added to your account.`,
        })
      } else {
        toast({
          title: "Subscription Successful",
          description: "Your premium subscription is now active.",
        })
      }
    } else if (canceled === "true") {
      toast({
        title: "Purchase Canceled",
        description: "Your purchase was canceled. No charges were made.",
        variant: "destructive",
      })
    }
  }, [searchParams, toast])

  // Fetch user stats
  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const response = await fetch("/api/user/stats")
        const data = await response.json()

        setTokens(data.tokens)
        setStreakDays(data.streakDays)
        setLastCheckIn(data.lastCheckIn)
      } catch (error) {
        console.error("Failed to fetch user stats:", error)
      }
    }

    fetchUserStats()
  }, [])

  const handleCheckInComplete = async () => {
    // Refresh user stats after check-in
    try {
      const response = await fetch("/api/user/stats")
      const data = await response.json()

      setTokens(data.tokens)
      setStreakDays(data.streakDays)
      setLastCheckIn(data.lastCheckIn)
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
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2">
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
                <RelationshipInsights />
              </TabsContent>

              <TabsContent value="subscription">
                <SubscriptionPlans currentPlan={subscription.isActive ? "premium" : "free"} tokens={tokens} />
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <UserProfile user={user} subscription={subscription} tokens={tokens} streakDays={streakDays} />
          </div>
        </div>
      </div>
    </div>
  )
}
