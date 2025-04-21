
import { X } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { ProductFormValues } from '../../../utils/schemas/productSchema';

interface ProductImageUploadProps {
  form: UseFormReturn<ProductFormValues>;
  previewImages: string[];
  handleImageUpload: (files: FileList | null) => void;
  removeImage: (index: number) => void;
}

export function ProductImageUpload({
  form,
  previewImages,
  handleImageUpload,
  removeImage,
}: ProductImageUploadProps) {
  return (
    <>
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
    </>
  );
}