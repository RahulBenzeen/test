import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { loginUser, getUserData, registerUser } from '../api/auth';

// Define more specific types
interface User {
  id: string;
  email: string;
  name?: string;
  role?: 'user' | 'admin';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Define types for API responses
interface AuthResponse {
  email: string;
  id: string;
  token: string;
  success: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  status: 'idle',
  error: null,
};

export const checkAuthToken = createAsyncThunk<User, void, { rejectValue: string }>(
  'auth/checkAuthToken',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No token found');
      }
      const response = await getUserData(token);
      return response.data.data;
    } catch (error) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('id');
      return rejectWithValue((error as Error).message);
    }
  }
);

export const registerUserThunk = createAsyncThunk<
  AuthResponse,
  { email: string; name: string; password: string },
  { rejectValue: string }
>('auth/registerUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await registerUser(userData);
    const data = response.data.data;
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('id', data.id);
    return data;
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
    const data = response.data.data;
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('id', data.id);
    return data;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const logoutUserThunk = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('id');
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
      return response.data.data;
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
      state.token = null;
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
        state.user = {
          id: action.payload.id,
          email: action.payload.email
        };
        state.token = action.payload.token;
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
        state.user = {
          id: action.payload.id,
          email: action.payload.email
        };
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to login';
      })
      .addCase(logoutUserThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.status = 'idle';
        state.error = null;
      })
      .addCase(logoutUserThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to logout';
      })
      .addCase(fetchUserData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.user = action.payload;
        state.error = null;
        state.status = 'succeeded';
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.status = 'failed';
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
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload || 'Failed to authenticate';
      });
  },
});

export const { setUser, clearUser } = authSlice.actions;

export default authSlice.reducer;