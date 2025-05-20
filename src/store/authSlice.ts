import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import {
  loginUser,
  getUserData,
  registerUser,
  updateUserProfileAPI,
  initiatePasswordResetAPI,
  confirmPasswordResetAPI,
} from "../api/auth"
import { fetchCart } from "./cartSlice"

export interface User {
  id: string
  _id?: string
  email: string
  name: string
  role?: "user" | "admin"
  profilePicture?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}

interface AuthResponse {
  email: string
  name: string
  id: string
  _id: string
  token: string
  success: boolean
  role?: "user" | "admin"
  profilePicture?: string
  refreshToken?: string
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  status: "idle",
  error: null,
}

export const checkAuthToken = createAsyncThunk<AuthResponse, void, { rejectValue: string }>(
  "auth/checkAuthToken",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        throw new Error("No token found")
      }
      const response = await getUserData(token)
      return response.data.data
    } catch (error: any) {
      localStorage.removeItem("authToken")
      localStorage.removeItem("refreshToken")
      localStorage.removeItem("id")
  
      const errorMessage =
        error.response?.data?.message || error.response?.data?.error || error.message || "Authentication failed"
      return rejectWithValue(errorMessage)
    }
  },
)

export const registerUserThunk = createAsyncThunk<
  AuthResponse,
  { email: string; name: string; password: string },
  { rejectValue: string }
>("auth/registerUser", async (userData, { rejectWithValue }) => {
  try {
    const response = await registerUser(userData)
    const data = response.data.data
    localStorage.setItem("authToken", data.token)
    localStorage.setItem("refreshToken", data.refreshToken) // Save refresh token
    localStorage.setItem("id", data.id)

    return data
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || error.response?.data?.error || error.message || "Registration failed"
    return rejectWithValue(errorMessage)
  }
})

export const loginUserThunk = createAsyncThunk<
  AuthResponse,
  { email: string; password: string; googleId?: string; tokens?: string },
  { rejectValue: string }
>("auth/loginUser", async (credentials, { rejectWithValue, dispatch }) => {
  try {
    const response = await loginUser(credentials)
    const data = response.data.data
    localStorage.setItem("authToken", data.token)
    localStorage.setItem("refreshToken", data.refreshToken) // Save refresh token
    localStorage.setItem("id", data.id)

    await dispatch(fetchCart())
    return data
  } catch (error: any) {

    const errorMessage = error.response?.data || error.response?.data?.message || error.response?.data?.error || error.message || "Login failed"
    return rejectWithValue(errorMessage)
  }
})

export const logoutUserThunk = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      localStorage.removeItem("authToken")
      localStorage.removeItem("refreshToken")
      localStorage.removeItem("id")
      localStorage.removeItem("user")
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.response?.data?.error || error.message || "Logout failed"
      return rejectWithValue(errorMessage)
    }
  },
)

export const fetchUserData = createAsyncThunk<User, string, { rejectValue: string }>(
  "auth/getUserData",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await getUserData(userId)
      return response.data.data
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.response?.data?.error || error.message || "Failed to fetch user data"
      return rejectWithValue(errorMessage)
    }
  },
)

export const updateUserProfile = createAsyncThunk<User, { name: string; email: string }, { rejectValue: string }>(
  "auth/updateUserProfile",
  async (userData, { rejectWithValue, getState }) => {
    try {
      // Get current user ID and token from Redux state
      const state = getState()
      const userId = (state as { auth: AuthState }).auth.user?.id
      const token = (state as { auth: AuthState }).auth.token

      // If userId or token is not available, throw an error
      if (!userId || !token) {
        throw new Error("User not authenticated")
      }

      // Assuming you have an API function `updateUserProfileAPI` to handle the request
      const response = await updateUserProfileAPI(userData)

      // Return the updated user data (assuming it comes in response.data.data)
      return response.data.data
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.response?.data?.error || error.message || "Profile update failed"
      return rejectWithValue(errorMessage)
    }
  },
)

