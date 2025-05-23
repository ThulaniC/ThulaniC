"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function InventoryComponent() {
  // Mock data for demonstration
  const inventory = [
    { id: 1, name: "Oil Filter", partNumber: "OF-1234", price: 12.99, stock: 45, reorderLevel: 20 },
    { id: 2, name: "Air Filter", partNumber: "AF-5678", price: 24.99, stock: 32, reorderLevel: 15 },
    { id: 3, name: "Brake Pad Set", partNumber: "BP-9012", price: 89.99, stock: 8, reorderLevel: 10 },
    { id: 4, name: "Spark Plug", partNumber: "SP-3456", price: 7.99, stock: 120, reorderLevel: 50 },
    { id: 5, name: "Wiper Blade", partNumber: "WB-7890", price: 19.99, stock: 56, reorderLevel: 25 },
    { id: 6, name: "Engine Oil", partNumber: "EO-1122", price: 34.99, stock: 12, reorderLevel: 15 },
    { id: 7, name: "Transmission Fluid", partNumber: "TF-3344", price: 29.99, stock: 18, reorderLevel: 20 },
    { id: 8, name: "Coolant", partNumber: "CO-5566", price: 19.99, stock: 5, reorderLevel: 10 },
  ]

  const getStockStatus = (stock: number, reorderLevel: number) => {
    if (stock <= 0) return { label: "Out of Stock", color: "destructive" }
    if (stock < reorderLevel) return { label: "Low Stock", color: "warning" }
    return { label: "In Stock", color: "success" }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-4">
          <div className="flex gap-4">
            <div className="w-64">
              <Label htmlFor="search">Search Inventory</Label>
              <Input id="search" placeholder="Search by name or part number" />
            </div>
            <div>
              <Label htmlFor="filter">Filter</Label>
              <select
                id="filter"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="all">All Items</option>
                <option value="low">Low Stock</option>
                <option value="out">Out of Stock</option>
              </select>
            </div>
          </div>
          <Button>Update Inventory</Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Part Name</TableHead>
              <TableHead>Part Number</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Reorder Level</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory.map((item) => {
              const status = getStockStatus(item.stock, item.reorderLevel)
              return (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.partNumber}</TableCell>
                  <TableCell>${item.price.toFixed(2)}</TableCell>
                  <TableCell>{item.stock}</TableCell>
                  <TableCell>{item.reorderLevel}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        status.color as "default" | "destructive" | "outline" | "secondary" | "success" | "warning"
                      }
                    >
                      {status.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Adjust
                      </Button>
                      {item.stock < item.reorderLevel && <Button size="sm">Order</Button>}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
