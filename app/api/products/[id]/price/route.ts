import { type NextRequest, NextResponse } from "next/server"
import { requireRole } from "@/lib/auth"
import { updateProductPrice } from "@/lib/db"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Only warehouse staff and managers can update product pricing
    const user = requireRole(["warehouse_staff", "manager"])
    const productId = Number(params.id)
    const { price, discountPrice, onOffer } = await request.json()

    // Validate request
    if (!productId || price === undefined) {
      return NextResponse.json({ success: false, error: "Invalid request data" }, { status: 400 })
    }

    if (price <= 0) {
      return NextResponse.json({ success: false, error: "Price must be greater than 0" }, { status: 400 })
    }

    if (onOffer && (discountPrice === null || discountPrice <= 0 || discountPrice >= price)) {
      return NextResponse.json(
        { success: false, error: "Discount price must be greater than 0 and less than the regular price" },
        { status: 400 },
      )
    }

    // Update product price
    const updatedProduct = await updateProductPrice(productId, price, onOffer ? discountPrice : null)

    if (!updatedProduct) {
      return NextResponse.json({ success: false, error: "Failed to update product price" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      product: updatedProduct,
      message: "Product price updated successfully",
    })
  } catch (error) {
    console.error("Product price update error:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 },
    )
  }
}
