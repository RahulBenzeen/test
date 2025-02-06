import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addWishlist, getUserWishList, removeWhislist } from '../api/whislist';
import { Product } from './productSlice';

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

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await addWishlist(productId);
      if (!response.data || !response.data.wishlist.products) {
        throw new Error('Invalid response format');
      }
      return { productId, products: response.data.wishlist.products };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await removeWhislist(productId);
      if (!response.data || !response.data.wishlist.products) {
        throw new Error('Invalid response format');
      }
      return { productId, products: response.data.wishlist.products };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  }
);

type WishlistStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

interface WishlistState {
  wishlists: { _id: string; product: Product }[];
  pendingChanges: string[]; // Changed from Set to array
  optimisticUpdates: string[]; // Changed from Set to array
  status: WishlistStatus;
  loading: {
    fetch: boolean;
    add: boolean;
    remove: boolean;
  };
  error: string | null;
}

const initialState: WishlistState = {
  wishlists: [],
  pendingChanges: [], // Changed from Set to array
  optimisticUpdates: [], // Changed from Set to array
  status: 'idle',
  loading: {
    fetch: false,
    add: false,
    remove: false,
  },
  error: null,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    resetWishlistState: (state) => {
      state.wishlists = [];
      state.pendingChanges = [];
      state.optimisticUpdates = [];
      state.status = 'idle';
      state.loading = { fetch: false, add: false, remove: false };
      state.error = null;
    },
    optimisticAddToWishlist: (state, action) => {
      const productId = action.payload;
      if (!state.optimisticUpdates.includes(productId)) {
        state.optimisticUpdates.push(productId);
      }
      if (!state.wishlists.some(item => item.product._id === productId)) {
        state.wishlists.push({ _id: productId, product: { _id: productId } as Product });
      }
    },
    optimisticRemoveFromWishlist: (state, action) => {
      const productId = action.payload;
      if (!state.optimisticUpdates.includes(productId)) {
        state.optimisticUpdates.push(productId);
      }
      state.wishlists = state.wishlists.filter(item => item.product._id !== productId);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.status = 'loading';
        state.loading.fetch = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.loading.fetch = false;
        state.wishlists = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.status = 'failed';
        state.loading.fetch = false;
        state.error = action.payload as string;
      })
      .addCase(addToWishlist.pending, (state, action) => {
        state.loading.add = true;
        if (!state.pendingChanges.includes(action.meta.arg)) {
          state.pendingChanges.push(action.meta.arg);
        }
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.loading.add = false;
        state.pendingChanges = state.pendingChanges.filter(id => id !== action.payload.productId);
        state.optimisticUpdates = state.optimisticUpdates.filter(id => id !== action.payload.productId);
        state.wishlists = action.payload.products;
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading.add = false;
        const productId = action.meta.arg;
        state.pendingChanges = state.pendingChanges.filter(id => id !== productId);
        state.optimisticUpdates = state.optimisticUpdates.filter(id => id !== productId);
        state.error = action.payload as string;
        // Revert optimistic update
        state.wishlists = state.wishlists.filter(item => item.product._id !== productId);
      })
      .addCase(removeFromWishlist.pending, (state, action) => {
        state.loading.remove = true;
        if (!state.pendingChanges.includes(action.meta.arg)) {
          state.pendingChanges.push(action.meta.arg);
        }
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.loading.remove = false;
        state.pendingChanges = state.pendingChanges.filter(id => id !== action.payload.productId);
        state.optimisticUpdates = state.optimisticUpdates.filter(id => id !== action.payload.productId);
        state.wishlists = action.payload.products;
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading.remove = false;
        const productId = action.meta.arg;
        state.pendingChanges = state.pendingChanges.filter(id => id !== productId);
        state.optimisticUpdates = state.optimisticUpdates.filter(id => id !== productId);
        state.error = action.payload as string;
        // Revert optimistic update by re-adding the product
        if (!state.wishlists.some(item => item.product._id === productId)) {
          state.wishlists.push({ _id: productId, product: { _id: productId } as Product });
        }
      });
  },
});

export const { 
  resetWishlistState, 
  optimisticAddToWishlist, 
  optimisticRemoveFromWishlist 
} = wishlistSlice.actions;
export default wishlistSlice.reducer;