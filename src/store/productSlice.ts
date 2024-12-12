import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../api/product';
import { handleApiError } from '../api/apiErrorHandler';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  subcategory: string;
  images: string[];
  stock: number;
  brand?: string;
  rating?: number;
  sku?: string;
  weight?: number;
  dimensions?: string;
  createdAt?: Date;
}

interface ProductState {
  items: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}

const initialState: ProductState = {
  items: [],
  status: 'idle',
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  },
};

export interface FetchProductsParams {
  page: number;
  limit: number;
  category?: string;
  subcategory?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  search?:string,
  sortBy?:string
}

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params: FetchProductsParams, { rejectWithValue }) => {

    try {
      const response = await getProducts(params);
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error);
      return rejectWithValue(apiError.message);
    }
  }
);

export const addProductThunk = createAsyncThunk(
  'products/addProduct',
  async (productData: Omit<Product, '_id'>, { rejectWithValue }) => {
    try {
      const response = await addProduct(productData);
      await getProducts({page:1, limit:12});
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error);
      return rejectWithValue(apiError.message);
    }
  }
);

export const updateProductThunk = createAsyncThunk(
  'products/updateProduct',
  async (productData: Product, { rejectWithValue }) => {
    try {
      const response = await updateProduct(productData);
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error);
      return rejectWithValue(apiError.message);
    }
  }
);

export const deleteProductThunk = createAsyncThunk(
  'products/deleteProduct',
  async (productId: string, { rejectWithValue }) => {
    try {
      await deleteProduct(productId);
      return productId;
    } catch (error) {
      const apiError = handleApiError(error);
      return rejectWithValue(apiError.message);
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<{
        data: Product[];
        count: number;
        pagination: ProductState['pagination'];
      }>) => {
        state.status = 'succeeded';
        state.items = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Add Product
      .addCase(addProductThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addProductThunk.fulfilled, (state, action: PayloadAction<Product>) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
        state.pagination.totalItems += 1;
      })
      .addCase(addProductThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Update Product
      .addCase(updateProductThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateProductThunk.fulfilled, (state, action: PayloadAction<Product>) => {
        state.status = 'succeeded';
        const index = state.items.findIndex(product => product._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateProductThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Delete Product
      .addCase(deleteProductThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteProductThunk.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = 'succeeded';
        state.items = state.items.filter(product => product._id !== action.payload);
        state.pagination.totalItems -= 1;
      })
      .addCase(deleteProductThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default productSlice.reducer;