import { redirect } from "next/navigation"
import { getUser } from "@/lib/auth"

export default async function Home() {
  const user = await getUser()

  if (!user) {
    redirect("/login")
  }

  // Redirect based on user role
  if (user.role === "local_staff") {
    redirect("/garage")
  } else if (user.role === "warehouse_staff") {
    redirect("/warehouse")
  } else if (user.role === "manager") {
    redirect("/manager")
  }

  // Fallback redirect
  redirect("/login")
}
