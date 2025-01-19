import React from 'react';
import { Truck, Shield, RefreshCcw, Clock } from 'lucide-react';

const ProductFeatures = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg mb-8">
    <div className="flex items-center gap-2 text-sm">
      <div className="p-2 bg-primary/10 rounded-full shrink-0">
        <Truck className="w-4 h-4 text-primary" />
      </div>
      <div>
        <p className="font-medium">Free Delivery</p>
        <p className="text-muted-foreground text-xs">Orders over ₹999</p>
      </div>
    </div>
    <div className="flex items-center gap-2 text-sm">
      <div className="p-2 bg-primary/10 rounded-full shrink-0">
        <Shield className="w-4 h-4 text-primary" />
      </div>
      <div>
        <p className="font-medium">Secure Payment</p>
        <p className="text-muted-foreground text-xs">100% Protected</p>
      </div>
    </div>
    <div className="flex items-center gap-2 text-sm">
      <div className="p-2 bg-primary/10 rounded-full shrink-0">
        <RefreshCcw className="w-4 h-4 text-primary" />
      </div>
      <div>
        <p className="font-medium">Easy Returns</p>
        <p className="text-muted-foreground text-xs">30 Day Policy</p>
      </div>
    </div>
    <div className="flex items-center gap-2 text-sm">
      <div className="p-2 bg-primary/10 rounded-full shrink-0">
        <Clock className="w-4 h-4 text-primary" />
      </div>
      <div>
        <p className="font-medium">24/7 Support</p>
        <p className="text-muted-foreground text-xs">Always Available</p>
      </div>
    </div>
  </div>
);

export default React.memo(ProductFeatures);