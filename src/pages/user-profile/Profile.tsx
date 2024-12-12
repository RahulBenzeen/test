import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../components/ui/form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Avatar, AvatarFallback } from "../../components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { ScrollArea } from "../../components/ui/scroll-area"
import { UserIcon, Package, MapPin, CreditCard, ChevronRight, Edit, Trash2 } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog"
import showToast from '../../utils/toast/toastUtils'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { User } from '../../store/authSlice'
import { fetchAddresses } from '../../store/addressSlice'
import { fetchOrdersByUser } from '../../store/orderSlice'

interface Address {
  _id: string;
  type: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
}

const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
})

const addressSchema = z.object({
  type: z.string().min(1, { message: "Address type is required." }),
  street: z.string().min(5, { message: "Street address must be at least 5 characters." }),
  city: z.string().min(2, { message: "City must be at least 2 characters." }),
  state: z.string().length(2, { message: "State must be 2 characters." }),
  zip: z.string().regex(/^\d{5}$/, { message: "ZIP code must be 5 digits." }),
})

export default function ProfilePage() {
  const userData = useAppSelector((state) => state.auth.user) as User;
  const { addresses, status } = useAppSelector((state) => state.address);
  const {orders} = useAppSelector((state) => state.order)


  const dispatch = useAppDispatch()

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchAddresses());
      dispatch(fetchOrdersByUser());
    }
  }, [dispatch, status])

  const [user, setUser] = useState<User>(userData)
  const [isEditing, setIsEditing] = useState(false)
  const [isAddingAddress, setIsAddingAddress] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [activeTab, setActiveTab] = useState('profile')
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null)

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || '',
      email: user.email,
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
    showToast('Profile updated successfully!', 'success')
  }

  function onAddressSubmit(values: z.infer<typeof addressSchema>) {
    // Here you would typically dispatch an action to add the address
    setIsAddingAddress(false)
    addressForm.reset()
    showToast('Address Added Successfully!', 'success')
  }

  function handleEditAddress(address: Address) {
    setEditingAddress(address)
    addressForm.reset({
      type: address.type,
      street: address.address,
      city: address.city,
      state: '', // You might need to split this from city if not available separately
      zip: address.zipCode,
    })
    setIsAddingAddress(true)
  }

  function handleDeleteAddress(addressId: string) {
    setDeleteConfirmation(addressId)
  }

  function confirmDeleteAddress() {
    if (deleteConfirmation) {
      // Here you would typically dispatch an action to delete the address
      showToast('Address deleted successfully!', 'success')
      setDeleteConfirmation(null)
    }
  }

  const AddressCard = ({ address }: { address: Address }) => (
    <div className="flex items-start space-x-4 p-4 rounded-lg bg-muted group relative">
      <MapPin className="w-5 h-5 mt-1 text-muted-foreground" />
      <div>
        <h3 className="font-semibold">{address.type || 'Home'}</h3>
        <p className="text-sm text-muted-foreground">{address.address}</p>
        <p className="text-sm text-muted-foreground">{address.city}, {address.zipCode}</p>
        <p className="text-sm text-muted-foreground">{address.country}</p>
      </div>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" onClick={() => handleEditAddress(address)}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => handleDeleteAddress(address._id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )

  const tabContent = {
    profile: (
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarFallback>{user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{user.name || 'User'}</CardTitle>
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
                  <TableHead>Order Status</TableHead>
                  <TableHead>Payment Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-medium">{order._id}</TableCell>
                    <TableCell>{order.createdAt}</TableCell>
                    <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        order.orderStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        order.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' :
                        order.paymentStatus === 'pending' ? 'bg-blue-100 text-blue-800' :
                        order.paymentStatus === 'failed' ? 'bg-yellow-100 text-yellow-800' :'bg-gray-100 text-gray-800'
                      }`}>
                        {order.paymentStatus}
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
              <AddressCard key={address._id} address={address} />
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
                <Button type="submit">{editingAddress ? 'Update' : 'Add'} Address</Button>
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

      <Dialog open={!!deleteConfirmation} onOpenChange={() => setDeleteConfirmation(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this address? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmation(null)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDeleteAddress}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}