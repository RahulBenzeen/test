'use client'

import { useAppSelector, useAppDispatch } from '../../store/hooks'
import { removeFromCartAsync, updateQuantityAsync, clearCartAsync } from '../../store/cartSlice'
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Minus, Plus, Trash2 } from 'lucide-react'
import { saveNewAddress } from '../../store/addressSlice'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ShippingAddressFormValues, shippingAddressSchema } from '../../utils/schemas/addressSchema'
import { useNavigate } from 'react-router-dom'
import { createOrder } from '../../store/orderSlice'

export default function CheckoutPage() {
  const cartItems = useAppSelector((state) => state.cart.items)
  const savedAddresses = useAppSelector((state) => state.address.addresses)
  const dispatch = useAppDispatch()
  const router = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ShippingAddressFormValues>({
    resolver: zodResolver(shippingAddressSchema),
  })

  const handleRemoveFromCart = (productId: string) => {
    dispatch(removeFromCartAsync(productId))
  }

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity > 0) {
      dispatch(updateQuantityAsync({ id: productId, quantity: newQuantity }))
    } else {
      dispatch(removeFromCartAsync(productId))
    }
  }

  const handleClearCart = () => {
    dispatch(clearCartAsync())
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)
  }



  const onSubmit = (data: ShippingAddressFormValues) => {
    // Save the address first
    dispatch(saveNewAddress(data))
      .then(() => {
        // Prepare the products array for the order
        const products = cartItems.map((item) => ({
          product: item._id, // Use only the product ID
          name: item.product.name, // Include product name
          price: item.price, // Include price
          quantity: item.quantity, // Include quantity
        }));
  
        // Prepare the order data
        const orderData = {
          products: products,
          shippingAddress: {
            firstName: data.firstName,
            lastName: data.lastName,
            address: data.address,
            city: data.city,
            zipCode: data.zipCode,
            country: data.country,
          },
          paymentMethod: 'razorpay',
        };
  
        // Dispatch the createOrder action
        dispatch(createOrder(orderData))
          .then((response) => {
            if (response.payload?.success) {
              // Navigate to the '/place-order' route after successful order creation
              router('/place-order', { state: { order: response.payload } });
            } else {
              console.error('Order creation failed:', response.payload?.message);
            }
          })
          .catch((error) => {
            console.error('Error while creating order:', error);
          });
      })
      .catch((error) => {
        console.error('Error while saving address:', error);
      });
  };
  

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Your Cart</CardTitle>
            </CardHeader>
            <CardContent>
              {cartItems.length === 0 ? (
                <p>Your cart is empty</p>
              ) : (
                <ul className="space-y-4">
                  {cartItems.map((item) => (
                    <li key={item._id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <img src={item?.product?.images[0]} alt={item?.product?.name} className="w-16 h-16 object-cover rounded" />
                        <div>
                          <h3 className="font-semibold">{item?.product?.name}</h3>
                          <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span>{item.quantity}</span>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => handleRemoveFromCart(item._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleClearCart}>Clear Cart</Button>
              <div className="text-xl font-bold">Total: ${getTotalPrice()}</div>
            </CardFooter>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent>
              {/* {savedAddresses.length > 0 && (
                <div className="mb-4">
                  <Label htmlFor="savedAddress">Select a saved address</Label>
                  <Select onValueChange={handleAddressSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an address" />
                    </SelectTrigger>
                    <SelectContent>
                      {savedAddresses.map((addr) => (
                        <SelectItem key={addr._id} value={addr._id}>
                          {addr.address}, {addr.city}, {addr.zipCode}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )} */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" {...register('firstName')} />
                    {errors.firstName && (
                      <p className="text-sm text-red-500">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" {...register('lastName')} />
                    {errors.lastName && (
                      <p className="text-sm text-red-500">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" {...register('address')} />
                  {errors.address && (
                    <p className="text-sm text-red-500">{errors.address.message}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" {...register('city')} />
                    {errors.city && (
                      <p className="text-sm text-red-500">{errors.city.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="zipCode">Zip Code</Label>
                    <Input id="zipCode" {...register('zipCode')} />
                    {errors.zipCode && (
                      <p className="text-sm text-red-500">{errors.zipCode.message}</p>
                    )}
                  </div>
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" {...register('country')} />
                  {errors.country && (
                    <p className="text-sm text-red-500">{errors.country.message}</p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={cartItems.length === 0}>
                  Place Order
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

