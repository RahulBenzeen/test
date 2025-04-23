import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createGiftOffer } from '../api/offer';

const giftOfferSchema = z.object({
  name: z.string().min(3, { message: "Offer name must be at least 3 characters" }),
  minCartValue: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Minimum cart value must be greater than 0",
  }),
  maxCartValue: z.string().optional().refine((val) => !val || (!isNaN(Number(val)) && Number(val) > 0), {
    message: "Maximum cart value must be greater than 0",
  }),
  giftCount: z.number().min(1).max(5),
  giftProducts: z.array(z.string()).min(1, { message: "Select at least one gift product" }),
}).refine((data) => {
  if (data.maxCartValue && Number(data.minCartValue) >= Number(data.maxCartValue)) {
    return false;
  }
  return true;
}, {
  message: "Maximum cart value must be greater than minimum cart value",
  path: ["maxCartValue"],
});

type GiftOfferFormValues = z.infer<typeof giftOfferSchema>;

export const useGiftOfferForm = () => {
  const form = useForm<GiftOfferFormValues>({
    resolver: zodResolver(giftOfferSchema),
    defaultValues: {
      name: '',
      minCartValue: '',
      maxCartValue: '',
      giftCount: 1,
      giftProducts: [],
    },
  });

  const onSubmit = async (values: GiftOfferFormValues) => {
    // Here you would normally send the data to your API
    console.log("Submitting gift offer:", values);
    
      try {
        const response = await createGiftOffer(values);
    
        console.log('Bundle offer saved:', response.data);
        return response.data;
      } catch (error) {
        console.error('Failed to save bundle offer', error);
        throw new Error("Failed to save bundle offer");
      }
  };

  return {
    form,
    onSubmit,
  };
};