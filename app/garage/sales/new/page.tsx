import { requireRole } from "@/lib/auth"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { getGarageById, getStockByLocation, getCustomers } from "@/lib/db"
import NewSaleForm from "./new-sale-form"

export default async function NewSalePage() {
  const user = requireRole(["local_staff", "manager"])
  const garage = await getGarageById(user.locationId)
  const stock = await getStockByLocation("garage", user.locationId)
  const customers = await getCustomers()

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Sale</h1>
          <p className="text-muted-foreground">Record a new sale transaction.</p>
        </div>

        <NewSaleForm garage={garage} stock={stock} customers={customers} />
      </div>
    </DashboardLayout>
  )
}
