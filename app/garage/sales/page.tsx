import { requireRole } from "@/lib/auth"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { getSalesByGarage, getGarageById } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Plus, Receipt } from "lucide-react"
import { format } from "date-fns"

export default async function GarageSalesPage() {
  const user = requireRole(["local_staff", "manager"])
  const garage = await getGarageById(user.locationId)
  const sales = await getSalesByGarage(user.locationId)

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{garage.name} Sales</h1>
            <p className="text-muted-foreground">View and manage sales transactions.</p>
          </div>
          <Button asChild>
            <Link href="/garage/sales/new">
              <Plus className="mr-2 h-4 w-4" />
              New Sale
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sales History</CardTitle>
            <CardDescription>View all sales transactions from this garage.</CardDescription>
          </CardHeader>
          <CardContent>
            {sales.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sale ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sales.map((sale) => (
                    <TableRow key={sale.sale_id}>
                      <TableCell className="font-medium">{sale.sale_id}</TableCell>
                      <TableCell>{format(new Date(sale.sale_date), "dd/MM/yyyy HH:mm")}</TableCell>
                      <TableCell>{sale.customer_name}</TableCell>
                      <TableCell>£{Number.parseFloat(sale.total_amount).toFixed(2)}</TableCell>
                      <TableCell>{sale.status}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/garage/sales/${sale.sale_id}`}>
                            <Receipt className="h-3 w-3 mr-1" />
                            View
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-6">
                <Receipt className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-lg font-medium">No sales found</h3>
                <p className="text-sm text-muted-foreground">Start by creating a new sale transaction.</p>
                <Button className="mt-4" asChild>
                  <Link href="/garage/sales/new">
                    <Plus className="mr-2 h-4 w-4" />
                    New Sale
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
