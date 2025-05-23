import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-gray-900">Thulani Car Part Distribution System</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Welcome to Thulani Car Part Distribution System
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">Select your role to access the system</p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Local Garage Staff</CardTitle>
              <CardDescription>Manage local sales, inventory, and customer information</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Access features for selling parts, managing local inventory, and processing customer orders.</p>
            </CardContent>
            <CardFooter>
              <Link href="/garage" className="w-full">
                <Button className="w-full">Login as Garage Staff</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Warehouse Staff</CardTitle>
              <CardDescription>Manage central inventory and distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Access features for managing warehouse inventory, setting prices, and processing garage orders.</p>
            </CardContent>
            <CardFooter>
              <Link href="/warehouse" className="w-full">
                <Button className="w-full">Login as Warehouse Staff</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Manager</CardTitle>
              <CardDescription>Access comprehensive system overview</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Access all system features and view national sales and inventory reports.</p>
            </CardContent>
            <CardFooter>
              <Link href="/manager" className="w-full">
                <Button className="w-full">Login as Manager</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}
