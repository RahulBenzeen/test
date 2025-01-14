import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setCurrentPage, setItemsPerPage, setView, setCategory, setSubcategory, setSortBy } from '../../store/filterSlice'
import { fetchProducts } from '../../store/productSlice'
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "../../components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "../../components/ui/toggle-group"
import { Grid, List, Star, ShoppingCart, Eye, Percent, Share2, Heart, Filter, ArrowUpRight } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "../../components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip"
import ProductFilter from '../filterProduct/filterProduct'
import Paginator from '../paginator/paginator'
import { addToCartAsync } from '../../store/cartSlice'
import { Product } from '../../store/productSlice'
import { Skeleton } from "../../components/ui/skeleton"
import showToast from '../../utils/toast/toastUtils'

export default function ProductPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const filters = useAppSelector((state) => state.filters)
  const { items: products, status, error, pagination } = useAppSelector((state) => state.products)
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [wishlist, setWishlist] = useState<Set<string>>(new Set())

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
      sortBy: filters.sortBy
    }))
  }, [dispatch, filters.currentPage, filters.itemsPerPage, filters.sortBy, location.search])

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch(addToCartAsync(product))
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
  }

  const handleSortChange = (value: string) => {
    dispatch(setSortBy(value))
  }


  const toggleWishlist = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setWishlist(prev => {
      const newWishlist = new Set(prev)
      if (newWishlist.has(productId)) {
        newWishlist.delete(productId)
      } else {
        newWishlist.add(productId)
      }
      return newWishlist
    })
  }

  const handleShare = async (product: Product, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await navigator.share({
        title: product.name,
        text: `Check out ${product.name}`,
        url: window.location.href,
      })
    } catch (err) {
      showToast(`Error sharing:${err}`, 'error')
    }
  }

  const categories = [...new Set(products.map((p) => p.category).filter((category): category is string => !!category))]

  const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
    const [isHovered, setIsHovered] = useState(false)
    const isWishlisted = wishlist.has(product._id)
    const isSpecialOffer = product.isSpecialOffer && (product.discountPercentage ?? 0) > 0

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

    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        onClick={() => handleProductClick(product._id)}
        className="cursor-pointer"
      >
        <Card 
          className={`${
            filters.view === 'grid' ? 'flex flex-col' : 'flex flex-row'
          } overflow-hidden transition-all duration-300 hover:shadow-xl relative group ${
            isSpecialOffer ? 'ring-2 ring-red-500 ring-offset-2' : ''
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <CardHeader className={`${filters.view === 'grid' ? 'p-0' : 'p-4'} relative`}>
            <div className="relative w-full h-48 md:h-64 overflow-hidden">
              <img
                src={product?.images[0] || '/placeholder.svg'}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className={`absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 transition-opacity duration-300 ${isHovered ? 'opacity-100' : ''}`}>
                <div className="flex items-center gap-2">
                  <Eye className="text-white w-6 h-6" />
                  <span className="text-white font-medium">Quick View</span>
                </div>
              </div>
            </div>
            <div className="absolute top-2 right-2 flex flex-col gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
                      onClick={(e) => toggleWishlist(product._id, e)}
                    >
                      <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
            {product.stock === 0 && (
              <Badge variant="destructive" className="absolute top-2 left-2">
                Out of Stock
              </Badge>
            )}
            {product.stock > 0 && product.stock <= 5 && (
              <Badge variant="secondary" className="absolute top-2 left-2">
                Only {product.stock} left
              </Badge>
            )}
            {isSpecialOffer && (
              <Badge variant="secondary" className="absolute bottom-2 left-2 bg-red-500 text-white">
                <Percent className="w-4 h-4 mr-1" />
                {product.discountPercentage}% OFF
              </Badge>
            )}
          </CardHeader>
          <CardContent className={`flex-grow p-4 ${filters.view === 'list' ? 'flex-1' : ''}`}>
            <div className="space-y-2">
              <Badge variant="outline" className="mb-2">
                {product.category}
              </Badge>
              <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors duration-300">
                {product.name}
                <ArrowUpRight className="inline-block w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              {product.brand && (
                <p className="text-sm text-muted-foreground">{product.brand}</p>
              )}
              <div className="flex items-center gap-2">
                {isSpecialOffer ? (
                  <>
                    <p className="text-xl font-bold text-red-500">₹{product.discountedPrice?.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground line-through">₹{product.price.toFixed(2)}</p>
                  </>
                ) : (
                  <p className="text-xl font-bold text-primary">₹{product.price.toFixed(2)}</p>
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
          <CardFooter className={`p-4 ${filters.view === 'list' ? 'self-end' : ''}`}>
            {isAuthenticated ? (
              <Button
                className={`w-full group relative overflow-hidden ${
                  isSpecialOffer ? 'bg-red-500 hover:bg-red-600' : ''
                }`}
                onClick={(e) => handleAddToCart(product, e)}
                disabled={product.stock === 0}
              >
                <span className="absolute inset-0 bg-white/20 group-hover:translate-y-0 translate-y-full transition-transform duration-300" />
                <ShoppingCart className="mr-2 h-4 w-4" />
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </Button>
            ) : (
              <Button
                className={`w-full group relative overflow-hidden ${
                  isSpecialOffer ? 'bg-red-500 hover:bg-red-600' : ''
                }`}
                onClick={() => navigate('/signin')}
                disabled={product.stock === 0}
              >
                <span className="absolute inset-0 bg-white/20 group-hover:translate-y-0 translate-y-full transition-transform duration-300" />
                {product.stock > 0 ? 'Sign in to Buy' : 'Out of Stock'}
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
        <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-4xl font-bold">
              {filters.category 
                ? `${filters.category?.toUpperCase()} - ${filters.subcategory || 'All'}`
                : 'All Products'
              }
            </h1>
            <p className="text-muted-foreground mt-2">
              Discover our curated collection of premium products
            </p>
          </div>
          <div className="flex items-center gap-4 self-stretch lg:self-center">
            <Button
              variant="outline"
              className="lg:hidden"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
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
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Section */}
          <div className="lg:w-1/4">
            <AnimatePresence>
              {(isFilterOpen || window.innerWidth >= 1024) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="sticky top-20">
                    <ProductFilter categories={categories} brands={[]} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Products Section */}
          <div className="lg:w-3/4">
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">
                Showing {products.length} of {pagination.totalItems} products
              </p>
            </div>

            {status === 'loading' ? (
              <div className={filters.view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
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
            ) : (
              <div className={filters.view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                {products.map((product) => (
                  <ProductCard key={product._id || product.name} product={product} />
                ))}
              </div>
            )}

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
    </div>
  )
}
