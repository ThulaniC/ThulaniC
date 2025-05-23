"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function CustomerComponent() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Mock data for demonstration
  const customers = [
    {
      id: 1,
      name: "John Smith",
      contact: "555-123-4567",
      email: "john.smith@email.com",
      address: "123 Customer St, Downtown",
      lastPurchase: "2023-05-10",
      totalSpent: "K245.97",
    },
    {
      id: 2,
      name: "Jane Doe",
      contact: "555-234-5678",
      email: "jane.doe@email.com",
      address: "456 Buyer Ave, Westside",
      lastPurchase: "2023-05-08",
      totalSpent: "K189.45",
    },
    {
      id: 3,
      name: "Bob Johnson",
      contact: "555-345-6789",
      email: "bob.johnson@email.com",
      address: "789 Client Blvd, Eastside",
      lastPurchase: "2023-05-05",
      totalSpent: "K456.78",
    },
  ]

  const handleAddCustomer = (event: React.FormEvent) => {
    event.preventDefault()
    // Handle form submission here
    setIsDialogOpen(false)
    alert("Customer added successfully!")
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Customer Management</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add New Customer</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddCustomer} className="space-y-4">
                <div>
                  <Label htmlFor="customer-name">Full Name</Label>
                  <Input id="customer-name" placeholder="Enter customer name" required />
                </div>
                <div>
                  <Label htmlFor="customer-phone">Phone Number</Label>
                  <Input id="customer-phone" placeholder="Enter phone number" required />
                </div>
                <div>
                  <Label htmlFor="customer-email">Email Address</Label>
                  <Input id="customer-email" type="email" placeholder="Enter email address" />
                </div>
                <div>
                  <Label htmlFor="customer-address">Address</Label>
                  <Input id="customer-address" placeholder="Enter address" />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Customer</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Label htmlFor="search-customers">Search Customers</Label>
          <Input id="search-customers" placeholder="Search by name, phone, or email" />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Last Purchase</TableHead>
              <TableHead>Total Spent</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.contact}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.address}</TableCell>
                <TableCell>{customer.lastPurchase}</TableCell>
                <TableCell>{customer.totalSpent}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Edit
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
      </CardContent>
    </Card>
  )
}
