"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function WarehouseInventoryComponent() {
  // Mock data for demonstration
  const inventory = [
    {
      id: 1,
      name: "Oil Filter",
      partNumber: "OF-1234",
      price: 8.99,
      stock: 450,
      reorderLevel: 200,
      category: "Filters",
    },
    {
      id: 2,
      name: "Air Filter",
      partNumber: "AF-5678",
      price: 18.99,
      stock: 320,
      reorderLevel: 150,
      category: "Filters",
    },
    {
      id: 3,
      name: "Brake Pad Set",
      partNumber: "BP-9012",
      price: 65.99,
      stock: 180,
      reorderLevel: 100,
      category: "Brakes",
    },
    {
      id: 4,
      name: "Spark Plug",
      partNumber: "SP-3456",
      price: 4.99,
      stock: 1200,
      reorderLevel: 500,
      category: "Ignition",
    },
    {
      id: 5,
      name: "Wiper Blade",
      partNumber: "WB-7890",
      price: 14.99,
      stock: 560,
      reorderLevel: 250,
      category: "Exterior",
    },
    {
      id: 6,
      name: "Engine Oil",
      partNumber: "EO-1122",
      price: 24.99,
      stock: 420,
      reorderLevel: 150,
      category: "Fluids",
    },
    {
      id: 7,
      name: "Transmission Fluid",
      partNumber: "TF-3344",
      price: 19.99,
      stock: 280,
      reorderLevel: 120,
      category: "Fluids",
    },
    { id: 8, name: "Coolant", partNumber: "CO-5566", price: 12.99, stock: 350, reorderLevel: 100, category: "Fluids" },
  ]

  const getStockStatus = (stock: number, reorderLevel: number) => {
    if (stock <= 0) return { label: "Out of Stock", color: "destructive" }
    if (stock < reorderLevel) return { label: "Low Stock", color: "warning" }
    return { label: "In Stock", color: "success" }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Warehouse Inventory Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <div className="flex justify-between mb-4">
            <TabsList>
              <TabsTrigger value="all">All Items</TabsTrigger>
              <TabsTrigger value="filters">Filters</TabsTrigger>
              <TabsTrigger value="brakes">Brakes</TabsTrigger>
              <TabsTrigger value="fluids">Fluids</TabsTrigger>
              <TabsTrigger value="other">Other</TabsTrigger>
            </TabsList>
            <div className="flex gap-4">
              <div className="w-64">
                <Input placeholder="Search inventory" />
              </div>
              <Button>Add New Part</Button>
            </div>
          </div>

          <TabsContent value="all">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Part Name</TableHead>
                  <TableHead>Part Number</TableHead>
                  <TableHead>Category</TableHead>
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
                      <TableCell>{item.category}</TableCell>
                      <TableCell>K{item.price.toFixed(2)}</TableCell>
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
                            Edit
                          </Button>
                          <Button size="sm">Order More</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="filters">
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
                {inventory
                  .filter((item) => item.category === "Filters")
                  .map((item) => {
                    const status = getStockStatus(item.stock, item.reorderLevel)
                    return (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.partNumber}</TableCell>
                        <TableCell>K{item.price.toFixed(2)}</TableCell>
                        <TableCell>{item.stock}</TableCell>
                        <TableCell>{item.reorderLevel}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              status.color as
                                | "default"
                                | "destructive"
                                | "outline"
                                | "secondary"
                                | "success"
                                | "warning"
                            }
                          >
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              Edit
                            </Button>
                            <Button size="sm">Order More</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
              </TableBody>
            </Table>
          </TabsContent>

          {/* Similar TabsContent for other categories */}
        </Tabs>
      </CardContent>
    </Card>
  )
}
