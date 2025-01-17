'use client'

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Separator } from "../../components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { 
  Star, 
  Truck, 
  RefreshCcw, 
  Loader2, 
  Share2, 
  Shield,
  Heart,
  ArrowLeft,
  Package,
  ShoppingCart
} from 'lucide-react'
import { motion } from "framer-motion"
import { Badge } from "../../components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip"
import showToast from '../../utils/toast/toastUtils'
import { Product } from '../../store/productSlice'
import { fetchProductDetails } from '../../store/productDetailSlice'
import { addToCartAsync } from '../../store/cartSlice'
import SimilarProducts from '../similarProduct/similarProduct'
import ReviewPage from '../ReviewPage/ReviewPage'

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const { item: product, status, error } = useAppSelector((state) => state.productDetails)
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id))
    }
  }, [dispatch, id])

  const handleAddToCart = async (product: Product) => {
    if (product) {
      try {
        const resultAction = await dispatch(addToCartAsync({ ...product }))
        if (addToCartAsync.fulfilled.match(resultAction)) {
          showToast("Product added to cart successfully!", "success")
        } else {
          showToast("Failed to add product to cart. Please try again.", "error")
        }
      } catch (error) {
        console.error("Unexpected error:", error)
        showToast("An unexpected error occurred. Please try again.", "error")
      }
    }
  }

  const handleShare = async (platform: string, product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const productUrl = window.location.href;
    const shareText = `Check out ${product.name}`;
  
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: shareText,
          url: productUrl,
        });
        showToast('Product shared successfully!', 'success');
      } catch (err) {
        showToast(`Error sharing: ${err}`, 'error');
      }
    } else {
      // Fallback for unsupported browsers
      switch (platform) {
        case 'whatsapp':
          window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + productUrl)}`, '_blank');
          break;
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`, '_blank');
          break;
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
          break;
        case 'copy':
          navigator.clipboard.writeText(productUrl)
            .then(() => showToast('Product link copied to clipboard!', 'success'))
            .catch(() => showToast('Failed to copy link. Please try again.', 'error'));
          break;
        default:
          showToast('Unsupported sharing platform', 'error');
      }
    }
  };
  
  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    showToast(
      isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      "success"
    )
  }

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Loading product details...</p>
      </div>
    )
  }

  if (status === 'failed') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-destructive text-center">
          <p className="text-lg font-semibold mb-2">Error loading product</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-lg font-semibold">Product not found</p>
        <Button onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    )
  }

  const isSpecialOffer = product.discountedPrice && product.discountedPrice < product.price

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >

        <Card className="overflow-hidden mb-8 shadow-lg">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Image Gallery */}
            <div className="p-6">
              <div className="relative mb-4 group rounded-lg overflow-hidden">
                <motion.img 
                  src={product.images[selectedImageIndex].secure_url} 
                  alt={`${product.name} - View ${selectedImageIndex + 1}`} 
                  className="w-full h-auto object-cover rounded-lg"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                />
                {isSpecialOffer && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-1 rounded-lg text-sm font-semibold shadow-md">
                    {/* <Percent className="h-4 w-4 mr-1" /> */}
                    {Math.round((1 - ((product.discountedPrice ?? product.price) / product.price)) * 100)}% OFF
                  </div>
                )}
              </div>
              <div className="flex gap-2 justify-center">
                {product.images.map((image, index) => (
                  <motion.img 
                    key={image.public_id}
                    src={image.secure_url} 
                    alt={`${product.name} - Thumbnail ${index + 1}`} 
                    className={`w-16 h-16 object-cover rounded-md cursor-pointer border-2 ${
                      index === selectedImageIndex ? 'border-primary scale-105' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                    whileHover={{ scale: 1.05 }}
                  />
                ))}
              </div>
            </div>

              {/* Product Info */}
              <div className="p-6 flex flex-col justify-between">
                <div>
                <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <div className="flex items-center gap-2 ml-auto"> {/* Align items to the right */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={toggleWishlist}
                          className="hover:bg-transparent"
                        >
                          <Heart
                            className={`h-6 w-6 transition-colors duration-300 ${
                              isWishlisted ? 'fill-red-500 text-red-500' : 'hover:text-red-500'
                            }`}
                          />
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
                            variant="ghost"
                            onClick={(e) => handleShare('copy', product, e)}
                            className="hover:bg-transparent"
                          >
                            <Share2 className="w-5 h-5 text-primary" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Share Product</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating || 0) 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                        }`} 
                      />
                    ))}
                    <span className="ml-2 text-sm text-muted-foreground">
                      ({product.rating || 0} ratings)
                    </span>
                  </div>

                  <div className="mb-6">
                    {isSpecialOffer ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl font-bold text-red-500">
                            ₹{product.discountedPrice?.toFixed(2)}
                          </span>
                          <span className="text-xl text-muted-foreground line-through">
                            ₹{product.price.toFixed(2)}
                          </span>
                        </div>
                        <p className="text-sm text-green-600 font-medium">
                          You save: ₹{(product.price - (product.discountedPrice ?? 0)).toFixed(2) }
                        </p>
                      </div>
                    ) : (
                      <span className="text-3xl font-bold">
                        ₹{product.price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <div className="prose prose-sm max-w-none mb-6">
                    <p className="text-muted-foreground">{product.description}</p>
                  </div>

                  {/* Stock Status */}
                  <div className="mb-6">
                    <Badge 
                      variant={product.stock > 5 ? "secondary" : product.stock > 0 ? "outline" : "destructive"}
                      className="text-sm"
                    >
                      {product.stock > 5 
                        ? "In Stock" 
                        : product.stock > 0 
                        ? `Only ${product.stock} left` 
                        : "Out of Stock"}
                    </Badge>
                  </div>
                </div>

                {/* Purchase Section */}
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-1">
                      <Label htmlFor="quantity" className="text-sm font-medium">
                        Quantity
                      </Label>
                      <div className="flex items-center mt-1">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          disabled={quantity <= 1}
                        >
                          -
                        </Button>
                        <Input
                          id="quantity"
                          type="number"
                          min="1"
                          max={product.stock}
                          value={quantity}
                          onChange={(e) => setQuantity(Number(e.target.value))}
                          className="w-20 text-center mx-2"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                          disabled={quantity >= product.stock}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    <div className="flex-1">
                      <Label className="text-sm font-medium">
                        Total Price
                      </Label>
                      <p className="text-2xl font-bold mt-1">
                        ₹{((product.discountedPrice || product.price) * quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {isAuthenticated ? (
                    <Button 
                      onClick={() => handleAddToCart(product)} 
                      className={`w-full mb-4 text-lg py-6 ${
                        isSpecialOffer ? 'bg-red-500 hover:bg-red-600' : ''
                      }`}
                      disabled={product.stock === 0}
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Add to Cart
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => navigate('/signin')} 
                      className="w-full mb-4 text-lg py-6"
                    >
                      Sign In to Buy
                    </Button>
                  )}

                  <Separator className="my-6" />

                  {/* Product Features */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <Truck className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">Free Delivery</p>
                        <p className="text-muted-foreground">2-3 business days</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <RefreshCcw className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">Easy Returns</p>
                        <p className="text-muted-foreground">30-day policy</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">Secure Payment</p>
                        <p className="text-muted-foreground">SSL encrypted</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Package className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">Genuine Product</p>
                        <p className="text-muted-foreground">100% authentic</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Details Tabs */}
        <Tabs defaultValue="description" className="mb-8">
          <TabsList className="w-full justify-start border-b">
            <TabsTrigger value="description" className="text-lg">
              Description
            </TabsTrigger>
            <TabsTrigger value="specifications" className="text-lg">
              Specifications
            </TabsTrigger>
            <TabsTrigger value="reviews" className="text-lg">
              Reviews
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-4">
            <Card>
              <CardContent className="p-6">
                <div className="prose prose-sm max-w-none">
                  <h2 className="text-2xl font-bold mb-4">Product Description</h2>
                  <p className="text-muted-foreground">{product.description}</p>
                  
                  {/* Key Features */}
                  <div className="mt-6">
                    <h3 className="text-xl font-semibold mb-3">Key Features</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      {product.features?.map((feature, index) => (
                        <li key={index} className="text-muted-foreground">
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specifications" className="mt-4">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Technical Specifications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications || {}).map(([key, value]) => (
                    <div key={key} className="flex border-b border-border py-2">
                      <span className="font-medium w-1/3">{key}</span>
                      <span className="text-muted-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Customer Reviews</h2>
                  {isAuthenticated && (
                    <Button>Write a Review</Button>
                  )}
                </div>
                <ReviewPage />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Similar Products */}
        <Card className="mb-8 shadow-lg">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">Similar Products</h2>
            <SimilarProducts currentProductId={product._id} />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}