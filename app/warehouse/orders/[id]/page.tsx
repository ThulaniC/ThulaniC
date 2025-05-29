import { notFound } from "next/navigation"
import { requireRole } from "@/lib/auth"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { getOrderDetails, getOrdersByLocation, getWarehouseById } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, AlertTriangle } from "lucide-react"
import { format } from "date-fns"
import OrderStatusActions from "./order-status-actions"

export default async function WarehouseOrderDetailsPage({ params }: { params: { id: string } }) {
  const user = requireRole(["warehouse_staff", "manager"])
  const warehouse = await getWarehouseById(user.locationId)

  // Get all orders for this warehouse
  const orders = await getOrdersByLocation("warehouse", user.locationId, user.role)

  // Find the specific order
  const order = orders.find((o) => o.order_id === Number(params.id))

  if (!order) {
    notFound()
  }

  // Get order items
  const orderItems = await getOrderDetails(order.order_id)

  // Calculate totals
  const totalItems = orderItems.reduce((sum, item) => sum + Number(item.quantity), 0)
  const totalCost = orderItems.reduce((sum, item) => sum + Number(item.quantity) * Number(item.price), 0)

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Button variant="ghost" size="sm" asChild className="mb-2">
              <Link href="/warehouse/orders">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Orders
              </Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Order #{order.order_id}</h1>
            <p className="text-muted-foreground">
              Created on {format(new Date(order.order_date), "dd MMMM yyyy 'at' HH:mm")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={order.status === "delivered" ? "default" : order.status === "pending" ? "outline" : "secondary"}
              className="text-sm"
            >
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
            {order.is_emergency && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Emergency
              </Badge>
            )}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Order Information</CardTitle>
            <CardDescription>Details about this order.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">From</h3>
                <p className="text-lg font-medium">{order.from_name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">To</h3>
                <p className="text-lg font-medium">{order.to_name}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Order Items</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderItems.map((item) => (
                    <TableRow key={item.order_item_id}>
                      <TableCell className="font-medium">{item.product_name}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell className="text-right">£{Number(item.price).toFixed(2)}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">
                        £{(Number(item.price) * Number(item.quantity)).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-medium">
                      Total
                    </TableCell>
                    <TableCell className="text-right font-medium">{totalItems}</TableCell>
                    <TableCell className="text-right font-medium">£{totalCost.toFixed(2)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/warehouse/orders">Back to All Orders</Link>
            </Button>
            <OrderStatusActions order={order} />
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  )
}
