import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { addToCart, clearCart, getCart, removeFromCart, updateQuantity } from "../api/cart";
import { Product } from "./productSlice";
import { AxiosError } from "axios";

export interface BundleDiscount {
    ruleId: string;
    minQty: number;
    discountType: string;
    discountValue: number;
    discountAmount: string;
}

export interface CartItem {
    _id: string;
    quantity: number;
    price: number;
    product: Product;
    discountedPrice?: number;
    bundleDiscount?: BundleDiscount[];
}

interface CartState {
    items: CartItem[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    gifts: number;
    bundleDiscounts: BundleDiscount[];
    totalPrice: number;
}

const initialState: CartState = {
    items: [],
    status: 'idle',
    error: null,
    gifts: 0,
    bundleDiscounts: [],
    totalPrice: 0
};

const handleError = (error: unknown): string => {
    if (error instanceof AxiosError) {
        return error.response?.data?.message || "An error occurred while processing your request";
    }
    return "An unexpected error occurred";
};

export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getCart();
            return {
                items: response.data.data.items,
                gifts: response.data.data.gifts || 0,
                bundleDiscounts: response.data.appliedOffers || [],
                totalPrice: response.data.totalPrice || 0
            };
        } catch (error) {
            return rejectWithValue(handleError(error));
        }
    }
);

export const addToCartAsync = createAsyncThunk(
    'cart/addToCart',
    async (product: Product, { rejectWithValue }) => {
        try {
            const cartItem = {
                product,
                quantity: 1,
                price: product.price,
                _id: product._id
            };
            await addToCart(cartItem);
            const updatedCart = await getCart();
            return {
                items: updatedCart.data.data.items,
                gifts: updatedCart.data.data.gifts || 0,
                bundleDiscounts: updatedCart.data.appliedOffers || [],
                totalPrice: updatedCart.data.totalPrice || 0
            };
        } catch (error) {
            return rejectWithValue(handleError(error));
        }
    }
);

export const removeFromCartAsync = createAsyncThunk(
    'cart/removeFromCart',
    async (itemId: string, { rejectWithValue }) => {
        try {
            await removeFromCart(itemId);
            const updatedCart = await getCart();
            return {
                items: updatedCart.data.data.items,
                gifts: updatedCart.data.data.gifts || 0,
                bundleDiscounts: updatedCart.data.appliedOffers || [],
                totalPrice: updatedCart.data.totalPrice || 0
            };
        } catch (error) {
            return rejectWithValue(handleError(error));
        }
    }
);

export const updateQuantityAsync = createAsyncThunk(
    'cart/updateQuantity',
    async ({ id, quantity }: { id: string; quantity: number }, { rejectWithValue }) => {
        try {
            const response = await updateQuantity(id, quantity);
            if (response.data.error) {
                return rejectWithValue(response.data.error);
            }
            const updatedCart = await getCart();
            return {
                items: updatedCart.data.data.items,
                gifts: updatedCart.data.data.gifts || 0,
                bundleDiscounts: updatedCart.data.appliedOffers || [],
                totalPrice: updatedCart.data.totalPrice || 0
            };
        } catch (error) {
            return rejectWithValue(handleError(error));
        }
    }
);

export const clearCartAsync = createAsyncThunk(
    'cart/clearCart',
    async (_, { rejectWithValue }) => {
        try {
            await clearCart();
            return null;
        } catch (error) {
            return rejectWithValue(handleError(error));
        }
    }
);

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        updateLocalQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
            const item = state.items.find(item => item._id === action.payload.id);
            if (item) {
                item.quantity = action.payload.quantity;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload.items;
                state.gifts = action.payload.gifts;
                state.bundleDiscounts = action.payload.bundleDiscounts;
                state.totalPrice = action.payload.totalPrice;
                state.error = null;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string || 'Failed to fetch cart';
            })
            .addCase(addToCartAsync.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(addToCartAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload.items;
                state.gifts = action.payload.gifts;
                state.bundleDiscounts = action.payload.bundleDiscounts;
                state.totalPrice = action.payload.totalPrice;
                state.error = null;
            })
            .addCase(addToCartAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(removeFromCartAsync.fulfilled, (state, action) => {
                state.items = action.payload.items;
                state.gifts = action.payload.gifts;
                state.bundleDiscounts = action.payload.bundleDiscounts;
                state.totalPrice = action.payload.totalPrice;
                state.error = null;
            })
            .addCase(removeFromCartAsync.rejected, (state, action) => {
                state.error = action.payload as string;
            })
            .addCase(updateQuantityAsync.fulfilled, (state, action) => {
                state.items = action.payload.items;
                state.gifts = action.payload.gifts;
                state.bundleDiscounts = action.payload.bundleDiscounts;
                state.totalPrice = action.payload.totalPrice;
                state.error = null;
            })
            .addCase(updateQuantityAsync.rejected, (state, action) => {
                state.error = action.payload as string;
            })
            .addCase(clearCartAsync.fulfilled, (state) => {
                state.items = [];
                state.gifts = 0;
                state.bundleDiscounts = [];
                state.totalPrice = 0;
                state.error = null;
            })
            .addCase(clearCartAsync.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

export const { updateLocalQuantity } = cartSlice.actions;
export default cartSlice.reducer;