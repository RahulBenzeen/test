import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getAllUsers } from '../api/auth';


 export interface Users {
  id: string;
  _id?: string;
  email: string;
  numberOfOrders:number
  name: string;
  role?: 'user' | 'admin';
}

interface UsersState {
  users: Users[]; // Array to hold all users
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  status: 'idle',
  error: null,
};

export const fetchAllUsers = createAsyncThunk(
    'users/fetchAllUsers',
    async (_, { rejectWithValue }) => {
      try {
        const response = await getAllUsers(); // API call to get all users
        return response.data.users; // Return the users data
      } catch (error) {
        return rejectWithValue((error as Error).message); // Handle errors
      }
    }
  )

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.status = 'loading';
        state.error = null; // Reset errors while loading
      })
      .addCase(fetchAllUsers.fulfilled, (state, action: PayloadAction<Users[]>) => {
        state.status = 'succeeded';
        state.users = action.payload; // Populate the users list
        state.error = null;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Failed to fetch users';
      });
  },
});

export default usersSlice.reducer;
