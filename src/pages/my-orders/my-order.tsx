
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Badge } from "../../components/ui/badge"
import { Package, Truck, CheckCircle } from 'lucide-react'

// Mock order data (in a real application, you'd fetch this based on the order number)
const orderData = {
  orderId: "ORD-12345",
  date: "2023-06-15",
  status: "In Transit",
  total: 1234.56,
  items: [
    { id: 1, name: "Smartphone X", quantity: 1, price: 999.99 },
    { id: 2, name: "Wireless Earbuds", quantity: 2, price: 149.99 },
  ],
  shippingAddress: "123 Main St, Anytown, AN 12345",
  paymentMethod: "Credit Card (ending in 1234)",
  trackingNumber: "1Z999AA1123456789",
  estimatedDelivery: "2023-06-20",
}

export default function OrderPage() {
  const redirect = useNavigate();
//   const [searchParams] = useSearchParams();
//   const { orderId } = searchParams.get('orderid')

  // In a real application, you'd fetch the order data here based on the orderId

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Processing":
        return <Package className="h-5 w-5" />
      case "In Transit":
        return <Truck className="h-5 w-5" />
      case "Delivered":
        return <CheckCircle className="h-5 w-5" />
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Order Details</CardTitle>
          <p className="text-muted-foreground">Order Number: {orderData.orderId}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">Order Date</p>
              <p>{orderData.date}</p>
            </div>
            <Badge variant="outline" className="text-lg py-1 px-3 flex items-center gap-2">
              {getStatusIcon(orderData.status)}
              {orderData.status}
            </Badge>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Items</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderData.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>${item.price.toFixed(2)}</TableCell>
                    <TableCell>${(item.quantity * item.price).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Order Total</h3>
            <p className="text-2xl font-bold">${orderData.total.toFixed(2)}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
              <p>{orderData.shippingAddress}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
              <p>{orderData.paymentMethod}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Tracking Information</h3>
            <p>Tracking Number: {orderData.trackingNumber}</p>
            <p>Estimated Delivery: {orderData.estimatedDelivery}</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => redirect('/')}>
            Continue Shopping
          </Button>
          <Button onClick={() => window.print()}>
            Print Order
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}