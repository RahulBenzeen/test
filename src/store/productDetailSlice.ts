import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { handleApiError } from '../api/apiErrorHandler';
import { FetchProductsParams, Product } from './productSlice';
import { getProducts, getProductsById, getRecentlyViewedProducts } from '../api/product';

interface ProductDetailState {
  item: Product | null;
  recentlyViewed: Product[];
  searchResults: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  searchStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ProductDetailState = {
  item: null,
  recentlyViewed: [],
  searchResults: [],
  status: 'idle',
  searchStatus: 'idle',
  error: null,
};

export const searchProducts = createAsyncThunk(
  'productDetail/searchProducts',
  async (params: FetchProductsParams, { rejectWithValue }) => {
    try {
      const response = await getProducts(params);
      return response.data.data;
    } catch (error) {
      const apiError = handleApiError(error);
      return rejectWithValue(apiError.message);
    }
  }
);

export const fetchProductDetails = createAsyncThunk(
  'productDetail/fetchProductDetails',
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await getProductsById(productId);
      return response.data.data;
    } catch (error) {
      const apiError = handleApiError(error);
      return rejectWithValue(apiError.message);
    }
  }
);

export const fetchRecentlyViewedProducts = createAsyncThunk(
  'productDetail/fetchRecentlyViewedProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRecentlyViewedProducts();
      return response.data.data;
    } catch (error) {
      const apiError = handleApiError(error);
      return rejectWithValue(apiError.message);
    }
  }
);

const productDetailSlice = createSlice({
  name: 'productDetails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductDetails.fulfilled, (state, action: PayloadAction<Product>) => {
        state.status = 'succeeded';
        state.item = action.payload;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(fetchRecentlyViewedProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRecentlyViewedProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.recentlyViewed = action.payload;
        state.error = null;
      })
      .addCase(fetchRecentlyViewedProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(searchProducts.pending, (state) => {
        state.searchStatus = 'loading';
      })
      .addCase(searchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.searchStatus = 'succeeded';
        state.searchResults = action.payload;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.searchStatus = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default productDetailSlice.reducer;