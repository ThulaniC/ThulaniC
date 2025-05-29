import { requireRole } from "../../../lib/auth"
import DashboardLayout from "@/components/layout/dashboard-layout"
import ImportForm from "./import-form"

export default async function ImportPage() {
  const user = requireRole(["manager"])

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Import Data</h1>
          <p className="text-muted-foreground">Import data from CSV files into the database.</p>
        </div>

        <ImportForm />
      </div>
    </DashboardLayout>
  )
}
