import { ShoppingCart, X, Minus, Plus } from 'lucide-react'
import { Button } from "../../components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "../../components/ui/sheet"
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { removeFromCart, updateQuantity, clearCart } from '../../store/cartSlice'
import { Link } from 'react-router-dom'

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image?: string
}

export default function Cart() {

  const cartItems = useAppSelector((state) => state.cart.items)
  const dispatch = useAppDispatch()

  // if(!localStorage.getItem('AuthToken')){
  //   return;
  // }
  const handleRemoveFromCart = (productId: number) => {
    dispatch(removeFromCart(productId))
  }

  const handleUpdateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ id: productId, quantity: newQuantity }))
    } else {
      dispatch(removeFromCart(productId))
    }
  }

  const handleClearCart = () => {
    dispatch(clearCart())
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)
  }


   
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
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
            </SheetClose>
          </div>

          <div className="flex-grow py-6 overflow-auto" aria-labelledby="cart-title" aria-describedby="cart-description">
            <p id="cart-description" className="sr-only">Your cart items and total summary.</p>
            {cartItems.length === 0 ? (
              <p className="text-center text-muted-foreground">Your cart is empty</p>
            ) : (
              <ul className="space-y-6">
                {cartItems.map((item: CartItem) => (
                  <li key={item.id} className="flex space-x-4">
                    <div className="relative h-24 w-24 rounded-md overflow-hidden">
                      <img
                        src={item.image || '/placeholder.svg'}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{item.name}</h3>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveFromCart(item.id)}>
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">${item.price.toFixed(2)}</p>
                      <div className="flex items-center mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                          <span className="sr-only">Decrease quantity</span>
                        </Button>
                        <span className="mx-2 w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
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
              <Button className="w-full mb-2" disabled={cartItems.length === 0}>
                Proceed to Checkout
              </Button>
            </Link>
            <Button variant="outline" className="w-full" onClick={handleClearCart} disabled={cartItems.length === 0}>
              Clear Cart
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
