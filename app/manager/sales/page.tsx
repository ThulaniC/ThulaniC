import { requireRole } from "@/lib/auth"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { getNationalSalesSummary } from "@/lib/db"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart } from "lucide-react"

export default async function ManagerSalesPage() {
  const user = requireRole(["manager"])
  const salesSummary = await getNationalSalesSummary()

  // Calculate total revenue
  const totalRevenue = salesSummary.reduce((sum, item) => sum + Number.parseFloat(item.total_revenue), 0)

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">National Sales Overview</h1>
          <p className="text-muted-foreground">Monitor sales performance across all garage locations.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sales by Garage</CardTitle>
            <CardDescription>Revenue and transaction breakdown by location.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center mb-6">
              <BarChart className="h-16 w-16 text-muted-foreground" />
              <p className="ml-4 text-sm text-muted-foreground">Sales chart visualization would appear here.</p>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Garage</TableHead>
                  <TableHead className="text-right">Total Sales</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Avg. Sale Value</TableHead>
                  <TableHead className="text-right">% of Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salesSummary.map((item, index) => {
                  const percentage = ((Number.parseFloat(item.total_revenue) / totalRevenue) * 100).toFixed(1)

                  return (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.garage_name}</TableCell>
                      <TableCell className="text-right">{item.total_sales}</TableCell>
                      <TableCell className="text-right">£{Number.parseFloat(item.total_revenue).toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        £{Number.parseFloat(item.average_sale_value).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">{percentage}%</TableCell>
                    </TableRow>
                  )
                })}
                <TableRow>
                  <TableCell className="font-bold">Total</TableCell>
                  <TableCell className="text-right font-bold">
                    {salesSummary.reduce((sum, item) => sum + Number.parseInt(item.total_sales), 0)}
                  </TableCell>
                  <TableCell className="text-right font-bold">£{totalRevenue.toFixed(2)}</TableCell>
                  <TableCell className="text-right font-bold">
                    £
                    {(
                      totalRevenue / salesSummary.reduce((sum, item) => sum + Number.parseInt(item.total_sales), 0)
                    ).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right font-bold">100%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
