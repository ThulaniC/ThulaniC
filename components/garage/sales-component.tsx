"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SalesComponent() {
  const [cart, setCart] = useState<{ id: number; name: string; price: number; quantity: number }[]>([])

  // Mock data for demonstration
  const availableParts = [
    { id: 1, name: "Oil Filter", price: 12.99, stock: 45 },
    { id: 2, name: "Air Filter", price: 24.99, stock: 32 },
    { id: 3, name: "Brake Pad Set", price: 89.99, stock: 18 },
    { id: 4, name: "Spark Plug", price: 7.99, stock: 120 },
    { id: 5, name: "Wiper Blade", price: 19.99, stock: 56 },
  ]

  const addToCart = (part: { id: number; name: string; price: number }) => {
    const existingItem = cart.find((item) => item.id === part.id)

    if (existingItem) {
      setCart(cart.map((item) => (item.id === part.id ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setCart([...cart, { ...part, quantity: 1 }])
    }
  }

  const removeFromCart = (id: number) => {
    setCart(cart.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }

    setCart(cart.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)
  }

  const completeSale = () => {
    alert(`Sale completed! Total: K${calculateTotal()}`)
    setCart([])
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Available Parts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Label htmlFor="search">Search Parts</Label>
              <Input id="search" placeholder="Search by name or part number" />
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Part Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {availableParts.map((part) => (
                  <TableRow key={part.id}>
                    <TableCell>{part.name}</TableCell>
                    <TableCell>K{part.price.toFixed(2)}</TableCell>
                    <TableCell>{part.stock}</TableCell>
                    <TableCell>
                      <Button size="sm" onClick={() => addToCart(part)} disabled={part.stock <= 0}>
                        Add to Cart
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Current Sale</CardTitle>
          </CardHeader>
          <CardContent>
            {cart.length === 0 ? (
              <p className="text-center text-gray-500 my-4">Cart is empty</p>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Part</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cart.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value))}
                            className="w-16"
                            min="1"
                          />
                        </TableCell>
                        <TableCell>K{(item.price * item.quantity).toFixed(2)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => removeFromCart(item.id)}>
                            ✕
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="mt-4 flex justify-between items-center font-bold">
                  <span>Total:</span>
                  <span>K{calculateTotal()}</span>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <Label htmlFor="customer">Customer</Label>
                    <Select>
                      <SelectTrigger id="customer">
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New Customer</SelectItem>
                        <SelectItem value="1">John Smith</SelectItem>
                        <SelectItem value="2">Jane Doe</SelectItem>
                        <SelectItem value="3">Bob Johnson</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="payment">Payment Method</Label>
                    <Select>
                      <SelectTrigger id="payment">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="credit">Credit Card</SelectItem>
                        <SelectItem value="debit">Debit Card</SelectItem>
                        <SelectItem value="invoice">Invoice</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full" onClick={completeSale}>
                    Complete Sale
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
