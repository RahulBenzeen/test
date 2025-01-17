import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchFeaturedProducts, Product } from '../../store/productSlice';
import { addToCartAsync } from '../../store/cartSlice';
import { Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Eye, Heart, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '../../components/ui/card';
import { Skeleton } from '../../components/ui/skeleton';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '../../components/ui/tooltip';
import showToast from '../../utils/toast/toastUtils';

export default function FeaturedProducts() {
  const dispatch = useAppDispatch();
  const { featuredProducts, status, error } = useAppSelector((state) => ({
    featuredProducts: state.products.featuredProducts,
    status: state.products.status,
    error: state.products.error,
  }));
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    if (!featuredProducts || featuredProducts.length === 0) {
      dispatch(fetchFeaturedProducts({ page: 1, limit: 4 }))
        .unwrap()
        .then(() => {
          // showToast('Featured products loaded successfully', 'success');
        })
        .catch((error) => {
          showToast(`Error loading featured products: ${error}`, 'error');
        });
    }
  }, [dispatch, featuredProducts]);

  const handleAddToCart = async (product: Product) => {
    try {
      await dispatch(addToCartAsync(product)).unwrap();
      showToast(`${product.name} has been added to your cart.`, 'success');
    } catch (error) {
      showToast(`Error adding ${product.name} to cart: ${error}`, 'error');
    }
  };

  const handleShare = async (product: Product, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await navigator.share({
        title: product.name,
        text: `Check out ${product.name}`,
        url: window.location.href + `/${product._id}`,
      })
    } catch  {
      showToast("Failed to share product", "error")
    }
  }

  const toggleWishlist = (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter((id) => id !== productId));
      showToast('Removed from wishlist', 'success');
    } else {
      setWishlist([...wishlist, productId]);
      showToast('Added to wishlist', 'success');
    }
  };

  if (status === 'loading' && (!featuredProducts || featuredProducts.length === 0)) {
    return (
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, index) => (
              <Card key={index} className="flex flex-col h-full">
                <CardHeader className="p-0">
                  <Skeleton className="h-48 w-full rounded-t-lg" />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </CardHeader>
                <CardContent className="p-4 flex-grow">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <div className="flex items-center mb-2">
                    <Skeleton className="h-6 w-24 mr-2" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-4 w-4" />
                    ))}
                    <Skeleton className="h-4 w-12 ml-2" />
                  </div>
                </CardContent>
                <CardFooter className="p-4">
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (status === 'failed') {
    showToast(`Error: ${error}`, 'error');
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  const productsToDisplay = Array.isArray(featuredProducts) ? featuredProducts : [];

  return (
    <section className="bg-muted py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {productsToDisplay.map((product) => {
            const isWishlisted = wishlist.includes(product._id);

            return (
              <motion.div
                key={product?._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full flex flex-col">
                  <CardHeader className="p-0 relative">
                    <Link to={`/product/${product?._id}`} className="block">
                      <img
                        src={product?.images[0].secure_url || '/placeholder.svg'}
                        alt={product?.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    </Link>
                    {product.isSpecialOffer && (
                      <Badge variant="destructive" className="absolute top-2 left-2">
                        Special Offer
                      </Badge>
                    )}
                    <div className="absolute top-2 right-2 flex gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="secondary"
                              className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
                              onClick={(e) => toggleWishlist(product._id, e)}
                            >
                              <Heart
                                className={`h-4 w-4 ${
                                  isWishlisted ? 'fill-red-500 text-red-500' : ''
                                }`}
                              />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="secondary"
                              className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
                              onClick={(e) => handleShare(product, e)}
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
                  <CardContent className="p-4 flex-grow">
                    <Link to={`/product/${product?._id}`} className="block">
                      <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-muted-foreground mb-2">{product.category}</p>
                    <div className="flex items-center mb-2">
                      {product.isSpecialOffer ? (
                        <>
                          <p className="text-xl font-bold text-red-500 mr-2">
                            ${product.discountedPrice?.toFixed(2)}
                          </p>
                          <p className="text-sm text-muted-foreground line-through">
                            ${product.price.toFixed(2)}
                          </p>
                        </>
                      ) : (
                        <p className="text-xl font-bold">${product.price.toFixed(2)}</p>
                      )}
                    </div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.round(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-muted-foreground">
                        ({product.rating?.toFixed(1)})
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4">
                    {isAuthenticated ? (
                      <Button
                        onClick={() => handleAddToCart(product)}
                        className="w-full"
                        disabled={product.stock === 0}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                      </Button>
                    ) : (
                      <Button onClick={() => navigate('/signin')} className="w-full">
                        Buy Now
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </div>
        <div className="flex justify-center mt-8">
          <Button variant="outline" asChild>
            <Link to="/product" className="inline-flex items-center">
              View More Products
              <Eye className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}