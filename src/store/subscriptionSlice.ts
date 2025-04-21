import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";



interface SubscriptionResponse {
    message: string;
    // You can extend this with any other fields returned by your API
  }
  
// Async thunk for subscribing to the newsletter
export const subscribeToNewsletter = createAsyncThunk <SubscriptionResponse ,string, { rejectValue: string } >(
  "subscription/subscribe",
  async (email, { rejectWithValue }) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/subscription/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to subscribe");
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState: {
    loading: false,
    success: false,
    error: null as Error | null,
  },
  reducers: {
    resetSubscription: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(subscribeToNewsletter.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(subscribeToNewsletter.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(subscribeToNewsletter.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload ? new Error(action.payload as string) : new Error("Something went wrong");
      });
  },
});

export const { resetSubscription } = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
