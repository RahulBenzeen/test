import { useEffect, useState, useCallback } from 'react';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { Button } from "../../components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../../components/ui/sheet";
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchCart, removeFromCartAsync, updateQuantityAsync, clearCartAsync, setSelectedGiftId } from '../../store/cartSlice';
import { useNavigate } from 'react-router-dom';
import { Separator } from "../../components/ui/separator";
import { ScrollArea } from "../../components/ui/scroll-area";
import showToast from '../../components/../utils/toast/toastUtils';
import CartItem from './components/CartItem';
import CartSummary from './components/CartSummary';
import EmptyCart from './components/EmptyCart';
import OffersSection from './offer/OfferSection';


export default function Cart() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items: cartItems, status, error, gifts, bundleDiscounts, totalPrice: grandTotal } = useAppSelector((state) => state.cart);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);


  const handleGiftSelect = useCallback((giftId: string) => {
    dispatch(setSelectedGiftId(giftId));
  }, [dispatch]);

  const handleRemoveFromCart = useCallback(async (productId: string) => {
    setIsLoading(true);
    try {
      await dispatch(removeFromCartAsync(productId)).unwrap();
    } catch {
      showToast('Failed to remove item', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  const handleUpdateQuantity = useCallback(async (productId: string, newQuantity: number) => {
    setIsLoading(true);
    try {
      if (newQuantity > 0) {
        await dispatch(updateQuantityAsync({ id: productId, quantity: newQuantity })).unwrap();
      } else {
        await dispatch(removeFromCartAsync(productId)).unwrap();
      }
    } catch {
      showToast('Failed to update quantity', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  const handleClearCart = useCallback(async () => {
    setIsLoading(true);
    try {
      await dispatch(clearCartAsync()).unwrap();
      showToast('Cart cleared successfully', 'success');
    } catch {
      showToast('Failed to clear cart', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  const handleCheckout = useCallback(() => {
    setIsOpen(false);
    navigate('/checkout');
  }, [navigate]);

  const handleContinueShopping = useCallback(() => {
    setIsOpen(false);
    navigate('/product');
  }, [navigate]);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCart());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (error) {
      showToast(error, 'error');
    }
  }, [error]);

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

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
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
              {totalItems}
            </span>
          )}
          <span className="sr-only">Open cart</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <div className="flex items-center justify-between pr-6">
          <h2 className="text-lg font-semibold">Shopping Cart</h2>
        </div>
        <Separator className="my-4" />
        {cartItems.length === 0 ? (
          <EmptyCart onContinueShopping={handleContinueShopping} />
        ) : (
          <>
            <ScrollArea className="flex-1 pr-6">
              {isLoading && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              )}
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <CartItem
                    key={item._id}
                    item={item}
                    onRemove={handleRemoveFromCart}
                    onUpdateQuantity={handleUpdateQuantity}
                    isLoading={isLoading}
                  />
                ))}
              </div>
              <OffersSection 
                gifts={gifts || []} 
                bundleDiscounts={bundleDiscounts}
                onGiftSelect={handleGiftSelect}
              />
            </ScrollArea>
            <CartSummary 
              grandTotal={grandTotal}
              bundleDiscounts={bundleDiscounts}
              giftsCount={gifts?.length || 0}
              onCheckout={handleCheckout}
              onClearCart={handleClearCart}
              isLoading={isLoading}
            />
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}