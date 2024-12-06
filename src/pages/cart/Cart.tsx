import { useEffect, useState } from 'react'
import { ShoppingCart, X, Minus, Plus, Loader2 } from 'lucide-react'
import { Button } from "../../components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "../../components/ui/sheet"
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { fetchCart, removeFromCartAsync, updateQuantityAsync, clearCartAsync, CartItem } from '../../store/cartSlice'
import { Link } from 'react-router-dom'

export default function Cart() {
  const dispatch = useAppDispatch()
  const { items: cartItems, status, error } = useAppSelector((state) => state.cart)
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCart())
    }
  }, [status, dispatch])

  const handleRemoveFromCart = async (productId: string) => {
    setIsLoading(true)
    await dispatch(removeFromCartAsync(productId))
    setIsLoading(false)
  }

  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    setIsLoading(true)
    if (newQuantity > 0) {
      await dispatch(updateQuantityAsync({ id: productId, quantity: newQuantity }))
    } else {
      await dispatch(removeFromCartAsync(productId))
    }
    setIsLoading(false)
  }

  const handleClearCart = async () => {
    setIsLoading(true)
    await dispatch(clearCartAsync())
    setIsLoading(false)
  }

  const getTotalPrice = () => {
    return cartItems?.reduce((total, item) => total + (item.price || 0) * (item.quantity || 0), 0)?.toFixed(2) || '0.00'
  }

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>
  }
   
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" onClick={() => setIsOpen(true)}>
          <ShoppingCart className="h-5 w-5" />
          {cartItems.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {cartItems.reduce((total, item) => total + item.quantity, 0)}
            </span>
          )}
          <span className="sr-only">Cart</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between pb-4 border-b">
            <h2 className="text-lg font-semibold" id="cart-title">Your Cart</h2>
            <SheetClose asChild>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </SheetClose>
          </div>

          <div className="flex-grow py-6 overflow-auto relative" aria-labelledby="cart-title" aria-describedby="cart-description">
            {isLoading && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-50">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            )}
            <p id="cart-description" className="sr-only">Your cart items and total summary.</p>
            {cartItems.length === 0 ? (
              <p className="text-center text-muted-foreground">Your cart is empty</p>
            ) : (
              <ul className="space-y-6">
                {cartItems.map((item: CartItem) => (
                  <li key={`cart-item-${item._id}`} className="flex space-x-4">
                    <div className="relative h-24 w-24 rounded-md overflow-hidden">
                      <img
                        src={item.product?.images?.[0] || '/path/to/placeholder.png'}
                        alt={item.product?.name || 'Product'}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{item.product.name}</h3>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleRemoveFromCart(item._id)}
                          disabled={isLoading}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">${item.price.toFixed(2)}</p>
                      <div className="flex items-center mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                          disabled={isLoading}
                        >
                          <Minus className="h-4 w-4" />
                          <span className="sr-only">Decrease quantity</span>
                        </Button>
                        <span className="mx-2 w-8 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                          disabled={isLoading}
                        >
                          <Plus className="h-4 w-4" />
                          <span className="sr-only">Increase quantity</span>
                        </Button>
                      </div>
                      <p className="text-sm font-medium mt-2">
                        Subtotal: ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="border-t pt-6">
            <div className="flex justify-between mb-4">
              <span className="text-base font-medium">Total:</span>
              <span className="text-lg font-bold">${getTotalPrice()}</span>
            </div>
            <Link to={'/checkout'}>
              <Button className="w-full mb-2" disabled={cartItems.length === 0 || isLoading}>
                Proceed to Checkout
              </Button>
            </Link>
            <Button variant="outline" className="w-full" onClick={handleClearCart} disabled={cartItems.length === 0 || isLoading}>
              Clear Cart
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}