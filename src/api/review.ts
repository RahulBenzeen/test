
import api from "./index";  // Import the axios instance

// Interface for the review input (when adding or updating a review)
export interface ReviewInput {
  productId: string;
  rating: number;
  comment: string;
}

// API call for adding a new review
export const addReviews = (reviewData: ReviewInput) => 
  api.post('/api/reviews', reviewData);

// API call for getting reviews for a specific product
export const getReviews = (productId: string) => 
  api.get(`/api/reviews/product/${productId}`);

// API call for updating an existing review
export const updateReviews = (reviewId: string, reviewData: Partial<ReviewInput>) => 
  api.put(`/api/reviews/${reviewId}`, reviewData);

// API call for deleting a review
export const deleteReview = (reviewId: string) => 
  api.delete(`/api/reviews/${reviewId}`);

// API call for getting a single review (if needed)
export const getReviewById = (reviewId: string) => 
  api.get(`/api/reviews/${reviewId}`);