import { requireRole } from "@/lib/auth"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { getStockByLocation, getGarageById } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Plus, AlertTriangle } from "lucide-react"

export default async function GarageStockPage() {
  const user = requireRole(["local_staff", "manager"])
  const garage = await getGarageById(user.locationId)
  const stock = await getStockByLocation("garage", user.locationId)

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{garage.name} Stock</h1>
            <p className="text-muted-foreground">Manage your garage's inventory and order new parts.</p>
          </div>
          <Button asChild>
            <Link href="/garage/orders/new">
              <Plus className="mr-2 h-4 w-4" />
              Order Parts
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Current Inventory</CardTitle>
            <CardDescription>View and manage your current stock levels.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stock.map((item) => (
                  <TableRow key={item.stock_id}>
                    <TableCell className="font-medium">{item.product_name}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>
                      {item.on_offer ? (
                        <>
                          <span className="line-through text-muted-foreground mr-2">
                            £{Number.parseFloat(item.price).toFixed(2)}
                          </span>
                          <span className="text-green-600 font-medium">
                            £{Number.parseFloat(item.discount_price).toFixed(2)}
                          </span>
                        </>
                      ) : (
                        `£${Number.parseFloat(item.price).toFixed(2)}`
                      )}
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>
                      {item.quantity < item.reorder_level ? (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Low Stock
                        </Badge>
                      ) : (
                        <Badge variant="outline">In Stock</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/garage/stock/${item.stock_id}`}>View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
