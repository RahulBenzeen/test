import { memo } from 'react';
import { X, Minus, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CartItem as CartItems } from '../../../store/cartSlice';

interface CartItemProps {
  item: CartItems;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  isLoading: boolean;
}

const CartItem = memo(({ item, onRemove, onUpdateQuantity, isLoading }: CartItemProps) => (
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

CartItem.displayName = 'CartItem';

export default CartItem;