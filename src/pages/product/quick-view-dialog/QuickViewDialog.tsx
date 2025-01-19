import React from 'react';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Product } from '../../../store/productSlice';

interface QuickViewDialogProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  onViewDetails: () => void;
  isWishlisted: boolean;
  onWishlistToggle: (productId: string, e: React.MouseEvent) => void;
}

const QuickViewDialog: React.FC<QuickViewDialogProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onViewDetails,
  isWishlisted,
  onWishlistToggle,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>
        <div className="grid md:grid-cols-2 gap-6 p-6">
          <div className="relative">
            <img
              src={product?.images?.[0]?.secure_url}
              alt={product.name}
              className="w-full h-auto rounded-lg"
            />
            {product.isSpecialOffer && (
              <Badge className="absolute top-2 left-2 bg-red-500">
                {product.discountPercentage}% OFF
              </Badge>
            )}
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Badge variant="outline">{product.category}</Badge>
                <h2 className="text-2xl font-bold">{product.name}</h2>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={(e) => onWishlistToggle(product._id, e)}
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              {product.isSpecialOffer ? (
                <>
                  <span className="text-2xl font-bold text-red-500">
                    ₹{product.discountedPrice?.toFixed(2)}
                  </span>
                  <span className="text-lg text-muted-foreground line-through">
                    ₹{product.price.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold">
                  ₹{product.price.toFixed(2)}
                </span>
              )}
            </div>
            <p className="text-muted-foreground">
              {product.description}
            </p>
            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.round(product.rating || 0)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="text-sm text-muted-foreground">
                ({product.rating?.toFixed(1)})
              </span>
            </div>
            <div className="space-y-2">
              <Button
                className="w-full"
                size="lg"
                onClick={(e) => onAddToCart(product, e)}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                className="w-full"
                size="lg"
                onClick={onViewDetails}
              >
                View Full Details
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(QuickViewDialog);