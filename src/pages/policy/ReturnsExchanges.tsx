
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ReturnsExchanges() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-4xl font-bold text-center mb-8">Returns & Exchanges</h1>

      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-6 w-6" />
              Return Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>We want you to be completely satisfied with your purchase. If you're not happy with your order, we accept returns within 30 days of delivery.</p>
            
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="border p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Eligible Items</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Unworn items in original condition</li>
                  <li>Items with original tags attached</li>
                  <li>Items in original packaging</li>
                  <li>Unused and unwashed items</li>
                </ul>
              </div>
              <div className="border p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Non-Returnable Items</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Intimate apparel</li>
                  <li>Personalized items</li>
                  <li>Sale items</li>
                  <li>Gift cards</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold text-lg mb-2">30-Day Window</h3>
                <p>Returns must be initiated within 30 days of delivery.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold text-lg mb-2">Free Returns</h3>
                <p>We provide free return shipping labels for all domestic orders.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold text-lg mb-2">Quality Check</h3>
                <p>All returns undergo inspection before refund processing.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}