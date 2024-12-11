import { ShippingAddress } from "../store/addressSlice";
import api from "./index";  // Import the axios instance

// API call for logging in the user
export const saveAddress = (shippingAddress:ShippingAddress) => 
  api.post('api/address/add', shippingAddress);  // Replace with your actual login API endpoint
export const getAllAddress = () => 
  api.get('api/address/all');  // Replace with your actual login API endpoint
