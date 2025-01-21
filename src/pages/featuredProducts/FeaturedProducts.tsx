import { useCallback, useEffect, useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchFeaturedProducts, Product } from '../../store/productSlice';
import { addToCartAsync } from '../../store/cartSlice';
import { addToWishlist, removeFromWishlist } from '../../store/whislistSlice';
import { Link, useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/button';
import showToast from '../../utils/toast/toastUtils';
import ProductCard from '../product/product-card/ProductCard';
import QuickViewDialog from '../product/quick-view-dialog/QuickViewDialog';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { Card } from '../../components/ui/card';
import { Skeleton } from '../../components/ui/skeleton';

export default function FeaturedProducts() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  // Memoized selectors
  const featuredProducts = useAppSelector((state) => state.products.featuredProducts);
  const status = useAppSelector((state) => state.products.status);
  const error = useAppSelector((state) => state.products.error);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const view = useAppSelector((state) => state.filters.view);
  const wishlists = useAppSelector((state) => state.whishlist.wishlists);
  
  // Local state
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  
  // Media query
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Memoized values
  const productsToDisplay = useMemo(() => 
    Array.isArray(featuredProducts) ? featuredProducts : [], 
    [featuredProducts]
  );

  useEffect(() => {
    if (!featuredProducts || featuredProducts.length === 0) {
      dispatch(fetchFeaturedProducts({ page: 1, limit: 4 }))
        .unwrap()
        .catch((error) => {
          showToast(`Error loading featured products: ${error}`, 'error');
        });
    }
  }, [dispatch, featuredProducts]);

  const handleAddToCart = useCallback(async (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const resultAction = await dispatch(addToCartAsync(product));
      if (addToCartAsync.fulfilled.match(resultAction)) {
        showToast("Added to cart successfully!", "success");
      }
    } catch {
      showToast("Failed to add to cart", "error");
    }
  }, [dispatch]);

  const handleQuickView = useCallback((product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewProduct(product);
  }, []);

  const handleProductClick = useCallback((productId: string) => {
    navigate(`/product/${productId}`);
  }, [navigate]);

  const toggleWishlist = useCallback(async (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      showToast("Please login to add to wishlist", "error");
      return;
    }
    
    if (!productId) {
      showToast("Invalid product", "error");
      return;
    }
    
    const isProductInWishlist = wishlists?.some((item) => item?.product?._id === productId);
    
    try {
      if (isProductInWishlist) {
        await dispatch(removeFromWishlist(productId)).unwrap();
        showToast("Removed from wishlist", "success");
      } else {
        await dispatch(addToWishlist(productId)).unwrap();
        showToast("Added to wishlist", "success");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      showToast(errorMessage, "error");
    }
  }, [dispatch, wishlists, isAuthenticated]);

  if (status === 'loading' && (!featuredProducts || featuredProducts.length === 0)) {
    return (
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, index) => (
              <Card key={index} className="flex flex-col h-full">
                <Skeleton className="h-48 w-full rounded-t-lg" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-10 w-full" />
                </div>
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

  return (
    <section className="bg-muted py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {productsToDisplay.map((product) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ProductCard
                product={product}
                isWishlisted={wishlists?.some((item) => item?.product?._id === product._id)}
                onAddToCart={handleAddToCart}
                onQuickView={handleQuickView}
                onClick={() => handleProductClick(product._id)}
                onWishlistToggle={toggleWishlist}
                view={view}
                isAuthenticated={isAuthenticated}
              />
            </motion.div>
          ))}
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

      {!isMobile && quickViewProduct && (
        <QuickViewDialog
          product={quickViewProduct}
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={handleAddToCart}
          isAuthenticated ={isAuthenticated}
          onViewDetails={() => {
            setQuickViewProduct(null);
            handleProductClick(quickViewProduct._id);
          }}
          isWishlisted={wishlists?.some((item) => item?.product?._id === quickViewProduct._id)}
          onWishlistToggle={toggleWishlist}
        />
      )}
    </section>
  );
}