export const updateUserProfilePicture = createAsyncThunk<User, { profilePicture: string }, { rejectValue: string }>(
  "auth/updateUserProfilePicture",
  async ({ profilePicture }, { rejectWithValue, getState }) => {
    try {
      // Get current user ID and token from Redux state
      const state = getState()
      const userId = (state as { auth: AuthState }).auth.user?.id
      const token = (state as { auth: AuthState }).auth.token

      // If userId or token is not available, throw an error
      if (!userId || !token) {
        throw new Error("User not authenticated")
      }

      // API call to update profile picture
      const response = await updateUserProfileAPI({ profilePicture })

      // Return the updated user data (assuming it comes in response.data.data)
      return response.data.data
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.response?.data?.error || error.message || "Profile picture update failed"
      return rejectWithValue(errorMessage)
    }
  },
)

export const initiatePasswordReset = createAsyncThunk<{ message: string }, { email: string }, { rejectValue: string }>(
  "auth/initiatePasswordReset",
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await initiatePasswordResetAPI(email)
      return response.data
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.response?.data?.error || error.message || "Password reset request failed"
      return rejectWithValue(errorMessage)
    }
  },
)

export const confirmPasswordReset = createAsyncThunk<
  { message: string },
  { token: string; newPassword: string },
  { rejectValue: string }
>("auth/confirmPasswordReset", async ({ token, newPassword }, { rejectWithValue }) => {
  try {
    const response = await confirmPasswordResetAPI(token, newPassword)
    return response.data
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || error.response?.data?.error || error.message || "Password reset failed"
    return rejectWithValue(errorMessage)
  }
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = true
    },
    clearUser: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.status = "idle"
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUserThunk.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.user = {
          id: action.payload.id,
          email: action.payload.email,
          name: action.payload.name,
        }
        state.token = null
        state.isAuthenticated = false
        state.error = null
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload || null;
      })
      .addCase(loginUserThunk.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.user = {
          id: action.payload.id,
          email: action.payload.email,
          role: action.payload.role,
          name: action.payload.name,
          profilePicture: action.payload.profilePicture,
        }
        state.token = action.payload.token
        state.isAuthenticated = true
        state.error = null

        // Persist to localStorage
        localStorage.setItem("user", JSON.stringify(state.user))
        localStorage.setItem("authToken", action.payload.token)
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload || null;
      })
      .addCase(logoutUserThunk.pending, (state) => {
        state.status = "loading"
      })
      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.status = "idle"
        state.error = null
        // Clear from localStorage
        localStorage.removeItem("user")
        localStorage.removeItem("authToken")
      })
      .addCase(logoutUserThunk.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload || null;
      })
      .addCase(fetchUserData.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.user = action.payload
        state.error = null
        state.status = "succeeded"
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload || null;
      })
      .addCase(checkAuthToken.pending, (state) => {
        state.status = "loading"
      })
      .addCase(checkAuthToken.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.user = {
          id: action.payload._id,
          email: action.payload.email,
          role: action.payload.role,
          name: action.payload.name,
          profilePicture: action.payload.profilePicture,
        }
        state.token = action.payload.token
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(checkAuthToken.rejected, (state) => {
        state.status = "failed"
        state.user = null
        state.token = null
        state.isAuthenticated = false
        // state.error = action.payload || null;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded"
        // Update the user's profile with the new data
        state.user = action.payload
        state.error = null
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload || null;
      })
      .addCase(updateUserProfilePicture.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(updateUserProfilePicture.fulfilled, (state, action) => {
        state.status = "succeeded"
        if (state.user) {
          state.user.profilePicture = action.payload.profilePicture
        }
        state.error = null
      })
      .addCase(updateUserProfilePicture.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload || null;
      })
      .addCase(initiatePasswordReset.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(initiatePasswordReset.fulfilled, (state) => {
        state.status = "succeeded"
        state.error = null
      })
      .addCase(initiatePasswordReset.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload || null;
      })
      .addCase(confirmPasswordReset.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(confirmPasswordReset.fulfilled, (state) => {
        state.status = "succeeded"
        state.error = null
      })
      .addCase(confirmPasswordReset.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload || null;
      })
  },
})

export const { setUser, clearUser } = authSlice.actions

export default authSlice.reducer
