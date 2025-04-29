import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  const session = await getServerSession(authOptions)

  return NextResponse.json({
    authenticated: !!session,
    session: session
      ? {
          user: {
            name: session.user.name,
            email: session.user.email,
            image: session.user.image,
          },
          expires: session.expires,
        }
      : null,
  })
}
