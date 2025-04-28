"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type SubscriptionStatus = "active" | "inactive" | "past_due" | "canceled" | "unknown"

interface SubscriptionContextType {
  status: SubscriptionStatus
  isLoading: boolean
  tokens: number
  refreshSubscription: () => Promise<void>
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  status: "unknown",
  isLoading: true,
  tokens: 0,
  refreshSubscription: async () => {},
})

export const useSubscription = () => useContext(SubscriptionContext)

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<SubscriptionStatus>("unknown")
  const [isLoading, setIsLoading] = useState(true)
  const [tokens, setTokens] = useState(0)

  const fetchSubscription = async () => {
    try {
      const response = await fetch("/api/subscription")
      if (!response.ok) {
        console.error("Failed to fetch subscription status")
        setStatus("unknown")
        return
      }

      const data = await response.json()
      setStatus(data.status || "inactive")
      setTokens(data.tokens || 0)
    } catch (error) {
      console.error("Error fetching subscription:", error)
      setStatus("unknown")
    } finally {
      setIsLoading(false)
    }
  }

  const refreshSubscription = async () => {
    setIsLoading(true)
    await fetchSubscription()
  }

  useEffect(() => {
    fetchSubscription()
  }, [])

  return (
    <SubscriptionContext.Provider value={{ status, isLoading, tokens, refreshSubscription }}>
      {children}
    </SubscriptionContext.Provider>
  )
}
