import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addReviews, getReviews, ReviewInput, updateReviews } from '../api/review';


interface ReviewedUser {
  _id: string;
  name: string;
}

export interface Review {
  _id: string;
  userId: ReviewedUser;
  productId: string;
  rating: number;
  comment: string;
  createdAt: string;
  userName: string;
}

export const fetchReviews = createAsyncThunk(
  'reviews/fetchReviews',
  async (productId: string) => {
    const response = await getReviews(productId);
    console.log('response', response)
    return response.data.data;
  }
);

export const addReview = createAsyncThunk(
  'reviews/addReview',
  async (reviewData: { productId: string; userId: string; rating: number; comment: string }) => {
    const response = await addReviews(reviewData);
    return response.data;
  }
);

export const updateReview = createAsyncThunk(
  'reviews/updateReview',
  async ({ reviewId, reviewData }: { reviewId: string; reviewData: Partial<ReviewInput> }) => {
    const response = await updateReviews(reviewId, reviewData);
    return response.data.data;
  }
);

interface ReviewState {
  reviews: Review[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ReviewState = {
  reviews: [],
  status: 'idle',
  error: null,
};

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    resetReviewsState: (state) => {
      state.reviews = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.reviews = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Unknown error';
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.reviews.push(action.payload);
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        const index = state.reviews.findIndex(review => review._id === action.payload._id);
        if (index !== -1) {
          state.reviews[index] = action.payload;
        }
      }); // Update 3: Add updateReview.fulfilled case
  },
});


export default reviewSlice.reducer;