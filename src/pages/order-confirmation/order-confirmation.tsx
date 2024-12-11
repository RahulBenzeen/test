import { useNavigate } from 'react-router-dom'
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { useLocation } from 'react-router-dom'
// Mock order data
const orderData = {
  orderId: "ORD-12345",
  date: "2023-06-15",
  total: 1234.56,
  items: [
    { id: 1, name: "Smartphone X", quantity: 1, price: 999.99 },
    { id: 2, name: "Wireless Earbuds", quantity: 2, price: 149.99 },
  ],
  shippingAddress: "123 Main St, Anytown, AN 12345",
  paymentMethod: "Credit Card (ending in 1234)",
}

export default function OrderConfirmationPage() {

 const createdOrderData = useLocation();
 console.log(createdOrderData.state);




  const redirect = useNavigate()

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Order Confirmation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold">Order Details</h2>
              <p>Order Number: {orderData.orderId}</p>
              <p>Date: {orderData.date}</p>
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
            <div>
              <h3 className="text-lg font-semibold">Order Total</h3>
              <p className="text-2xl font-bold">${orderData.total.toFixed(2)}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Shipping Address</h3>
              <p>{orderData.shippingAddress}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Payment Method</h3>
              <p>{orderData.paymentMethod}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => redirect('/')}>
            Continue Shopping
          </Button>
          <Button onClick={() => redirect('/thank-you')}>
            Complete Order
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}