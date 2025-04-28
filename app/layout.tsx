import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import { SubscriptionProvider } from "@/components/subscription-provider"
import { Toaster } from "@/components/ui/toaster"

export const metadata = {
  title: "Situationship Decoder",
  description: "Track and decode your relationship with AI-powered insights",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <SubscriptionProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
              {children}
              <Toaster />
            </ThemeProvider>
          </SubscriptionProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
