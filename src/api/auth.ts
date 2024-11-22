import api from "./index";  // Import the axios instance

// API call for logging in the user
export const loginUser = (credentials: { email: string; password: string }) => 
  api.post('api/users/login', credentials);  // Replace with your actual login API endpoint

// API call for logging out the user
export const logoutUser = () => 
  api.post('/logout');  // Replace with your actual logout API endpoint

// API call for fetching the logged-in user's data (if needed)
export const getUserData = (userId: string) => 
  api.get(`/user/${userId}`);  // Replace with your actual API endpoint to get user details

// API call for registering a new user
export const registerUser = (userData: { email: string; name: string; password: string }) =>
  api.post('api/users/register', userData);  // Replace with your actual registration API endpoint
