import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setCurrentPage, setItemsPerPage, setView, setCategory, setSubcategory, setSortBy } from '../../store/filterSlice';
import { fetchProducts } from '../../store/productSlice';
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "../../components/ui/toggle-group";
import { Grid, List, Loader2, Star, ShoppingCart, Eye } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { motion } from "framer-motion";
import ProductFilter from '../filterProduct/filterProduct';
import Paginator from '../paginator/paginator';
import { addToCartAsync } from '../../store/cartSlice';
import { Product } from '../../store/productSlice';

export default function ProductPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const filters = useAppSelector((state) => state.filters);
  const { items: products, status, error, pagination } = useAppSelector((state) => state.products);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  // Remove this line
  // const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const category = searchParams.get('category') || '';
    const subcategory = searchParams.get('subcategory') || '';

    if (category) dispatch(setCategory(category));
    if (subcategory) dispatch(setSubcategory(subcategory));

    dispatch(fetchProducts({ 
      page: filters.currentPage, 
      limit: filters.itemsPerPage,
      category,
      subcategory,
      sortBy: filters.sortBy
    }));
  }, [dispatch, filters.currentPage, filters.itemsPerPage, filters.sortBy, location.search]);

  const handleAddToCart = (product: Product) => {
    dispatch(addToCartAsync(product));
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const categories = [...new Set(products.map((p) => p.category))];
  const brands = [...new Set(products.map((p) => p.brand).filter(Boolean))];

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  const handleItemsPerPageChange = (items: number) => {
    dispatch(setItemsPerPage(items));
    dispatch(setCurrentPage(1));
  };

  const handleSortChange = (value: string) => {
    dispatch(setSortBy(value));
  };

  const ProductCard = ({ product }: { product: Product }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card 
          className={`${filters.view === 'grid' ? 'flex flex-col' : 'flex flex-row'} overflow-hidden transition-shadow duration-300 hover:shadow-lg`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <CardHeader className={filters.view === 'grid' ? 'p-0 relative' : 'p-4 relative'}>
            <img
              src={product.images[0]}
              alt={product.name}
              className={`${filters.view === 'grid' ? 'w-full h-48' : 'w-40 h-40'} object-cover rounded-t-lg cursor-pointer transition-transform duration-300 hover:scale-105`}
              onClick={() => handleProductClick(product._id)}
            />
            {isHovered && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center cursor-pointer justify-center transition-opacity duration-300" onClick={() => handleProductClick(product._id)}>
                <Eye className="text-white w-8 h-8 "  />
              </div>
            )}
            {product.stock === 0 && (
              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                Out of Stock
              </div>
            )}
          </CardHeader>
          <CardContent className={`flex-grow p-4 ${filters.view === 'list' ? 'flex-1' : ''}`}>
            <CardTitle className="text-lg mb-2 cursor-pointer hover:text-primary transition-colors duration-300" onClick={() => handleProductClick(product._id)}>
              {product.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
            {product.brand && <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>}
            <p className="text-lg font-semibold text-primary">${product.price.toFixed(2)}</p>
            <div className="flex items-center mt-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < Math.round(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`} />
              ))}
              <span className="ml-2 text-sm text-muted-foreground">({product.rating?.toFixed(1)})</span>
            </div>
          </CardContent>
          <CardFooter className={`p-4 ${filters.view === 'list' ? 'self-end' : 'pt-0'}`}>
            {isAuthenticated ? (
              <Button
                className="w-full flex items-center justify-center"
                onClick={() => handleAddToCart(product)}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={() => navigate('/signin')}
                disabled={product.stock === 0}
              >
                {product.stock > 0 ? 'Buy Now' : 'Out of Stock'}
              </Button>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    );
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (status === 'failed') {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center lg:text-left">
        {filters.category ? `${filters.category?.toUpperCase()} - ${filters.subcategory || 'All'}` : 'All Products'}
      </h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/4">
          <div className="sticky top-20">
            <ProductFilter categories={categories} brands={brands} />
          </div>
        </div>
        <div className="lg:w-3/4">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <div className="flex items-center gap-4">
              <ToggleGroup
                type="single"
                value={filters.view}
                onValueChange={(value: string) => value && dispatch(setView(value as 'grid' | 'list'))}
                className="border rounded-md"
              >
                <ToggleGroupItem value="grid" aria-label="Grid view" className="px-3 py-2">
                  <Grid className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="list" aria-label="List view" className="px-3 py-2">
                  <List className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>
              <Select onValueChange={handleSortChange} defaultValue={filters.sortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price_asc">Price: Low to High</SelectItem>
                  <SelectItem value="price_desc">Price: High to Low</SelectItem>
                  <SelectItem value="rating_desc">Highest Rated</SelectItem>
                  <SelectItem value="newest">Newest Arrivals</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-sm text-muted-foreground">
              Showing {products.length} of {pagination.totalItems} products
            </p>
          </div>
          <div className={filters.view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {products.map((product) => (
              <ProductCard key={product._id || product.name} product={product} />
            ))}
          </div>
          <div className="mt-8">
            <Paginator
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={filters.itemsPerPage}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}