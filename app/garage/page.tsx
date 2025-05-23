import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SalesComponent from "@/components/garage/sales-component"
import InventoryComponent from "@/components/garage/inventory-component"
import OrderComponent from "@/components/garage/order-component"
import CustomerComponent from "@/components/garage/customer-component"
import EmergencyQueryComponent from "@/components/garage/emergency-query-component"
import GarageHeader from "@/components/garage/garage-header"

export default function GaragePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <GarageHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Garage Dashboard</CardTitle>
            <CardDescription>Manage local sales, inventory, and customer information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Today's Sales</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">$1,245.89</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Low Stock Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">7</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Pending Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">3</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="sales">
          <TabsList className="grid grid-cols-5 mb-6">
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="emergency">Emergency Query</TabsTrigger>
          </TabsList>

          <TabsContent value="sales">
            <SalesComponent />
          </TabsContent>

          <TabsContent value="inventory">
            <InventoryComponent />
          </TabsContent>

          <TabsContent value="orders">
            <OrderComponent />
          </TabsContent>

          <TabsContent value="customers">
            <CustomerComponent />
          </TabsContent>

          <TabsContent value="emergency">
            <EmergencyQueryComponent />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
