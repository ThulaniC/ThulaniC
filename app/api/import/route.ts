import { type NextRequest, NextResponse } from "next/server"
import { importCSVFiles } from "@/lib/csv-import"
import { requireRole } from "../../../lib/auth"

export async function POST(request: NextRequest) {
  try {
    // Check if user is authorized (manager only)
    const user = requireRole(["manager"])

    // Parse the form data
    const formData = await request.formData()
    const files: Record<string, string> = {}
    const options = {
      truncate: formData.get("truncate") === "true",
      updateExisting: formData.get("updateExisting") === "true",
    }

    // Process each file
    for (const [key, value] of formData.entries()) {
      if (value instanceof File && key.endsWith(".csv")) {
        const tableName = key.replace(".csv", "")
        const content = await value.text()
        files[tableName] = content
      }
    }

    if (Object.keys(files).length === 0) {
      return NextResponse.json({ success: false, error: "No CSV files were provided" }, { status: 400 })
    }

    // Import the files
    const results = await importCSVFiles(files, options)

    // Calculate overall success
    const success = results.every((result) => result.success)
    const totalRowsImported = results.reduce((sum, result) => sum + result.rowsImported, 0)

    return NextResponse.json({
      success,
      results,
      totalRowsImported,
    })
  } catch (error) {
    console.error("Import error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 },
    )
  }
}
