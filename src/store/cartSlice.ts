import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addToCart, clearCart, getCart, removeFromCart, updateQuantity } from "../api/cart";
import { Product } from "./productSlice";
import { AxiosError } from "axios";
export interface CartItem {
    _id: string;
    quantity: number;
    price: number;
    product: Product;
}

interface CartState {
    items: CartItem[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: CartState = {
    items: [],
    status: 'idle',
    error: null
}

// Async thunks
export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
    const response = await getCart();
    return response.data.data;
});

export const addToCartAsync = createAsyncThunk(
    'cart/addToCart', 
    async (product: Product) => {
        const cartItem = {
            product, // Store the full product object
            quantity: 1,
            price: product.price,
            _id: product._id // Use product._id as the cart item ID initially
        };
         await addToCart(cartItem);
        // Immediately fetch the updated cart to ensure we have the correct data
        const updatedCart = await getCart();
        return updatedCart.data.data;
    }
);

export const removeFromCartAsync = createAsyncThunk(
    'cart/removeFromCart', 
    async (itemId: string) => {
        await removeFromCart(itemId);
        // Fetch the updated cart after removal
        const updatedCart = await getCart();
        return updatedCart.data.data;
    }
);

export const updateQuantityAsync = createAsyncThunk(
    'cart/updateQuantity',
    async ({ id, quantity }: { id: string; quantity: number }, { rejectWithValue }) => {
        try {
            // Update quantity, make sure to handle out-of-stock or any other errors
            const response = await updateQuantity(id, quantity);
            
            // Check if the response indicates the product is out of stock
            if (response.data.error) {
                return rejectWithValue(response.data.error); // return the error message
            }
            
            // Fetch the updated cart after the quantity update
            const updatedCart = await getCart();
            return updatedCart.data.data;
        } catch (error) {
            // Check if the error is an AxiosError
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data?.message || "Something went wrong");
            }
            // Handle other types of errors
            return rejectWithValue('An unexpected error occurred');
        }
    }
);

export const clearCartAsync = createAsyncThunk(
    'cart/clearCart', 
    async () => {
        await clearCart();
        return null;
    }
);

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.status = 'succeeded';
                if (action.payload && action.payload.items) {
                    state.items = action.payload.items;
                }
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            })
            .addCase(addToCartAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addToCartAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                if (action.payload && action.payload.items) {
                    state.items = action.payload.items;
                }
            })
            .addCase(addToCartAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            })
            .addCase(removeFromCartAsync.fulfilled, (state, action) => {
                if (action.payload && action.payload.items) {
                    state.items = action.payload.items;
                }
            })
            .addCase(updateQuantityAsync.fulfilled, (state, action) => {
                if (action.payload && action.payload.items) {
                    state.items = action.payload.items;
                }
            })
            .addCase(clearCartAsync.fulfilled, (state) => {
                state.items = [];
            });
    }
});

export default cartSlice.reducer;