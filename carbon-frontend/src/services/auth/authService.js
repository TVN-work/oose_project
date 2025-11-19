import apiClient from '../api/client';
import { API_ENDPOINTS } from '../../config/api';

export const authService = {
  login: async (credentials) => {
    return apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
  },

  register: async (userData) => {
    return apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData);
  },

  logout: async () => {
    return apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  },

  getProfile: async () => {
    try {
      return await apiClient.get(API_ENDPOINTS.AUTH.PROFILE);
    } catch (error) {
      // For development: return mock profile if API fails
      console.warn('Auth API not available, returning mock profile');
      throw error; // Re-throw to let AuthContext handle it
    }
  },

  refreshToken: async () => {
    return apiClient.post(API_ENDPOINTS.AUTH.REFRESH);
  },
};

export default authService;

