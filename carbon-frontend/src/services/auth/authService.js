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
    return apiClient.get(API_ENDPOINTS.AUTH.PROFILE);
  },

  refreshToken: async () => {
    return apiClient.post(API_ENDPOINTS.AUTH.REFRESH);
  },
};

export default authService;

