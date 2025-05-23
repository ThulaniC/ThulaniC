"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function NationalSalesComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>National Sales Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-6">
          <div className="flex gap-4">
            <div>
              <Label htmlFor="period">Time Period</Label>
              <Select defaultValue="month">
                <SelectTrigger id="period" className="w-[180px]">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select defaultValue="all">
                <SelectTrigger id="category" className="w-[180px]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="filters">Filters</SelectItem>
                  <SelectItem value="brakes">Brakes</SelectItem>
                  <SelectItem value="fluids">Fluids</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="export">Export</Label>
            <Select>
              <SelectTrigger id="export" className="w-[180px]">
                <SelectValue placeholder="Export data" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">Export as PDF</SelectItem>
                <SelectItem value="excel">Export as Excel</SelectItem>
                <SelectItem value="csv">Export as CSV</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="summary">
          <TabsList className="mb-6">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="by-garage">By Garage</TabsTrigger>
            <TabsTrigger value="by-product">By Product</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="summary">
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
          </TabsContent>

          {/* Similar TabsContent for other tabs */}
        </Tabs>
      </CardContent>
    </Card>
  )
}
