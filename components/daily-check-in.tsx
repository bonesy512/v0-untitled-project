"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"
import { useSubscription } from "./subscription-provider"

const checkInSchema = z.object({
  mood: z.number().min(1).max(10),
  connection: z.number().min(1).max(10),
  communication: z.number().min(1).max(10),
  highlight: z.string().optional(),
  challenge: z.string().optional(),
})

type CheckInFormValues = z.infer<typeof checkInSchema>

export default function DailyCheckIn() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const { refreshSubscription } = useSubscription()

  const form = useForm<CheckInFormValues>({
    resolver: zodResolver(checkInSchema),
    defaultValues: {
      mood: 5,
      connection: 5,
      communication: 5,
      highlight: "",
      challenge: "",
    },
  })

  async function onSubmit(data: CheckInFormValues) {
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/check-in/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to submit check-in")
      }

      const result = await response.json()

      toast({
        title: "Check-in submitted!",
        description:
          result.streakDays > 1
            ? `You're on a ${result.streakDays} day streak! Keep it up!`
            : "Come back tomorrow to build your streak!",
      })

      // Reset form
      form.reset({
        mood: 5,
        connection: 5,
        communication: 5,
        highlight: "",
        challenge: "",
      })

      // Refresh subscription data to update tokens
      refreshSubscription()
    } catch (error) {
      console.error("Error submitting check-in:", error)
      toast({
        title: "Error",
        description: "Failed to submit check-in. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Daily Check-In</CardTitle>
        <CardDescription>Track your relationship health with a quick daily check-in</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="mood"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mood Today</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Slider
                        min={1}
                        max={10}
                        step={1}
                        defaultValue={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Low</span>
                        <span>Current: {field.value}</span>
                        <span>High</span>
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>How are you feeling today overall?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="connection"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Connection Level</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Slider
                        min={1}
                        max={10}
                        step={1}
                        defaultValue={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Distant</span>
                        <span>Current: {field.value}</span>
                        <span>Close</span>
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>How connected do you feel with your partner today?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="communication"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Communication Quality</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Slider
                        min={1}
                        max={10}
                        step={1}
                        defaultValue={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Poor</span>
                        <span>Current: {field.value}</span>
                        <span>Excellent</span>
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>How would you rate your communication today?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="highlight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Today's Highlight</FormLabel>
                  <FormControl>
                    <Textarea placeholder="What was the best part of your relationship today?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="challenge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Today's Challenge</FormLabel>
                  <FormControl>
                    <Textarea placeholder="What was challenging in your relationship today?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Submitting..." : "Submit Check-In"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
