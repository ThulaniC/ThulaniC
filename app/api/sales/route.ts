import { NextResponse } from "next/server"
import { createSale, addSaleItem } from "@/lib/database"

export async function POST(request: Request) {
  try {
    const { garageId, customerId, totalAmount, paymentMethod, items } = await request.json()

    // Create the sale record
    const sale = await createSale(garageId, customerId, totalAmount, paymentMethod)

    // Add sale items
    const saleItems = []
    for (const item of items) {
      const saleItem = await addSaleItem(sale.sale_id, item.partId, item.quantity, item.unitPrice)
      saleItems.push(saleItem)
    }

    return NextResponse.json({ sale, saleItems })
  } catch (error) {
    console.error("Error creating sale:", error)
    return NextResponse.json({ error: "Failed to create sale" }, { status: 500 })
  }
}
