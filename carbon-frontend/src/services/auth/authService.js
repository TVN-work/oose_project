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
    const refreshToken = localStorage.getItem('refreshToken');
    return apiClient.post(API_ENDPOINTS.AUTH.REFRESH, { refreshToken });
  },

  changePassword: async (currentPassword, newPassword, confirmPassword) => {
    if (shouldUseMock()) {
      return mockAuthService.changePassword(currentPassword, newPassword, confirmPassword);
    }
    // Backend expects: oldPassword, newPassword, confirmPassword
    return apiClient.patch(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, {
      oldPassword: currentPassword,
      newPassword: newPassword,
      confirmPassword: confirmPassword,
    });
  },

  updateProfile: async (profileData) => {
    if (shouldUseMock()) {
      return mockAuthService.updateProfile(profileData);
    }
    // Backend expects: fullName, email, phoneNumber, dob
    return apiClient.patch(API_ENDPOINTS.AUTH.PROFILE, {
      fullName: profileData.fullName || profileData.full_name,
      email: profileData.email,
      phoneNumber: profileData.phoneNumber || profileData.phone_number,
      dob: profileData.dob,
    });
  },
};

export default authService;

