'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Textarea } from "../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { X, Loader2 } from 'lucide-react'
import showToast from '../../utils/toast/toastUtils'
import { updateProductThunk } from '../../store/productSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { ProductFormValues, productSchema } from '../../utils/schemas/productSchema'
import { fetchProductDetails } from '../../store/productDetailSlice'

export default function UpdateProductPage({ productId }: { productId: string }) {
  const [previewImages, setPreviewImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const dispatch = useAppDispatch()
  const { item: product, status, error } = useAppSelector((state) => state.productDetails)

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      brand: "",
      description: "",
      price: "",
      category: "",
      stock: "",
      images: undefined,
    },
  })

  useEffect(() => {
    dispatch(fetchProductDetails(productId))
  }, [dispatch, productId])

  useEffect(() => {
    if (product) {
      form.reset({
        ...product,
        price: product.price.toString(),
        stock: product.stock.toString(),
        images: undefined,
      })
      setPreviewImages(product.images)
    }
  }, [product, form])

  function onSubmit(values: ProductFormValues) {
    setIsSubmitting(true)
    const updatedProduct = {
      ...values,
      id: productId,
      price: parseFloat(values.price),
      stock: parseInt(values.stock), 
      images: previewImages,
    };
  
    dispatch(updateProductThunk(updatedProduct))
      .unwrap()
      .then(() => {
        showToast("Product updated successfully!", 'success');
      })
      .catch((error) => {
        showToast(`Failed to update product: ${error}`, 'error');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  const handleImageUpload = (files: FileList | null) => {
    if (files) {
      const newPreviewImages: string[] = []
      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          newPreviewImages.push(reader.result as string)
          if (newPreviewImages.length === files.length) {
            setPreviewImages((prev) => [...prev, ...newPreviewImages].slice(0, 5))
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeImage = (index: number) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index))
    const currentImages = form.getValues('images')
    if (currentImages instanceof FileList) {
      const dataTransfer = new DataTransfer()
      Array.from(currentImages).forEach((file, i) => {
        if (i !== index) dataTransfer.items.add(file)
      })
      form.setValue('images', dataTransfer.files)
    }
  }

  if (status === 'loading') {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  if (status === 'failed') {
    return <div className="text-center text-red-500 mt-8">Error: {error}</div>
  }

  if (!product) {
    return <div className="text-center mt-8">Product not found</div>
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Update Product</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product brand" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter product description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="Enter price" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="clothing">Clothing</SelectItem>
                      <SelectItem value="home">Home & Garden</SelectItem>
                      <SelectItem value="books">Books</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter available stock"
                      min="0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Images</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files) {
                          field.onChange(files);
                          handleImageUpload(files);
                        }
                      }}
                      name={field.name}
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormDescription>
                    Upload up to 5 product images (max 5MB each, .jpg, .jpeg, .png, or .webp)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {previewImages.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {previewImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img src={image} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => window.history.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating Product...
                  </>
                ) : (
                  'Update Product'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

