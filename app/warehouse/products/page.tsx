import { requireRole } from "@/lib/auth"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { getProducts, getWarehouseById } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Edit, Tag, Plus } from "lucide-react"

export default async function WarehouseProductsPage() {
  const user = requireRole(["warehouse_staff", "manager"])
  const warehouse = await getWarehouseById(user.locationId)
  const products = await getProducts()

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Product Management</h1>
            <p className="text-muted-foreground">Manage product catalog, prices, and discounts.</p>
          </div>
          <Button asChild>
            <Link href="/warehouse/products/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Product Catalog</CardTitle>
            <CardDescription>View and manage all products in the system.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reorder Level</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.product_id}>
                    <TableCell>{product.product_id}</TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.description}</TableCell>
                    <TableCell>
                      {product.on_offer ? (
                        <>
                          <span className="line-through text-muted-foreground mr-2">
                            £{Number(product.price).toFixed(2)}
                          </span>
                          <span className="text-green-600 font-medium">
                            £{Number(product.discount_price).toFixed(2)}
                          </span>
                        </>
                      ) : (
                        `£${Number(product.price).toFixed(2)}`
                      )}
                    </TableCell>
                    <TableCell>
                      {product.on_offer ? (
                        <Badge variant="success" className="bg-green-500">
                          On Sale
                        </Badge>
                      ) : (
                        <Badge variant="outline">Regular Price</Badge>
                      )}
                    </TableCell>
                    <TableCell>{product.reorder_level}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/warehouse/products/${product.product_id}`}>
                            <Tag className="h-3 w-3 mr-1" />
                            Pricing
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/warehouse/products/${product.product_id}/edit`}>
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Link>
                        </Button>
                      </div>
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
