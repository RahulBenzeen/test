import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchReviews, addReview, Review, updateReview } from '../../store/reviewSlice';
import { fetchProductDetails } from '../../store/productDetailSlice';
import { fetchOrdersByUser } from '../../store/orderSlice'; // Assuming an action to fetch user orders
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { Star, Loader2 } from 'lucide-react';
import { motion } from "framer-motion";
import showToast from '../../utils/toast/toastUtils';

export default function ReviewPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { reviews, status: reviewStatus } = useAppSelector((state) => state.reviews);
  const { item, status: productStatus } = useAppSelector((state) => state.productDetails);
  const { user } = useAppSelector((state) => state.auth);
  const { orders } = useAppSelector((state) => state.order); // Assuming orders are fetched here

  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [canReview, setCanReview] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      if (reviewStatus === 'idle') {
        dispatch(fetchReviews(id));
      }
      if (productStatus === 'idle') {
        dispatch(fetchProductDetails(id));
      }
    }
  }, [dispatch, id, reviewStatus, productStatus]);

  useEffect(() => {
    if (user) {
      dispatch(fetchOrdersByUser()); // Fetch user orders to check if they've purchased this product
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (orders && user) {
      const hasPurchased = orders.some(order => 
        Array.isArray(order.products) && 
        order.products.some((product) => product.product === id) // Assuming the `productId` is `_id` in the Product object
      );
      setCanReview(hasPurchased); // Set canReview based on the purchase check
    }
  }, [orders, id, user]);
  

  const existingReview = useMemo(() => {
    return user && reviews ? reviews.find((review) => review.userId?._id === user.id) : null;
  }, [user, reviews]);

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating);
      setComment(existingReview.comment);
      setIsEditing(true);
    }
  }, [existingReview]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (id && user) {
      try {
        if (isEditing) {
          await dispatch(updateReview({
            reviewId: existingReview?._id || '',
            reviewData: {
              rating,
              comment,
            },
          })).unwrap();
          showToast('Review updated successfully!', 'success');
        } else {
          await dispatch(addReview({
            productId: id,
            userId: user.id,
            rating,
            comment,
          })).unwrap();
          showToast('Review added successfully!', 'success');
        }
      } catch {
        showToast('Something went wrong. Please try again.', 'error');
      }
    }
  };

  const StarRating = ({ rating, onRatingChange }: { rating: number; onRatingChange?: (rating: number) => void }) => (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-6 w-6 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'} ${onRatingChange ? 'cursor-pointer' : ''}`}
          onClick={() => onRatingChange && onRatingChange(star)}
        />
      ))}
    </div>
  );

  // Loading states for product and reviews
  if (productStatus === 'loading' || reviewStatus === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (productStatus === 'failed' || reviewStatus === 'failed') {
    return <div className="text-center text-red-500">Failed to load product or reviews. Please try again later.</div>;
  }

  if (!item) {
    return <div className="text-center text-red-500">Product not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Reviews for {item.name}</h1>

      {!canReview && user && (
        <div className="mb-8 text-center text-red-500">
          You can only review this product after making a purchase.
        </div>
      )}

      {canReview && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{isEditing ? "Edit Your Review" : "Write a Review"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <Label htmlFor="rating">Rating</Label>
                <StarRating rating={rating} onRatingChange={setRating} />
              </div>
              <div>
                <Label htmlFor="comment">Your Review</Label>
                <Textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write your review here..."
                  className="w-full"
                  required
                />
              </div>
              <Button type="submit" disabled={!rating}>
                {isEditing ? "Update Review" : "Submit Review"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {reviews.map((review: Review) => (
          <motion.div
            key={review._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{review.userId?.name}</h3>
                    <p className="text-sm text-gray-500">{new Date(review?.createdAt).toLocaleDateString()}</p>
                  </div>
                  <StarRating rating={review.rating} />
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {reviews.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No reviews yet. Be the first to review this product!</p>
      )}
    </div>
  );
}
