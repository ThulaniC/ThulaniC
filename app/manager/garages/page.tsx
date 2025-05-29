import { requireRole } from "@/lib/auth"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { getGarages } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Building, ExternalLink } from "lucide-react"

export default async function ManagerGaragesPage() {
  const user = requireRole(["manager"])
  const garages = await getGarages()

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Garage Locations</h1>
          <p className="text-muted-foreground">Manage and monitor all garage locations.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {garages.map((garage) => (
            <Card key={garage.garage_id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{garage.name}</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">{garage.address}</div>
                <div className="text-xs text-muted-foreground">{garage.phone}</div>
                <div className="text-xs text-muted-foreground">{garage.email}</div>
                <Button variant="outline" size="sm" className="mt-4 w-full" asChild>
                  <Link href={`/manager/garages/${garage.garage_id}`}>
                    <ExternalLink className="mr-2 h-3 w-3" />
                    View Details
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Garage Performance</CardTitle>
            <CardDescription>Compare performance metrics across all garage locations.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Garage</TableHead>
                  <TableHead className="text-right">Sales (Month)</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Avg. Sale Value</TableHead>
                  <TableHead className="text-right">Stock Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {garages.map((garage) => (
                  <TableRow key={garage.garage_id}>
                    <TableCell className="font-medium">{garage.name}</TableCell>
                    <TableCell className="text-right">42</TableCell>
                    <TableCell className="text-right">£1,245.89</TableCell>
                    <TableCell className="text-right">£29.66</TableCell>
                    <TableCell className="text-right">£3,567.50</TableCell>
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
