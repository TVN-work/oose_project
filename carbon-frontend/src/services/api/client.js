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
    // Handle network errors (backend not available)
    if (error.code === 'ERR_NETWORK' || error.code === 'ERR_CONNECTION_REFUSED' || error.message?.includes('Network Error')) {
      // In development, silently handle network errors
      if (import.meta.env.DEV) {
        // Only log warning for non-auth endpoints to avoid noise
        if (!error.config?.url?.includes('/auth/')) {
          console.warn('API endpoint not available:', error.config?.url);
        }
        // Return a rejected promise but don't show error in console
        return Promise.reject(error);
      }
    }
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // Only redirect if not in dev mode or if explicitly configured
      if (!import.meta.env.DEV || import.meta.env.VITE_DEV_MODE === 'false') {
        localStorage.removeItem('authToken');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;

