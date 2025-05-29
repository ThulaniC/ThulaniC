import { NextResponse } from "next/server"
import { getGarages } from "@/lib/database"

export async function GET() {
  try {
    const garages = await getGarages()
    return NextResponse.json({ garages })
  } catch (error) {
    console.error("Error fetching garages:", error)
    return NextResponse.json({ error: "Failed to fetch garages" }, { status: 500 })
  }
}
