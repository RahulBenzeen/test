'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
  FormDescription,
} from '../../components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Switch } from '../../components/ui/switch';
import { X, Loader2 } from 'lucide-react';
import showToast from '../../utils/toast/toastUtils';
import { Product, updateProductThunk } from '../../store/productSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { ProductFormValues, productSchema } from '../../utils/schemas/productSchema';
import { fetchProductDetails } from '../../store/productDetailSlice';
import { useNavigate } from 'react-router-dom';

const categories = [
  { value: 'electronics', label: 'Electronics', subcategories: ['Smartphones', 'Laptops', 'Accessories'] },
  { value: 'clothing', label: 'Clothing', subcategories: ['Men', 'Women', 'Kids'] },
  { value: 'home', label: 'Home & Garden', subcategories: ['Furniture', 'Decor', 'Kitchen'] },
  { value: 'books', label: 'Books', subcategories: ['Fiction', 'Non-fiction', 'Educational'] },
];


interface UpdateProductPageProps {
  productId: string;
  onUpdateProduct: (updatedProduct: Product) => void;
  onCancel: () => void;

}

export default function UpdateProductPage({ productId, onUpdateProduct}: UpdateProductPageProps) {
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const dispatch = useAppDispatch();
  const router = useNavigate();
  const { item: product, status, error } = useAppSelector((state) => state.productDetails);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      brand: '',
      description: '',
      price: '',
      category: '',
      subcategory: '',
      stock: '',
      weight: '',
      dimensions: '',
      isSpecialOffer: false,
      discountPercentage: '',
    },
  });

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductDetails(productId));
    }
  }, [dispatch, productId]);

  useEffect(() => {
    if (product) {
      const formValues = {
        name: product.name || '',
        brand: product.brand || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        category: product.category || '',
        subcategory: product.subcategory || '',
        stock: product.stock?.toString() || '',
        weight: product.weight?.toString() || '',
        dimensions: product.dimensions || '',
        isSpecialOffer: product.isSpecialOffer || false,
        discountPercentage: product.discountPercentage?.toString() || '',
      };
      
      form.reset(formValues);
      setPreviewImages(product.images.map(images => images.secure_url) || []);
      setSelectedCategory(product.category || '');
    }
  }, [product, form]);

  useEffect(() => {
    if (selectedCategory) {
      const subcategories = categories.find(cat => cat.value === selectedCategory)?.subcategories || [];
      if (subcategories.length > 0 && !form.getValues('subcategory')) {
        form.setValue('subcategory', subcategories[0]);
      }
    }
  }, [selectedCategory, form]);

  const handleImageUpload = (files: FileList | null) => {
    if (files) {
      const newPreviewImages: string[] = [];
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviewImages.push(reader.result as string);
          if (newPreviewImages.length === files.length) {
            setPreviewImages((prev) => [...prev, ...newPreviewImages].slice(0, 5));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const deleteCloodinaryImage = async (publicId: string) => {
    
  }

  const onSubmit = async (values: ProductFormValues) => {
    try {
      setIsSubmitting(true);

      const updatedProduct = {
        _id: productId,
        ...values,
        id: productId,
        price: parseFloat(values.price),
        stock: parseInt(values.stock),
        weight: values.weight ? parseFloat(values.weight) : undefined,
        images: previewImages,
        discountPercentage: values.isSpecialOffer && values.discountPercentage ? parseFloat(values.discountPercentage) : undefined,
      };

      await dispatch(updateProductThunk(updatedProduct)).unwrap();
      showToast('Product updated successfully!', 'success');
      onUpdateProduct(updatedProduct);
    } catch (err) {

      showToast(`Failed to update product: ${err}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (status === 'failed') {
    return <div className="text-center text-red-500 mt-8">Error: {error}</div>;
  }

  if (!product) {
    return <div className="text-center mt-8">Product not found</div>;
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
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedCategory(value);
                      form.setValue('subcategory', '');
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subcategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subcategory</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subcategory" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories
                        .find((cat) => cat.value === selectedCategory)
                        ?.subcategories.map((sub) => (
                          <SelectItem key={sub} value={sub}>
                            {sub}
                          </SelectItem>
                        ))}
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
                    <Input type="number" placeholder="Enter available stock" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight (in kg)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="Enter weight" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dimensions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dimensions (L x W x H in cm)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 10 x 5 x 2" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isSpecialOffer"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Special Product</FormLabel>
                    <FormDescription>
                      Toggle if this product is on special offer.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {form.watch("isSpecialOffer") && (
              <FormField
                control={form.control}
                name="discountPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount Percentage</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Enter discount percentage"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter a discount percentage (e.g., 10 for 10%).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

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
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
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
              <Button type="button" variant="outline" onClick={() => router('/products')}>
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
  );
}