import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setCurrentPage, setItemsPerPage, setView } from '../../store/filterSlice';
import { fetchProducts } from '../../store/productSlice';
import { Button } from "../../components/ui/button";
import {Card,CardContent,CardFooter,CardHeader,CardTitle} from "../../components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "../../components/ui/toggle-group";
import { Grid, List } from 'lucide-react';
import ProductFilter from '../filterProduct/filterProduct';
import Paginator from '../paginator/paginator';
import { addToCartAsync } from '../../store/cartSlice';
import { Product } from '../../store/productSlice';

export default function ProductPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const filters = useAppSelector((state) => state.filters);
  const { items: products, status, error, pagination } = useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts({ page: filters.currentPage, limit: filters.itemsPerPage }));
  }, [dispatch, filters.currentPage, filters.itemsPerPage]);
  
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
    dispatch(setCurrentPage(1)); // Reset to first page when changing items per page
  };

  const ProductCard = ({ product }: { product: Product }) => (
    <Card className={filters.view === 'grid' ? 'flex flex-col' : 'flex flex-row'}>
      <CardHeader className={filters.view === 'grid' ? 'p-0' : 'p-4'}>
        <img
          src={product.images[0]}
          alt={product.name}
          className={filters.view === 'grid' ? 'w-full h-48 object-cover rounded-t-lg cursor-pointer' : 'w-40 h-40 object-cover rounded-lg cursor-pointer'}
          onClick={() => handleProductClick(product._id)}
        />
      </CardHeader>
      <CardContent className={`flex-grow p-4 ${filters.view === 'list' ? 'flex-1' : ''}`}>
        <CardTitle className="text-lg mb-2 cursor-pointer" onClick={() => handleProductClick(product._id)}>
          {product.name}
        </CardTitle>
        <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
        {product.brand && <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>}
        <p className="text-lg font-semibold">${product.price.toFixed(2)}</p>
        <p className="text-sm text-yellow-500">★ {product.rating?.toFixed(1)}</p>
      </CardContent>
      <CardFooter className={`p-4 ${filters.view === 'list' ? 'self-end' : 'pt-0'}`}>
        <Button className="w-full" onClick={() => handleAddToCart(product)} disabled={product.stock === 0}>
          {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </CardFooter>
    </Card>
  );

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/4">
          <div className="sticky top-20">
            <ProductFilter categories={categories} brands={brands} />
          </div>
        </div>
        <div className="lg:w-3/4">
          <div className="flex justify-between items-center mb-4">
            <ToggleGroup
              type="single"
              value={filters.view}
              onValueChange={(value: string) => value && dispatch(setView(value as 'grid' | 'list'))}
            >
              <ToggleGroupItem value="grid" aria-label="Grid view">
                <Grid className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="list" aria-label="List view">
                <List className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
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
