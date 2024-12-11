import { useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {  fetchProducts, Product } from '../../store/productSlice';
import { addToCartAsync } from '../../store/cartSlice';
import { Link, useNavigate} from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export default function FeaturedProducts() {
  const dispatch = useAppDispatch();
  const { items: products, status, error } = useAppSelector((state) => state.products);
  const { isAuthenticated} = useAppSelector((state) => state.auth);
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(fetchProducts({page:1, limit:4})); // Fetch top 4 recent products
  }, [dispatch]);

  const handleAddToCart = (product: Product) => {
    dispatch(addToCartAsync(product));
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (status === 'failed') {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <section className="bg-muted py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product?._id} className="bg-background rounded-lg shadow-md overflow-hidden">
              <Link to={`/product/${product?._id}`} className="block">
                <img
                  src={product?.images[0] || 'https://placehold.co/600x400'}
                  alt={product?.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                  <p className="text-muted-foreground mb-4">${product.price.toFixed(2)}</p>
                </div>
              </Link>
              <div className="px-4 pb-4">
                { 
                  isAuthenticated ? 
                  
                  <Button onClick={() => handleAddToCart(product)} className="w-full">
                    Add to Cart
                  </Button> 
                  :
                 < Button onClick={() => navigate('/signin')} className="w-full">
                    Buy Now
                  </Button>
                }
             
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-8">
          <Link to="/product" className="text-primary hover:underline">
            View More
          </Link>
        </div>
      </div>
    </section>
  );
}
