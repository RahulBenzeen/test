import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProductsById } from '../api/product';
import { handleApiError } from '../api/apiErrorHandler';

export const fetchProductDetails = createAsyncThunk(
  'productDetails/fetchProductDetails',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await getProductsById(id);
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error)
      return rejectWithValue(apiError.message);
     
    }
  }
);

interface ProductDetailsState {
  item: [] | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ProductDetailsState = {
  item: null,
  status: 'idle',
  error: null,
};

const productDetailsSlice = createSlice({
  name: 'productDetails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.item = action.payload;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default productDetailsSlice.reducer;