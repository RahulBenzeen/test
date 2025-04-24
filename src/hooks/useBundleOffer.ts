import { useState } from 'react';
import { createBundleOffers } from '../api/offer';

export interface BundleRule  {
  minQty: string;
  maxQty: string;
  discountType: string;
  discountValue: string;
  products: string[];
};

export const useBundleOfferForm = () => {
  const [bundleRules, setBundleRules] = useState<BundleRule[]>([
    { minQty: '', maxQty: '', discountType: 'percent', discountValue: '', products: [] },
  ]);

  const addNewRule = () => {
    setBundleRules([
      ...bundleRules,
      { minQty: '', maxQty: '', discountType: 'percent', discountValue: '', products: [] },
    ]);
  };

  const updateRule = (index: number, field: string, value: any) => {
    const updated = [...bundleRules];
    updated[index] = { ...updated[index], [field]: value };
    setBundleRules(updated);
  };

  const removeRule = (index: number) => {
    setBundleRules(bundleRules.filter((_, i) => i !== index));
  };

  const validateRules = () => {
    // Filter out empty rules
    const validRules = bundleRules.filter(
      (rule) => rule.minQty && rule.discountValue && rule.products.length > 0
    );

    if (validRules.length === 0) {
      throw new Error("At least one complete rule is required");
    }

    // Check for each rule
    for (const rule of validRules) {
      if (parseInt(rule.minQty) < 1) {
        throw new Error("Minimum quantity must be at least 1");
      }

      if (rule.maxQty && parseInt(rule.maxQty) < parseInt(rule.minQty)) {
        throw new Error("Maximum quantity cannot be less than minimum quantity");
      }

      if (rule.discountType === 'percent') {
        const percent = parseInt(rule.discountValue);
        if (percent < 1 || percent > 100) {
          throw new Error("Percentage discount must be between 1 and 100");
        }
      } else if (rule.discountType === 'price') {
        if (parseInt(rule.discountValue) < 1) {
          throw new Error("Price discount must be at least 1");
        }
      }
    }

    return validRules;
  };

  const validateAndSubmit = async () => {
    const validRules = validateRules();
   console.log('Valid rules:', validRules);
    try {
      const response = await createBundleOffers(validRules);
  
      console.log('Bundle offer saved:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to save bundle offer', error);
      throw new Error("Failed to save bundle offer");
    }
  };

  return {
    bundleRules,
    addNewRule,
    updateRule,
    removeRule,
    validateAndSubmit,
  };
};