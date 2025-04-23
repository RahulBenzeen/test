import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createGiftOffer } from '../api/offer';

// Zod schema
const giftOfferSchema = z.object({
  name: z.string().min(3, { message: "Offer name must be at least 3 characters" }),
  minCartValue: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Minimum cart value must be greater than 0",
  }),
  giftCount: z
    .preprocess((val) => Number(val), z.number().min(1).max(5)), // ensure number
  giftProducts: z.array(z.string()).min(1, { message: "Select at least one gift product" }),
});

type GiftOfferFormValues = z.infer<typeof giftOfferSchema>;

export const useGiftOfferForm = () => {
  const form = useForm<GiftOfferFormValues>({
    resolver: zodResolver(giftOfferSchema),
    defaultValues: {
      name: '',
      minCartValue: '',
      giftCount: 1,
      giftProducts: [],
    },
  });

  const onSubmit = async (values: GiftOfferFormValues) => {
    try {
      const payload = {
        ...values,
        minCartValue: Number(values.minCartValue),
      };
      const response = await createGiftOffer(payload);
      return response.data;
    } catch (error) {
      console.error('Failed to save gift offer', error);
      throw new Error("Failed to save gift offer");
    }
  };

  return {
    form,
    onSubmit,
  };
};
