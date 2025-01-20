import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addWishlist, getUserWishList, removeWhislist } from '../api/whislist';
import { Product } from './productSlice';

// Async Thunk to fetch the wishlist for a user
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await getUserWishList(userId);
      if (!response || !response.data.wishlist.products) {
        throw new Error('Failed to fetch wishlist');
      }
      return response.data.wishlist.products;
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      return rejectWithValue(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  }
);


// Async Thunk to add a product to the wishlist
export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await addWishlist(productId);
      if (!response.data || !response.data.wishlist.products) {
        throw new Error('Invalid response format');
      }
      return response.data.wishlist.products;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  }
);

// Async Thunk to remove a product from the wishlist
export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await removeWhislist(productId);
      if (!response.data || !response.data.wishlist.products) {
        throw new Error('Invalid response format');
      }
      return response.data.wishlist.products;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    wishlists: [] as { _id: string; product: Product }[],
    loading: {
      fetch: false,
      add: false,
      remove: false,
    },
    error: null as string | null,
  },
  reducers: {
    resetWishlistState: (state) => {
      state.wishlists = [];
      state.loading = { fetch: false, add: false, remove: false };
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.loading.fetch = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.wishlists = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error = action.payload as string;
      })

      // Add to wishlist
      .addCase(addToWishlist.pending, (state) => {
        state.loading.add = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.loading.add = false;
        state.wishlists = action.payload;
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading.add = false;
        state.error = action.payload as string;
      })

      // Remove from wishlist
      .addCase(removeFromWishlist.pending, (state) => {
        state.loading.remove = true;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.loading.remove = false;
        state.wishlists = action.payload;
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading.remove = false;
        state.error = action.payload as string;
      });
  },
});


export const { resetWishlistState } = wishlistSlice.actions;
export default wishlistSlice.reducer;