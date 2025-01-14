import api from "./index";  // Import the axios instance

// API call for logging in the user
export const loginUser = (credentials: { email: string; password: string }) => 
  api.post('api/users/login', credentials);  // Replace with your actual login API endpoint

export const updateUserProfileAPI = (data: { email?: string; name?: string, profilePicture?:string }) => 
  api.put('api/users/profile', data);  // Replace with your actual login API endpoint

// API call for logging out the user
export const logoutUser = () => 
  api.post('api/users/logout');  // Replace with your actual logout API endpoint

export const getAllUsers = () => 
  api.get('api/admin/users');  // Replace with your actual logout API endpoint

export const deleteUserFromApi = (userId:string) => 
  api.delete(`api/admin/users/${userId}`);  // Replace with your actual logout API endpoint

export const initiatePasswordResetAPI = (email:string) => 
  api.post('api/users/users', email);  // Replace with your actual logout API endpoint

export const confirmPasswordResetAPI = (token: string, newPassword:string) => 
  api.post('api/users/reset-password',{token, newPassword});  // Replace with your actual logout API endpoint

export const getAllOrders = () => 
  api.get('api/admin/orders');  // Replace with your actual logout API endpoint

export const updateOrderStatusAPI = (orderId: string, orderStatus:string) => 
  api.put(`api/order/orders/${orderId}`, {orderStatus});  // Replace with your actual logout API endpoint

// API call for fetching the logged-in user's data (if needed)
export const getUserData = (token: string) =>
  api.get('api/users/verify', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// API call for registering a new user
export const registerUser = (userData: { email: string; name: string; password: string }) =>
  api.post('api/users/register', userData);  // Replace with your actual registration API endpoint
