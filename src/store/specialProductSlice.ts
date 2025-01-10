import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getSpecialOfferProducts } from '../api/product';
import { handleApiError } from '../api/apiErrorHandler';

 interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  subcategory: string;
  images: string[];
  stock: number;
  isSpecialOffer?: boolean;
  brand?: string;
  rating?: number;
  sku?: string;
  weight?: number;
  dimensions?: string;
  createdAt?: Date;
}

interface SpecialOfferState {
  items: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}

const initialState: SpecialOfferState = {
  items: [],
  status: 'idle',
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  },
};

export  interface FetchSpecialOffersParams {
  page: number;
  limit: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
}

export const fetchSpecialOffers = createAsyncThunk(
  'specialOffers/fetchSpecialOffers',
  async (params: FetchSpecialOffersParams, { rejectWithValue }) => {
    console.log('params', params);
    try {
      const response = await getSpecialOfferProducts(params);
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error);
      return rejectWithValue(apiError.message);
    }
  }
);


const specialOfferSlice = createSlice({
  name: 'specialOffers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Special Offers
      .addCase(fetchSpecialOffers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSpecialOffers.fulfilled, (state, action: PayloadAction<{
        data: Product[];
        count: number;
        pagination: SpecialOfferState['pagination'];
      }>) => {
        state.status = 'succeeded';
        state.items = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchSpecialOffers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

  },
});

export default specialOfferSlice.reducer;
