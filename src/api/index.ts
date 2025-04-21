import axios from 'axios';



const api = axios.create({
  baseURL:import.meta.env.VITE_APP_API_URL,
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
