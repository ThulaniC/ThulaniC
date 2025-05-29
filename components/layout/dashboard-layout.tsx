import type React from "react"
import Header from "./header"

interface DashboardLayoutProps {
  user: {
    username: string
    role: string
    locationId: number
    locationType: string
  }
  children: React.ReactNode
}

export default function DashboardLayout({ user, children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header user={user} />
      <main className="flex-1 container py-6">{children}</main>
      <footer className="border-t py-4">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-14 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Car Parts Retail System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
