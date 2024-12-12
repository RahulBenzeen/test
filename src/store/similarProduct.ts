import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getSimilarProducts } from '../api/product';
import { handleApiError } from '../api/apiErrorHandler';
import { Product } from './productSlice';

// Define the Product interface (if not already defined elsewhere)

// Define the state interface for similar products
export interface SimilarProductState {
  items: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Initial state for the slice
const initialState: SimilarProductState = {
  items: [],
  status: 'idle',
  error: null,
};

// Thunk for fetching similar products
export const fetchSimilarProducts = createAsyncThunk(
  'similarProducts/fetchSimilarProducts',
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await getSimilarProducts(productId); // API call function
      return response.data.data; // Ensure the data returned is an array of products
    } catch (error) {
      const apiError = handleApiError(error); // Custom error handler
      return rejectWithValue(apiError.message); // Reject with error message
    }
  }
);

// Create the slice
const similarProductSlice = createSlice({
  name: 'similarProducts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle pending state for fetchSimilarProducts
      .addCase(fetchSimilarProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null; // Reset any previous error
      })
      // Handle fulfilled state for fetchSimilarProducts
      .addCase(fetchSimilarProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.status = 'succeeded';
        state.items = action.payload; // Update items with fetched data
      })
      // Handle rejected state for fetchSimilarProducts
      .addCase(fetchSimilarProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string; // Set the error message
      });
  },
});

export default similarProductSlice.reducer;
