import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../components/ui/form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { ScrollArea } from "../../components/ui/scroll-area"

import { User, Package, MapPin, CreditCard, ChevronRight } from 'lucide-react'
import showToast from '../../utils/toast/toastUtils'

// Mock user data
const mockUser = {
  id: '1',
  name: 'Rahul',
  email: 'rahul@example.com',
  avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=all',
  phone: '(555) 123-4567'
}

// Mock order data
const mockOrders = [
  { id: '1001', date: '2023-05-15', total: 129.99, status: 'Delivered' },
  { id: '1002', date: '2023-06-02', total: 79.95, status: 'Shipped' },
  { id: '1003', date: '2023-06-10', total: 249.99, status: 'Processing' },
  { id: '1004', date: '2023-06-15', total: 59.99, status: 'Pending' },
  { id: '1005', date: '2023-06-20', total: 149.99, status: 'Shipped' },
]

// Mock address data
const mockAddresses = [
  { id: '1', type: 'Home', street: '123 Main St', city: 'Anytown', state: 'AN', zip: '12345' },
  { id: '2', type: 'Work', street: '456 Office Blvd', city: 'Workville', state: 'WK', zip: '67890' },
]

const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().regex(/^$$\d{3}$$ \d{3}-\d{4}$/, { message: "Phone number must be in the format (xxx) xxx-xxxx" }),
})

const addressSchema = z.object({
  type: z.string().min(1, { message: "Address type is required." }),
  street: z.string().min(5, { message: "Street address must be at least 5 characters." }),
  city: z.string().min(2, { message: "City must be at least 2 characters." }),
  state: z.string().length(2, { message: "State must be 2 characters." }),
  zip: z.string().regex(/^\d{5}$/, { message: "ZIP code must be 5 digits." }),
})

export default function ProfilePage() {
  const [user, setUser] = useState(mockUser)
  const [addresses, setAddresses] = useState(mockAddresses)
  const [isEditing, setIsEditing] = useState(false)
  const [isAddingAddress, setIsAddingAddress] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
  })

  const addressForm = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      type: '',
      street: '',
      city: '',
      state: '',
      zip: '',
    },
  })

  function onProfileSubmit(values: z.infer<typeof profileSchema>) {
    setUser({ ...user, ...values })
    setIsEditing(false)
    showToast('Profile updated successfully!','success')
  }

  function onAddressSubmit(values: z.infer<typeof addressSchema>) {
    setAddresses([...addresses, { id: Date.now().toString(), ...values }])
    setIsAddingAddress(false)
    addressForm.reset()
    showToast('Address Added Successfully !', 'success')
  }

  const tabContent = {
    profile: (
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-8">
              <FormField
                control={profileForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={!isEditing} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={profileForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={!isEditing} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={profileForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={!isEditing} />
                    </FormControl>
                    <FormDescription>
                      Format: (xxx) xxx-xxxx
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isEditing && (
                <Button type="submit">Save Changes</Button>
              )}
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          )}
        </CardFooter>
      </Card>
    ),
    orders: (
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>View your past orders and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] w-full rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    ),
    addresses: (
      <Card>
        <CardHeader>
          <CardTitle>Addresses</CardTitle>
          <CardDescription>Manage your saved addresses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {addresses.map((address) => (
              <div key={address.id} className="flex items-start space-x-4 p-4 rounded-lg bg-muted">
                <MapPin className="w-5 h-5 mt-1 text-muted-foreground" />
                <div>
                  <h3 className="font-semibold">{address.type}</h3>
                  <p className="text-sm text-muted-foreground">{address.street}</p>
                  <p className="text-sm text-muted-foreground">{address.city}, {address.state} {address.zip}</p>
                </div>
              </div>
            ))}
          </div>
          {isAddingAddress ? (
            <Form {...addressForm}>
              <form onSubmit={addressForm.handleSubmit(onAddressSubmit)} className="space-y-4 mt-6">
                <FormField
                  control={addressForm.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Type</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Home, Work" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addressForm.control}
                  name="street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={addressForm.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addressForm.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input {...field} maxLength={2} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={addressForm.control}
                  name="zip"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ZIP Code</FormLabel>
                      <FormControl>
                        <Input {...field} maxLength={5} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Add Address</Button>
              </form>
            </Form>
          ) : (
            <Button onClick={() => setIsAddingAddress(true)} className="mt-4">Add New Address</Button>
          )}
        </CardContent>
      </Card>
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
                    {tab === 'profile' && <User className="mr-2 h-4 w-4" />}
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