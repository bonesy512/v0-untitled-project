import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  // Get the pathname
  const pathname = request.nextUrl.pathname

  // Get the token - this verifies if the user is authenticated
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // Add debug logging
  console.log(`Middleware checking path: ${pathname}, authenticated: ${!!token}`)

  // Define public routes that don't require authentication
  const publicRoutes = ["/", "/login", "/api/auth"]
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  // Redirect unauthenticated users to the login page for protected routes
  if (!token && pathname.startsWith("/dashboard")) {
    console.log("Redirecting unauthenticated user to home page")
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Redirect authenticated users away from login/home to dashboard
  if (token && pathname === "/") {
    console.log("Redirecting authenticated user to dashboard")
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Allow the request to proceed
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all routes except for API routes that aren't auth-related,
    // static files, and other special routes
    "/((?!_next/static|_next/image|favicon.ico|api/(?!auth)).*)",
  ],
}
