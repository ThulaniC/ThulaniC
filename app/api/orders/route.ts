import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { createOrder, addOrderItem, getProductById } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const user = requireAuth()
    const { fromType, fromId, toType, toId, isEmergency, items } = await request.json()

    // Validate request
    if (!fromType || !fromId || !toType || !toId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: "Invalid request data" }, { status: 400 })
    }

    // Create the order
    const order = await createOrder(fromType, fromId, toType, toId, isEmergency)

    if (!order) {
      return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 })
    }

    // Add order items
    for (const item of items) {
      // Verify product exists and get current price
      const product = await getProductById(item.product_id)
      if (!product) {
        return NextResponse.json(
          { success: false, error: `Product with ID ${item.product_id} not found` },
          { status: 400 },
        )
      }

      // Use the current price from the database
      const price = product.on_offer && product.discount_price ? product.discount_price : product.price

      await addOrderItem(order.order_id, item.product_id, item.quantity, price)
    }

    return NextResponse.json({
      success: true,
      orderId: order.order_id,
      message: "Order created successfully",
    })
  } catch (error) {
    console.error("Order creation error:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 },
    )
  }
}
