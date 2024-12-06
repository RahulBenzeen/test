'use client'

import { useState } from 'react'
import { LayoutDashboard, Package, ShoppingCart, Users, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Separator } from '../../components/ui/separator'
import ProductManagement from './ProductManagement'
import OrderManagement from './OrderManagement'
import CustomerManagement from './CustomerManagement'
import Analytics from './Analytics'

const sidebarItems = [
  { name: 'Dashboard', icon: LayoutDashboard },
  { name: 'Products', icon: Package },
  { name: 'Orders', icon: ShoppingCart },
  { name: 'Customers', icon: Users },
]

export default function AdminDashboard() {
  const [activeItem, setActiveItem] = useState('Dashboard')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const renderContent = () => {
    switch (activeItem) {
      case 'Dashboard':
        return <Analytics />
      case 'Products':
        return <ProductManagement />
      case 'Orders':
        return <OrderManagement />
      case 'Customers':
        return <CustomerManagement />
      default:
        return <Analytics />
    }
  }

  return (
    <div className="flex h-[92vh] bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`relative bg-white shadow-md transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'w-64' : 'w-16'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4">
          <h1
            className={`text-2xl font-bold text-gray-800 transition-opacity duration-300 ${
              isSidebarOpen ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Admin Panel
          </h1>
        </div>
        <Separator />
        <nav className="mt-4 space-y-2">
          {sidebarItems.map((item) => (
            <Button
              key={item.name}
              variant={activeItem === item.name ? 'secondary' : 'ghost'}
              className="w-full flex items-center justify-start"
              onClick={() => setActiveItem(item.name)}
            >
              <item.icon className="h-5 w-5" />
              {isSidebarOpen && <span className="ml-2">{item.name}</span>}
            </Button>
          ))}
        </nav>

        {/* Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-1/2 -right-4 transform -translate-y-1/2 bg-white rounded-full shadow-md border border-gray-200 hover:bg-gray-100 transition-transform duration-300 ${
            isSidebarOpen ? 'rotate-0' : 'rotate-180'
          }`}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <ChevronLeft /> : <ChevronRight />}
        </Button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <h2 className="text-3xl font-bold mb-6">{activeItem}</h2>
        {renderContent()}
      </main>
    </div>
  )
}
