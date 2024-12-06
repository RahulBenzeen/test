import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';
import { addToCart, getCart, removeFromCart, updateQuantity } from "../api/cart";
import { Product } from "./productSlice";

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
    async ({ id, quantity }: { id: string; quantity: number }) => {
        await updateQuantity(id, quantity);
        // Fetch the updated cart after quantity update
        const updatedCart = await getCart();
        return updatedCart.data.data;
    }
);

export const clearCartAsync = createAsyncThunk(
    'cart/clearCart', 
    async () => {
        await axios.delete('/api/cart');
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