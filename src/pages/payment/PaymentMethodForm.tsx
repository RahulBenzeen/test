import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  paymentMethod: z.enum(["upi", "phonePe", "googlePay", "netbanking"]),
  upiId: z.string().optional(),
  bankName: z.string().optional(),
});

interface PaymentMethodFormProps {
  onSubmit: (values: z.infer<typeof formSchema>) => Promise<void>;
  totalAmount: number;
  isProcessing: boolean;
}

const paymentOptions = [
  { value: "upi", label: "UPI" },
  { value: "phonePe", label: "PhonePe" },
  { value: "googlePay", label: "Google Pay" },
  { value: "netbanking", label: "Netbanking" },
];

export function PaymentMethodForm({ onSubmit, totalAmount, isProcessing }: PaymentMethodFormProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paymentMethod: undefined,
      upiId: "",
      bankName: "",
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
        <CardDescription>Choose your preferred payment option</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedMethod(value);
                      }}
                      defaultValue={field.value}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                    >
                      {paymentOptions.map((option) => (
                        <div
                          key={option.value}
                          className={`flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-colors ${
                            field.value === option.value
                              ? "border-primary bg-primary/5"
                              : "hover:border-primary/50"
                          }`}
                        >
                          <RadioGroupItem value={option.value} id={option.value} />
                          <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedMethod === "upi" && (
              <FormField
                control={form.control}
                name="upiId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>UPI ID</FormLabel>
                    <FormControl>
                      <Input placeholder="yourname@upi" {...field} />
                    </FormControl>
                    <FormDescription>Enter your UPI ID (e.g., yourname@upi)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {selectedMethod === "netbanking" && (
              <FormField
                control={form.control}
                name="bankName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your bank name" {...field} />
                    </FormControl>
                    <FormDescription>Enter the name of your bank for netbanking</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button
          className="w-full"
          size="lg"
          onClick={form.handleSubmit(onSubmit)}
          disabled={isProcessing || !form.getValues().paymentMethod}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay ₹${totalAmount}`
          )}
        </Button>
        <p className="text-sm text-muted-foreground text-center">
          By proceeding with the payment, you agree to our Terms of Service
        </p>
      </CardFooter>
    </Card>
  );
}