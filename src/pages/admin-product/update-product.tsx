'use client';

import { useState, useEffect, useCallback } from 'react';
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
  Form
} from '../../components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Loader2 } from 'lucide-react';
import showToast from '../../utils/toast/toastUtils';
import { updateProductThunk } from '../../store/productSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { ProductFormValues, productSchema } from '../../utils/schemas/productSchema';
import { fetchProductDetails } from '../../store/productDetailSlice';
import { useNavigate } from 'react-router-dom';

export default function UpdateProductPage({ productId }: { productId: string }) {
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useAppDispatch();
  const router = useNavigate();
  const { item: product, status, error } = useAppSelector((state) => state.productDetails);

  // Initialize the form
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      brand: '',
      description: '',
      price: '',
      category: '',
      stock: '',
      weight: '',
      images: undefined,
    },
  });

  // Fetch product details
  const fetchDetails = useCallback(() => {
    console.log("Fetching product details...");
    dispatch(fetchProductDetails(productId));
  }, [dispatch, productId]);

  useEffect(() => {
    console.log('Fetching product details for ID:', productId);
    fetchDetails();
  }, [fetchDetails, productId]);

  useEffect(() => {
    if (product) {
      form.reset({
        ...product,
        price: product.price.toString(),
        stock: product.stock.toString(),
        weight: product.weight?.toString(),
        images: undefined, // Reset images to avoid validation
      });
      setPreviewImages(product.images || []);
    }
  }, [product, form.reset]);

  // Submit handler
  const onSubmit = async (values: ProductFormValues) => {
    console.log("onSubmit called");

    if (isSubmitting) return; // Prevent multiple submissions
    setIsSubmitting(true);

    const updatedProduct = {
      ...values,
      _id: productId,
      price: parseFloat(values.price),
      stock: parseInt(values.stock, 10),
      weight: parseInt(values.weight, 10),
      images: product?.images || [], // Use existing images if not updated
    };

    try {
      console.log("Dispatching update...");
      await dispatch(updateProductThunk(updatedProduct)).unwrap();
      showToast('Product updated successfully!', 'success');
      setIsSubmitting(false);
      router('/products');
    } catch (err) {
      console.error("Error during dispatch:", err);
      setIsSubmitting(false);
      showToast(`Failed to update product: ${err}`, 'error');
    }
  };

  // Handle loading, error, and no product found states
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
            {/* Product Name */}
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

            {/* Brand */}
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

            {/* Description */}
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

            {/* Price */}
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

            {/* Category */}
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

            {/* Stock */}
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

            {/* Weight */}
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight (in grams)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter product weight" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Preview Images */}
            {previewImages.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {previewImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Submit Button */}
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
