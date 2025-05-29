import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { updateOrderStatus } from "@/lib/db"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = requireAuth()
    const orderId = Number(params.id)
    const { status } = await request.json()

    // Validate request
    if (!orderId || !status) {
      return NextResponse.json({ success: false, error: "Invalid request data" }, { status: 400 })
    }

    // Validate status value
    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ success: false, error: "Invalid status value" }, { status: 400 })
    }

    // Update order status
    const updatedOrder = await updateOrderStatus(orderId, status)

    if (!updatedOrder) {
      return NextResponse.json({ success: false, error: "Failed to update order status" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      message: "Order status updated successfully",
    })
  } catch (error) {
    console.error("Order status update error:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 },
    )
  }
}
