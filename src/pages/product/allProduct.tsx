import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setCurrentPage, setItemsPerPage, setView, setCategory, setSubcategory, setSortBy } from '../../store/filterSlice'
import { fetchProducts } from '../../store/productSlice'
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "../../components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "../../components/ui/toggle-group"
import { 
  Grid, 
  List, 
  Star, 
  ShoppingCart, 
  Eye, 
  Percent, 
  Share2, 
  Heart, 
  ArrowUpRight,
  Truck,
  Shield,
  Clock,
  Package,
  RefreshCcw,
  SlidersHorizontal,
  X
} from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { motion } from "framer-motion"
import { Badge } from "../../components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../../components/ui/sheet"
import ProductFilter from '../filterProduct/filterProduct'
import Paginator from '../paginator/paginator'
import { addToCartAsync } from '../../store/cartSlice'
import { Product } from '../../store/productSlice'
import { Skeleton } from "../../components/ui/skeleton"
import showToast from '../../utils/toast/toastUtils'
import { addToWishlist, fetchWishlist, removeFromWishlist } from '../../store/whislistSlice'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import WishlistButton from '../wishlistButton/wishlistButton'
import fallbackImage from '../../assets/images/fallbackimage.webp'

export default function ProductPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const filters = useAppSelector((state) => state.filters)
  const { items: products, status, error, pagination } = useAppSelector((state) => state.products)
  const wishlists  = useAppSelector((state) => state.whishlist.wishlists)
  const { isAuthenticated,user } = useAppSelector((state) => state.auth)
  const [wishlist, setWishlist] = useState<Set<string>>(new Set())
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])

  const isMobile = useMediaQuery('(max-width: 768px)')
  const isTablet = useMediaQuery('(max-width: 1024px)')
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const category = searchParams.get('category') || ''
    const subcategory = searchParams.get('subcategory') || ''

    if (category) dispatch(setCategory(category))
    if (subcategory) dispatch(setSubcategory(subcategory))

    dispatch(fetchProducts({ 
      page: filters.currentPage, 
      limit: filters.itemsPerPage,
      category,
      subcategory,
      sortBy: filters.sortBy,
    }))
  }, [dispatch, filters.currentPage, filters.itemsPerPage, filters.sortBy, location.search])

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist(user?.id || ''));
    }
  }, [isAuthenticated, user?.id, dispatch]);  // Dependency array: runs when `isAuthenticated` or `user?.id` changes
  

  const handleAddToCart = async (product: Product, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      const resultAction = await dispatch(addToCartAsync(product))
      if (addToCartAsync.fulfilled.match(resultAction)) {
        showToast("Added to cart successfully!", "success")
      }
    } catch {
      showToast("Failed to add to cart", "error")
    }
  }

  const handleQuickView = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation()
    setQuickViewProduct(product)
  }

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`)
  }

  const handleItemsPerPageChange = (items: number) => {
    dispatch(setItemsPerPage(items))
    dispatch(setCurrentPage(1))
  }

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSortChange = (value: string) => {
    dispatch(setSortBy(value))
  }

  const toggleWishlist = async (productId: string, e: React.MouseEvent) => {
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
  };
  
  
  const handleShare = async (product: Product, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await navigator.share({
        title: product.name,
        text: `Check out ${product.name}`,
        url: window.location.href + `/${product._id}`,
      })
    } catch {
      showToast("Failed to share product", "error")
    }
  }

  const categories = [...new Set(products.map((p) => p.category).filter((category): category is string => !!category))]

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    },
    hover: {
      y: -5,
      transition: { duration: 0.2 }
    }
  }

  const ProductFeatures = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg mb-8">
      <div className="flex items-center gap-2 text-sm">
        <div className="p-2 bg-primary/10 rounded-full shrink-0">
          <Truck className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="font-medium">Free Delivery</p>
          <p className="text-muted-foreground text-xs">Orders over ₹999</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <div className="p-2 bg-primary/10 rounded-full shrink-0">
          <Shield className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="font-medium">Secure Payment</p>
          <p className="text-muted-foreground text-xs">100% Protected</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <div className="p-2 bg-primary/10 rounded-full shrink-0">
          <RefreshCcw className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="font-medium">Easy Returns</p>
          <p className="text-muted-foreground text-xs">30 Day Policy</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <div className="p-2 bg-primary/10 rounded-full shrink-0">
          <Clock className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="font-medium">24/7 Support</p>
          <p className="text-muted-foreground text-xs">Always Available</p>
        </div>
      </div>
    </div>
  )

  const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
    const [isHovered, setIsHovered] = useState(false)
    const isWishlisted = Array.isArray(wishlists) && wishlists.some((item) => item?.product?._id === product?._id);
    const isSpecialOffer = product.isSpecialOffer && (product.discountPercentage ?? 0) > 0


    
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover={!isMobile ? "hover" : undefined}
        onClick={() => handleProductClick(product._id)}
        className="cursor-pointer"
      >
        <Card 
          className={`${
            filters.view === 'grid' ? 'flex flex-col' : 'flex flex-col md:flex-row'
          } overflow-hidden transition-all duration-300 hover:shadow-xl relative group ${
            isSpecialOffer ? 'ring-2 ring-red-500 ring-offset-2' : ''
          }`}
        >
          <CardHeader className={`${filters.view === 'grid' ? 'p-0' : 'p-4 md:w-1/3'} relative`}>
            <div className="relative w-full aspect-square md:aspect-[4/3] overflow-hidden">
              <img
                src={product?.images?.[0]?.secure_url || fallbackImage}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
                onError={(e) => (e.target as HTMLImageElement).src = fallbackImage}
              />

              {!isMobile && (
                <div 
                  className={`absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 transition-opacity duration-300 ${
                    isHovered ? 'opacity-100' : ''
                  }`}
                  onClick={(e) => handleQuickView(product, e)}
                >
                  <Button variant="secondary" className="gap-2">
                    <Eye className="w-4 h-4" />
                    Quick View
                  </Button>
                </div>
              )}
              {isMobile && (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="secondary"
                      className="absolute bottom-4 right-4 gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Eye className="w-4 h-4" />
                      Quick View
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="h-[90vh]">
                    <SheetHeader>
                      <SheetTitle>{product.name}</SheetTitle>
                    </SheetHeader>
                    <div className="space-y-4 mt-4">
                      <img
                        src={product?.images?.[0]?.secure_url}
                        alt={fallbackImage}
                        className="w-full h-auto rounded-lg"
                        onError={(e) => (e.target as HTMLImageElement).src = fallbackImage}

                      />
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          {isSpecialOffer ? (
                            <>
                              <span className="text-2xl font-bold text-red-500">
                                ₹{product.discountedPrice?.toFixed(2)}
                              </span>
                              <span className="text-lg text-muted-foreground line-through">
                                ₹{product.price.toFixed(2)}
                              </span>
                            </>
                          ) : (
                            <span className="text-2xl font-bold">
                              ₹{product.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <p className="text-muted-foreground">
                          {product.description}
                        </p>
                        <Button
                          className="w-full"
                          size="lg"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product, e);
                          }}
                          disabled={product.stock === 0}
                        >
                          <ShoppingCart className="mr-2 h-5 w-5" />
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              )}
            </div>
            <div className="absolute top-2 right-2 flex flex-col gap-2">
            <WishlistButton
              productId={product._id}
              isWishlisted={isWishlisted}
              toggleWishlist={toggleWishlist}
            />
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
            {product?.stock === 0 && (
              <Badge variant="destructive" className="absolute top-2 left-2">
                Out of Stock
              </Badge>
            )}
            {product?.stock > 0 && product?.stock <= 5 && (
              <Badge variant="secondary" className="absolute top-2 left-2">
                Only {product.stock} left
              </Badge>
            )}
            {isSpecialOffer && (
              <Badge variant="secondary" className="absolute bottom-2 left-2 bg-red-500 text-white">
                <Percent className="w-4 h-4 mr-1" />
                {product?.discountPercentage}% OFF
              </Badge>
            )}
          </CardHeader>
          <CardContent className={`flex-grow p-4 ${filters.view === 'list' ? 'md:flex-1' : ''}`}>
            <div className="space-y-2">
              {
                product?.category && (
                  <Badge variant="outline" className="mb-2">
                  {product.category}
                  </Badge>
                )
              }
  
              <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors duration-300">
                {product?.name}
                <ArrowUpRight className="inline-block w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              {product?.brand && (
                <p className="text-sm text-muted-foreground">{product.brand}</p>
              )}
              <div className="flex items-center gap-2">
                {isSpecialOffer ? (
                  <>
                    <p className="text-xl font-bold text-red-500">₹{product?.discountedPrice?.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground line-through">₹{product?.price?.toFixed(2)}</p>
                  </>
                ) : (
                  <p className="text-xl font-bold text-primary">₹{product?.price?.toFixed(2)}</p>
                )}
              </div>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.round(product.rating || 0)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-muted-foreground">
                  ({product.rating?.toFixed(1)})
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className={`p-4 ${filters.view === 'list' ? 'md:self-end' : ''}`}>
            {isAuthenticated ? (
              <Button
                className={`w-full group relative overflow-hidden ${
                  isSpecialOffer ? 'bg-red-500 hover:bg-red-600' : ''
                }`}
                onClick={(e) => handleAddToCart(product, e)}
                disabled={product?.stock === 0}
              >
                <span className="absolute inset-0 bg-white/20 group-hover:translate-y-0 translate-y-full transition-transform duration-300" />
                <ShoppingCart className="mr-2 h-4 w-4" />
                {product?.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </Button>
            ) : (
              <Button
                className={`w-full group relative overflow-hidden ${
                  isSpecialOffer ? 'bg-red-500 hover:bg-red-600' : ''
                }`}
                onClick={() => navigate('/signin')}
                disabled={product?.stock === 0}
              >
                <span className="absolute inset-0 bg-white/20 group-hover:translate-y-0 translate-y-full transition-transform duration-300" />
                {product?.stock > 0 ? 'Sign in to Buy' : 'Out of Stock'}
              </Button>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        {/* Header Section */}
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold">
              {filters.category 
                ? `${filters.category?.toUpperCase()} - ${filters.subcategory || 'All'}`
                : 'All Products'
              }
            </h1>
            <p className="text-muted-foreground mt-2">
              Discover our curated collection of premium products
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 self-stretch">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {isTablet && (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="flex-1 sm:flex-none">
                      <SlidersHorizontal className="mr-2 h-4 w-4" />
                      Filters
                      {selectedFilters.length > 0 && (
                        <Badge className="ml-2" variant="secondary">
                          {selectedFilters.length}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-4">
                      <ProductFilter 
                        categories={categories} 
                        brands={[]} 
                        selectedFilters={selectedFilters}
                        onFilterChange={setSelectedFilters}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
              )}
              <div className="flex items-center gap-2 flex-1 sm:flex-none">
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
                  <SelectTrigger className="w-full sm:w-[180px]">
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
            </div>
          </div>
        </div>

        {/* Features Section */}
        <ProductFeatures />

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Section - Only visible on desktop */}
          {!isTablet && (
            <div className="lg:w-1/4">
              <div className="sticky top-20">
                <ProductFilter 
                  categories={categories} 
                  brands={[]} 
                  selectedFilters={selectedFilters}
                  onFilterChange={setSelectedFilters}
                />
              </div>
            </div>
          )}

          {/* Products Section */}
          <div className="lg:w-3/4">
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">
                Showing {products.length} of {pagination.totalItems} products
              </p>
            </div>

            {status === 'loading' ? (
              <div className={filters.view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6' : 'space-y-4'}>
                {[...Array(6)].map((_, index) => (
                  <Card key={index} className="overflow-hidden">
                    <Skeleton className="h-48 md:h-64 w-full" />
                    <CardContent className="p-4">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-2" />
                      <Skeleton className="h-4 w-1/4" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : status === 'failed' ? (
              <div className="text-center py-12">
                <div className="text-destructive mb-4">Error: {error}</div>
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Products Found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            ) : (
              <div className={filters.view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6' : 'space-y-4'}>
                {products.map((product) => (
                  <ProductCard key={product._id || product.name} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
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

      {/* Quick View Dialog - Only for desktop */}
      {!isMobile && (
        <Dialog open={!!quickViewProduct} onOpenChange={() => setQuickViewProduct(null)}>
          <DialogContent className="max-w-3xl">
            {quickViewProduct && (
              <>
                <DialogHeader>
                  <DialogTitle>{quickViewProduct.name}</DialogTitle>
                </DialogHeader>
                <div className="grid md:grid-cols-2 gap-6 p-6">
                  <div className="relative">
                    <img
                      src={quickViewProduct?.images?.[0]?.secure_url}
                      alt={fallbackImage}
                      className="w-full h-auto rounded-lg"
                      onError={(e) => (e.target as HTMLImageElement).src = fallbackImage}
                    />
                    {quickViewProduct.isSpecialOffer && (
                      <Badge className="absolute top-2 left-2 bg-red-500">
                        {quickViewProduct.discountPercentage}% OFF
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Badge variant="outline">{quickViewProduct.category}</Badge>
                        <h2 className="text-2xl font-bold">{quickViewProduct.name}</h2>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => toggleWishlist(quickViewProduct._id, e)}
                      >
                        <Heart className={`h-5 w-5 ${
                          wishlist.has(quickViewProduct._id) ? 'fill-red-500 text-red-500' : ''
                        }`} />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      {quickViewProduct.isSpecialOffer ? (
                        <>
                          <span className="text-2xl font-bold text-red-500">
                            ₹{quickViewProduct.discountedPrice?.toFixed(2)}
                          </span>
                          <span className="text-lg text-muted-foreground line-through">
                            ₹{quickViewProduct.price.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="text-2xl font-bold">
                          ₹{quickViewProduct.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground">
                      {quickViewProduct.description}
                    </p>
                    <div className="flex items-center gap-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.round(quickViewProduct.rating || 0)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-sm text-muted-foreground">
                        ({quickViewProduct.rating?.toFixed(1)})
                      </span>
                    </div>
                    <div className="space-y-2">
                      <Button
                        className="w-full"
                        size="lg"
                        onClick={(e) => handleAddToCart(quickViewProduct, e)}
                        disabled={quickViewProduct.stock === 0}
                      >
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Add to Cart
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        size="lg"
                        onClick={() => {
                          setQuickViewProduct(null)
                          handleProductClick(quickViewProduct._id)
                        }}
                      >
                        View Full Details
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}