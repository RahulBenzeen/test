
import api from "./index";  // Import the axios instance

// Interface for the review input (when adding or updating a review)

// API call for adding a new review
export const addWishlist= (productId:string) => 
  api.post('/api/wishlist/add', {productId});

// API call for getting reviews for a specific product
export const removeWhislist = (productId: string) => 
  api.post(`/api/wishlist/remove`, {productId});

