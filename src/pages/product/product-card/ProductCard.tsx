import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, ShoppingCart, Share2, Percent, ArrowUpRight, Star } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../components/ui/tooltip';
import WishlistButton from '../../wishlistButton/wishlistButton';
import { Product } from '../../../store/productSlice';
import { useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  onQuickView: (product: Product, e: React.MouseEvent) => void;
  onClick: () => void;
  onWishlistToggle: (productId: string, e: React.MouseEvent) => void;
  view: 'grid' | 'list';
  isAuthenticated: boolean;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" }
  },
  hover: {
    y: -5,
    transition: { duration: 0.2 }
  }
};

const ProductCard: React.FC<ProductCardProps> = React.memo(({
  product,
  isWishlisted,
  onAddToCart,
  onQuickView,
  onClick,
  onWishlistToggle,
  view,
  isAuthenticated
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const router = useNavigate();
  
  // Memoize computed values
  const {
    isSpecialOffer,
    formattedPrice,
    formattedDiscountedPrice,
    stockStatus
  } = useMemo(() => ({
    isSpecialOffer: product?.isSpecialOffer && (product?.discountPercentage ?? 0) > 0,
    formattedPrice: product?.price?.toFixed(2),
    formattedDiscountedPrice: product?.discountedPrice?.toFixed(2),
    stockStatus: product?.stock === 0 ? 'out-of-stock' : product?.stock <= 5 ? 'low-stock' : 'in-stock'
  }), [product]);

  // Memoize event handlers
  const handleShare = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.share({
        title: product.name,
        text: `Check out ${product.name}`,
        url: `/product/${product._id}`,
      });
    } catch {
      // Ignore share errors
    }
  }, [product]);

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    onAddToCart(product, e);
  }, [product, onAddToCart]);

  const handleQuickView = useCallback((e: React.MouseEvent) => {
    onQuickView(product, e);
  }, [product, onQuickView]);

  // Render rating stars
  const renderRatingStars = useMemo(() => (
    [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.round(product?.rating || 0)
            ? 'text-yellow-400 fill-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ))
  ), [product.rating]);

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      whileHover="hover"
      onClick={onClick}
      className="h-full cursor-pointer transform-gpu"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className={`
        ${view === 'grid' ? 'flex flex-col' : 'flex flex-col md:flex-row'}
        overflow-hidden transition-all duration-300 hover:shadow-xl relative
        ${isSpecialOffer ? 'ring-2 ring-red-500 ring-offset-2' : ''}
        will-change-transform
      `}>
        <CardHeader className={`${view === 'grid' ? 'p-0' : 'p-4 md:w-1/3'} relative`}>
          <div className="relative w-full aspect-square md:aspect-[4/3] overflow-hidden">
            <img
              src={product?.images?.[0]?.secure_url}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 will-change-transform"
              loading="lazy"
              decoding="async"
            />

            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/40 flex items-center justify-center"
                >
                  <Button
                    variant="secondary"
                    className="gap-2"
                    onClick={handleQuickView}
                  >
                    <Eye className="w-4 h-4" />
                    Quick View
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {stockStatus !== 'in-stock' && (
              <Badge
                variant={stockStatus === 'out-of-stock' ? 'destructive' : 'secondary'}
                className="absolute top-2 left-2"
              >
                {stockStatus === 'out-of-stock' ? 'Out of Stock' : `Only ${product.stock} left`}
              </Badge>
            )}

            {isSpecialOffer && (
              <Badge variant="secondary" className="absolute bottom-2 left-2 bg-red-500 text-white">
                <Percent className="w-4 h-4 mr-1" />
                {product.discountPercentage}% OFF
              </Badge>
            )}
          </div>

          <div className="absolute top-2 right-2 flex flex-col gap-2">
            {isAuthenticated && (
              <WishlistButton
                productId={product._id}
                isWishlisted={isWishlisted}
                toggleWishlist={onWishlistToggle}
              />
            )}

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share Product</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>

        <CardContent className={`flex-grow p-4 ${view === 'list' ? 'md:flex-1' : ''}`}>
          <div className="flex h-full justify-between flex-col space-y-2">
            <div>
              {product.category && (
                <Badge variant="outline" className="mb-2">
                  {product.category}
                </Badge>
              )}

              <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors duration-300">
                {product.name}
                <ArrowUpRight className="inline-block w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>

              {product.brand && (
                <p className="text-sm text-muted-foreground">{product.brand}</p>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                {isSpecialOffer ? (
                  <>
                    <p className="text-xl font-bold text-red-500">₹{formattedDiscountedPrice}</p>
                    <p className="text-sm text-muted-foreground line-through">₹{formattedPrice}</p>
                  </>
                ) : (
                  <p className="text-xl font-bold text-primary">₹{formattedPrice}</p>
                )}
              </div>

              <div className="flex items-center">
                {renderRatingStars}
                <span className="ml-2 text-sm text-muted-foreground">
                  ({product.rating?.toFixed(1)})
                </span>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className={`p-4 ${view === 'list' ? 'md:self-end' : ''}`}>
          {isAuthenticated ? (
            <Button
              className={`w-full relative overflow-hidden ${
                isSpecialOffer ? 'bg-red-500 hover:bg-red-600' : ''
              }`}
              onClick={handleAddToCart}
              disabled={stockStatus === 'out-of-stock'}
            >
              <span className="absolute inset-0 bg-white/20 group-hover:translate-y-0 translate-y-full transition-transform duration-300" />
              <ShoppingCart className="mr-2 h-4 w-4" />
              {stockStatus === 'out-of-stock' ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          ) : (
            <Button
              className={`w-full relative overflow-hidden ${
                isSpecialOffer ? 'bg-red-500 hover:bg-red-600' : ''
              }`}
              onClick={() => router('/signin')}
              disabled={stockStatus === 'out-of-stock'}
            >
              <span className="absolute inset-0 bg-white/20 group-hover:translate-y-0 translate-y-full transition-transform duration-300" />
              {stockStatus === 'out-of-stock' ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;