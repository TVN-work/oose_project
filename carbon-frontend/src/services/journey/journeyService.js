import apiClient from '../api/client';
import { API_ENDPOINTS } from '../../config/api';

/**
 * Journey Service
 * Handles journey operations (journey table)
 * Manage EV trip/journey data
 */
const journeyService = {
  /**
   * Get all journeys with optional filters and pagination
   * @param {Object} params - Query parameters
   * @param {string} params.journeyId - Journey ID filter (optional)
   * @param {string} params.journeyStatus - Status filter: PENDING, APPROVED, REJECTED, CANCELLED (optional)
   * @param {number} params.page - Page number (default: 0)
   * @param {number} params.entry - Items per page (default: 10)
   * @param {string} params.field - Sort field (default: 'id')
   * @param {string} params.sort - Sort direction: 'ASC' or 'DESC' (default: 'DESC')
   * @returns {Promise<Array>} List of journeys
   */
  getAllJourneys: async (params = {}) => {
    try {
      const {
        journeyId,
        journeyStatus,
        page = 0,
        entry = 10,
        field = 'id',
        sort = 'DESC'
      } = params;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        entry: entry.toString(),
        field,
        sort,
      });

      // Add optional filters
      if (journeyId) queryParams.append('journeyId', journeyId);
      if (journeyStatus) queryParams.append('journeyStatus', journeyStatus);

      const response = await apiClient.get(`/journeys?${queryParams.toString()}`, {
        headers: {
          'accept': '*/*',
        },
      });

      return response;
    } catch (error) {
      console.error('Error fetching journeys:', error);
      throw error;
    }
  },

  /**
   * Get journey history by journey ID
   * Returns list of journey history records for a specific journey
   * @param {string} journeyId - Journey ID
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 0)
   * @param {number} params.size - Items per page (default: 10)
   * @param {string} params.sort - Sort field (default: 'createdAt')
   * @param {string} params.order - Sort direction: 'asc' or 'desc' (default: 'desc')
   * @returns {Promise<Object>} Paginated journey history response with content and totalElements
   */
  getJourneyHistoryByJourneyId: async (journeyId, params = {}) => {
    try {
      const {
        page = 0,
        size = 10,
        sort = 'createdAt',
        order = 'desc'
      } = params;

      const queryParams = new URLSearchParams({
        journeyId,
        page: page.toString(),
        entry: size.toString(),
        field: sort,
        sort: order.toUpperCase(),
      });

      const response = await apiClient.get(`/journeys?${queryParams.toString()}`, {
        headers: {
          'accept': '*/*',
        },
      });

      // Transform response to match expected pagination structure
      if (Array.isArray(response)) {
        // If API returns array, wrap in pagination structure
        return {
          content: response,
          totalElements: response.length,
          totalPages: 1,
          size: response.length,
          number: 0
        };
      } else if (response && typeof response === 'object') {
        // If API already returns pagination structure, use as is
        return response;
      } else {
        // Fallback for unexpected response
        return {
          content: [],
          totalElements: 0,
          totalPages: 0,
          size: size,
          number: page
        };
      }
    } catch (error) {
      console.error('Error fetching journey history:', error);
      // Return empty pagination structure on error
      return {
        content: [],
        totalElements: 0,
        totalPages: 0,
        size: params.size || 10,
        number: params.page || 0
      };
    }
  },

  /**
   * Create a new journey
   * @param {Object} journeyData - Journey data
   * @param {string} journeyData.journeyId - Journey ID (required)
   * @param {number} journeyData.newDistance - Distance traveled in km (required)
   * @param {number} journeyData.averageSpeed - Average speed (required)
   * @param {number} journeyData.energyUsed - Energy consumed (required)
   * @param {Array<string>} journeyData.certificateImageUrl - Certificate image URLs (optional)
   * @returns {Promise<Object>} Created journey
   * 
   * Response format:
   * {
   *   "id": "string",
   *   "newDistance": 0.1,
   *   "averageSpeed": 0.1,
   *   "energyUsed": 0.1,
   *   "certificateImageUrl": ["string"],
   *   "status": "PENDING"
   * }
   */
  createJourney: async (journeyData) => {
    try {
      const response = await apiClient.post('/journeys', journeyData, {
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json',
        },
      });

      return response;
    } catch (error) {
      console.error('Error creating journey:', error);
      throw error;
    }
  },

  /**
   * Get journey by ID
   * @param {string} journeyId - Journey ID
   * @returns {Promise<Object>} Journey details
   * 
   * Response format:
   * {
   *   "id": "string",
   *   "newDistance": 0.1,
   *   "averageSpeed": 0.1,
   *   "energyUsed": 0.1,
   *   "certificateImageUrl": ["string"],
   *   "status": "PENDING"
   * }
   */
  getJourneyById: async (journeyId) => {
    try {
      const response = await apiClient.get(`/journeys/${journeyId}`, {
        headers: {
          'accept': '*/*',
        },
      });

      return response;
    } catch (error) {
      console.error('Error fetching journey by ID:', error);
      throw error;
    }
  },

  /**
   * Get journey status display
   * @param {string} status - Journey status
   * @returns {Object} Display info { text, color }
   */
  getStatusDisplay: (status) => {
    const statusMap = {
      'PENDING': { text: 'Chờ xác minh', color: 'yellow' },
      'APPROVED': { text: 'Đã duyệt', color: 'green' },
      'REJECTED': { text: 'Từ chối', color: 'red' },
    };

    return statusMap[status] || { text: status || 'Unknown', color: 'gray' };
  },

  /**
   * Format distance for display
   * @param {number} distance - Distance in km
   * @param {number} decimals - Number of decimal places (default: 2)
   * @returns {string} Formatted distance (e.g., "15.5 km")
   */
  formatDistance: (distance, decimals = 2) => {
    if (typeof distance !== 'number') return '0 km';
    return `${distance.toFixed(decimals)} km`;
  },

  /**
   * Format speed for display
   * @param {number} speed - Speed in km/h
   * @param {number} decimals - Number of decimal places (default: 1)
   * @returns {string} Formatted speed (e.g., "45.5 km/h")
   */
  formatSpeed: (speed, decimals = 1) => {
    if (typeof speed !== 'number') return '0 km/h';
    return `${speed.toFixed(decimals)} km/h`;
  },

  /**
   * Format energy for display
   * @param {number} energy - Energy in kWh
   * @param {number} decimals - Number of decimal places (default: 2)
   * @returns {string} Formatted energy (e.g., "12.5 kWh")
   */
  formatEnergy: (energy, decimals = 2) => {
    if (typeof energy !== 'number') return '0 kWh';
    return `${energy.toFixed(decimals)} kWh`;
  },

  /**
   * Validate journey data
   * @param {Object} journeyData - Journey data to validate
   * @returns {Object} Validation result { valid: boolean, errors: Array }
   */
  validateJourneyData: (journeyData) => {
    const errors = [];

    if (!journeyData.journeyId) {
      errors.push('Journey ID is required');
    }

    if (!journeyData.newDistance || journeyData.newDistance <= 0) {
      errors.push('Distance must be greater than 0');
    }

    if (!journeyData.averageSpeed || journeyData.averageSpeed <= 0) {
      errors.push('Average speed must be greater than 0');
    }

    if (!journeyData.energyUsed || journeyData.energyUsed <= 0) {
      errors.push('Energy used must be greater than 0');
    }

    // Check if speed is realistic (0-200 km/h)
    if (journeyData.averageSpeed && (journeyData.averageSpeed < 0 || journeyData.averageSpeed > 200)) {
      errors.push('Average speed must be between 0 and 200 km/h');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },
};

export default journeyService;