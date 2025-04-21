import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getAllUsers, deleteUserFromApi } from '../api/auth'; // Assuming you have an API method to delete a user

export interface Users {
  id: string;
  _id?: string;
  email: string;
  numberOfOrders: number;
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

// Fetch all users
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
);

// Delete a user
export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      await deleteUserFromApi(userId); // API call to delete user
      return userId; // Return the user ID to remove it from the state
    } catch (error) {
      return rejectWithValue((error as Error).message); // Handle errors
    }
  }
);

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
      })
      // Handle delete user action
      .addCase(deleteUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = 'succeeded';
        // Remove the deleted user from the list
        state.users = state.users.filter(user => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Failed to delete user';
      });
  },
});

export default usersSlice.reducer;
