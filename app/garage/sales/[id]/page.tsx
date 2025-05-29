import { notFound } from "next/navigation"
import { requireRole } from "@/lib/auth"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { getSaleDetails, getSalesByGarage, getGarageById } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Receipt, Printer } from "lucide-react"
import { format } from "date-fns"

export default async function SaleDetailsPage({ params }: { params: { id: string } }) {
  const user = requireRole(["local_staff", "manager"])
  const garage = await getGarageById(user.locationId)

  // Get all sales for this garage
  const sales = await getSalesByGarage(user.locationId)

  // Find the specific sale
  const sale = sales.find((s) => s.sale_id === Number(params.id))

  if (!sale) {
    notFound()
  }

  // Get sale items
  const saleItems = await getSaleDetails(sale.sale_id)

  // Calculate totals
  const totalItems = saleItems.reduce((sum, item) => sum + Number(item.quantity), 0)
  const subtotal = saleItems.reduce((sum, item) => sum + Number(item.quantity) * Number(item.price), 0)
  const totalDiscount = saleItems.reduce((sum, item) => sum + Number(item.discount), 0)

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Button variant="ghost" size="sm" asChild className="mb-2">
              <Link href="/garage/sales">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Sales
              </Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Sale #{sale.sale_id}</h1>
            <p className="text-muted-foreground">
              Created on {format(new Date(sale.sale_date), "dd MMMM yyyy 'at' HH:mm")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
              {sale.status || "Completed"}
            </Badge>
            <Button variant="outline" size="sm">
              <Printer className="mr-2 h-4 w-4" />
              Print Receipt
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sale Information</CardTitle>
            <CardDescription>Details about this sale.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Customer</h3>
                <p className="text-lg font-medium">{sale.customer_name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Garage</h3>
                <p className="text-lg font-medium">{garage.name}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Sale Items</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Discount</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {saleItems.map((item) => (
                    <TableRow key={item.sale_item_id}>
                      <TableCell className="font-medium">{item.product_name}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell className="text-right">£{Number(item.price).toFixed(2)}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">£{Number(item.discount).toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        £{(Number(item.price) * Number(item.quantity) - Number(item.discount)).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-medium">
                      Subtotal
                    </TableCell>
                    <TableCell className="text-right font-medium">{totalItems}</TableCell>
                    <TableCell className="text-right font-medium">£{totalDiscount.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-medium">£{subtotal.toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={5} className="text-right font-bold">
                      Total
                    </TableCell>
                    <TableCell className="text-right font-bold">£{Number(sale.total_amount).toFixed(2)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/garage/sales">Back to All Sales</Link>
            </Button>
            <Button variant="outline">
              <Receipt className="mr-2 h-4 w-4" />
              Email Receipt
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  )
}
