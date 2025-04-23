import React from 'react';
import { Package } from 'lucide-react';
import { BundleDiscount } from '../../../store/cartSlice';

interface BundleDiscountsCardProps {
  bundleDiscounts: BundleDiscount[];
}

const BundleDiscountsCard: React.FC<BundleDiscountsCardProps> = ({ bundleDiscounts }) => {
  if (bundleDiscounts.length === 0) return null;

  return (
    <div className="rounded-2xl border border-primary/10 bg-primary/5 p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-center gap-2 mb-4 text-primary">
        <Package className="w-5 h-5" />
        <h2 className="text-lg font-semibold">Bundle Discounts Applied</h2>
      </div>
      <ul className="space-y-3 text-sm text-muted-foreground pl-1">
        {bundleDiscounts.map((discount, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="mt-1 text-primary">•</span>
            <p className="leading-relaxed">
              {discount.discountType === 'percent'
                ? `${discount.discountValue}% off on ${discount.minQty}+ items`
                : `₹${discount.discountAmount} off on ${discount.minQty}+ items`}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BundleDiscountsCard;
