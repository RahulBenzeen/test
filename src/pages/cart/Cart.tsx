import { useEffect, useState } from 'react';
import { ShoppingCart, X, Minus, Plus, Loader2 } from 'lucide-react';
import { Button } from "../../components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../../components/ui/sheet";
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchCart, removeFromCartAsync, updateQuantityAsync, clearCartAsync, CartItem } from '../../store/cartSlice';
import { Link } from 'react-router-dom';

// Assuming showToast is imported from your utils or a toast component
import showToast from '../../utils/toast/toastUtils';

export default function Cart() {
  const dispatch = useAppDispatch();
  const { items: cartItems, status, error } = useAppSelector((state) => state.cart);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCart());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (error) {
      // Show the error message as a toast notification
      showToast(error, 'error');
    }
  }, [error]);

  const handleRemoveFromCart = async (productId: string) => {
    setIsLoading(true);
    await dispatch(removeFromCartAsync(productId));
    setIsLoading(false);
  };

  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    setIsLoading(true);
    if (newQuantity > 0) {
      await dispatch(updateQuantityAsync({ id: productId, quantity: newQuantity }));
    } else {
      await dispatch(removeFromCartAsync(productId));
    }
    setIsLoading(false);
  };

  const handleClearCart = async () => {
    setIsLoading(true);
    await dispatch(clearCartAsync());
    setIsLoading(false);
  };

  const getTotalPrice = () => {
    return cartItems?.reduce(
      (total, item) => total + ((item.discountedPrice || item.price) * (item.quantity || 0)),
      0
    )?.toFixed(2) || '0.00';
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={() => setIsOpen(true)}
        >
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
            <h2 className="text-lg font-semibold">Your Cart</h2>

          </div>

          <div className="flex-grow py-6 overflow-auto relative">
            {isLoading && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-50">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            )}
            {cartItems.length === 0 ? (
              <p className="text-center text-muted-foreground">
                Your cart is empty
              </p>
            ) : (
              <ul className="space-y-6">
                {cartItems.map((item: CartItem) => (
                  <li key={item._id} className="flex space-x-4">
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
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground mt-1">
                          ${item.discountedPrice ? item.discountedPrice.toFixed(2) : item.price.toFixed(2)}
                        </p>
                        {item.discountedPrice && (
                          <span className="text-xs text-red-500 line-through">
                            ${item.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                      {item.discountedPrice && (
                        <p className="text-xs text-green-500 mt-1">
                          Save ${(item.price - item.discountedPrice).toFixed(2)}!
                        </p>
                      )}
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
                        <span className="mx-2 w-8 text-center">{item.quantity}</span>
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
                        Subtotal: ${(item.discountedPrice ? item.discountedPrice : item.price) * (item.quantity ?? 0)}
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
            <Button
              variant="outline"
              className="w-full"
              onClick={handleClearCart}
              disabled={cartItems.length === 0 || isLoading}
            >
              Clear Cart
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
