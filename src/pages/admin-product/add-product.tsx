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
import { ProductImageUpload } from './update-product/ProductImageUpload';;
import { addProductThunk, Product } from '../../store/productSlice';
import { useAppDispatch } from '../../store/hooks';
import showToast from '../../utils/toast/toastUtils';
import { uploadToCloudinary } from '../../utils/ProductImageUpload/cloudanary';
import { ProductFormValues, productSchema } from '../../utils/schemas/productSchema';

const categories = [
  { value: 'electronics', label: 'Electronics', subcategories: ['Smartphones', 'Laptops', 'Accessories'] },
  { value: 'clothing', label: 'Clothing', subcategories: ['Men', 'Women', 'Kids'] },
  { value: 'home', label: 'Home & Garden', subcategories: ['Furniture', 'Decor', 'Kitchen'] },
  { value: 'books', label: 'Books', subcategories: ['Fiction', 'Non-fiction', 'Educational'] },
];

interface AddProductPageProps {
  onAddProduct: (newProduct: Omit<Product, "_id">) => void;
  onCancel: () => void;
}

export default function AddProductPage({ onAddProduct, onCancel }: AddProductPageProps) {
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const dispatch = useAppDispatch();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      brand: "",
      description: "",
      price: "",
      category: "",
      subcategory: "",
      stock: "",
      weight: "",
      dimensions: "",
      isSpecialOffer: false,
      discountPercentage: "",
      bundle: false,
      gift: false,
    },
  });

  useEffect(() => {
    if (selectedCategory) {
      const subcategories = categories.find(cat => cat.value === selectedCategory)?.subcategories || [];
      if (subcategories.length > 0) {
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
    const currentImages = form.getValues('images');
    if (currentImages instanceof FileList) {
      const dataTransfer = new DataTransfer();
      Array.from(currentImages).forEach((file, i) => {
        if (i !== index) dataTransfer.items.add(file);
      });
      form.setValue('images', dataTransfer.files);
    }
  };

  const onSubmit = async (values: ProductFormValues) => {
    try {
      setIsSubmitting(true);

      const imageData = await Promise.all(
        uploadedFiles.map(file => uploadToCloudinary(file))
      );

      const product = {
        ...values,
        price: parseFloat(values.price),
        stock: parseInt(values.stock),
        weight: parseFloat(values.weight),
        images: imageData,
        discountPercentage: values.isSpecialOffer && values.discountPercentage ? parseFloat(values.discountPercentage) : undefined,
      };

      await dispatch(addProductThunk(product)).unwrap();
      showToast("Product Added Successfully", "success");
      onAddProduct(product);
      form.reset();
      setPreviewImages([]);
    } catch {
      showToast("Failed to add product", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Product</CardTitle>
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
                    Adding Product...
                  </>
                ) : (
                  'Add Product'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}