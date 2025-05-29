"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

export default function DiscountsComponent() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Mock data for demonstration
  const discounts = [
    {
      id: 1,
      partName: "Oil Filter",
      partNumber: "OF-1234",
      discountPercentage: 10,
      startDate: "2023-05-01",
      endDate: "2023-06-30",
      status: "Active",
    },
    {
      id: 2,
      partName: "Air Filter",
      partNumber: "AF-5678",
      discountPercentage: 15,
      startDate: "2023-05-01",
      endDate: "2023-06-30",
      status: "Active",
    },
    {
      id: 3,
      partName: "Brake Pad Set",
      partNumber: "BP-9012",
      discountPercentage: 20,
      startDate: "2023-04-01",
      endDate: "2023-04-30",
      status: "Expired",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "success"
      case "expired":
        return "destructive"
      case "scheduled":
        return "warning"
      default:
        return "secondary"
    }
  }

  const handleCreateDiscount = (event: React.FormEvent) => {
    event.preventDefault()
    setIsDialogOpen(false)
    alert("Discount created successfully!")
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Discount Management</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Create New Discount</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Discount</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateDiscount} className="space-y-4">
                <div>
                  <Label htmlFor="discount-part">Part</Label>
                  <select
                    id="discount-part"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="">Select a part</option>
                    <option value="1">Oil Filter (OF-1234)</option>
                    <option value="2">Air Filter (AF-5678)</option>
                    <option value="3">Brake Pad Set (BP-9012)</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="discount-percentage">Discount Percentage</Label>
                  <Input
                    id="discount-percentage"
                    type="number"
                    placeholder="Enter discount percentage"
                    min="1"
                    max="50"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input id="start-date" type="date" required />
                  </div>
                  <div>
                    <Label htmlFor="end-date">End Date</Label>
                    <Input id="end-date" type="date" required />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Discount</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search-discounts">Search Discounts</Label>
              <Input id="search-discounts" placeholder="Search by part name or number" />
            </div>
            <div>
              <Label htmlFor="status-filter">Status</Label>
              <select
                id="status-filter"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Part Name</TableHead>
              <TableHead>Part Number</TableHead>
              <TableHead>Discount %</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {discounts.map((discount) => (
              <TableRow key={discount.id}>
                <TableCell>{discount.partName}</TableCell>
                <TableCell>{discount.partNumber}</TableCell>
                <TableCell>{discount.discountPercentage}%</TableCell>
                <TableCell>{discount.startDate}</TableCell>
                <TableCell>{discount.endDate}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      getStatusColor(discount.status) as
                        | "default"
                        | "destructive"
                        | "outline"
                        | "secondary"
                        | "success"
                        | "warning"
                    }
                  >
                    {discount.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      Deactivate
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
