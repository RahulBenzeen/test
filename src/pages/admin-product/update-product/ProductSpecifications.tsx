
import { Input } from '../../../components/ui/input';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { ProductFormValues } from '../../../utils/schemas/productSchema';


interface ProductSpecificationsProps {
  form: UseFormReturn<ProductFormValues>;
}

export function ProductSpecifications({ form }: ProductSpecificationsProps) {
  return (
    <>
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
    </>
  );
}