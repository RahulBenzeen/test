import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addWishlist, removeWhislist } from '../api/whislist';

// Async Thunk to fetch the wishlist for a user
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (userId:string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/wishlist/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch wishlist');
      }
      return await response.json();
    } catch (error) {
      // Simplified error handling
      return rejectWithValue(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  }
);

// Async Thunk to add a product to the wishlist
export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (productId:string, { rejectWithValue }) => {
    try {
     await addWishlist(productId);

    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async Thunk to remove a product from the wishlist
export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId:string, { rejectWithValue }) => {
    try {
      const response = await removeWhislist(productId);

        } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create the slice
const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    wishlists: [] as { _id: string }[], // Store the wishlist products
    loading: false,
    error: null as string | null,
  },
  reducers: {
    resetWishlistState: (state) => {
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlists = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Add to wishlist
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlists = action.payload.products; // Assuming the response includes the full updated list of products
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Remove from wishlist
      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlists = state.wishlists.filter(
          (product) => product._id !== action.payload
        );
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Actions
export const { resetWishlistState } = wishlistSlice.actions;

// Reducer
export default wishlistSlice.reducer;
