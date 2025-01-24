
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { ProductFormValues } from '../../../utils/schemas/productSchema';

interface ProductCategoriesProps {
  form: UseFormReturn<ProductFormValues>;
  categories: Array<{
    value: string;
    label: string;
    subcategories: string[];
  }>;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export function ProductCategories({
  form,
  categories,
  selectedCategory,
  setSelectedCategory,
}: ProductCategoriesProps) {
  return (
    <>
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
    </>
  );
}