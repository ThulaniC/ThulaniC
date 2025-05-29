import { requireRole } from "@/lib/auth"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { getNationalStockSummary } from "@/lib/db"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default async function ManagerStockPage() {
  const user = requireRole(["manager"])
  const stockSummary = await getNationalStockSummary()

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">National Stock Overview</h1>
          <p className="text-muted-foreground">Monitor inventory levels across all locations.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Stock Distribution</CardTitle>
            <CardDescription>View how stock is distributed between the warehouse and garages.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Warehouse Stock</TableHead>
                  <TableHead>Garage Stock</TableHead>
                  <TableHead>Total Stock</TableHead>
                  <TableHead>Distribution</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stockSummary.map((item, index) => {
                  const warehousePercentage = Math.round(
                    (Number.parseInt(item.warehouse_stock) / Number.parseInt(item.total_stock)) * 100,
                  )

                  return (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.product_name}</TableCell>
                      <TableCell>{item.warehouse_stock}</TableCell>
                      <TableCell>{item.garage_stock}</TableCell>
                      <TableCell>{item.total_stock}</TableCell>
                      <TableCell className="w-[200px]">
                        <div className="flex flex-col space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Warehouse</span>
                            <span>Garages</span>
                          </div>
                          <Progress value={warehousePercentage} className="h-2" />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{warehousePercentage}%</span>
                            <span>{100 - warehousePercentage}%</span>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
