import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../../config/api';
import { mockAuthService, shouldUseMock } from '../mock';

export const authService = {
  login: async (credentials) => {
    // Use mock if explicitly enabled
    if (shouldUseMock()) {
      return mockAuthService.login(credentials);
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`,
        credentials,
        {
          headers: {
            'accept': '*/*',
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      // Fallback to mock if network error (backend not running)
      if (error.code === 'ERR_NETWORK' || error.code === 'ERR_CONNECTION_REFUSED' || error.message?.includes('Network Error')) {
        console.warn('Backend not available, using mock service for login');
        return mockAuthService.login(credentials);
      }
      throw error;
    }
  },

  register: async (userData) => {
    // Use mock if explicitly enabled
    if (shouldUseMock()) {
      return mockAuthService.register(userData);
    }

    try {
      // Create FormData for multipart/form-data request
      const formData = new FormData();
      formData.append('fullName', userData.fullName);
      formData.append('email', userData.email);
      formData.append('password', userData.password);
      formData.append('phoneNumber', userData.phone);
      formData.append('role', userData.role);
      // Add dob if provided, otherwise use current date
      formData.append('dob', userData.dob || new Date().toISOString().split('T')[0]);

      const response = await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.AUTH.REGISTER}`,
        formData,
        {
          headers: {
            'accept': '*/*',
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      // Fallback to mock if network error (backend not running)
      if (error.code === 'ERR_NETWORK' || error.code === 'ERR_CONNECTION_REFUSED' || error.message?.includes('Network Error')) {
        console.warn('Backend not available, using mock service for register');
        return mockAuthService.register(userData);
      }
      throw error;
    }
  },

  logout: async () => {
    const token = localStorage.getItem('authToken');
    const response = await axios.post(
      `${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGOUT}`,
      {},
      {
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  getProfile: async () => {
    // Use mock if explicitly enabled
    if (shouldUseMock()) {
      return mockAuthService.getProfile();
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.AUTH.PROFILE}`,
        {
          headers: {
            'accept': '*/*',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      // Fallback to mock if network error (backend not running)
      if (error.code === 'ERR_NETWORK' || error.code === 'ERR_CONNECTION_REFUSED' || error.message?.includes('Network Error')) {
        console.warn('Backend not available, using mock service for getProfile');
        return mockAuthService.getProfile();
      }
      throw error;
    }
  },

  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await axios.post(
      `${API_BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`,
      { refreshToken },
      {
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  },

  changePassword: async (currentPassword, newPassword, confirmPassword) => {
    // Use mock if explicitly enabled
    if (shouldUseMock()) {
      return mockAuthService.changePassword(currentPassword, newPassword, confirmPassword);
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.patch(
        `${API_BASE_URL}${API_ENDPOINTS.AUTH.CHANGE_PASSWORD}`,
        {
          oldPassword: currentPassword,
          newPassword: newPassword,
          confirmPassword: confirmPassword,
        },
        {
          headers: {
            'accept': '*/*',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      // Fallback to mock if network error (backend not running)
      if (error.code === 'ERR_NETWORK' || error.code === 'ERR_CONNECTION_REFUSED' || error.message?.includes('Network Error')) {
        console.warn('Backend not available, using mock service for changePassword');
        return mockAuthService.changePassword(currentPassword, newPassword, confirmPassword);
      }
      throw error;
    }
  },

  updateProfile: async (profileData) => {
    // Use mock if explicitly enabled
    if (shouldUseMock()) {
      return mockAuthService.updateProfile(profileData);
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.patch(
        `${API_BASE_URL}${API_ENDPOINTS.AUTH.PROFILE}`,
        {
          fullName: profileData.fullName || profileData.full_name,
          email: profileData.email,
          phoneNumber: profileData.phoneNumber || profileData.phone_number,
          dob: profileData.dob,
        },
        {
          headers: {
            'accept': '*/*',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      // Fallback to mock if network error (backend not running)
      if (error.code === 'ERR_NETWORK' || error.code === 'ERR_CONNECTION_REFUSED' || error.message?.includes('Network Error')) {
        console.warn('Backend not available, using mock service for updateProfile');
        return mockAuthService.updateProfile(profileData);
      }
      throw error;
    }
  },
};

export default authService;

