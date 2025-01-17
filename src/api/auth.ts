import api from "./index";  // Import the axios instance

// API call for logging in the user
export const loginUser = (credentials: { email: string; password: string; googleId?: string }) =>
  api.post(credentials.googleId ? 'api/users/google-login' : 'api/users/login', credentials);


// API call for updating the user's profile
export const updateUserProfileAPI = (data: { email?: string; name?: string; profilePicture?: string }) =>
  api.put('api/users/profile', data);  // Verify profile update API endpoint

// API call for logging out the user
export const logoutUser = () =>
  api.post('api/users/logout');  // Verify logout API endpoint

// API call for fetching all users (admin)
export const getAllUsers = () =>
  api.get('api/admin/users');  // Verify users fetching API endpoint

// API call for deleting a user
export const deleteUserFromApi = (userId: string) =>
  api.delete(`api/admin/users/${userId}`);  // Verify delete user API endpoint

// API call for initiating a password reset (should use a clearer endpoint name)
export const initiatePasswordResetAPI = (email: string) =>
  api.post('api/users/password-reset', { email });  // Check reset password API endpoint

// API call for confirming a password reset
export const confirmPasswordResetAPI = (token: string, newPassword: string) =>
  api.post('api/users/reset-password', { token, newPassword });  // Verify reset confirmation API endpoint

// API call for fetching all orders (admin)
export const getAllOrders = () =>
  api.get('api/admin/orders');  // Verify orders API endpoint

// API call for updating the status of an order
export const updateOrderStatusAPI = (orderId: string, orderStatus: string) =>
  api.put(`api/order/orders/${orderId}`, { orderStatus });  // Verify update order API endpoint

// API call for fetching the logged-in user's data (if needed)
export const getUserData = (token: string) =>
  api.get('api/users/verify', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });  // Verify user data fetch API endpoint

// API call for registering a new user
export const registerUser = (userData: { email: string; name: string; password: string }) =>
  api.post('api/users/register', userData);  // Verify registration API endpoint
