import React from 'react'
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { fetchWishlist, removeFromWishlist } from "../../store/whislistSlice"
import { addToCartAsync } from "../../store/cartSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import showToast from "../../utils/toast/toastUtils"
import ProductErrorState from '../product/error-state/ProductErrorState'
import EmptyOrderState from '../user-profile/order/EmptyOrderState';
import ProductCard from '../product/product-card/ProductCard'
import ProductSkeleton from '../product/product-skeleton/ProductSkeleton'
import { useNavigate } from 'react-router-dom'

const WishlistPage = () => {
  const dispatch = useAppDispatch()
  const { wishlists, status, error } = useAppSelector((state) => state.whishlist)
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const navigate = useNavigate()

  React.useEffect(() => {
    if (user?.id) {
      dispatch(fetchWishlist(user.id))
    }
  }, [dispatch, user?.id])

  const handleRemoveFromWishlist = async (productId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await dispatch(removeFromWishlist(productId)).unwrap()
      showToast('Removed from wishlist', 'success')
    } catch (error) {
      showToast('Failed to remove from wishlist', 'error')
    }
  }

  const handleAddToCart = async (product: any, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await dispatch(addToCartAsync(product)).unwrap()
      showToast('Added to cart successfully', 'success')
    } catch (error) {
      showToast('Failed to add to cart', 'error')
    }
  }

  const handleQuickView = (product: any, e: React.MouseEvent) => {
    e.stopPropagation()
    // Handle quick view logic
  }

  const handleProductClick = (productId: string) => {
    window.location.href = `/product/${productId}`
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <Card className="shadow-xl border-0">
            <CardHeader className="border-b bg-white rounded-t-xl">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <Heart className="w-6 h-6 text-red-500" />
                  My Wishlist
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ProductSkeleton view="grid" count={6} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (status === 'failed') {
    return <ProductErrorState error={error} onRetry={() => dispatch(fetchWishlist(user?.id || ""))} />
  }

  if (!wishlists?.length) {
    return <EmptyOrderState hasSearch={false} />
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <Card className="shadow-xl border-0">
          <CardHeader className="border-b bg-white rounded-t-xl">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Heart className="w-6 h-6 text-red-500" />
                My Wishlist
                <span className="text-gray-400 text-lg">({wishlists.length})</span>
              </CardTitle>
              <Button
                variant="outline"
                onClick={() => navigate('/product')}
              >
                Continue Shopping
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <AnimatePresence>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlists.map((item) => (
                  <motion.div
                    key={item?.product?._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <ProductCard
                      product={item?.product}
                      isWishlisted={true}
                      onAddToCart={handleAddToCart}
                      onQuickView={handleQuickView}
                      onClick={() => handleProductClick(item?.product?._id)}
                      onWishlistToggle={handleRemoveFromWishlist}
                      view="grid"
                      isAuthenticated={isAuthenticated}
                    />
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default WishlistPage