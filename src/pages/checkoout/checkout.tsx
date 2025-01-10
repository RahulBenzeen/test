'use client'

import { useEffect, useState } from 'react'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import { removeFromCartAsync, updateQuantityAsync, clearCartAsync } from '../../store/cartSlice'
import { Button } from "../../components/ui/button"
import { Label } from "../../components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Minus, Plus, Trash2 } from 'lucide-react'
import { fetchAddresses } from '../../store/addressSlice'
import { useNavigate } from 'react-router-dom'
import { createOrder } from '../../store/orderSlice'

export default function CheckoutPage() {
  const cartItems = useAppSelector((state) => state.cart.items)
  const savedAddresses = useAppSelector((state) => state.address.addresses)
  const dispatch = useAppDispatch()
  const router = useNavigate()
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)

  useEffect(() => {
    dispatch(fetchAddresses())
  }, [dispatch])

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

  const handlePlaceOrder = () => {
    if (!selectedAddressId) {
      alert('Please select a shipping address.')
      return
    }

    const selectedAddress = savedAddresses.find((addr) => addr._id === selectedAddressId)
    if (!selectedAddress) {
      console.error('Selected address not found.')
      return
    }

    const products = cartItems.map((item) => ({
      product: item._id,
      name: item.product.name,
      price: item.price,
      quantity: item.quantity,
    }))

    const orderData = {
      products: products,
      shippingAddress: selectedAddress,
      paymentMethod: 'razorpay',
    }

    dispatch(createOrder(orderData))
      .then((response) => {
        if (response.payload?.success) {
          router('/place-order', { state: { order: response.payload } })
        } else {
          console.error('Order creation failed:', response.payload?.message)
        }
      })
      .catch((error) => {
        console.error('Error while creating order:', error)
      })
  }

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
              <Button variant="outline" onClick={handleClearCart}>
                Clear Cart
              </Button>
              <div className="text-xl font-bold">Total: ${getTotalPrice()}</div>
            </CardFooter>
          </Card>
        </div>
        <div>
        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle>Shipping Information</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router('/add-address')}
            >
              Add New Address
            </Button>
          </CardHeader>
  <CardContent>
    {savedAddresses.length > 0 ? (
      <div className="mb-4">
        <Label>Select a saved address</Label>
        <div className="space-y-2">
          {savedAddresses.map((addr) => (
            <div key={addr._id} className="flex items-center space-x-2">
              <input
                type="radio"
                id={addr._id}
                name="address"
                value={addr._id}
                checked={selectedAddressId === addr._id}
                onChange={() => setSelectedAddressId(addr._id || '')}
              />
              <Label htmlFor={addr._id}>
                {addr.address}, {addr.city}, {addr.zipCode}
              </Label>
            </div>
          ))}
        </div>
      </div>
    ) : (
      <p>No saved addresses found. Please add an address.</p>
    )}
  </CardContent>
  <CardFooter>
    <Button
      className="w-full"
      onClick={handlePlaceOrder}
      disabled={cartItems.length === 0 || !selectedAddressId}
    >
      Place Order
    </Button>
  </CardFooter>
</Card>

        </div>
      </div>
    </div>
  )
}
