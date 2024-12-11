import api from "./index";  // Import the axios instance

// API call for logging in the user
export const placeOrder = (orderData) => 
  api.post('api/order/create', orderData);  // Replace with your actual login API endpoint
export const getOrderByUserId = () => 
  api.get('api/order/myorder');  // Replace with your actual login API endpoint

