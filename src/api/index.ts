import axios from 'axios';

export const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials:true
});

// Add an interceptor to attach the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // Get token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Add token to Authorization header
    }
    return config;
  },
  (error) => {
    // Handle error responses (e.g., redirect to login if unauthorized)
    if (error.response && error.response.status === 401) {
      // Redirect to login page or show an error message
    }
    return Promise.reject(error);
  }
);

export default api;
