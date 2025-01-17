'use client'

import { useState, useEffect } from 'react'
import { LayoutDashboard, Package, ShoppingCart, Users, ChevronLeft, ChevronRight, Image, Menu } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Separator } from '../../components/ui/separator'
import ProductManagement from './ProductManagement'
import OrderManagement from './OrderManagement'
import CustomerManagement from './CustomerManagement'
import Analytics from './Analytics'
import ImageUpload from './uploadBannerImage'

const sidebarItems = [
  { name: 'Dashboard', icon: LayoutDashboard },
  { name: 'Products', icon: Package },
  { name: 'Orders', icon: ShoppingCart },
  { name: 'Customers', icon: Users },
  { name: 'Image', icon: Image },
]

export default function AdminDashboard() {
  const [activeItem, setActiveItem] = useState('Dashboard')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false)
      } else {
        setIsSidebarOpen(true)
      }
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

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
      case 'Image':
        return <ImageUpload />
      default:
        return <Analytics />
    }
  }

  const handleItemClick = (itemName: string) => {
    setActiveItem(itemName)
    if (isMobile) {
      setIsSidebarOpen(false)
    }
  }

  return (
    <div className="relative flex min-h-[92vh] bg-gray-100">
      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:relative
          h-full
          bg-white shadow-md
          transition-all duration-300 ease-in-out
          z-30 md:z-auto
          ${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 md:w-16'}
        `}
      >
        <div className="flex items-center justify-between p-4">
          <h1
            className={`text-xl md:text-2xl font-bold text-gray-800 transition-opacity duration-300 ${
              isSidebarOpen ? 'opacity-100' : 'opacity-0 md:opacity-0'
            }`}
          >
            Admin Panel
          </h1>
        </div>
        <Separator />
        <nav className="mt-4 space-y-2 px-2">
          {sidebarItems.map((item) => (
            <Button
              key={item.name}
              variant={activeItem === item.name ? 'secondary' : 'ghost'}
              className="w-full flex items-center justify-start"
              onClick={() => handleItemClick(item.name)}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {isSidebarOpen && <span className="ml-2 truncate">{item.name}</span>}
            </Button>
          ))}
        </nav>

        {/* Toggle Button - Hidden on mobile */}
        <Button
          variant="ghost"
          size="icon"
          className={`
            hidden md:flex
            absolute top-1/2 -right-4
            transform -translate-y-1/2
            bg-white rounded-full
            shadow-md border border-gray-200
            hover:bg-gray-100
            transition-transform duration-300
            ${isSidebarOpen ? 'rotate-0' : 'rotate-180'}
          `}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <ChevronLeft /> : <ChevronRight />}
        </Button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full md:w-auto overflow-x-hidden">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white shadow-sm">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h2 className="text-lg font-semibold">{activeItem}</h2>
          <div className="w-8" /> {/* Spacer for alignment */}
        </div>

        {/* Content Area */}
        <div className="p-4 md:p-8">
          <h2 className="hidden md:block text-2xl md:text-3xl font-bold mb-6">{activeItem}</h2>
          <div className="space-y-6">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  )
}