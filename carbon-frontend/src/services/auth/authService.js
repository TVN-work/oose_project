import apiClient from '../api/client';
import { API_ENDPOINTS } from '../../config/api';
import { mockAuthService, shouldUseMock } from '../mock';

export const authService = {
  login: async (credentials) => {
    if (shouldUseMock()) {
      return mockAuthService.login(credentials);
    }
    return apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
  },

  register: async (userData) => {
    if (shouldUseMock()) {
      return mockAuthService.register(userData);
    }
    return apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData);
  },

  logout: async () => {
    if (shouldUseMock()) {
      return mockAuthService.logout();
    }
    return apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  },

  getProfile: async () => {
    if (shouldUseMock()) {
      return mockAuthService.getProfile();
    }
    try {
      return await apiClient.get(API_ENDPOINTS.AUTH.PROFILE);
    } catch (error) {
      // Fallback to mock if API fails in dev mode
      if (import.meta.env.DEV) {
        console.warn('Auth API not available, using mock profile');
        return mockAuthService.getProfile();
      }
      throw error;
    }
  },

  refreshToken: async () => {
    if (shouldUseMock()) {
      return mockAuthService.refreshToken();
    }
    return apiClient.post(API_ENDPOINTS.AUTH.REFRESH);
  },
};

export default authService;

