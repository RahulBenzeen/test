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

interface ImageInfo {
  url: string;
  isExisting: boolean;
  public_id?: string;
  file?: File;
}

interface ProductImageUploadProps {
  form: UseFormReturn<ProductFormValues>;
  images: ImageInfo[];
  onImagesChange: (images: ImageInfo[]) => void;
}

export function ProductImageUpload({
  form,
  images,
  onImagesChange,
}: ProductImageUploadProps) {
  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;

    const remainingSlots = 5 - images.length;
    const filesToAdd = Array.from(files).slice(0, remainingSlots);

    filesToAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImagesChange([
          ...images,
          {
            url: reader.result as string,
            isExisting: false,
            file
          }
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
    
    // If no images left, reset the form field
    if (newImages.length === 0) {
      const dataTransfer = new DataTransfer();
      form.setValue('images', dataTransfer.files);
    }
  };

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
                    handleImageUpload(files);
                    // Only update form value for new files
                    field.onChange(files);
                  }
                }}
                disabled={images.length >= 5}
                className={images.length > 0 ? 'file:bg-primary/10' : 'file:bg-primary'}
              />
            </FormControl>
            <FormDescription className="flex items-center justify-between">
              <span>Upload up to 5 product images (max 5MB each, .jpg, .jpeg, .png, or .webp)</span>
              <span className="text-sm text-muted-foreground">
                {images.length} of 5 images used
              </span>
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image.url}
                alt={`Product ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <X className="h-4 w-4" />
              </Button>
              {image.isExisting && (
                <div className="absolute bottom-2 left-2 bg-primary/80 text-primary-foreground text-xs px-2 py-1 rounded">
                  Existing
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}