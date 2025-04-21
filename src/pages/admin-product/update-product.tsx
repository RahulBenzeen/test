import  { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Loader2 } from 'lucide-react';
import { Form } from '../../components/ui/form';
import { ProductBasicInfo } from './update-product/ProductBasicInfo';
import { ProductCategories } from './update-product/ProductCategories';
import { ProductSpecifications } from './update-product/ProductSpecifications';
import { ProductSpecialOffer } from './update-product/ProductSpecialOffer';
import { ProductImageUpload } from './update-product/ProductImageUpload';
import showToast from '../../utils/toast/toastUtils';
import { Product, updateProductThunk } from '../../store/productSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { ProductFormValues, productSchema } from '../../utils/schemas/productSchema';
import { fetchProductDetails } from '../../store/productDetailSlice';
import { uploadAndUpdateImage } from '../../utils/ProductImageUpload/cloudnaryUtils';

const categories = [
  { value: 'electronics', label: 'Electronics', subcategories: ['Smartphones', 'Laptops', 'Accessories'] },
  { value: 'clothing', label: 'Clothing', subcategories: ['Men', 'Women', 'Kids'] },
  { value: 'home', label: 'Home & Garden', subcategories: ['Furniture', 'Decor', 'Kitchen'] },
  { value: 'books', label: 'Books', subcategories: ['Fiction', 'Non-fiction', 'Educational'] },
  { value: 'beauty', label: 'Beauty & Personal Care', subcategories: ['Makeup', 'Skincare', 'Hair', 'Fragrance', 'Bath', 'Grooming', 'Tools'] }
];

interface UpdateProductPageProps {
  productId: string;
  onUpdateProduct: (updatedProduct: Product) => void;
  onCancel: () => void;
}

export default function UpdateProductPage({
  productId,
  onUpdateProduct,
  onCancel,
}: UpdateProductPageProps) {
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<Array<{ secure_url: string; public_id: string }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const dispatch = useAppDispatch();

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
      setExistingImages(product.images || []);
      setPreviewImages(product.images.map(img => img.secure_url) || []);
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
      const newUploadedFiles: File[] = [];
      
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviewImages.push(reader.result as string);
          newUploadedFiles.push(file);
          if (newPreviewImages.length === files.length) {
            setPreviewImages((prev) => [...prev, ...newPreviewImages].slice(0, 5));
            setUploadedFiles((prev) => [...prev, ...newUploadedFiles].slice(0, 5));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (values: ProductFormValues) => {
    try {
      setIsSubmitting(true);

      const newImageData = await Promise.all(
        uploadedFiles.map(file => uploadAndUpdateImage(file))
      );

      const allImages = [...existingImages, ...newImageData];

      const updatedProduct = {
        _id: productId,
        ...values,
        id: productId,
        price: parseFloat(values.price),
        stock: parseInt(values.stock),
        weight: values.weight ? parseFloat(values.weight) : undefined,
        images: allImages,
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
            <ProductBasicInfo form={form} />
            <ProductCategories
              form={form}
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
            <ProductSpecifications form={form} />
            <ProductSpecialOffer form={form} />
            <ProductImageUpload
              form={form}
              previewImages={previewImages}
              handleImageUpload={handleImageUpload}
              removeImage={removeImage}
            />

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={onCancel}>
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