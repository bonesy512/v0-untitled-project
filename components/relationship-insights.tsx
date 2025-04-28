"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useSubscription } from "./subscription-provider"
import { Sparkles } from "lucide-react"

interface Insight {
  id: string
  type: string
  content: string
  createdAt: string
}

export default function RelationshipInsights() {
  const [insights, setInsights] = useState<Insight[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("recent")
  const { toast } = useToast()
  const { tokens, refreshSubscription } = useSubscription()

  const fetchInsights = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/insights")

      if (!response.ok) {
        throw new Error("Failed to fetch insights")
      }

      const data = await response.json()
      setInsights(data.insights)
    } catch (error) {
      console.error("Error fetching insights:", error)
      toast({
        title: "Error",
        description: "Failed to fetch insights. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const generateInsight = async (type: string) => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/insights/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to generate insight")
      }

      const data = await response.json()

      // Add the new insight to the list
      setInsights((prev) => [data.insight, ...prev])

      // Refresh subscription data to update tokens
      refreshSubscription()

      toast({
        title: "Insight Generated",
        description: "Your relationship insight has been generated successfully.",
      })
    } catch (error) {
      console.error("Error generating insight:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate insight. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch insights when the component mounts
  useEffect(() => {
    fetchInsights()
  }, [])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Relationship Insights</CardTitle>
        <CardDescription>AI-powered insights to help you understand your relationship better</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="recent" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="generate">Generate</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>

          <TabsContent value="recent" className="space-y-4 mt-4">
            {insights.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No insights yet. Generate your first insight!</p>
              </div>
            ) : (
              insights.map((insight) => (
                <Card key={insight.id} className="overflow-hidden">
                  <CardHeader className="bg-muted/50 py-2">
                    <div className="flex justify-between items-center">
                      <p className="font-medium capitalize">{insight.type} Insight</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(insight.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p>{insight.content}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="generate" className="space-y-4 mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Daily Insight
                  </CardTitle>
                  <CardDescription>Get insights based on your recent check-ins</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button
                    onClick={() => generateInsight("daily")}
                    disabled={isLoading || tokens < 1}
                    className="w-full"
                  >
                    {tokens < 1 ? "Need Tokens" : "Generate (1 Token)"}
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Weekly Analysis
                  </CardTitle>
                  <CardDescription>Get a deeper analysis of your relationship patterns</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button
                    onClick={() => generateInsight("weekly")}
                    disabled={isLoading || tokens < 3}
                    className="w-full"
                  >
                    {tokens < 3 ? "Need Tokens" : "Generate (3 Tokens)"}
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Communication Tips
                  </CardTitle>
                  <CardDescription>Get personalized tips to improve communication</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button
                    onClick={() => generateInsight("communication")}
                    disabled={isLoading || tokens < 2}
                    className="w-full"
                  >
                    {tokens < 2 ? "Need Tokens" : "Generate (2 Tokens)"}
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Milestone Analysis
                  </CardTitle>
                  <CardDescription>Get insights based on your relationship timeline</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button
                    onClick={() => generateInsight("milestone")}
                    disabled={isLoading || tokens < 2}
                    className="w-full"
                  >
                    {tokens < 2 ? "Need Tokens" : "Generate (2 Tokens)"}
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="text-center mt-6">
              <p className="text-sm text-muted-foreground">
                You have <span className="font-medium">{tokens}</span> tokens available
              </p>
            </div>
          </TabsContent>

          <TabsContent value="favorites" className="space-y-4 mt-4">
            <div className="text-center py-8">
              <p className="text-muted-foreground">Favorite insights feature coming soon!</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
