"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, Plus, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type Product = {
  product_id: number
  name: string
  description: string
  price: number
  discount_price: number | null
  on_offer: boolean
  reorder_level: number
}

type Location = {
  garage_id?: number
  warehouse_id?: number
  name: string
}

type OrderItem = {
  product_id: number
  product_name: string
  quantity: number
  price: number
}

type NewOrderFormProps = {
  garage: {
    garage_id: number
    name: string
  }
  products: Product[]
  warehouses: Location[]
  otherGarages: Location[]
}

export default function NewOrderForm({ garage, products, warehouses, otherGarages }: NewOrderFormProps) {
  const router = useRouter()
  const [destinationType, setDestinationType] = useState<"warehouse" | "garage">("warehouse")
  const [destinationId, setDestinationId] = useState<number>(warehouses[0]?.warehouse_id || 0)
  const [isEmergency, setIsEmergency] = useState(false)
  const [items, setItems] = useState<OrderItem[]>([])
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null)
  const [quantity, setQuantity] = useState<number>(1)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddItem = () => {
    if (!selectedProduct) {
      setError("Please select a product")
      return
    }

    if (quantity <= 0) {
      setError("Quantity must be greater than 0")
      return
    }

    const product = products.find((p) => p.product_id === Number(selectedProduct))
    if (!product) {
      setError("Selected product not found")
      return
    }

    // Check if product already exists in items
    const existingItemIndex = items.findIndex((item) => item.product_id === Number(selectedProduct))
    if (existingItemIndex >= 0) {
      // Update quantity of existing item
      const updatedItems = [...items]
      updatedItems[existingItemIndex].quantity += quantity
      setItems(updatedItems)
    } else {
      // Add new item
      setItems([
        ...items,
        {
          product_id: product.product_id,
          product_name: product.name,
          quantity,
          price: product.on_offer && product.discount_price ? product.discount_price : product.price,
        },
      ])
    }

    // Reset form
    setSelectedProduct(null)
    setQuantity(1)
    setError(null)
  }

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    if (items.length === 0) {
      setError("Please add at least one item to the order")
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fromType: "garage",
          fromId: garage.garage_id,
          toType: destinationType,
          toId: destinationId,
          isEmergency,
          items,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create order")
      }

      // Redirect to the order details page
      router.push(`/garage/orders/${data.orderId}`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while creating the order")
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalCost = items.reduce((sum, item) => sum + item.quantity * item.price, 0)

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
            <CardDescription>Specify where you want to order parts from.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="destination-type">Order From</Label>
              <Select
                value={destinationType}
                onValueChange={(value: "warehouse" | "garage") => {
                  setDestinationType(value)
                  // Reset destination ID when changing type
                  if (value === "warehouse") {
                    setDestinationId(warehouses[0]?.warehouse_id || 0)
                  } else {
                    setDestinationId(otherGarages[0]?.garage_id || 0)
                  }
                }}
              >
                <SelectTrigger id="destination-type">
                  <SelectValue placeholder="Select destination type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="warehouse">Warehouse</SelectItem>
                  <SelectItem value="garage">Another Garage</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination-id">
                {destinationType === "warehouse" ? "Warehouse" : "Garage"} Location
              </Label>
              <Select
                value={destinationId.toString()}
                onValueChange={(value) => setDestinationId(Number(value))}
                disabled={
                  (destinationType === "warehouse" && warehouses.length === 0) ||
                  (destinationType === "garage" && otherGarages.length === 0)
                }
              >
                <SelectTrigger id="destination-id">
                  <SelectValue placeholder={`Select ${destinationType}`} />
                </SelectTrigger>
                <SelectContent>
                  {destinationType === "warehouse"
                    ? warehouses.map((warehouse) => (
                        <SelectItem key={warehouse.warehouse_id} value={warehouse.warehouse_id!.toString()}>
                          {warehouse.name}
                        </SelectItem>
                      ))
                    : otherGarages.map((garage) => (
                        <SelectItem key={garage.garage_id} value={garage.garage_id!.toString()}>
                          {garage.name}
                        </SelectItem>
                      ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox id="is-emergency" checked={isEmergency} onCheckedChange={setIsEmergency} />
              <Label htmlFor="is-emergency" className="font-normal">
                This is an emergency order (prioritize fulfillment)
              </Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
            <CardDescription>Add parts to your order.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
              <div className="flex-1 space-y-2">
                <Label htmlFor="product">Product</Label>
                <Select
                  value={selectedProduct?.toString() || ""}
                  onValueChange={(value) => setSelectedProduct(Number(value))}
                >
                  <SelectTrigger id="product">
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.product_id} value={product.product_id.toString()}>
                        {product.name} - £
                        {product.on_offer && product.discount_price
                          ? product.discount_price.toFixed(2)
                          : product.price.toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full md:w-32 space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
              </div>

              <div className="flex items-end">
                <Button type="button" onClick={handleAddItem} className="w-full md:w-auto">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </div>
            </div>

            <div className="mt-6">
              {items.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.product_name}</TableCell>
                        <TableCell className="text-right">£{item.price.toFixed(2)}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">£{(item.price * item.quantity).toFixed(2)}</TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(index)}
                            className="h-8 w-8 p-0"
                          >
                            <span className="sr-only">Remove</span>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={2} className="text-right font-medium">
                        Total
                      </TableCell>
                      <TableCell className="text-right font-medium">{totalItems}</TableCell>
                      <TableCell className="text-right font-medium">£{totalCost.toFixed(2)}</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  No items added to the order yet. Use the form above to add items.
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={items.length === 0 || isSubmitting}>
              {isSubmitting ? "Creating Order..." : "Create Order"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </form>
  )
}
