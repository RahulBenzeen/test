import React, { useState } from 'react';
import { Gift } from 'lucide-react';
import { Gifts } from '../../../store/cartSlice';

interface GiftSelectionProps {
  gifts: Gifts[];
  onGiftSelect?: (giftId: string) => void;
  initialSelectedGiftId?: string;
}

const GiftSelection: React.FC<GiftSelectionProps> = ({ 
  gifts, 
  onGiftSelect,
  initialSelectedGiftId 
}) => {
  const [selectedGiftId, setSelectedGiftId] = useState<string>(initialSelectedGiftId || '');

  if (gifts.length === 0) return null;

  const handleGiftSelect = (giftId: string) => {
    setSelectedGiftId(giftId);
    if (onGiftSelect) {
      onGiftSelect(giftId);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-accent/10 bg-accent/5 p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <Gift className="h-5 w-5 text-pink-500" />
          <p className="text-base font-medium text-accent-foreground">
            Congratulations! You qualify for 1 free gift{gifts.length > 1 ? 's' : ''}!
          </p>
        </div>
        <p className="text-sm text-muted-foreground ml-7">
          Select your preferred gift below.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-4 mt-6">
        {gifts.map((gift) => {
          const isSelected = selectedGiftId === gift._id;
          return (
            <div
              key={gift._id}
              className={`cursor-pointer border rounded-xl shadow-sm transition-all duration-200 overflow-hidden ${
                isSelected
                  ? "ring-2 ring-accent border-accent bg-accent/5"
                  : "hover:border-gray-300 hover:shadow-md"
              }`}
              onClick={() => handleGiftSelect(gift._id)}
            >
              <div className="relative pb-[100%] overflow-hidden bg-gray-100">
                <img
                  src={gift.images[0]?.secure_url}
                  alt={gift.name}
                  className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-accent text-white rounded-full p-1 shadow-md  bg-green-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-center line-clamp-2 h-10">{gift.name}</p>
              </div>
            </div>
          );
        })}
      </div>
      </div>

     
    </div>
  );
};

export default GiftSelection;