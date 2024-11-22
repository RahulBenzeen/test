import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { loginUser, logoutUser, getUserData, registerUser } from '../api/auth';

// Define more specific types
interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin'; // Use a union type for specific roles
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Define types for API responses
interface AuthResponse {
  user: User;
  token: string;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  status: 'idle',
  error: null,
};

export const checkAuthToken = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>('auth/checkAuthToken', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No token found');
    }
    const response = await getUserData(token);
    return response.data;
  } catch (error) {
    localStorage.removeItem('authToken');
    return rejectWithValue((error as Error).message);
  }
});

// Improve type safety for async thunks
export const registerUserThunk = createAsyncThunk<
  AuthResponse,
  { email: string; name: string; password: string },
  { rejectValue: string }
>('auth/registerUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await registerUser(userData);
    localStorage.setItem('authToken', response.data.data.token);
    return response.data;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const loginUserThunk = createAsyncThunk<
  AuthResponse,
  { email: string; password: string },
  { rejectValue: string }
>('auth/loginUser', async (credentials, { rejectWithValue }) => {
  try {
    const response = await loginUser(credentials);
    console.log('authToken', response.data.data.token)
    localStorage.setItem('authToken', response.data.data.token);
    return response.data;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const logoutUserThunk = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await logoutUser();
      localStorage.removeItem('authToken');
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchUserData = createAsyncThunk<User, string, { rejectValue: string }>(
  'auth/getUserData',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await getUserData(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUserThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to register';
      })
      .addCase(loginUserThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to login';
      })
      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.status = 'idle';
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.error = action.payload || 'Failed to fetch user data';
      })
      .addCase(checkAuthToken.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(checkAuthToken.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(checkAuthToken.rejected, (state, action) => {
        state.status = 'failed';
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload || 'Failed to authenticate';
      });
  },
});

export const { setUser, clearUser } = authSlice.actions;

export default authSlice.reducer;