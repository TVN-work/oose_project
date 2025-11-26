import apiClient from '../api/client';
import { API_ENDPOINTS } from '../../config/api';

/**
 * User Service
 * Handles user operations
 */
const userService = {
  /**
   * Get user by ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User details
   * 
   * Response format:
   * {
   *   "id": "string",
   *   "username": "string",
   *   "email": "string",
   *   "fullName": "string",
   *   "phoneNumber": "string",
   *   "role": "string",
   *   "createdAt": "2025-11-24T17:00:00.000Z",
   *   "updatedAt": "2025-11-24T17:00:00.000Z"
   * }
   */
  getUserById: async (userId) => {
    try {
      const response = await apiClient.get(
        API_ENDPOINTS.USER.USER_BY_ID.replace(':id', userId),
        {
          headers: {
            'accept': '*/*',
          },
        }
      );
      return response;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw error;
    }
  },

  /**
   * Get all users with pagination and search filters
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 0)
   * @param {number} params.entry - Items per page (default: 10)
   * @param {string} params.field - Sort field (default: 'id')
   * @param {string} params.sort - Sort direction: 'ASC' or 'DESC' (default: 'DESC')
   * @param {string} params.fullName - Filter by full name (optional)
   * @param {string} params.email - Filter by email (optional)
   * @param {string} params.phoneNumber - Filter by phone number (optional)
   * @returns {Promise<Array>} List of users
   */
  getAllUsers: async (params = {}) => {
    try {
      const {
        page = 0,
        entry = 10,
        field = 'id',
        sort = 'DESC',
        fullName,
        email,
        phoneNumber,
      } = params;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        entry: entry.toString(),
        field,
        sort,
      });

      // Add optional search filters
      if (fullName) queryParams.append('fullName', fullName);
      if (email) queryParams.append('email', email);
      if (phoneNumber) queryParams.append('phoneNumber', phoneNumber);

      const response = await apiClient.get(
        `${API_ENDPOINTS.USER.USERS}?${queryParams.toString()}`,
        {
          headers: {
            'accept': '*/*',
          },
        }
      );
      return response;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  /**
   * Update user information
   * @param {string} userId - User ID
   * @param {Object} userData - User data to update
   * @returns {Promise<Object>} Updated user
   */
  updateUser: async (userId, userData) => {
    try {
      const response = await apiClient.patch(
        API_ENDPOINTS.USER.USER_BY_ID.replace(':id', userId),
        userData,
        {
          headers: {
            'accept': '*/*',
            'Content-Type': 'application/json',
          },
        }
      );
      return response;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  /**
   * Lock user account
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Result
   */
  lockUser: async (userId) => {
    try {
      const response = await apiClient.post(
        `${API_ENDPOINTS.USER.USER_BY_ID.replace(':id', userId)}/lock`,
        {},
        {
          headers: {
            'accept': '*/*',
          },
        }
      );
      return response;
    } catch (error) {
      console.error('Error locking user:', error);
      throw error;
    }
  },

  /**
   * Unlock user account
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Result
   */
  unlockUser: async (userId) => {
    try {
      const response = await apiClient.post(
        `${API_ENDPOINTS.USER.USER_BY_ID.replace(':id', userId)}/unlock`,
        {},
        {
          headers: {
            'accept': '*/*',
          },
        }
      );
      return response;
    } catch (error) {
      console.error('Error unlocking user:', error);
      throw error;
    }
  },

  /**
   * Delete user
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Result
   */
  deleteUser: async (userId) => {
    try {
      const response = await apiClient.delete(
        API_ENDPOINTS.USER.USER_BY_ID.replace(':id', userId),
        {
          headers: {
            'accept': '*/*',
          },
        }
      );
      return response;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },
};

export default userService;
