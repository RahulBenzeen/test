import React, { useEffect, useState, useCallback, memo, Suspense, lazy, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setCurrentPage, setItemsPerPage, setView, setCategory, setSubcategory, setSortBy } from '../../store/filterSlice';
import { fetchProducts } from '../../store/productSlice';
import { addToCartAsync } from '../../store/cartSlice';
import { addToWishlist, fetchWishlist, optimisticAddToWishlist, optimisticRemoveFromWishlist, removeFromWishlist } from '../../store/whislistSlice';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useInView } from 'react-intersection-observer';
import { Product } from '../../store/productSlice';
import showToast from '../../utils/toast/toastUtils';
import { motion, AnimatePresence } from 'framer-motion';
import debounce from 'lodash/debounce';

// Lazy-loaded components
const QuickViewDialog = lazy(() => import('./quick-view-dialog/QuickViewDialog'));
const ProductFeatures = lazy(() => import('./product-feature/ProductFeatures'));

// Eagerly loaded components for critical UI
import ProductCard from './product-card/ProductCard';
import ProductFilter from '../filterProduct/filterProduct';
import Paginator from '../paginator/paginator';
import ProductHeader from './product-header/ProductHeader';
import ProductSkeleton from './product-skeleton/ProductSkeleton';
import ProductEmptyState from './empty-state/ProductEmptyState';
import ProductErrorState from './error-state/ProductErrorState';
import { Button } from '../../components/ui/button';
import { Loader2, Filter, X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../../components/ui/sheet';


// Constants
const ITEMS_PER_PAGE_OPTIONS = [12, 24, 48];
const ANIMATION_DURATION = 0.3;

// Animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: ANIMATION_DURATION }
  }
};

// Memoized Components
const MemoizedProductCard = memo(ProductCard);

const FilterButton = memo(({ onClick, isActive }: { onClick: () => void; isActive: boolean }) => (
  <Button
    variant={isActive ? "secondary" : "outline"}
    size="sm"
    onClick={onClick}
    className="flex items-center gap-2"
  >
    <Filter className="w-4 h-4" />
    Filters
  </Button>
));

const ProductPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  
  // Selectors with memoization
  const filters = useAppSelector((state) => state.filters);
  const { items: products, status, error, pagination } = useAppSelector((state) => state.products);
  const wishlists = useAppSelector((state) => state.whishlist.wishlists);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  
  // Local state
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Media queries
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');

  // Memoized values
  const categories = React.useMemo(() => 
    [...new Set(products.map((p) => p.category).filter(Boolean))], 
    [products]
  );
  
  const brands = React.useMemo(() => 
    [...new Set(products.map((p) => p.brand).filter(Boolean))], 
    [products]
  );

  // Debounced handlers
  const debouncedFetch = useMemo(() => 
    debounce((params) => {
      dispatch(fetchProducts(params));
      setIsLoading(false);
    }, 300), 
    [dispatch]
  );

  // Event handlers
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
    
    if (!productId) {
      showToast("Invalid product", "error");
      return;
    }
    
    const isProductInWishlist = wishlists?.some((item) => item?.product?._id === productId);
    
    try {
      // Optimistically update the UI
      if (isProductInWishlist) {
        dispatch(optimisticRemoveFromWishlist(productId));
      } else {
        dispatch(optimisticAddToWishlist(productId));
      }

      // Make the API call
      if (isProductInWishlist) {
        const result = await dispatch(removeFromWishlist(productId)).unwrap();
        if (result) {
          showToast("Removed from wishlist", "success");
        }
      } else {
        const result = await dispatch(addToWishlist(productId)).unwrap();
        if (result) {
          showToast("Added to wishlist", "success");
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      showToast(errorMessage, "error");
    }
  }, [dispatch, wishlists]);

  // Effects
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const category = searchParams.get('category') || '';
    const subcategory = searchParams.get('subcategory') || '';

    if (category) dispatch(setCategory(category));
    if (subcategory) dispatch(setSubcategory(subcategory));

    setIsLoading(true);
    debouncedFetch({ 
      page: filters.currentPage, 
      limit: filters.itemsPerPage,
      category,
      subcategory,
      sortBy: filters.sortBy,
    });

    return () => {
      debouncedFetch.cancel();
    };
  }, [dispatch, filters.currentPage, filters.itemsPerPage, filters.sortBy, location.search, debouncedFetch]);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      dispatch(fetchWishlist(user.id));
    }
  }, [isAuthenticated, user?.id, dispatch]);

  // Render helpers
  const renderProducts = () => {
    if (status === 'loading' || isLoading) {
      return <ProductSkeleton view={filters.view} count={filters.itemsPerPage} />;
    }

    if (status === 'failed') {
      return <ProductErrorState error={error} onRetry={() => window.location.reload()} />;
    }

    if (products.length === 0) {
      return <ProductEmptyState />;
    }

    return (
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className={filters.view === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6' 
          : 'space-y-4'
        }
      >
        <AnimatePresence mode="wait">
          {products.map((product) => (
            <motion.div
              key={product._id}
              variants={itemVariants}
              layout
            >
              <MemoizedProductCard
                product={product}
                isWishlisted={wishlists?.some((item) => item?.product?._id === product._id)}
                onAddToCart={handleAddToCart}
                onQuickView={handleQuickView}
                onClick={() => handleProductClick(product._id)}
                onWishlistToggle={toggleWishlist}
                view={filters.view}
                isAuthenticated={isAuthenticated}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <>
    <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="flex flex-col gap-6">
        <ProductHeader
          filters={filters}
          onViewChange={(value) => dispatch(setView(value))}
          onSortChange={(value) => dispatch(setSortBy(value))}
          selectedFilters={selectedFilters}
          isTablet={isTablet}
          categories={categories}
          brands={brands}
          onFilterChange={setSelectedFilters}
        />

        <Suspense fallback={<div className="h-20 animate-pulse bg-gray-100 rounded-lg" />}>
        {
          !isMobile && 
          <ProductFeatures />
        }
         
        </Suspense>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Sheet */}
          {(isTablet && !isMobile) && (
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <FilterButton onClick={() => setIsFilterOpen(true)} isActive={isFilterOpen} />
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:w-[400px] p-0">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <ProductFilter 
                  categories={categories} 
                  brands={brands} 
                  selectedFilters={selectedFilters}
                  onFilterChange={setSelectedFilters}
                />
              </SheetContent>
            </Sheet>
          )}

          {/* Desktop Filter Sidebar */}
          {!isTablet && (
            <aside className="lg:w-1/4">
              <div className="sticky top-20">
                <ProductFilter 
                  categories={categories} 
                  brands={brands} 
                  selectedFilters={selectedFilters}
                  onFilterChange={setSelectedFilters}
                />
              </div>
            </aside>
          )}

          <main className="lg:w-3/4">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                Showing {products.length} of {pagination.totalItems} products
              </p>
              {selectedFilters.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedFilters([])}
                  className="text-red-500 hover:text-red-600"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              )}
            </div>

            {renderProducts()}

            <motion.div 
              className="mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Paginator
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={(page) => dispatch(setCurrentPage(page))}
                itemsPerPage={filters.itemsPerPage}
                onItemsPerPageChange={(items) => {
                  dispatch(setItemsPerPage(items));
                  dispatch(setCurrentPage(1));
                }}
                itemsPerPageOptions={ITEMS_PER_PAGE_OPTIONS}
              />
            </motion.div>
          </main>
        </div>
      </div>

      {/* Quick View Dialog */}
      {!isMobile && quickViewProduct && (
        <Suspense fallback={
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-white" />
          </div>
        }>
          <QuickViewDialog
            product={quickViewProduct}
            isOpen={!!quickViewProduct}
            onClose={() => setQuickViewProduct(null)}
            onAddToCart={handleAddToCart}
            isAuthenticated={isAuthenticated}
            onViewDetails={() => {
              setQuickViewProduct(null);
              handleProductClick(quickViewProduct._id);
            }}
            isWishlisted={wishlists?.some((item) => item?.product?._id === quickViewProduct._id)}
            onWishlistToggle={toggleWishlist}
          />
        </Suspense>
      )}
    </div>
      </>
    
  );
};

export default memo(ProductPage);