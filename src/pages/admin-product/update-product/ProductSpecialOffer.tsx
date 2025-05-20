
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { ProductFormValues } from '../../../utils/schemas/productSchema';

interface ProductSpecialOfferProps {
  form: UseFormReturn<ProductFormValues>;
}

export function ProductSpecialOffer({ form }: ProductSpecialOfferProps) {
  return (
    <>
    <FormField
      control={form.control}
      name="bundle"
      render={({ field }) => (
    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
      <div className="space-y-0.5">
        <FormLabel className="text-base">Bundle Product</FormLabel>
        <FormDescription>
          Toggle if this product is on bundle offer.
        </FormDescription>
      </div>
      <FormControl>
        <Switch
          checked={field.value} // Ensure that field.value is a boolean (true/false)
          onCheckedChange={(checked) => field.onChange(checked)} // onChange should handle the switch state change
        />
      </FormControl>
    </FormItem>
  )}
/>
    <FormField
      control={form.control}
      name="gift"
      render={({ field }) => (
    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
      <div className="space-y-0.5">
        <FormLabel className="text-base">Gift Product</FormLabel>
        <FormDescription>
          Toggle if this product is on gift offer.
        </FormDescription>
      </div>
      <FormControl>
        <Switch
          checked={field.value} // Ensure that field.value is a boolean (true/false)
          onCheckedChange={(checked) => field.onChange(checked)} // onChange should handle the switch state change
        />
      </FormControl>
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
    </>
  );
}