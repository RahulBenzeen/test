import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Textarea } from "../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { X } from 'lucide-react'

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_IMAGES = 5;

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Price must be a positive number.",
  }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  images: z
    .custom<FileList>((val) => val instanceof FileList, "Please upload at least one image.")
    .refine((files) => files.length > 0, "At least one image is required.")
    .refine((files) => files.length <= MAX_IMAGES, `You can upload up to ${MAX_IMAGES} images.`)
    .refine(
      (files) => Array.from(files).every((file) => file.size <= MAX_FILE_SIZE),
      `Each file size should be less than 5MB.`
    )
    .refine(
      (files) => Array.from(files).every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)),
      ".jpg, .jpeg, .png and .webp files are accepted."
    ),
})

// Mock product data
const mockProducts = [
  { id: 1, name: 'Smartphone X', description: 'A high-end smartphone with advanced features.', price: '999.99', category: 'electronics', images: [] },
  { id: 2, name: 'Laptop Pro', description: 'Powerful laptop for professionals.', price: '1499.99', category: 'electronics', images: [] },
  { id: 3, name: 'Wireless Earbuds', description: 'High-quality wireless earbuds with noise cancellation.', price: '149.99', category: 'electronics', images: [] },
  { id: 4, name: 'Smart Watch', description: 'Feature-packed smartwatch for fitness enthusiasts.', price: '299.99', category: 'electronics', images: [] },
]

type FormValues = z.infer<typeof formSchema>;

export default function UpdateProductPage() {
  const [selectedProduct, setSelectedProduct] = useState(mockProducts[0])
  const [previewImages, setPreviewImages] = useState<string[]>([])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...selectedProduct,
      images: undefined,
    },
  })

  useEffect(() => {
    form.reset({
      ...selectedProduct,
      images: undefined,
    })
    setPreviewImages([])
  }, [selectedProduct, form])

  function onSubmit(values: FormValues) {
    console.log({
      ...values,
      images: previewImages,
    })
    // Here you would typically send this data to your backend API
    alert("Product updated successfully!")
  }

  const handleProductChange = (productId: string) => {
    const product = mockProducts.find(p => p.id === parseInt(productId))
    if (product) {
      setSelectedProduct(product)
    }
  }

  const handleImageUpload = (files: FileList | null) => {
    if (files) {
      const newPreviewImages: string[] = []
      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          newPreviewImages.push(reader.result as string)
          if (newPreviewImages.length === files.length) {
            setPreviewImages((prev) => [...prev, ...newPreviewImages].slice(0, MAX_IMAGES))
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

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Update Product</CardTitle>
        </CardHeader>
        <CardContent>
          <Select onValueChange={handleProductChange} defaultValue={selectedProduct.id.toString()}>
            <SelectTrigger className="mb-6">
              <SelectValue placeholder="Select a product to update" />
            </SelectTrigger>
            <SelectContent>
              {mockProducts.map((product) => (
                <SelectItem key={product.id} value={product.id.toString()}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                      <Textarea {...field} />
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
                      <Input type="number" step="0.01" {...field} />
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
              <Button type="submit">Update Product</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}