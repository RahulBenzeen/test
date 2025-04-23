import { ScrollArea } from "../../components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { CreditCard } from "lucide-react";

interface Product {
  name: string;
  quantity: number;
  price: number;
}

interface OrderSummaryProps {
  products: Product[],
  totalAmount: number;
}

export function OrderSummary({ products, totalAmount}: OrderSummaryProps ){
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Order Summary
        </CardTitle>
        <CardDescription>
          Review your order details before payment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px] rounded-md border p-4">
          <div className="space-y-4">
            {products.map((product, index) => (
              <div key={index} className="flex justify-between items-center pb-2 border-b">
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-muted-foreground">Qty: {product.quantity}</p>
                </div>
                <p className="font-medium">₹{product.price * product.quantity}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between items-center font-medium">
            <span>Total Amount</span>
            <span>₹{totalAmount}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}