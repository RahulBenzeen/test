import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include the access token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle 401 (Unauthorized) error and refresh token logic
api.interceptors.response.use(
  (response) => response, // Pass through successful responses
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Access the refresh token stored on the client
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          // Automatically use the refresh token to get a new access token
          const refreshResponse = await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/users/refresh-token`, { refreshToken });
 
          const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data.data;

          // Store the new access and refresh tokens
          localStorage.setItem('authToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);

          // Retry the original request with the new access token
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
          return axios(originalRequest);
        } catch {
          // Handle refresh token failure (user needs to log in again)
          console.error('Refresh token expired or invalid.');
          // Redirect to login page or show appropriate message
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
