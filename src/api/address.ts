import { ShippingAddress } from "../store/addressSlice";
import api from "./index";  // Import the axios instance

// API call for saving a new address
export const saveAddress = (shippingAddress: ShippingAddress) =>
  api.post('api/address/add', shippingAddress);  // Replace with your actual API endpoint

// API call for getting all addresses
export const getAllAddress = () =>
  api.get('api/address/all');  // Replace with your actual API endpoint

// API call for deleting an address
export const deleteAddress = (addressId: string) =>
  api.delete(`api/address/${addressId}`);  // Replace with your actual API endpoint and address identifier

// API call for updating an existing address
export const updateAddress = (addressId: string, shippingAddress: ShippingAddress) =>
  api.put(`api/address/${addressId}`, shippingAddress);  // Replace with your actual API endpoint and address identifier
