"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export default function EmergencyQueryComponent() {
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Mock data for demonstration
  const mockSearchResults = [
    {
      garage: "Westside Auto Parts",
      partName: "Brake Pad Set",
      quantity: 8,
      price: 89.99,
      distance: "2.3 miles",
      estimatedDelivery: "2 hours",
    },
    {
      garage: "Eastside Car Center",
      partName: "Brake Pad Set",
      quantity: 12,
      price: 92.99,
      distance: "4.1 miles",
      estimatedDelivery: "3 hours",
    },
    {
      garage: "Northside Parts Depot",
      partName: "Brake Pad Set",
      quantity: 5,
      price: 87.99,
      distance: "6.8 miles",
      estimatedDelivery: "4 hours",
    },
  ]

  const handleSearch = () => {
    setIsSearching(true)
    // Simulate API call
    setTimeout(() => {
      setSearchResults(mockSearchResults)
      setIsSearching(false)
    }, 1500)
  }

  const handleEmergencyOrder = (garage: string, partName: string) => {
    alert(`Emergency order placed with ${garage} for ${partName}. Express delivery will arrive within 2-4 hours.`)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Emergency Stock Query</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <Label htmlFor="part-search">Part Name/Number</Label>
              <Input id="part-search" placeholder="Enter part name or number" />
            </div>
            <div>
              <Label htmlFor="quantity-needed">Quantity Needed</Label>
              <Input id="quantity-needed" type="number" placeholder="Enter quantity" min="1" />
            </div>
            <div>
              <Label htmlFor="urgency">Urgency Level</Label>
              <Select>
                <SelectTrigger id="urgency">
                  <SelectValue placeholder="Select urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical (Same Day)</SelectItem>
                  <SelectItem value="urgent">Urgent (Next Day)</SelectItem>
                  <SelectItem value="normal">Normal (2-3 Days)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={handleSearch} disabled={isSearching} className="w-full">
                {isSearching ? "Searching..." : "Search Garages"}
              </Button>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Emergency Query Notice</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    Emergency queries are for urgent stock needs only. Express delivery charges apply and orders are
                    dispatched for overnight delivery.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {searchResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Available Stock at Other Garages</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Garage</TableHead>
                  <TableHead>Part</TableHead>
                  <TableHead>Available Qty</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Distance</TableHead>
                  <TableHead>Est. Delivery</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {searchResults.map((result, index) => (
                  <TableRow key={index}>
                    <TableCell>{result.garage}</TableCell>
                    <TableCell>{result.partName}</TableCell>
                    <TableCell>
                      <Badge
                        variant={result.quantity > 10 ? "success" : result.quantity > 5 ? "warning" : "destructive"}
                      >
                        {result.quantity}
                      </Badge>
                    </TableCell>
                    <TableCell>${result.price.toFixed(2)}</TableCell>
                    <TableCell>{result.distance}</TableCell>
                    <TableCell>{result.estimatedDelivery}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        onClick={() => handleEmergencyOrder(result.garage, result.partName)}
                        disabled={result.quantity === 0}
                      >
                        Order Now
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
