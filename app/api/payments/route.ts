import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const user = requireAuth()
    const { saleId, amount, paymentMethod } = await request.json()

    // Validate request
    if (!saleId || !amount || !paymentMethod) {
      return NextResponse.json({ success: false, error: "Invalid request data" }, { status: 400 })
    }

    // Create the payment
    const result = await sql`
      INSERT INTO payments (sale_id, amount, payment_method)
      VALUES (${saleId}, ${amount}, ${paymentMethod})
      RETURNING *
    `
    const payment = result[0]

    if (!payment) {
      return NextResponse.json({ success: false, error: "Failed to create payment" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      paymentId: payment.payment_id,
      message: "Payment recorded successfully",
    })
  } catch (error) {
    console.error("Payment creation error:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 },
    )
  }
}
