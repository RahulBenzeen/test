import { useEffect, useState, useCallback, memo } from 'react';
import { ShoppingCart, X, Minus, Plus, Loader2, ShoppingBag, Gift, Package } from 'lucide-react';
import { Button } from "../../components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../../components/ui/sheet";
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchCart, removeFromCartAsync, updateQuantityAsync, clearCartAsync, CartItem, BundleDiscount } from '../../store/cartSlice';
import { Link, useNavigate } from 'react-router-dom';
import { Separator } from '../../components/ui/separator';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Badge } from '../../components/ui/badge';
import { Card } from '../../components/ui/card';
import showToast from '../../utils/toast/toastUtils';

const CartItemComponent = memo(({ 
  item, 
  onRemove, 
  onUpdateQuantity, 
  isLoading 
}: { 
  item: CartItem; 
  onRemove: (id: string) => void; 
  onUpdateQuantity: (id: string, quantity: number) => void; 
  isLoading: boolean;
}) => (
  <div className="flex gap-4 py-4">
    <div className="relative aspect-square h-24 w-24 min-w-[6rem] overflow-hidden rounded-lg bg-muted">
      <Link to={`/product/${item.product?._id}`}>
        <img
          src={item.product?.images?.[0].secure_url || '/placeholder.png'}
          alt={item.product?.name}
          className="h-full w-full object-cover transition-transform hover:scale-105"
          loading="lazy"
        />
      </Link>
      {Array.isArray(item.bundleDiscount) && item.bundleDiscount.length > 0 && (
        <div className="absolute bottom-1 right-1">
          {item.bundleDiscount.map((discount, index) => (
            <Badge 
              key={index}
              variant="secondary" 
              className="bg-primary/90 text-primary-foreground"
            >
              {discount.discountValue}% OFF
            </Badge>
          ))}
        </div>
      )}
    </div>
    <div className="flex flex-1 flex-col">
      <div className="flex justify-between">
        <Link 
          to={`/product/${item.product?._id}`}
          className="font-medium line-clamp-2 hover:text-primary transition-colors"
        >
          {item.product.name}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(item._id)}
          disabled={isLoading}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Remove</span>
        </Button>
      </div>
      
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="font-medium">₹{item.discountedPrice?.toFixed(2) || item.price.toFixed(2)}</span>
          {item.discountedPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ₹{item.price.toFixed(2)}
            </span>
          )}
        </div>
        {item.discountedPrice && (
          <span className="text-xs font-medium text-green-600">
            Save ₹{(item.price - item.discountedPrice).toFixed(2)}
          </span>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center rounded-lg border">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
            disabled={isLoading || item.quantity <= 1}
            className="h-8 w-8 rounded-none"
          >
            <Minus className="h-3 w-3" />
            <span className="sr-only">Decrease quantity</span>
          </Button>
          <span className="flex h-8 w-12 items-center justify-center text-sm">
            {item.quantity}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
            disabled={isLoading}
            className="h-8 w-8 rounded-none"
          >
            <Plus className="h-3 w-3" />
            <span className="sr-only">Increase quantity</span>
          </Button>
        </div>
        <p className="text-sm font-medium">
          ₹{((item.discountedPrice || item.price) * item.quantity).toFixed(2)}
        </p>
      </div>
    </div>
  </div>
));

CartItemComponent.displayName = 'CartItemComponent';

const OffersSection = memo(({ gifts, bundleDiscounts }: { gifts: number; bundleDiscounts: BundleDiscount[] }) => (
  <div className="space-y-3 mb-4">
    {bundleDiscounts.length > 0 && (
      <Card className="p-3 bg-primary/5 border-primary/10">
        <div className="flex items-center gap-2 text-sm font-medium text-primary mb-2">
          <Package className="h-4 w-4" />
          <span>Bundle Discounts Applied</span>
        </div>
        <ul className="space-y-1 text-sm text-muted-foreground">
          {bundleDiscounts.map((discount, i) => (
            <li key={i} className="flex items-center gap-1">
              <span>•</span>
              <span>
                {discount.discountType === 'percent' 
                  ? `${discount.discountValue}% off on ${discount.minQty}+ items`
                  : `₹${discount.discountAmount} off on ${discount.minQty}+ items`
                }
              </span>
            </li>
          ))}
        </ul>
      </Card>
    )}
    
    {gifts > 0 && (
      <Alert className="bg-accent/5 border-accent/10">
        <div className="flex items-center gap-2">
          <Gift className="h-4 w-4 text-accent" />
          <AlertDescription className="text-sm font-medium text-accent-foreground">
            Congratulations! You qualify for {gifts} free gift{gifts > 1 ? 's' : ''}!
          </AlertDescription>
        </div>
      </Alert>
    )}
  </div>
));

OffersSection.displayName = 'OffersSection';

export default function Cart() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items: cartItems, status, error, gifts, bundleDiscounts, totalPrice:grandTotal} = useAppSelector((state) => state.cart);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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
  // const totalPrice = cartItems.reduce(
  //   (total, item) => total + ((item.discountedPrice || item.price) * item.quantity),
  //   0
  // ).toFixed(2);

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
          <div className="flex h-full flex-col items-center justify-center space-y-4">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            <p className="text-lg font-medium">Your cart is empty</p>
            <Button
              variant="outline"
              onClick={() => {
                setIsOpen(false);
                navigate('/product');
              }}
            >
              Continue Shopping
            </Button>
          </div>
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
                  <CartItemComponent
                  key={item._id}
                  item={item}
                  onRemove={handleRemoveFromCart}
                  onUpdateQuantity={handleUpdateQuantity}
                  isLoading={isLoading}
                  />
                ))}
              </div>
                <OffersSection gifts={gifts} bundleDiscounts={bundleDiscounts} />
            </ScrollArea>
            <div className="space-y-4 pr-6">
              <Separator />
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-sm">Subtotal</span>
                  <span className="text-sm font-medium">₹{grandTotal}</span>
                </div>
                 {
                  bundleDiscounts.length > 0 &&
                  (  <div className="flex justify-between text-green-600">
                    <span className="text-sm">Total Savings</span>
                    <span className="text-sm font-medium">₹{bundleDiscounts.reduce((total, discount) => total + (Number(discount.discountAmount) || 0), 0)}</span>
                  </div>)
                 }
                
                
                {gifts > 0 && (
                  <div className="flex justify-between text-accent">
                    <span className="text-sm">Free Gifts</span>
                    <span className="text-sm font-medium">{gifts}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm">Shipping</span>
                  <span className="text-sm text-muted-foreground">Calculated at checkout</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>₹{grandTotal}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Button
                  className="w-full"
                  onClick={handleCheckout}
                  disabled={isLoading}
                >
                  Proceed to Checkout
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleClearCart}
                  disabled={isLoading}
                >
                  Clear Cart
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}