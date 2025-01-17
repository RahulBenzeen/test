import { useEffect, useState } from 'react'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import { removeFromCartAsync, updateQuantityAsync, clearCartAsync } from '../../store/cartSlice'
import { Button } from "../../components/ui/button"
import { Label } from "../../components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { fetchAddresses } from '../../store/addressSlice'
import { useNavigate } from 'react-router-dom'
import { createOrder } from '../../store/orderSlice'
import { ScrollArea } from "../../components/ui/scroll-area"

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
      product: item.product._id,
      name: item.product.name,
      price: item.price,
      quantity: item.quantity,
    }))

    const orderData = {
      products,
      shippingAddress: selectedAddress,
      paymentMethod: 'razorpay',
    }
    dispatch(createOrder(orderData))
      .then((response) => {
        if (response.payload?.success) {
          router('/checkout/place-order', { state: { order: response.payload } })
        } else {
          console.error('Order creation failed:', response.payload?.message)
        }
      })
      .catch((error) => {
        console.error('Error while creating order:', error)
      })
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-semibold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">Looks like you haven't added anything to your cart yet.</p>
          <Button onClick={() => router('/')} className="w-full sm:w-auto">
            Continue Shopping
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Cart Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Your Cart ({cartItems.length} items)</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleClearCart}
                  className="text-muted-foreground hover:text-destructive"
                >
                  Clear Cart
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] sm:h-[500px] pr-4">
                <ul className="space-y-6">
                  {cartItems.map((item) => (
                    <li key={item._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
                      <div className="flex items-start space-x-4">
                        <img 
                          src={item?.product?.images[0]} 
                          alt={item?.product?.name} 
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="space-y-1">
                          <h3 className="font-medium line-clamp-2">{item?.product?.name}</h3>
                          <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                        <div className="flex items-center space-x-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                            className="h-8 w-8"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                            className="h-8 w-8"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleRemoveFromCart(item._id)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <div className="w-full flex justify-between items-center text-lg font-semibold">
                <span>Total</span>
                <span>${getTotalPrice()}</span>
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Shipping Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle>Shipping Address</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router("/profile?tab=addresses")}
              >
                Add New
              </Button>
            </CardHeader>
            <CardContent>
              {savedAddresses.length > 0 ? (
                <div className="space-y-4">
                  <Label className="text-base">Select delivery address</Label>
                  <div className="grid gap-4">
                    {savedAddresses.map((addr) => (
                      <div
                        key={addr._id}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                          selectedAddressId === addr._id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedAddressId(addr._id || '')}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            id={addr._id}
                            name="address"
                            value={addr._id}
                            checked={selectedAddressId === addr._id}
                            onChange={() => setSelectedAddressId(addr._id || '')}
                            className="mt-1"
                          />
                          <Label htmlFor={addr._id} className="cursor-pointer space-y-1">
                            <span className="font-medium block">
                              {addr.address}
                            </span>
                            <span className="text-sm text-muted-foreground block">
                              {addr.city}, {addr.zipCode}
                            </span>
                          </Label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">No saved addresses found.</p>
                  <Button
                    variant="outline"
                    onClick={() => router("/profile?tab=addresses")}
                  >
                    Add New Address
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button
                className="w-full"
                size="lg"
                onClick={handlePlaceOrder}
                disabled={!selectedAddressId}
              >
                Place Order
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                By placing this order you agree to our Terms of Service and Privacy Policy
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}