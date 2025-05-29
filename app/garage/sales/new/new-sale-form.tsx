"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trash2, Plus, CreditCard, Banknote, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type Product = {
  stock_id: number
  product_id: number
  product_name: string
  description: string
  price: number
  discount_price: number | null
  on_offer: boolean
  quantity: number
}

type Customer = {
  customer_id: number
  name: string
  email: string
}

type Garage = {
  garage_id: number
  name: string
}

type SaleItem = {
  product_id: number
  product_name: string
  quantity: number
  price: number
  discount: number
  stock_id: number
}

type NewSaleFormProps = {
  garage: Garage
  stock: Product[]
  customers: Customer[]
}

export default function NewSaleForm({ garage, stock, customers }: NewSaleFormProps) {
  const router = useRouter()
  const [customerId, setCustomerId] = useState<number | null>(null)
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  })
  const [items, setItems] = useState<SaleItem[]>([])
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null)
  const [quantity, setQuantity] = useState<number>(1)
  const [discount, setDiscount] = useState<number>(0)
  const [paymentMethod, setPaymentMethod] = useState<string>("credit_card")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("existing")

  // Filter out products with zero quantity
  const availableProducts = stock.filter((product) => product.quantity > 0)

  const handleAddItem = () => {
    if (!selectedProduct) {
      setError("Please select a product")
      return
    }

    if (quantity <= 0) {
      setError("Quantity must be greater than 0")
      return
    }

    const product = availableProducts.find((p) => p.stock_id === Number(selectedProduct))
    if (!product) {
      setError("Selected product not found")
      return
    }

    if (quantity > product.quantity) {
      setError(`Only ${product.quantity} units available in stock`)
      return
    }

    // Check if product already exists in items
    const existingItemIndex = items.findIndex((item) => item.stock_id === Number(selectedProduct))
    if (existingItemIndex >= 0) {
      // Update quantity of existing item
      const updatedItems = [...items]
      const newQuantity = updatedItems[existingItemIndex].quantity + quantity

      if (newQuantity > product.quantity) {
        setError(`Only ${product.quantity} units available in stock`)
        return
      }

      updatedItems[existingItemIndex].quantity = newQuantity
      setItems(updatedItems)
    } else {
      // Add new item
      const price = product.on_offer && product.discount_price ? product.discount_price : product.price

      setItems([
        ...items,
        {
          product_id: product.product_id,
          product_name: product.product_name,
          quantity,
          price,
          discount,
          stock_id: product.stock_id,
        },
      ])
    }

    // Reset form
    setSelectedProduct(null)
    setQuantity(1)
    setDiscount(0)
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
      setError("Please add at least one item to the sale")
      setIsSubmitting(false)
      return
    }

    let customerIdToUse = customerId

    // If creating a new customer
    if (activeTab === "new" && newCustomer.name && newCustomer.email) {
      try {
        const response = await fetch("/api/customers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newCustomer),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to create customer")
        }

        customerIdToUse = data.customerId
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred while creating the customer")
        setIsSubmitting(false)
        return
      }
    }

    if (!customerIdToUse) {
      setError("Please select or create a customer")
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch("/api/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          garageId: garage.garage_id,
          customerId: customerIdToUse,
          items,
          paymentMethod,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create sale")
      }

      // Redirect to the sale details page
      router.push(`/garage/sales/${data.saleId}`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while creating the sale")
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0)
  const totalDiscount = items.reduce((sum, item) => sum + item.discount, 0)
  const total = subtotal - totalDiscount

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
            <CardDescription>Select an existing customer or create a new one.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="existing">Existing Customer</TabsTrigger>
                <TabsTrigger value="new">New Customer</TabsTrigger>
              </TabsList>
              <TabsContent value="existing" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customer">Select Customer</Label>
                  <Select value={customerId?.toString() || ""} onValueChange={(value) => setCustomerId(Number(value))}>
                    <SelectTrigger id="customer">
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.customer_id} value={customer.customer_id.toString()}>
                          {customer.name} ({customer.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
              <TabsContent value="new" className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={newCustomer.name}
                      onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                      required={activeTab === "new"}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newCustomer.email}
                      onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                      required={activeTab === "new"}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={newCustomer.phone}
                      onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={newCustomer.address}
                      onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sale Items</CardTitle>
            <CardDescription>Add products to the sale.</CardDescription>
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
                    {availableProducts.map((product) => (
                      <SelectItem key={product.stock_id} value={product.stock_id.toString()}>
                        {product.product_name} - £
                        {product.on_offer && product.discount_price
                          ? product.discount_price.toFixed(2)
                          : product.price.toFixed(2)}{" "}
                        ({product.quantity} in stock)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full md:w-24 space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
              </div>

              <div className="w-full md:w-32 space-y-2">
                <Label htmlFor="discount">Discount (£)</Label>
                <Input
                  id="discount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
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
                      <TableHead className="text-right">Discount</TableHead>
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
                        <TableCell className="text-right">£{item.discount.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          £{(item.price * item.quantity - item.discount).toFixed(2)}
                        </TableCell>
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
                        Subtotal
                      </TableCell>
                      <TableCell className="text-right font-medium">{totalItems}</TableCell>
                      <TableCell className="text-right font-medium">£{totalDiscount.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-medium">£{subtotal.toFixed(2)}</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={4} className="text-right font-bold">
                        Total
                      </TableCell>
                      <TableCell className="text-right font-bold">£{total.toFixed(2)}</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  No items added to the sale yet. Use the form above to add items.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment</CardTitle>
            <CardDescription>Select payment method.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div
                className={`border rounded-md p-4 cursor-pointer ${
                  paymentMethod === "credit_card" ? "border-primary bg-primary/5" : "border-border"
                }`}
                onClick={() => setPaymentMethod("credit_card")}
              >
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span className="font-medium">Credit Card</span>
                </div>
              </div>
              <div
                className={`border rounded-md p-4 cursor-pointer ${
                  paymentMethod === "debit_card" ? "border-primary bg-primary/5" : "border-border"
                }`}
                onClick={() => setPaymentMethod("debit_card")}
              >
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span className="font-medium">Debit Card</span>
                </div>
              </div>
              <div
                className={`border rounded-md p-4 cursor-pointer ${
                  paymentMethod === "cash" ? "border-primary bg-primary/5" : "border-border"
                }`}
                onClick={() => setPaymentMethod("cash")}
              >
                <div className="flex items-center space-x-2">
                  <Banknote className="h-5 w-5" />
                  <span className="font-medium">Cash</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                items.length === 0 ||
                isSubmitting ||
                (activeTab === "existing" && !customerId) ||
                (activeTab === "new" && (!newCustomer.name || !newCustomer.email))
              }
            >
              {isSubmitting ? "Processing..." : "Complete Sale"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </form>
  )
}
