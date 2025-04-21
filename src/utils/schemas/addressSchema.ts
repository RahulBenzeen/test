import * as z from 'zod';

// Define the shipping address schema
export const shippingAddressSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  city: z.string().min(2, {
    message: "City must be at least 2 characters.",
  }),
  zipCode: z.string().min(5, {
    message: "Zip code must be at least 5 characters.",
  }).max(10, {
    message: "Zip code must be at most 10 characters.",
  }),
  country: z.string().min(2, {
    message: "Country name must be at least 2 characters.",
  }),
});

export type ShippingAddressFormValues = z.infer<typeof shippingAddressSchema>;
