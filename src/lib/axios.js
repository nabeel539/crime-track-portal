
import axios from 'axios';

// Create an axios instance with a base URL for our API
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Change this to your actual API URL in production
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add auth token to all requests
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
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

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors (token expired)
    if (error.response && error.response.status === 401) {
      // Clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      // Redirect to login
      window.location.href = '/';
    }
    
    return Promise.reject(error);
  }
);

export default api;
