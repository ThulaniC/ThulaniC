"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function DispatchComponent() {
  // Mock data for demonstration
  const pendingOrders = [
    {
      id: 1,
      garage: "Downtown Garage",
      orderDate: "2023-05-10",
      items: 5,
      priority: "Normal",
      estimatedDispatch: "2023-05-12",
    },
    {
      id: 2,
      garage: "Westside Auto Parts",
      orderDate: "2023-05-11",
      items: 8,
      priority: "High",
      estimatedDispatch: "2023-05-12",
    },
    {
      id: 3,
      garage: "Eastside Car Center",
      orderDate: "2023-05-11",
      items: 3,
      priority: "Emergency",
      estimatedDispatch: "2023-05-12",
    },
  ]

  const recentDispatches = [
    {
      id: 4,
      garage: "Northside Parts Depot",
      dispatchDate: "2023-05-09",
      items: 12,
      trackingNumber: "TRK123456789",
      status: "In Transit",
    },
    {
      id: 5,
      garage: "Southside Auto Shop",
      dispatchDate: "2023-05-08",
      items: 7,
      trackingNumber: "TRK987654321",
      status: "Delivered",
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "emergency":
        return "destructive"
      case "high":
        return "warning"
      case "normal":
        return "default"
      default:
        return "secondary"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "success"
      case "in transit":
        return "warning"
      case "pending":
        return "default"
      default:
        return "secondary"
    }
  }

  const handleDispatch = (orderId: number) => {
    alert(`Order ${orderId} has been dispatched for delivery.`)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pending Dispatch Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="search-orders">Search Orders</Label>
                <Input id="search-orders" placeholder="Search by garage or order ID" />
              </div>
              <div>
                <Label htmlFor="priority-filter">Priority</Label>
                <select
                  id="priority-filter"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="all">All Priorities</option>
                  <option value="emergency">Emergency</option>
                  <option value="high">High</option>
                  <option value="normal">Normal</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button className="w-full">Batch Dispatch</Button>
              </div>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Garage</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Est. Dispatch</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>#{order.id}</TableCell>
                  <TableCell>{order.garage}</TableCell>
                  <TableCell>{order.orderDate}</TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        getPriorityColor(order.priority) as
                          | "default"
                          | "destructive"
                          | "outline"
                          | "secondary"
                          | "success"
                          | "warning"
                      }
                    >
                      {order.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>{order.estimatedDispatch}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleDispatch(order.id)}>
                        Dispatch
                      </Button>
                      <Button size="sm" variant="outline">
                        Details
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Dispatches</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Garage</TableHead>
                <TableHead>Dispatch Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Tracking Number</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentDispatches.map((dispatch) => (
                <TableRow key={dispatch.id}>
                  <TableCell>#{dispatch.id}</TableCell>
                  <TableCell>{dispatch.garage}</TableCell>
                  <TableCell>{dispatch.dispatchDate}</TableCell>
                  <TableCell>{dispatch.items}</TableCell>
                  <TableCell>{dispatch.trackingNumber}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        getStatusColor(dispatch.status) as
                          | "default"
                          | "destructive"
                          | "outline"
                          | "secondary"
                          | "success"
                          | "warning"
                      }
                    >
                      {dispatch.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">
                      Track
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Dispatch Schedule</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Regular deliveries to garages occur once every week</li>
          <li>• Emergency orders are dispatched for express overnight delivery</li>
          <li>• High priority orders are processed within 24 hours</li>
          <li>• Tracking information is automatically sent to garage managers</li>
        </ul>
      </div>
    </div>
  )
}
