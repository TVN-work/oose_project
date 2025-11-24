import apiClient from '../api/client';
import { API_ENDPOINTS } from '../../config/api';

/**
 * Journey Service
 * Handles journey operations (journey table)
 * Manage EV trip/journey data
 */
const journeyService = {
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