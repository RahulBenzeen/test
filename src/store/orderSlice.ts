import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { getOrderByUserId, placeOrder } from '../api/order';
import { Product } from './productSlice';


// Define the structure of a shipping address
interface ShippingAddress {
  name: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone: string;
}

// Define the structure of shipping info
interface ShippingInfo {
  trackingNumber?: string;
  courierService?: string;
  shippingDate?: string;
}

// Define the structure of an order
export interface Order {
  _id?: string;
  user?: string; // MongoDB ObjectId as string
  products:Product;
  totalPrice: number;
  shippingAddress: ShippingAddress;
  paymentStatus: 'pending' | 'completed' | 'failed';
  orderStatus: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod?: 'razorpay' | 'creditCard' | 'paypal';
  shippingInfo?: ShippingInfo;
  createdAt?: string;
  updatedAt?: string;
}

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  status: 'idle',
  error: null,
};

// Async thunk for creating an order
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData: { products: Product, shippingAddress: ShippingAddress, paymentMethod: Order['paymentMethod'] }) => {
    const response = await placeOrder(orderData);
    return response.data;
  }
);

export const fetchOrdersByUser = createAsyncThunk(
  'orders/fetchOrdersByUser',
  async () => {
    const response = await getOrderByUserId();
    return response.data.orders; // Assuming the API returns an object with an `orders` array
  }
);

// Async thunk for fetching all orders
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async () => {
    const response = await axios.get('/api/orders');
    return response.data;
  }
);

// Async thunk for updating an order
export const updateOrder = createAsyncThunk(
  'orders/updateOrder',
  async (order: Partial<Order> & { _id: string }) => {
    const response = await axios.put(`/api/orders/${order._id}`, order);
    return response.data;
  }
);

// Async thunk for deleting an order
export const deleteOrder = createAsyncThunk(
  'orders/deleteOrder',
  async (orderId: string) => {
    await axios.delete(`/api/orders/${orderId}`);
    return orderId;
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setCurrentOrder: (state, action: PayloadAction<string>) => {
      state.currentOrder = state.orders.find(order => order._id === action.payload) || null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders.push(action.payload.order);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      // Fetch Orders
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      // Update Order
      .addCase(updateOrder.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.orders.findIndex(order => order._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      // Delete Order
      .addCase(deleteOrder.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = state.orders.filter(order => order._id !== action.payload);
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
          // Fetch Orders by User ID
      .addCase(fetchOrdersByUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrdersByUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload; // Update state with user's orders
      })
      .addCase(fetchOrdersByUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
  },
});

export const { setCurrentOrder, clearCurrentOrder } = orderSlice.actions;

export default orderSlice.reducer;

