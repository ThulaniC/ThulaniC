import { requireRole } from "@/lib/auth"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { getGarageById, getProducts, getWarehouses, getGarages } from "@/lib/db"
import NewOrderForm from "./new-order-form"

export default async function NewOrderPage() {
  const user = requireRole(["local_staff", "manager"])
  const garage = await getGarageById(user.locationId)
  const products = await getProducts()
  const warehouses = await getWarehouses()
  const garages = await getGarages()

  // Filter out the current garage from the list
  const otherGarages = garages.filter((g) => g.garage_id !== user.locationId)

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Order</h1>
          <p className="text-muted-foreground">Order parts from the warehouse or other garages.</p>
        </div>

        <NewOrderForm garage={garage} products={products} warehouses={warehouses} otherGarages={otherGarages} />
      </div>
    </DashboardLayout>
  )
}
