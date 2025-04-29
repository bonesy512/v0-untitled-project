"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ArrowRight, Lock, Heart, Sparkles } from "lucide-react"
import SignInButton from "@/components/auth/sign-in-button"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
            Situationship Decoder
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Decode your relationship with AI-powered insights, track your journey, and gain deeper understanding
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <div>
            <h2 className="text-2xl font-bold mb-6">Understand Your Relationship</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>AI-powered relationship analysis using psychology and attachment theory</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Track your relationship journey with interactive timeline</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Daily check-ins to monitor relationship health and patterns</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Personalized insights on communication, attachment, and compatibility</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Earn rewards and unlock deeper insights as you track consistently</span>
              </li>
            </ul>

            <SignInButton className="mt-8 w-full md:w-auto px-6 py-2" />
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
                <CardTitle>Premium Subscription</CardTitle>
                <CardDescription className="text-purple-100">$9.99/month</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>Unlimited AI relationship insights</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>Advanced relationship analytics</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>Personalized growth recommendations</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>Relationship pattern detection</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <SignInButton
                  variant="default"
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                />
              </CardFooter>
            </Card>

            <div className="text-center text-sm text-gray-500 flex items-center justify-center gap-1">
              <Lock className="h-4 w-4" />
              <span>Secure payment processing with Stripe</span>
            </div>
          </div>
        </div>

        {/* Feature highlights */}
        <div className="mt-24 mb-12">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Heart className="h-8 w-8 text-purple-500" />
                </div>
                <CardTitle>Track Your Relationship</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Log daily check-ins and important milestones to build a complete picture of your relationship journey.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Sparkles className="h-8 w-8 text-pink-500" />
                </div>
                <CardTitle>Get AI Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Receive personalized insights based on psychology and attachment theory to understand your
                  relationship dynamics.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <ArrowRight className="h-8 w-8 text-amber-500" />
                </div>
                <CardTitle>Grow Together</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Apply the personalized recommendations to strengthen your connection and build a healthier
                  relationship.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
