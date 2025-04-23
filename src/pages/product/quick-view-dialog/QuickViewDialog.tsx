import React, { useState, useCallback, memo } from 'react';
import { ShoppingCart, Star, Heart, ChevronLeft, ChevronRight, Truck, Shield } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Product } from '../../../store/productSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { Separator } from '../../../components/ui/separator';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { useMediaQuery } from '../../../hooks/useMediaQuery';

interface QuickViewDialogProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  isAuthenticated: boolean;
  onViewDetails: () => void;
  isWishlisted: boolean;
  onWishlistToggle: (productId: string, e: React.MouseEvent) => void;
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

const imageVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
};

const QuickViewDialog: React.FC<QuickViewDialogProps> = memo(({
  product,
  isOpen,
  onClose,
  onAddToCart,
  isAuthenticated,
  onViewDetails,
  isWishlisted,
  onWishlistToggle,
}) => {
  const [[page, direction], setPage] = useState([0, 0]);
  const [loading, setLoading] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width: 640px)');

  const imageIndex = Math.abs(page % (product.images?.length || 1));

  const paginate = useCallback((newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  }, [page]);

  const handleAddToCart = useCallback(async (e: React.MouseEvent) => {
    setLoading(true);
    await onAddToCart(product, e);
    setLoading(false);
  }, [product, onAddToCart]);

  const isSpecialOffer = product.isSpecialOffer && (product.discountPercentage ?? 0) > 0;
  const savings = product.price - (product.discountedPrice ?? product.price);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 gap-0 bg-white dark:bg-gray-950">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <span className="line-clamp-1">{product.name}</span>
            {product.brand && (
              <Badge variant="secondary" className="text-xs">
                {product.brand}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[80vh]">
          <div className="grid md:grid-cols-2 gap-6 p-6">
            {/* Image Gallery */}
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-900">
              <AnimatePresence initial={false} custom={direction}>
                <motion.img
                  key={page}
                  src={product.images[imageIndex].secure_url}
                  alt={`${product.name} - View ${imageIndex + 1}`}
                  custom={direction}
                  variants={imageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
              </AnimatePresence>

              {/* Navigation Buttons */}
              {product.images.length > 1 && (
                <>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white dark:bg-gray-950/80 dark:hover:bg-gray-950"
                    onClick={() => paginate(-1)}
                    disabled={loading}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white dark:bg-gray-950/80 dark:hover:bg-gray-950"
                    onClick={() => paginate(1)}
                    disabled={loading}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}

              {/* Thumbnail Navigation */}
              {!isSmallScreen && product.images.length > 1 && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                  {product.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setPage([index, index > imageIndex ? 1 : -1])}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === imageIndex 
                          ? 'bg-primary w-4' 
                          : 'bg-primary/50 hover:bg-primary/75'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-2">
                {isSpecialOffer && (
                  <Badge className="bg-red-500">
                    {product.discountPercentage}% OFF
                  </Badge>
                )}
                {product.stock <= 5 && (
                  <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500">
                    Only {product.stock} left
                  </Badge>
                )}
              </div>
            </div>

            {/* Product Info */}
            <motion.div 
              className="space-y-6"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Badge variant="outline">{product.category}</Badge>
                </div>
                {isAuthenticated && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={(e) => onWishlistToggle(product._id, e)}
                    className="hover:text-red-500"
                    disabled={loading}
                  >
                    <Heart 
                      className={`h-5 w-5 transition-colors ${
                        isWishlisted ? 'fill-red-500 text-red-500' : ''
                      }`} 
                    />
                  </Button>
                )}
              </div>

              {/* Price Section */}
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  {isSpecialOffer ? (
                    <>
                      <span className="text-3xl font-bold text-red-500">
                        ₹{product.discountedPrice?.toFixed(2)}
                      </span>
                      <span className="text-lg text-muted-foreground line-through">
                        ₹{product.price.toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold">
                      ₹{product.price.toFixed(2)}
                    </span>
                  )}
                </div>
                {isSpecialOffer && (
                  <p className="text-sm text-green-600 font-medium">
                    You save: ₹{savings.toFixed(2)}
                  </p>
                )}
              </div>

              {/* Rating */}
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

              {/* Description */}
              <p className="text-muted-foreground line-clamp-3">
                {product.description}
              </p>

              <Separator />

              {/* Features */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Truck className="h-4 w-4 text-primary" />
                  <span>Free Delivery</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>Genuine Product</span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                {isAuthenticated ? (
                  <Button
                    className="w-full relative overflow-hidden group"
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={product.stock === 0 || loading}
                  >
                    <span className="absolute inset-0 bg-white/10 group-hover:translate-y-0 translate-y-full transition-transform duration-300" />
                    {loading ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <ShoppingCart className="h-5 w-5" />
                        </motion.div>
                        Adding...
                      </motion.div>
                    ) : (
                      <>
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={onViewDetails}
                  >
                    Add to Cart
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  className="w-full"
                  size="lg"
                  onClick={onViewDetails}
                  disabled={loading}
                >
                  View Full Details
                </Button>
              </div>
            </motion.div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
});

QuickViewDialog.displayName = 'QuickViewDialog';

export default QuickViewDialog;