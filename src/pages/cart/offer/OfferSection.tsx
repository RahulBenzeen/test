import React, { memo } from 'react';

import BundleDiscountsCard from './BundleDiscountsCard';
import GiftSelection from './GiftSelection';
import { BundleDiscount, Gifts } from '../../../store/cartSlice';

interface OffersSectionProps {
  gifts: Gifts[];
  bundleDiscounts: BundleDiscount[];
  onGiftSelect?: (giftId: string) => void;
  selectedGiftId?: string;
}

const OffersSection: React.FC<OffersSectionProps> = memo(({ 
  gifts, 
  bundleDiscounts,
  onGiftSelect,
  selectedGiftId
}) => {
  return (
    <div className="space-y-6 mb-6">
      {bundleDiscounts.length > 0 && (
        <BundleDiscountsCard bundleDiscounts={bundleDiscounts} />
      )}
      
      {gifts.length > 0 && (
        <GiftSelection 
          gifts={gifts} 
          onGiftSelect={onGiftSelect}
          initialSelectedGiftId={selectedGiftId}
        />
      )}
    </div>
  );
});

OffersSection.displayName = 'OffersSection';

export default OffersSection;