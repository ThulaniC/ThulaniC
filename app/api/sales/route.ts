import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { createSale, addSaleItem, updateStockQuantity, getStockByLocation } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const user = requireAuth()
    const { garageId, customerId, items, paymentMethod } = await request.json()

    // Validate request
    if (!garageId || !customerId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: "Invalid request data" }, { status: 400 })
    }

    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.price - item.discount, 0)

    // Create the sale
    const sale = await createSale(garageId, customerId, totalAmount)

    if (!sale) {
      return NextResponse.json({ success: false, error: "Failed to create sale" }, { status: 500 })
    }

    // Add sale items and update stock
    for (const item of items) {
      // Add the item to the sale
      await addSaleItem(sale.sale_id, item.product_id, item.quantity, item.price, item.discount)

      // Update stock quantity
      const stock = await getStockByLocation("garage", garageId)
      const stockItem = stock.find((s) => s.stock_id === item.stock_id)

      if (stockItem) {
        const newQuantity = Number(stockItem.quantity) - item.quantity
        await updateStockQuantity(item.stock_id, newQuantity)
      }
    }

    // Create payment record
    await fetch(`/api/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        saleId: sale.sale_id,
        amount: totalAmount,
        paymentMethod,
      }),
    })

    return NextResponse.json({
      success: true,
      saleId: sale.sale_id,
      message: "Sale created successfully",
    })
  } catch (error) {
    console.error("Sale creation error:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 },
    )
  }
}
