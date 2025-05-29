import { type NextRequest, NextResponse } from "next/server"
import { parseCSV, validateCSVData } from "../../../lib/csv-import"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const tableName = formData.get("tableName") as string | null

    if (!file || !tableName) {
      return NextResponse.json({ success: false, error: "File and table name are required" }, { status: 400 })
    }

    const content = await file.text()
    const data = parseCSV(content)
    const validation = validateCSVData(tableName, data)

    return NextResponse.json({
      success: validation.valid,
      errors: validation.errors,
      rowCount: data.length,
      sampleData: data.slice(0, 5),
    })
  } catch (error) {
    console.error("CSV validation error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 },
    )
  }
}
