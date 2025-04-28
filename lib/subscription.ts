import { db } from "@/lib/db"

export async function getUserSubscription(userId: string) {
  try {
    const subscription = await db.subscription.findUnique({
      where: {
        userId,
      },
    })

    return {
      ...subscription,
      isActive: subscription?.status === "active",
    }
  } catch (error) {
    console.error("Error fetching user subscription:", error)
    return {
      isActive: false,
    }
  }
}
