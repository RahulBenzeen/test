import { useGiftOfferForm } from '../../../hooks/useGiftOfferForm';
import { CardContent, CardFooter } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../../../components/ui/form';
import ProductSelector from './ProductSelector';
import { motion } from '../../../components/ui/motion';
import { useToast } from '../../../hooks/use-toast';
import { Slider } from '../../../components/ui/slider';
import { Badge } from '../../../components/ui/badge';
import { Card } from '../../../components/ui/card';

export default function GiftOfferForm() {
  const { form, onSubmit } = useGiftOfferForm();
  const { toast } = useToast();

  const handleSubmit = async (values: any) => {
    try {
      await onSubmit(values);
      toast({
        title: "Success!",
        description: "Gift offer has been saved successfully.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to save gift offer",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <CardContent className="p-6">
          <div className="grid lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Offer Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Summer Special Gift" {...field} />
                        </FormControl>
                        <FormDescription>
                          A descriptive name for your offer
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="minCartValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Cart Value</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="1000" {...field} />
                        </FormControl>
                        <FormDescription>
                          The minimum order amount to qualify for this offer
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-6">
                  {/* <FormField
                    control={form.control}
                    name="maxCartValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Cart Value (Optional)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="5000" {...field} />
                        </FormControl>
                        <FormDescription>
                          Leave blank for no upper limit
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}
                  
                  <FormField
                    control={form.control}
                    name="giftCount"
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>Number of Gift Items</FormLabel>
                        <div className="space-y-2">
                          <Slider
                            defaultValue={[value]}
                            max={5}
                            step={1}
                            onValueChange={([val]) => onChange(val)}
                            className="py-2"
                          />
                          <div className="flex justify-between">
                            {[1, 2, 3, 4, 5].map((num) => (
                              <Badge 
                                key={num} 
                                variant={value === num ? "default" : "outline"}
                                className={`cursor-pointer ${value === num ? '' : 'hover:bg-muted'}`}
                                onClick={() => onChange(num)}
                              >
                                {num}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <FormDescription>
                          How many gift items to offer
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="giftProducts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gift Products</FormLabel>
                    <FormControl>
                      <ProductSelector 
                        selectedProducts={field.value}
                        onChange={field.onChange}
                        maxSelections={form.watch("giftCount")}
                      />
                    </FormControl>
                    <FormDescription>
                      Select products to offer as gifts
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card className="bg-muted/20 overflow-hidden h-full">
                <div className="p-4 bg-muted/30 border-b">
                  <h3 className="font-medium">Offer Preview</h3>
                </div>
                <div className="p-4">
                  <div className="rounded-lg border bg-card p-4 text-card-foreground shadow">
                    <div className="flex flex-col gap-2">
                      <div className="text-lg font-semibold">{form.watch("name") || "Summer Special Gift"}</div>
                      <div className="text-sm text-muted-foreground">
                        Spend ₹{form.watch("minCartValue") || "1000"}
                        {/* {form.watch("maxCartValue") ? ` - ₹${form.watch("maxCartValue")}` : ""} */}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {Array(form.watch("giftCount") || 1).fill(0).map((_, i) => (
                          <div key={i} className="h-16 w-16 rounded-md bg-accent/40 flex items-center justify-center">
                            <span className="text-xs text-accent-foreground">Gift {i+1}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end gap-2 p-6 pt-0">
          <Button variant="outline" type="button">Cancel</Button>
          <Button type="submit">Save Gift Offer</Button>
        </CardFooter>
      </form>
    </Form>
  );
}