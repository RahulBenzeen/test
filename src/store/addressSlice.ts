import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { deleteAddress, getAllAddress, saveAddress, updateAddress } from "../api/address";

// Renaming the Address interface to ShippingAddress
export interface ShippingAddress {
  _id?: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
  type?: string;
}

interface AddressState {
  addresses: ShippingAddress[]; // Updated type here
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AddressState = {
  addresses: [],
  status: "idle",
  error: null,
};

// Async thunks

// Fetch all addresses
export const fetchAddresses = createAsyncThunk(
  "address/fetchAddresses",
  async () => {
    const response = await getAllAddress()
    return response.data.addresses;
  }
);

// Save a new address
export const saveNewAddress = createAsyncThunk("address/saveAddress",
  async (shippingAddress: ShippingAddress) => { // Updated type here
    const response = await saveAddress(shippingAddress);
    return response.data.address;
  }
);

// Update an existing address
export const updateAddresses = createAsyncThunk(
  "address/updateAddress",
  async (address: ShippingAddress) => { // Updated type here
    if (!address._id) {
      throw new Error("Address ID is required");
    }
    const response = await updateAddress(address._id, address);
    return response.data.address;
  }
);

// Delete an address
export const deleteAddresses = createAsyncThunk(
  "address/deleteAddress",
  async (addressId: string) => {
    await deleteAddress(addressId);
    return addressId;
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Addresses
      .addCase(fetchAddresses.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.addresses = action.payload;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      // Save Address
      .addCase(saveNewAddress.pending, (state) => {
        state.status = "loading";
      })
      .addCase(saveNewAddress.fulfilled, (state, action) => {
        console.log(action.payload)
        state.status = "succeeded";
        state.addresses.push(action.payload); // Add new address to the state
      })
      .addCase(saveNewAddress.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      // Update Address
      .addCase(updateAddresses.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateAddresses.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.addresses.findIndex(
          (address) => address._id === action.payload._id
        );
        if (index !== -1) {
          state.addresses[index] = action.payload; // Update the address in the state
        }
      })
      .addCase(updateAddresses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      // Delete Address
      .addCase(deleteAddresses.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteAddresses.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.addresses = state.addresses.filter(
          (address) => address._id !== action.payload
        ); // Remove the address from the state
      })
      .addCase(deleteAddresses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      });
  },
});

export default addressSlice.reducer;
