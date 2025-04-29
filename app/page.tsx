import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import LandingPage from "@/components/landing-page"

export default async function Home() {
  const session = await getServerSession(authOptions)

  // If user is logged in, redirect to dashboard
  // This is a server-side check to complement the middleware
  if (session) {
    console.log("Home page: User is authenticated, redirecting to dashboard")
    redirect("/dashboard")
    return null
  }

  console.log("Home page: User is not authenticated, showing landing page")
  return <LandingPage />
}
