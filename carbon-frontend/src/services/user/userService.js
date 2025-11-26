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
   * Get all users with pagination
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 0)
   * @param {number} params.entry - Items per page (default: 10)
   * @param {string} params.field - Sort field (default: 'id')
   * @param {string} params.sort - Sort direction: 'ASC' or 'DESC' (default: 'DESC')
   * @returns {Promise<Array>} List of users
   */
  getAllUsers: async (params = {}) => {
    try {
      const {
        page = 0,
        entry = 10,
        field = 'id',
        sort = 'DESC',
      } = params;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        entry: entry.toString(),
        field,
        sort,
      });

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
};

export default userService;
