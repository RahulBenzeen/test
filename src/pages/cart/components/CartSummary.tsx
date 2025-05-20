import { memo } from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BundleDiscount } from '../../../store/cartSlice';


interface CartSummaryProps {
  grandTotal: number;
  bundleDiscounts: BundleDiscount[];
  giftsCount: number;
  onCheckout: () => void;
  onClearCart: () => void;
  isLoading: boolean;
}

const CartSummary = memo(({ 
  grandTotal, 
  bundleDiscounts, 
  giftsCount, 
  onCheckout, 
  onClearCart, 
  isLoading 
}: CartSummaryProps) => (
  <div className="space-y-4 pr-6">
    <Separator />
    <div className="space-y-1.5">
      <div className="flex justify-between">
        <span className="text-sm">Subtotal</span>
        <span className="text-sm font-medium">₹{grandTotal}</span>
      </div>
      {bundleDiscounts.length > 0 && (
        <div className="flex justify-between text-green-600">
          <span className="text-sm">Total Savings</span>
          <span className="text-sm font-medium">
            ₹{bundleDiscounts.reduce((total, discount) => 
              total + (Number(discount.discountAmount) || 0), 0)}
          </span>
        </div>
      )}
      {giftsCount > 0 && (
        <div className="flex justify-between text-accent">
          <span className="text-sm">Free Gifts</span>
          <span className="text-sm font-medium">{giftsCount}</span>
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
        onClick={onCheckout}
        disabled={isLoading}
      >
        Proceed to Checkout
      </Button>
      <Button
        variant="outline"
        className="w-full"
        onClick={onClearCart}
        disabled={isLoading}
      >
        Clear Cart
      </Button>
    </div>
  </div>
));

CartSummary.displayName = 'CartSummary';

export default CartSummary;