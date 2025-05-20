import { memo } from 'react';
import { ShoppingBag } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface EmptyCartProps {
  onContinueShopping: () => void;
}

const EmptyCart = memo(({ onContinueShopping }: EmptyCartProps) => (
  <div className="flex h-full flex-col items-center justify-center space-y-4">
    <ShoppingBag className="h-12 w-12 text-muted-foreground" />
    <p className="text-lg font-medium">Your cart is empty</p>
    <Button
      variant="outline"
      onClick={onContinueShopping}
    >
      Continue Shopping
    </Button>
  </div>
));

EmptyCart.displayName = 'EmptyCart';

export default EmptyCart;