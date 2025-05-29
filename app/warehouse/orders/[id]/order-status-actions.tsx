"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Package, Truck, CheckCircle } from "lucide-react"

type OrderStatusActionsProps = {
  order: {
    order_id: number
    status: string
  }
}

export default function OrderStatusActions({ order }: OrderStatusActionsProps) {
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)

  const updateOrderStatus = async (status: string) => {
    setIsUpdating(true)

    try {
      const response = await fetch(`/api/orders/${order.order_id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update order status")
      }

      // Refresh the page to show updated status
      router.refresh()
    } catch (error) {
      console.error("Error updating order status:", error)
      alert("Failed to update order status. Please try again.")
    } finally {
      setIsUpdating(false)
    }
  }

  if (order.status === "pending") {
    return (
      <Button onClick={() => updateOrderStatus("processing")} disabled={isUpdating}>
        <Package className="mr-2 h-4 w-4" />
        {isUpdating ? "Processing..." : "Start Processing"}
      </Button>
    )
  }

  if (order.status === "processing") {
    return (
      <Button onClick={() => updateOrderStatus("shipped")} disabled={isUpdating}>
        <Truck className="mr-2 h-4 w-4" />
        {isUpdating ? "Updating..." : "Mark as Shipped"}
      </Button>
    )
  }

  if (order.status === "shipped") {
    return (
      <Button onClick={() => updateOrderStatus("delivered")} disabled={isUpdating}>
        <CheckCircle className="mr-2 h-4 w-4" />
        {isUpdating ? "Updating..." : "Mark as Delivered"}
      </Button>
    )
  }

  return null
}
