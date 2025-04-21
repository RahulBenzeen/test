
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Truck, Clock, Globe, Shield } from 'lucide-react';

export default function ShippingInfo() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-4xl font-bold text-center mb-8">Shipping Information</h1>

      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-6 w-6" />
              Shipping Methods
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Standard Shipping</h3>
                <p>5-7 business days</p>
                <p className="font-medium">$5.99</p>
              </div>
              <div className="border p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Express Shipping</h3>
                <p>2-3 business days</p>
                <p className="font-medium">$12.99</p>
              </div>
              <div className="border p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Next Day Delivery</h3>
                <p>Next business day</p>
                <p className="font-medium">$24.99</p>
              </div>
              <div className="border p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">International Shipping</h3>
                <p>7-14 business days</p>
                <p className="font-medium">Calculated at checkout</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Clock className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold text-lg mb-2">Processing Time</h3>
                <p>Orders are processed within 24-48 hours after payment confirmation.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Globe className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold text-lg mb-2">International Orders</h3>
                <p>We ship to over 100 countries worldwide with reliable tracking.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold text-lg mb-2">Shipping Insurance</h3>
                <p>All orders are insured and tracked for your peace of mind.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}