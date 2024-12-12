import * as z from 'zod'

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_IMAGES = 5;

export const productSchema = z.object({
  name: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  brand: z.string().min(2, {
    message: "Brand must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Price must be a positive number.",
  }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  subcategory: z.string({
    required_error: "Please select a subcategory.",
  }),
  stock: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Stock must be a non-negative number.",
  }),
  weight: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Weight must be a positive number.",
  }),
  dimensions: z.string().regex(/^\d+(\.\d+)?\s*[x*]\s*\d+(\.\d+)?\s*[x*]\s*\d+(\.\d+)?$/, {
    message: "Dimensions must be in the format 'L x W x H' or 'L * W * H' (e.g., '10 x 5 x 2' or '10 * 5 * 2').",
  }),
  
  images: z
    .custom<FileList>((val) => val instanceof FileList, "Please upload at least one image.")
    .refine((files) => files.length > 0, "At least one image is required.")
    .refine((files) => files.length <= MAX_IMAGES, `You can upload up to ${MAX_IMAGES} images.`)
    .refine(
      (files) => Array.from(files).every((file) => file.size <= MAX_FILE_SIZE),
      `Each file size should be less than 5MB.`
    )
    .refine(
      (files) => Array.from(files).every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)),
      ".jpg, .jpeg, .png and .webp files are accepted."
    ),
})

export type ProductFormValues = z.infer<typeof productSchema>;