import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { requireRole } from "@/lib/auth"
import DashboardLayout from "@/components/layout/dashboard-layout"
import Link from "next/link"
import { getNationalSalesSummary, getNationalStockSummary } from "@/lib/db"
import { AlertCircle, BarChart3, FileUp, TrendingUp, Package, Building } from "lucide-react"

export default async function ManagerDashboard() {
  const user = await requireRole(["manager"])

  let salesSummary = []
  let stockSummary = []
  let error = null

  try {
    salesSummary = await getNationalSalesSummary()
    stockSummary = await getNationalStockSummary()
  } catch (err) {
    error = "Unable to load dashboard data. Please ensure the database is properly set up."
    console.error("Dashboard data error:", err)
  }

  const totalRevenue = salesSummary.reduce((sum, item) => sum + Number(item.total_revenue || 0), 0)
  const totalSales = salesSummary.reduce((sum, item) => sum + Number(item.total_sales || 0), 0)
  const totalProducts = stockSummary.length
  const totalStock = stockSummary.reduce((sum, item) => sum + Number(item.total_stock || 0), 0)

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manager Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user.username}. Here's an overview of the entire operation.
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Database Connection Issue</AlertTitle>
            <AlertDescription>
              {error}
              <br />
              <Button asChild variant="link" className="p-0 h-auto font-normal mt-2">
                <Link href="/manager/import">Set up database with sample data</Link>
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">£{totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Across all locations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSales}</div>
              <p className="text-xs text-muted-foreground">Transactions completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
              <p className="text-xs text-muted-foreground">Active products</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStock}</div>
              <p className="text-xs text-muted-foreground">Items in inventory</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common management tasks.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/manager/sales">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Sales Reports
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/manager/stock">
                  <Package className="mr-2 h-4 w-4" />
                  Monitor Stock Levels
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/manager/garages">
                  <Building className="mr-2 h-4 w-4" />
                  Manage Garages
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/manager/import">
                  <FileUp className="mr-2 h-4 w-4" />
                  Import Data
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Overview of system health.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Database Connection</span>
                <span className={`text-sm ${error ? "text-red-500" : "text-green-500"}`}>
                  {error ? "Disconnected" : "Connected"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Active Garages</span>
                <span className="text-sm text-muted-foreground">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Active Warehouses</span>
                <span className="text-sm text-muted-foreground">1</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">System Version</span>
                <span className="text-sm text-muted-foreground">v1.0.0</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
