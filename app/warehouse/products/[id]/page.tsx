import { notFound } from "next/navigation"
import { requireRole } from "@/lib/auth"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { getProductById, getWarehouseById } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import PricingForm from "./pricing-form"

export default async function ProductPricingPage({ params }: { params: { id: string } }) {
  const user = requireRole(["warehouse_staff", "manager"])
  const warehouse = await getWarehouseById(user.locationId)
  const product = await getProductById(Number(params.id))

  if (!product) {
    notFound()
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-2">
            <Link href="/warehouse/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Product Pricing</h1>
          <p className="text-muted-foreground">Update price and discount for {product.name}.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{product.name}</CardTitle>
            <CardDescription>{product.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <PricingForm product={product} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
