import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { getUserSubscription } from "@/lib/subscription"
import Dashboard from "@/components/dashboard"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/")
  }

  // Get user subscription data
  const subscription = await getUserSubscription(session.user.id)

  return <Dashboard user={session.user} subscription={subscription} />
}
