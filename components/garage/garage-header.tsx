import Link from "next/link"

export default function GarageHeader() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <h1 className="text-2xl font-bold text-gray-900">Thulani Car Parts - Garage Dashboard</h1>
          <nav className="flex space-x-4">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <Link href="/warehouse" className="text-gray-600 hover:text-gray-900">
              Warehouse
            </Link>
            <Link href="/manager" className="text-gray-600 hover:text-gray-900">
              Manager
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
