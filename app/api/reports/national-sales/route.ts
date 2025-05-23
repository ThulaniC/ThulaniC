import { NextResponse } from "next/server"
import { getNationalSalesSummary } from "@/lib/database"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get("startDate") || "2023-01-01"
    const endDate = searchParams.get("endDate") || "2023-12-31"

    const salesSummary = await getNationalSalesSummary(startDate, endDate)
    return NextResponse.json({ salesSummary })
  } catch (error) {
    console.error("Error fetching national sales summary:", error)
    return NextResponse.json({ error: "Failed to fetch national sales summary" }, { status: 500 })
  }
}
