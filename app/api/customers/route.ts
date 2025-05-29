import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { createCustomer } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const user = requireAuth()
    const { name, email, phone, address } = await request.json()

    // Validate request
    if (!name || !email) {
      return NextResponse.json({ success: false, error: "Name and email are required" }, { status: 400 })
    }

    // Create the customer
    const customer = await createCustomer(name, address || "", phone || "", email)

    if (!customer) {
      return NextResponse.json({ success: false, error: "Failed to create customer" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      customerId: customer.customer_id,
      message: "Customer created successfully",
    })
  } catch (error) {
    console.error("Customer creation error:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 },
    )
  }
}
