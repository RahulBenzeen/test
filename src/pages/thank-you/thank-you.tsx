import { useNavigate } from 'react-router-dom'
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { CheckCircle } from 'lucide-react'

export default function ThankYouPage() {
  const redirect = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Thank You for Your Order!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Your order has been successfully placed and is being processed.
          </p>
          <p className="font-semibold mb-2">Order Number: ORD-12345</p>
          <p className="text-sm text-muted-foreground">
            You will receive an email confirmation shortly with your order details.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button className="w-full" onClick={() => redirect('/order-tracking')}>
            Track Your Order
          </Button>
          <Button variant="outline" className="w-full" onClick={() => redirect('/')}>
            Continue Shopping
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}