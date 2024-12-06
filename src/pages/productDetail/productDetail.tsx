import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Separator } from "../../components/ui/separator"
import { Star, Truck, RefreshCcw, Loader2 } from 'lucide-react'
import showToast from '../../utils/toast/toastUtils'
import { Product } from '../../store/productSlice'
import { fetchProductDetails } from '../../store/productDetailSlice'
import { addToCartAsync } from '../../store/cartSlice'

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const { item: product, status, error } = useAppSelector((state) => state.productDetails)
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  console.log({product})
  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id))
    }
  }, [dispatch, id])

  const handleAddToCart = (product: Product) => {
    if (product) {
      dispatch(addToCartAsync(product))
      showToast("Product added to cart successfully!", "success")
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (status === 'failed') {
    return <div className="text-center text-red-500 mt-8">Error: {error}</div>
  }

  if (!product) {
    return <div className="text-center mt-8">Product not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6">
              <div className="mb-4">
                <img 
                  src={product.images[selectedImageIndex]} 
                  alt={`${product.name} - View ${selectedImageIndex + 1}`} 
                  className="w-full h-auto object-cover rounded-lg"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <img 
                    key={index}
                    src={image} 
                    alt={`${product.name} - Thumbnail ${index + 1}`} 
                    className={`w-full h-auto object-cover rounded-lg cursor-pointer border-2 ${
                      index === selectedImageIndex ? 'border-primary' : 'border-transparent'
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                  />
                ))}
              </div>
            </div>
            <div className="p-6 flex flex-col justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${i < Math.floor(product.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">({product.rating || 'N/A'})</span>
                </div>
                <p className="text-xl font-semibold mb-4">${product.price.toFixed(2)}</p>
                <p className="text-gray-600 mb-6">{product.description}</p>
              </div>
              <div>
                <div className="flex items-center mb-4">
                  <Label htmlFor="quantity" className="mr-2">Quantity:</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-20"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    {product.stock} available
                  </span>
                </div>
                <Button onClick={() => handleAddToCart(product)} className="w-full mb-4">
                  Add to Cart
                </Button>
                <Separator className="my-4" />
                <div className="flex justify-between text-sm text-gray-600">
                  <div className="flex items-center">
                    <Truck className="w-4 h-4 mr-1" />
                    Free Shipping
                  </div>
                  <div className="flex items-center">
                    <RefreshCcw className="w-4 h-4 mr-1" />
                    30-Day Returns
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

