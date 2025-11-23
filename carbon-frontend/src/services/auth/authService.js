import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../../config/api';

export const authService = {
  login: async (credentials) => {
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
  },

  register: async (userData) => {
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
    const token = localStorage.getItem('authToken');
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
  },

  updateProfile: async (profileData) => {
    const token = localStorage.getItem('authToken');
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
  },
};

export default authService;

