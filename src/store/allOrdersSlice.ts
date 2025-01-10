// src/store/ordersSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { getAllOrders, updateOrderStatusAPI } from '../api/auth'  // Assume the `updateOrderStatusAPI` is the API function that updates the status

// Define the types for the orders and state
interface Product {
  product: string
  name: string
  quantity: number
  price: number,
  _id: string
}

interface ShippingAddress {
  country: string
  postalCode: string
}

interface User {
  _id: string
  name: string
  email: string
}

interface Order {
  _id: string
  user: User
  products: Product[]
  totalPrice: number
  shippingAddress: ShippingAddress
  paymentStatus: string
  orderStatus: string
  createdAt: string
  updatedAt: string
}

interface OrdersState {
  orders: Order[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

// Define the initial state
const initialState: OrdersState = {
  orders: [],
  status: 'idle',
  error: null,
}

// Define the async thunk to fetch all orders
export const fetchAllOrders = createAsyncThunk(
  'orders/fetchAllOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllOrders() // API call to get all orders
      return response.data.orders // Return the orders data
    } catch (error) {
      return rejectWithValue((error as Error).message) // Handle errors
    }
  }
)

// Define the async thunk to update the order status
export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ id, orderStatus }: { id: string, orderStatus: string }, { rejectWithValue }) => {
    console.log({ id, orderStatus })
    try {
      await updateOrderStatusAPI(id, orderStatus) // API call to update the order status
      return { id, orderStatus }  // Return the updated status and order id
    } catch (error) {
      return rejectWithValue((error as Error).message) // Handle errors
    }
  }
)

// Create the orders slice
const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetching orders
      .addCase(fetchAllOrders.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.orders = action.payload // Update state with fetched orders
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to load orders'
      })
      
      // Updating order status
      .addCase(updateOrderStatus.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.status = 'succeeded'
        const { id, orderStatus } = action.payload
        // Find the order and update its status
        const updatedOrder = state.orders.find(order => order._id === id)
        if (updatedOrder) {
          updatedOrder.orderStatus = orderStatus
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to update order status'
      })
  },
})

export default ordersSlice.reducer
