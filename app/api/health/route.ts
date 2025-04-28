import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    // Simple query to check if the database is connected
    await db.$queryRaw`SELECT 1`

    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      database: "connected",
    })
  } catch (error) {
    console.error("Database connection error:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Database connection failed",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
