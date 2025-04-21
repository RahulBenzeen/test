'use client'

import { useEffect, useRef, useCallback, useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { addToCartAsync } from '../../store/cartSlice'
import { fetchSimilarProducts } from '../../store/similarProduct'
import { useNavigate } from 'react-router-dom'
import { Product } from '../../store/productSlice'
import showToast from '../../utils/toast/toastUtils'
import ProductCard from '../product/product-card/ProductCard'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import QuickViewDialog from '../product/quick-view-dialog/QuickViewDialog'
import { addToWishlist, removeFromWishlist } from '../../store/whislistSlice'

interface SimilarProductsProps {
  currentProductId: string
}

export default function SimilarProducts({ currentProductId }: SimilarProductsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { items: similarProducts, status, error } = useAppSelector((state) => state.similarProducts)
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const { wishlists } = useAppSelector((state) => state.whishlist)
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)

  const isMobile = useMediaQuery('(max-width: 768px)')


  useEffect(() => {
    if (currentProductId) {
      dispatch(fetchSimilarProducts(currentProductId))
    }
  }, [currentProductId, dispatch])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          dispatch(fetchSimilarProducts(currentProductId))
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [currentProductId, dispatch])

  const handleAddToCart = useCallback(
    async (product: Product, e: React.MouseEvent) => {
      e.stopPropagation()
      try {
        const resultAction = await dispatch(addToCartAsync(product))
        if (addToCartAsync.fulfilled.match(resultAction)) {
          showToast('Product added to cart successfully!', 'success')
        } else {
          showToast('Failed to add product to cart. Please try again.', 'error')
        }
      } catch (error) {
        console.error('Unexpected error:', error)
        showToast('An unexpected error occurred. Please try again.', 'error')
      }
    },
    [dispatch]
  )

  const handleQuickView = useCallback((product: Product, e: React.MouseEvent) => {
    e.stopPropagation()
    setQuickViewProduct(product)
  }, [])

  const handleProductClick = useCallback((productId: string) => {
    navigate(`/product/${productId}`)
  }, [navigate])

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


  const renderProductCard = useCallback((product: Product) => {
    const isWishlisted = wishlists.some(item => item.product._id === product._id)

    return (
      <ProductCard
        key={product._id}
        product={product}
        isWishlisted={isWishlisted}
        onAddToCart={handleAddToCart}
        onQuickView={handleQuickView}
        onClick={() => handleProductClick(product._id)}
        onWishlistToggle={toggleWishlist}
        view="grid"
        isAuthenticated={isAuthenticated}
      />
    )
  }, [isAuthenticated, handleAddToCart, handleQuickView, handleProductClick, toggleWishlist, wishlists])

  const productCards = useMemo(() => {
    return Array.isArray(similarProducts) ? similarProducts.map(renderProductCard) : <div>No similar products available.</div>
  }, [similarProducts, renderProductCard])

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>
  }

  return (
    <div ref={containerRef} className="mt-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">{productCards}</div>
      {!isMobile && quickViewProduct && (
        <QuickViewDialog
          product={quickViewProduct}
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={handleAddToCart}
          isAuthenticated = {isAuthenticated}
          onViewDetails={() => {
            setQuickViewProduct(null)
            handleProductClick(quickViewProduct._id)
          }}
          isWishlisted={wishlists?.some((item) => item?.product?._id === quickViewProduct._id)}
          onWishlistToggle={toggleWishlist}
        />
      )}
    </div>
  )
}