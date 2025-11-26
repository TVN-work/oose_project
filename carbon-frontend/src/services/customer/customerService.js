import apiClient from '../api/client';
import { API_ENDPOINTS } from '../../config/api';

/**
 * Customer Service
 * Handles customer profile and password operations
 */
const customerService = {
  /**
   * Get current user profile
   * @returns {Promise<Object>} User profile
   * 
   * Response format:
   * {
   *   "id": "string",
   *   "fullName": "string",
   *   "email": "string",
   *   "phoneNumber": "string",
   *   "dob": "2025-11-26",
   *   "role": "EV_OWNER"
   * }
   */
  getProfile: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.AUTH.PROFILE, {
        headers: {
          'accept': '*/*',
        },
      });
      return response;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  /**
   * Change password
   * @param {Object} passwordData - Password change data
   * @param {string} passwordData.oldPassword - Current password
   * @param {string} passwordData.newPassword - New password
   * @param {string} passwordData.confirmPassword - Confirm new password
   * @returns {Promise<string>} Success message
   */
  changePassword: async (passwordData) => {
    try {
      const response = await apiClient.patch('/customer/change-password', passwordData, {
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json',
        },
      });
      return response;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  },

  /**
   * Update profile
   * @param {Object} profileData - Profile data to update
   * @param {string} profileData.fullName - Full name
   * @param {string} profileData.email - Email
   * @param {string} profileData.phoneNumber - Phone number
   * @param {string} profileData.dob - Date of birth
   * @returns {Promise<Object>} Updated profile
   */
  updateProfile: async (profileData) => {
    try {
      const response = await apiClient.patch(API_ENDPOINTS.AUTH.PROFILE, profileData, {
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json',
        },
      });
      return response;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },
};

export default customerService;
