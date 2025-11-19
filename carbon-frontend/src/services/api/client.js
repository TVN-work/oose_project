import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
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

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Only handle network errors, not 404s from missing endpoints
    if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
      // In development, don't redirect on network errors
      if (import.meta.env.DEV) {
        console.warn('API endpoint not available:', error.config?.url);
        return Promise.reject(error);
      }
    }
    
    if (error.response?.status === 401) {
      // Handle unauthorized - clear token and redirect to login
      localStorage.removeItem('authToken');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

