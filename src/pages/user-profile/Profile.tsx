
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { UserIcon, Package, MapPin, CreditCard, ChevronRight} from 'lucide-react'
import UserProfile from './ProfileInfo'
import AddressManagement from './AddressInfo'
import { useState } from "react"
import CustomerOrderHistory from "./OrderInfo"



export default function ProfilePage() {

  const [activeTab, setActiveTab] = useState('profile')

  const tabContent = {
    profile: (
      <UserProfile />
    ),
    orders: (
      <CustomerOrderHistory />
    ),
    addresses: (
      <AddressManagement/>
    ),
    payment: (
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>Manage your payment methods</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Payment methods management to be implemented.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Account</h1>
      </div>

      <div className="flex flex-col md:flex-row max-w-6xl mx-auto gap-8">
        <div className="w-full md:w-1/4">
          <Card>
            <CardContent className="p-0">
              <nav className="flex flex-col">
                {Object.entries(tabContent).map(([tab,], index) => (
                  <Button
                    key={tab}
                    variant="ghost"
                    className={`justify-start rounded-none h-14 px-4 ${
                      activeTab === tab ? 'bg-muted' : ''
                    } ${index !== 0 ? 'border-t' : ''}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab === 'profile' && <UserIcon className="mr-2 h-4 w-4" />}
                    {tab === 'orders' && <Package className="mr-2 h-4 w-4" />}
                    {tab === 'addresses' && <MapPin className="mr-2 h-4 w-4" />}
                    {tab === 'payment' && <CreditCard className="mr-2 h-4 w-4" />}
                    <span className="flex-grow text-left">{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
                    <ChevronRight className="ml-auto h-4 w-4" />
                  </Button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>
        <div className="w-full md:w-3/4">
          {tabContent[activeTab as keyof typeof tabContent]}
        </div>
      </div>
    </div>
  )
}