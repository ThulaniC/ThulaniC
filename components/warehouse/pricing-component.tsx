"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function PricingComponent() {
  // Mock data for demonstration
  const parts = [
    { id: 1, name: "Oil Filter", partNumber: "OF-1234", currentPrice: 12.99, category: "Filters" },
    { id: 2, name: "Air Filter", partNumber: "AF-5678", currentPrice: 24.99, category: "Filters" },
    { id: 3, name: "Brake Pad Set", partNumber: "BP-9012", currentPrice: 89.99, category: "Brakes" },
    { id: 4, name: "Spark Plug", partNumber: "SP-3456", currentPrice: 7.99, category: "Ignition" },
    { id: 5, name: "Wiper Blade", partNumber: "WB-7890", currentPrice: 19.99, category: "Exterior" },
  ]

  const handlePriceUpdate = (partId: number, newPrice: number) => {
    alert(`Price updated for part ${partId} to $${newPrice.toFixed(2)}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>National Pricing Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search-parts">Search Parts</Label>
              <Input id="search-parts" placeholder="Search by name or part number" />
            </div>
            <div>
              <Label htmlFor="category-filter">Category</Label>
              <select
                id="category-filter"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="all">All Categories</option>
                <option value="filters">Filters</option>
                <option value="brakes">Brakes</option>
                <option value="ignition">Ignition</option>
                <option value="exterior">Exterior</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button className="w-full">Bulk Price Update</Button>
            </div>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Part Name</TableHead>
              <TableHead>Part Number</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Current Price</TableHead>
              <TableHead>New Price</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parts.map((part) => (
              <TableRow key={part.id}>
                <TableCell>{part.name}</TableCell>
                <TableCell>{part.partNumber}</TableCell>
                <TableCell>{part.category}</TableCell>
                <TableCell>${part.currentPrice.toFixed(2)}</TableCell>
                <TableCell>
                  <Input type="number" step="0.01" defaultValue={part.currentPrice} className="w-24" min="0" />
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handlePriceUpdate(part.id, part.currentPrice + 1)}>
                      Update
                    </Button>
                    <Button size="sm" variant="outline">
                      History
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Pricing Guidelines</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Price changes take effect immediately across all garages</li>
            <li>• Consider market conditions and competitor pricing</li>
            <li>• Bulk updates can be applied to entire categories</li>
            <li>• Price history is maintained for audit purposes</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
