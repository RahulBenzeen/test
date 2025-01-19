import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, ShoppingCart, Share2, Percent, ArrowUpRight, Star } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../../../components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../components/ui/tooltip';
import WishlistButton from '../../wishlistButton/wishlistButton';
import { Product } from '../../../store/productSlice';

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
    transition: { duration: 0.4, ease: "easeOut" }
  },
  hover: {
    y: -5,
    transition: { duration: 0.2 }
  }
};

const ProductCard: React.FC<ProductCardProps> = ({
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
  const isMobile = window.innerWidth <= 768;
  const isSpecialOffer = product.isSpecialOffer && (product.discountPercentage ?? 0) > 0;

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.share({
        title: product.name,
        text: `Check out ${product.name}`,
        url: window.location.href + `/${product._id}`,
      });
    } catch {
      // Ignore share errors
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={!isMobile ? "hover" : undefined}
      onClick={onClick}
      className="cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className={`
        ${view === 'grid' ? 'flex flex-col' : 'flex flex-col md:flex-row'}
        overflow-hidden transition-all duration-300 hover:shadow-xl relative group
        ${isSpecialOffer ? 'ring-2 ring-red-500 ring-offset-2' : ''}
      `}>
        <CardHeader className={`${view === 'grid' ? 'p-0' : 'p-4 md:w-1/3'} relative`}>
          <div className="relative w-full aspect-square md:aspect-[4/3] overflow-hidden">
            <img
              src={product?.images?.[0]?.secure_url}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />

            {!isMobile && (
              <div className={`
                absolute inset-0 bg-black/40 flex items-center justify-center
                opacity-0 transition-opacity duration-300 ${isHovered ? 'opacity-100' : ''}
              `}>
                <Button variant="secondary" className="gap-2" onClick={(e) => onQuickView(product, e)}>
                  <Eye className="w-4 h-4" />
                  Quick View
                </Button>
              </div>
            )}

            {isMobile && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="secondary"
                    className="absolute bottom-4 right-4 gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Eye className="w-4 h-4" />
                    Quick View
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[90vh]">
                  <SheetHeader>
                    <SheetTitle>{product.name}</SheetTitle>
                  </SheetHeader>
                  <div className="space-y-4 mt-4">
                    <img
                      src={product?.images?.[0]?.secure_url}
                      alt={product.name}
                      className="w-full h-auto rounded-lg"
                    />
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        {isSpecialOffer ? (
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
                      <p className="text-muted-foreground">{product.description}</p>
                      <Button
                        className="w-full"
                        size="lg"
                        onClick={(e) => onAddToCart(product, e)}
                        disabled={product.stock === 0}
                      >
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>

          <div className="absolute top-2 right-2 flex flex-col gap-2">
            <WishlistButton
              productId={product._id}
              isWishlisted={isWishlisted}
              toggleWishlist={onWishlistToggle}
            />
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

          {product.stock === 0 && (
            <Badge variant="destructive" className="absolute top-2 left-2">
              Out of Stock
            </Badge>
          )}
          {product.stock > 0 && product.stock <= 5 && (
            <Badge variant="secondary" className="absolute top-2 left-2">
              Only {product.stock} left
            </Badge>
          )}
          {isSpecialOffer && (
            <Badge variant="secondary" className="absolute bottom-2 left-2 bg-red-500 text-white">
              <Percent className="w-4 h-4 mr-1" />
              {product.discountPercentage}% OFF
            </Badge>
          )}
        </CardHeader>

        <CardContent className={`flex-grow p-4 ${view === 'list' ? 'md:flex-1' : ''}`}>
          <div className="space-y-2">
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

            <div className="flex items-center gap-2">
              {isSpecialOffer ? (
                <>
                  <p className="text-xl font-bold text-red-500">₹{product.discountedPrice?.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground line-through">₹{product.price?.toFixed(2)}</p>
                </>
              ) : (
                <p className="text-xl font-bold text-primary">₹{product.price?.toFixed(2)}</p>
              )}
            </div>

            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.round(product.rating || 0)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="ml-2 text-sm text-muted-foreground">
                ({product.rating?.toFixed(1)})
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className={`p-4 ${view === 'list' ? 'md:self-end' : ''}`}>
          {isAuthenticated ? (
            <Button
              className={`w-full group relative overflow-hidden ${
                isSpecialOffer ? 'bg-red-500 hover:bg-red-600' : ''
              }`}
              onClick={(e) => onAddToCart(product, e)}
              disabled={product.stock === 0}
            >
              <span className="absolute inset-0 bg-white/20 group-hover:translate-y-0 translate-y-full transition-transform duration-300" />
              <ShoppingCart className="mr-2 h-4 w-4" />
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          ) : (
            <Button
              className={`w-full group relative overflow-hidden ${
                isSpecialOffer ? 'bg-red-500 hover:bg-red-600' : ''
              }`}
              onClick={() => window.location.href = '/signin'}
              disabled={product.stock === 0}
            >
              <span className="absolute inset-0 bg-white/20 group-hover:translate-y-0 translate-y-full transition-transform duration-300" />
              {product.stock > 0 ? 'Sign in to Buy' : 'Out of Stock'}
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default React.memo(ProductCard);