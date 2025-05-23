import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import WarehouseInventoryComponent from "@/components/warehouse/warehouse-inventory-component"
import PricingComponent from "@/components/warehouse/pricing-component"
import DiscountsComponent from "@/components/warehouse/discounts-component"
import DispatchComponent from "@/components/warehouse/dispatch-component"
import WarehouseHeader from "@/components/warehouse/warehouse-header"

export default function WarehousePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <WarehouseHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Warehouse Dashboard</CardTitle>
            <CardDescription>Manage central inventory, pricing, and distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Total Inventory Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">$1,245,789.00</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Pending Dispatches</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">12</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Active Discounts</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">8</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="inventory">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="discounts">Discounts</TabsTrigger>
            <TabsTrigger value="dispatch">Dispatch</TabsTrigger>
          </TabsList>

          <TabsContent value="inventory">
            <WarehouseInventoryComponent />
          </TabsContent>

          <TabsContent value="pricing">
            <PricingComponent />
          </TabsContent>

          <TabsContent value="discounts">
            <DiscountsComponent />
          </TabsContent>

          <TabsContent value="dispatch">
            <DispatchComponent />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
