import { NextResponse } from "next/server"
import { getInventoryByGarage, updateInventoryQuantity } from "@/lib/database"

export async function GET(request: Request, { params }: { params: { garageId: string } }) {
  try {
    const garageId = Number.parseInt(params.garageId)
    const inventory = await getInventoryByGarage(garageId)
    return NextResponse.json({ inventory })
  } catch (error) {
    console.error("Error fetching inventory:", error)
    return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { garageId: string } }) {
  try {
    const { inventoryId, quantity } = await request.json()
    const updatedInventory = await updateInventoryQuantity(inventoryId, quantity)
    return NextResponse.json({ inventory: updatedInventory })
  } catch (error) {
    console.error("Error updating inventory:", error)
    return NextResponse.json({ error: "Failed to update inventory" }, { status: 500 })
  }
}
