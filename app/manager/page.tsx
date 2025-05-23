import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ManagerPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-gray-900">Manager Dashboard</h1>
            <nav className="flex space-x-4">
              <a href="/" className="text-gray-600 hover:text-gray-900">
                Home
              </a>
              <a href="/garage" className="text-gray-600 hover:text-gray-900">
                Garage
              </a>
              <a href="/warehouse" className="text-gray-600 hover:text-gray-900">
                Warehouse
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Manager Dashboard</CardTitle>
            <CardDescription>View comprehensive system reports and manage operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Total National Sales</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">$3,245,789.00</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Total Inventory Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">$5,789,456.00</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Total Garages</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">24</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Active Customers</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">4,567</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="national-sales">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="national-sales">National Sales</TabsTrigger>
            <TabsTrigger value="local-sales">Local Sales</TabsTrigger>
            <TabsTrigger value="national-stock">National Stock</TabsTrigger>
            <TabsTrigger value="local-stock">Local Stock</TabsTrigger>
          </TabsList>

          <TabsContent value="national-sales">
            <Card>
              <CardHeader>
                <CardTitle>National Sales Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Total Sales</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">$1,245,789.00</p>
                      <p className="text-sm text-green-600">↑ 12.5% from last period</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Total Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">8,456</p>
                      <p className="text-sm text-green-600">↑ 8.2% from last period</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Average Order Value</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">$147.32</p>
                      <p className="text-sm text-green-600">↑ 4.1% from last period</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Sales Chart Visualization</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="local-sales">
            <Card>
              <CardHeader>
                <CardTitle>Local Sales by Garage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Downtown Garage</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold">$45,789.00</p>
                        <p className="text-sm text-green-600">↑ 8.2% this month</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Westside Auto Parts</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold">$38,456.00</p>
                        <p className="text-sm text-green-600">↑ 5.7% this month</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Eastside Car Center</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold">$52,123.00</p>
                        <p className="text-sm text-green-600">↑ 12.1% this month</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="national-stock">
            <Card>
              <CardHeader>
                <CardTitle>National Stock Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Filters</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">850</p>
                      <p className="text-sm text-gray-600">Total units</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Brakes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">200</p>
                      <p className="text-sm text-gray-600">Total units</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Fluids</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">1,500</p>
                      <p className="text-sm text-gray-600">Total units</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Electrical</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">550</p>
                      <p className="text-sm text-gray-600">Total units</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Stock Level Chart Visualization</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="local-stock">
            <Card>
              <CardHeader>
                <CardTitle>Local Stock by Garage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Downtown Garage</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="font-medium">Oil Filters</p>
                        <p className="text-2xl font-bold">45</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="font-medium">Air Filters</p>
                        <p className="text-2xl font-bold">32</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="font-medium">Brake Pads</p>
                        <p className="text-2xl font-bold text-orange-600">18</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="font-medium">Spark Plugs</p>
                        <p className="text-2xl font-bold">120</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Westside Auto Parts</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="font-medium">Oil Filters</p>
                        <p className="text-2xl font-bold">38</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="font-medium">Air Filters</p>
                        <p className="text-2xl font-bold">27</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="font-medium">Brake Pads</p>
                        <p className="text-2xl font-bold">22</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="font-medium">Engine Oil</p>
                        <p className="text-2xl font-bold">42</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
