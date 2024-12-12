'use client'

import { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Eye, ShoppingCart, Star } from 'lucide-react';
import showToast from '../../utils/toast/toastUtils';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addToCartAsync } from '../../store/cartSlice';
import { fetchSimilarProducts } from '../../store/similarProduct'; 
import { useNavigate } from 'react-router-dom';
import { Product } from '../../store/productSlice';
interface SimilarProductsProps {
  currentProductId: string;
}

export default function SimilarProducts({ currentProductId }: SimilarProductsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const [isHovered, setIsHovered] = useState(false);
  const { items: similarProducts, status, error } = useAppSelector( (state) => state.similarProducts);
  const navigate = useNavigate()

  console.log({similarProducts})
  useEffect(() => {
    if (currentProductId) {
      dispatch(fetchSimilarProducts(currentProductId));
    }
  }, [currentProductId, dispatch]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          dispatch(fetchSimilarProducts(currentProductId));
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [currentProductId, dispatch]);

  const handleAddToCart = useCallback(
    async (product:Product) => {
      try {
        const resultAction = await dispatch(addToCartAsync(product));
        if (addToCartAsync.fulfilled.match(resultAction)) {
          showToast('Product added to cart successfully!', 'success');
        } else {
          showToast('Failed to add product to cart. Please try again.', 'error');
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        showToast('An unexpected error occurred. Please try again.', 'error');
      }
    },
    [dispatch]
  );

  const productCards = useMemo(() => (
    Array.isArray(similarProducts) ? (
      similarProducts.map((product) => (
        <div
          key={product._id}
          className="overflow-hidden transition-shadow duration-300 hover:shadow-xl flex flex-col"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Card className="relative overflow-hidden">
            <CardHeader className="p-0 relative">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg transition-transform duration-300 hover:scale-105 cursor-pointer"
                onClick={() => navigate(product._id)}
              />
              {isHovered && (
                <div
                  className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer transition-opacity duration-300"
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  <Eye className="text-white w-8 h-8" />
                </div>
              )}
              {product.stock === 0 && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  Out of Stock
                </div>
              )}
            </CardHeader>
            <CardContent className="p-4 flex-grow">
              <CardTitle className="text-lg font-semibold cursor-pointer hover:text-primary transition-colors duration-300" onClick={() =>  navigate(`/product/${product._id}`)}>
                {product.name}
              </CardTitle>
              <p className="text-sm text-gray-500 mb-2">{product.category}</p>
              {product.brand && <p className="text-sm text-gray-500 mb-2">{product.brand}</p>}
              <p className="text-lg font-semibold text-primary">${product.price.toFixed(2)}</p>
              <div className="flex items-center mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.round(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-500">({product.rating?.toFixed(1)})</span>
              </div>
            </CardContent>
            <CardFooter className="p-4">
              <Button
                className="w-full flex items-center justify-center"
                onClick={() => handleAddToCart(product)}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      ))
    ) : (
      <div>No similar products available.</div>
    )
  ), [similarProducts, handleAddToCart, isHovered]);

  return (
    <div ref={containerRef} className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Similar Products</h2>
      {status === 'loading' ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {productCards}
        </div>
      )}
    </div>
  );
}
