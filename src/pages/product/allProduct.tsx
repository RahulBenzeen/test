import React, { useEffect, useState, useCallback, memo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setCurrentPage, setItemsPerPage, setView, setCategory, setSubcategory, setSortBy } from '../../store/filterSlice';
import { fetchProducts } from '../../store/productSlice';
import { addToCartAsync } from '../../store/cartSlice';
import { addToWishlist, fetchWishlist, removeFromWishlist } from '../../store/whislistSlice';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { Product } from '../../store/productSlice';
import showToast from '../../utils/toast/toastUtils';

// Components
import ProductFeatures from './product-feature/ProductFeatures';
import ProductCard from './product-card/ProductCard';
import ProductFilter from '../filterProduct/filterProduct';
import Paginator from '../paginator/paginator';
import QuickViewDialog from './quick-view-dialog/QuickViewDialog';
import ProductHeader from './product-header/ProductHeader';
import ProductSkeleton from './product-skeleton/ProductSkeleton';
import ProductEmptyState from './empty-state/ProductEmptyState';
import ProductErrorState from './error-state/ProductErrorState'; 

// Constants
const ITEMS_PER_PAGE_OPTIONS = [12, 24, 48];

const ProductPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Selectors
  const filters = useAppSelector((state) => state.filters);
  const { items: products, status, error, pagination } = useAppSelector((state) => state.products);
  const wishlists = useAppSelector((state) => state.whishlist.wishlists);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  
  // Local state
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  
  // Media queries
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');

  // Memoized values
  const categories = React.useMemo(() => 
    [...new Set(products.map((p) => p.category).filter(Boolean))], 
    [products]
  );
  
  const brands = React.useMemo(() => [...new Set(products.map((p) => p.brand).filter(Boolean))], [products]) || [];

  // Handlers
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
  }, [dispatch, wishlists]);

  // Effects
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const category = searchParams.get('category') || '';
    const subcategory = searchParams.get('subcategory') || '';

    if (category) dispatch(setCategory(category));
    if (subcategory) dispatch(setSubcategory(subcategory));

    const controller = new AbortController();
    
    dispatch(fetchProducts({ 
      page: filters.currentPage, 
      limit: filters.itemsPerPage,
      category,
      subcategory,
      sortBy: filters.sortBy,
    }));

    return () => controller.abort();
  }, [dispatch, filters.currentPage, filters.itemsPerPage, filters.sortBy, location.search]);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      dispatch(fetchWishlist(user.id));
    }
  }, [isAuthenticated, user?.id, dispatch]);

  // Render helpers
  const renderProducts = () => {
    if (status === 'loading') {
      return <ProductSkeleton view={filters.view} count={6} />;
    }

    if (status === 'failed') {
      return <ProductErrorState error={error} onRetry={() => window.location.reload()} />;
    }

    if (products.length === 0) {
      return <ProductEmptyState />;
    }

    return (
      <div className={filters.view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6' : 'space-y-4'}>
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            isWishlisted={wishlists?.some((item) => item?.product?._id === product._id)}
            onAddToCart={handleAddToCart}
            onQuickView={handleQuickView}
            onClick={() => handleProductClick(product._id)}
            onWishlistToggle={toggleWishlist}
            view={filters.view}
            isAuthenticated={isAuthenticated}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        <ProductHeader
          filters={filters}
          onViewChange={(value) => dispatch(setView(value))}
          onSortChange={(value) => dispatch(setSortBy(value))}
          selectedFilters={selectedFilters}
          isTablet={isTablet}
          categories={categories}
          brands={brands }
          onFilterChange={setSelectedFilters}
        />

        <ProductFeatures />

        <div className="flex flex-col lg:flex-row gap-8">
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
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">
                Showing {products.length} of {pagination.totalItems} products
              </p>
            </div>

            {renderProducts()}

            <div className="mt-8">
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
            </div>
          </main>
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
    </div>
  );
};

export default memo(ProductPage);