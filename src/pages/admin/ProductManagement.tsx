'use client'

import { useEffect, useState } from 'react'
import { Button } from '../../components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Edit, Trash2, Plus, X, ChevronLeft, ChevronRight, ImageIcon, Upload, ArrowLeft, Loader2 } from 'lucide-react'
import AddProduct from '../admin-product/add-product'
import UpdateProductPage from '../admin-product/update-product'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts, deleteProductThunk, updateProductThunk } from '../../store/productSlice'
import { RootState, AppDispatch } from '../../store/store'
import { Input } from '../../components/ui/input'

interface Product {
  _id: string
  name: string
  price: number
  stock: number
  images: string[] // Array of base64 encoded images
}

export default function ProductManagement() {
  const dispatch = useDispatch<AppDispatch>()
  const { items: products, status } = useSelector((state: RootState) => state.products)
  const [view, setView] = useState<'list' | 'add' | 'edit'>('list')
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; productId: string | null }>({
    isOpen: false,
    productId: null,
  })
  const [imagePreview, setImagePreview] = useState<{ productId: string | null; index: number | null }>({
    productId: null,
    index: null,
  })
  const [isEditingImage, setIsEditingImage] = useState(false)

  useEffect(() => {
    dispatch(fetchProducts({ page: 1, limit: 12 }))
  }, [dispatch])

  const handleAddProduct = (newProduct: Omit<Product, '_id'>) => {
    // handle adding product logic here
  }

  const openDeleteConfirmation = (id: string) => {
    setDeleteConfirmation({ isOpen: true, productId: id })
  }

  const closeDeleteConfirmation = () => {
    setDeleteConfirmation({ isOpen: false, productId: null })
  }

  const handleDeleteProduct = () => {
    if (deleteConfirmation.productId) {
      console.log('Deleting product with id:', deleteConfirmation.productId)
      dispatch(deleteProductThunk(deleteConfirmation.productId))
      closeDeleteConfirmation()
    }
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setView('edit')
  }

  const handleUpdateProduct = (updatedProduct: Product) => {
    dispatch(updateProductThunk(updatedProduct))
    setView('list')
    setEditingProduct(null)
  }

  const openImagePreview = (productId: string, index: number = 0) => {
    setImagePreview({ productId, index })
  }

  const closeImagePreview = () => {
    setImagePreview({ productId: null, index: null })
    setIsEditingImage(false)
  }

  const showNextImage = () => {
    if (imagePreview.productId && imagePreview.index !== null) {
      const product = products.find(p => p._id === imagePreview.productId)
      if (product) {
        setImagePreview(prev => ({
          ...prev,
          index: (prev.index! + 1) % product.images.length
        }))
      }
    }
  }

  const showPrevImage = () => {
    if (imagePreview.productId && imagePreview.index !== null) {
      const product = products.find(p => p._id === imagePreview.productId)
      if (product) {
        setImagePreview(prev => ({
          ...prev,
          index: (prev.index! - 1 + product.images.length) % product.images.length
        }))
      }
    }
  }

  const handleImageEdit = () => {
    setIsEditingImage(true)
  }

  const handleImageUpdate = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && imagePreview.productId && imagePreview.index !== null) {
      const base64 = await convertToBase64(file)
      const product = products.find(p => p._id === imagePreview.productId)
      if (product) {
        const updatedImages = [...product.images]
        updatedImages[imagePreview.index] = base64 as string
        const updatedProduct = { ...product, images: updatedImages }
        dispatch(updateProductThunk(updatedProduct))
        setIsEditingImage(false)
      }
    }
  }

  const convertToBase64 = (file: File): Promise<string | ArrayBuffer | null> => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.readAsDataURL(file)
      fileReader.onload = () => {
        resolve(fileReader.result)
      }
      fileReader.onerror = (error) => {
        reject(error)
      }
    })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center">
          {view !== 'list' && (
            <Button variant="ghost" size="icon" onClick={() => setView('list')} className="mr-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <CardTitle>{view === 'list' ? 'Product Management' : view === 'add' ? 'Add Product' : 'Edit Product'}</CardTitle>
        </div>
        {view === 'list' && (
          <Button onClick={() => setView('add')}>
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {status === 'loading' ? (
    
              <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
        
        ) : (
          view === 'list' && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>₹{product.price?.toFixed(2) || 0}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      {product.images.length > 0 ? (
                        <div className="relative w-16 h-16 group">
                          <img
                            src={product.images[0]}
                            alt={`${product.name} - 1`}
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() => openImagePreview(product._id)}
                          />
                          {product.images.length > 1 && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-white"
                                onClick={() => openImagePreview(product._id)}
                              >
                                <ImageIcon className="mr-2 h-4 w-4" />
                                View All
                              </Button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span>No image</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => handleEditProduct(product)} className="mr-2">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openDeleteConfirmation(product._id)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )
        )}
        {view === 'add' && <AddProduct onAddProduct={handleAddProduct} onCancel={() => setView('list')} />}
        {view === 'edit' && editingProduct && (
          <UpdateProductPage
            productId={editingProduct._id}
            onUpdateProduct={handleUpdateProduct}
            onCancel={() => setView('list')}
          />
        )}
      </CardContent>

      <Dialog open={deleteConfirmation.isOpen} onOpenChange={closeDeleteConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete this product?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the product from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={closeDeleteConfirmation}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={imagePreview.productId !== null} onOpenChange={closeImagePreview}>
        <DialogContent className="max-w-screen-lg max-h-screen flex flex-col items-center justify-center">
          <DialogHeader className="w-full flex justify-between items-center">
            <DialogTitle>Product Images</DialogTitle>
            <Button variant="ghost" size="icon" onClick={closeImagePreview}>
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          <DialogDescription className="w-full">
            {imagePreview.productId !== null && imagePreview.index !== null && (
              <>
                <div className="flex justify-center mb-4 relative">
                  <img
                    src={products.find(p => p._id === imagePreview.productId)?.images[imagePreview.index!]}
                    alt="Product"
                    className="max-w-full max-h-96 object-contain"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={showPrevImage}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={showNextImage}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </div>
                <div className="flex justify-center space-x-2 mt-4">
                  {products.find(p => p._id === imagePreview.productId)?.images.map((_, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className={`w-8 h-8 p-0 ${index === imagePreview.index ? 'bg-primary text-primary-foreground' : ''}`}
                      onClick={() => setImagePreview(prev => ({ ...prev, index }))}
                    >
                      {index + 1}
                    </Button>
                  ))}
                </div>
                <div className="flex justify-center mt-4">
                  {isEditingImage ? (
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpdate}
                      className="w-full max-w-xs"
                    />
                  ) : (
                    <Button onClick={handleImageEdit}>
                      <Upload className="mr-2 h-4 w-4" />
                      Edit Image
                    </Button>
                  )}
                </div>
              </>
            )}
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </Card>
  )
}