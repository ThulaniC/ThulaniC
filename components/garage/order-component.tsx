"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export default function OrderComponent() {
  const [orderType, setOrderType] = useState("warehouse")

  // Mock data for demonstration
  const existingOrders = [
    { id: 1, date: "2023-05-10", type: "Warehouse", status: "Pending", items: 5, total: "$245.95" },
    { id: 2, date: "2023-05-08", type: "Emergency", status: "Completed", items: 2, total: "$89.98" },
    { id: 3, date: "2023-05-05", type: "Warehouse", status: "In Progress", items: 8, total: "$456.78" },
  ]

  const availableParts = [
    { id: 1, name: "Oil Filter", price: 12.99, warehouseStock: 500, otherGarageStock: 45 },
    { id: 2, name: "Air Filter", price: 24.99, warehouseStock: 350, otherGarageStock: 32 },
    { id: 3, name: "Brake Pad Set", price: 89.99, warehouseStock: 200, otherGarageStock: 18 },
    { id: 4, name: "Spark Plug", price: 7.99, warehouseStock: 1000, otherGarageStock: 120 },
  ]

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "warning"
      case "completed":
        return "success"
      case "in progress":
        return "default"
      default:
        return "secondary"
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Order</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="order-type">Order Type</Label>
              <Select value={orderType} onValueChange={setOrderType}>
                <SelectTrigger id="order-type">
                  <SelectValue placeholder="Select order type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="warehouse">From Warehouse</SelectItem>
                  <SelectItem value="garage">From Other Garage</SelectItem>
                  <SelectItem value="emergency">Emergency Order</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {orderType === "garage" && (
              <div>
                <Label htmlFor="source-garage">Source Garage</Label>
                <Select>
                  <SelectTrigger id="source-garage">
                    <SelectValue placeholder="Select garage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="westside">Westside Auto Parts</SelectItem>
                    <SelectItem value="eastside">Eastside Car Center</SelectItem>
                    <SelectItem value="northside">Northside Parts Depot</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label>Available Parts</Label>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Part Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>{orderType === "warehouse" ? "Warehouse Stock" : "Available"}</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {availableParts.map((part) => (
                    <TableRow key={part.id}>
                      <TableCell>{part.name}</TableCell>
                      <TableCell>${part.price.toFixed(2)}</TableCell>
                      <TableCell>{orderType === "warehouse" ? part.warehouseStock : part.otherGarageStock}</TableCell>
                      <TableCell>
                        <Input type="number" className="w-20" min="1" defaultValue="1" />
                      </TableCell>
                      <TableCell>
                        <Button size="sm">Add</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-between">
              <Button variant="outline">Save as Draft</Button>
              <Button>Submit Order</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {existingOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>#{order.id}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.type}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        getStatusColor(order.status) as
                          | "default"
                          | "destructive"
                          | "outline"
                          | "secondary"
                          | "success"
                          | "warning"
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell>{order.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
