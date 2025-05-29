import { NextResponse } from "next/server"
import { createOrder, addOrderItem } from "@/lib/database"

export async function POST(request: Request) {
  try {
    const { garageId, orderType, items } = await request.json()

    // Create the order record
    const order = await createOrder(garageId, orderType)

    // Add order items
    const orderItems = []
    for (const item of items) {
      const orderItem = await addOrderItem(order.order_id, item.partId, item.quantity)
      orderItems.push(orderItem)
    }

    return NextResponse.json({ order, orderItems })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
