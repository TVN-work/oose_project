import apiClient from '../api/client';
import { API_ENDPOINTS } from '../../config/api';

/**
 * Carbon Credit Service
 * Handles carbon credit operations (carbon_credit table)
 * Manages totalCredit, availableCredit, and tradedCredit
 */
const carbonCreditService = {
  /**
   * Get all carbon credits with pagination and sorting
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 0)
   * @param {number} params.entry - Items per page (default: 10)
   * @param {string} params.field - Field to sort by (default: 'id')
   * @param {string} params.sort - Sort direction: 'ASC' or 'DESC' (default: 'DESC')
   * @returns {Promise<Array>} List of carbon credits
   * 
   * Response format:
   * [
   *   {
   *     "id": "49780ccf-3b45-473e-b912-6fc4106c220e",
   *     "totalCredit": 0,
   *     "availableCredit": 0,
   *     "tradedCredit": 0
   *   }
   * ]
   */
  getAllCarbonCredits: async (params = {}) => {
    try {
      const { page = 0, entry = 10, field = 'id', sort = 'DESC' } = params;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        entry: entry.toString(),
        field,
        sort,
      });

      const response = await apiClient.get(`/carbon-credit?${queryParams.toString()}`, {
        headers: {
          'accept': '*/*',
        },
      });

      return response;
    } catch (error) {
      console.error('Error fetching carbon credits:', error);
      throw error;
    }
  },

  /**
   * Get carbon credit by ID
   * @param {string} creditId - Carbon credit ID
   * @returns {Promise<Object>} Carbon credit details
   * 
   * Response format:
   * {
   *   "id": "3e7aa2cb-2b9f-4c5c-a6c4-be2953399e2e",
   *   "totalCredit": 0,
   *   "availableCredit": 0,
   *   "tradedCredit": 0
   * }
   */
  getCarbonCreditById: async (creditId) => {
    try {
      const response = await apiClient.get(`/carbon-credit/${creditId}`, {
        headers: {
          'accept': '*/*',
        },
      });

      return response;
    } catch (error) {
      console.error('Error fetching carbon credit by ID:', error);
      throw error;
    }
  },

  /**
   * Get carbon credit by user ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User's carbon credit details
   * 
   * Response format:
   * {
   *   "id": "3e7aa2cb-2b9f-4c5c-a6c4-be2953399e2e",
   *   "totalCredit": 0,
   *   "availableCredit": 0,
   *   "tradedCredit": 0
   * }
   */
  getCarbonCreditByUserId: async (userId) => {
    try {
      const response = await apiClient.get(`/carbon-credit/user/${userId}`, {
        headers: {
          'accept': '*/*',
        },
      });

      return response;
    } catch (error) {
      console.error('Error fetching carbon credit by user ID:', error);
      throw error;
    }
  },

  /**
   * Get current user's carbon credit (uses userId from localStorage)
   * @returns {Promise<Object>} Current user's carbon credit details
   */
  getMyCarbonCredit: async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('User ID not found. Please login again.');
      }

      return await carbonCreditService.getCarbonCreditByUserId(userId);
    } catch (error) {
      console.error('Error fetching my carbon credit:', error);
      throw error;
    }
  },

  /**
   * Update carbon credit
   * @param {string} creditId - Carbon credit ID
   * @param {Object} data - Update data
   * @param {number} data.totalCredit - Total credit amount
   * @param {number} data.tradedCredit - Traded credit amount
   * @param {string} data.description - Transaction description
   * @returns {Promise<Object>} Updated carbon credit
   * 
   * Response format:
   * {
   *   "id": "3e7aa2cb-2b9f-4c5c-a6c4-be2953399e2e",
   *   "totalCredit": 0.1,
   *   "availableCredit": 0,
   *   "tradedCredit": 0.1
   * }
   * 
   * Note: availableCredit is automatically calculated as (totalCredit - tradedCredit)
   */
  updateCarbonCredit: async (creditId, data) => {
    try {
      const { totalCredit, tradedCredit, description = '' } = data;

      // Create FormData for multipart/form-data
      const formData = new FormData();

      if (totalCredit !== undefined) {
        formData.append('totalCredit', totalCredit.toString());
      }

      if (tradedCredit !== undefined) {
        formData.append('tradedCredit', tradedCredit.toString());
      }

      formData.append('description', description);

      const response = await apiClient.patch(`/carbon-credit/${creditId}`, formData, {
        headers: {
          'accept': '*/*',
          'Content-Type': 'multipart/form-data',
        },
      });

      return response;
    } catch (error) {
      console.error('Error updating carbon credit:', error);
      throw error;
    }
  },

  /**
   * Update current user's carbon credit
   * @param {Object} data - Update data
   * @param {number} data.totalCredit - Total credit amount
   * @param {number} data.tradedCredit - Traded credit amount
   * @param {string} data.description - Transaction description
   * @returns {Promise<Object>} Updated carbon credit
   */
  updateMyCarbonCredit: async (data) => {
    try {
      // Get current user's carbon credit first
      const credit = await carbonCreditService.getMyCarbonCredit();

      // Update carbon credit
      return await carbonCreditService.updateCarbonCredit(credit.id, data);
    } catch (error) {
      console.error('Error updating my carbon credit:', error);
      throw error;
    }
  },

  /**
   * Add carbon credits (increase totalCredit)
   * @param {string} creditId - Carbon credit ID
   * @param {Object} data - Add data
   * @param {number} data.amount - Amount to add
   * @param {string} data.description - Transaction description
   * @returns {Promise<Object>} Updated carbon credit
   */
  addCarbonCredits: async (creditId, data) => {
    try {
      const { amount, description = 'Add carbon credits' } = data;

      if (!amount || amount <= 0) {
        throw new Error('Amount must be greater than 0');
      }

      // Get current credit to calculate new total
      const currentCredit = await carbonCreditService.getCarbonCreditById(creditId);
      const newTotalCredit = (currentCredit.totalCredit || 0) + amount;

      return await carbonCreditService.updateCarbonCredit(creditId, {
        totalCredit: newTotalCredit,
        tradedCredit: currentCredit.tradedCredit || 0,
        description,
      });
    } catch (error) {
      console.error('Error adding carbon credits:', error);
      throw error;
    }
  },

  /**
   * Trade carbon credits (increase tradedCredit)
   * @param {string} creditId - Carbon credit ID
   * @param {Object} data - Trade data
   * @param {number} data.amount - Amount to trade
   * @param {string} data.description - Transaction description
   * @returns {Promise<Object>} Updated carbon credit
   */
  tradeCarbonCredits: async (creditId, data) => {
    try {
      const { amount, description = 'Trade carbon credits' } = data;

      if (!amount || amount <= 0) {
        throw new Error('Amount must be greater than 0');
      }

      // Get current credit to validate and calculate
      const currentCredit = await carbonCreditService.getCarbonCreditById(creditId);
      const availableCredit = (currentCredit.totalCredit || 0) - (currentCredit.tradedCredit || 0);

      if (amount > availableCredit) {
        throw new Error(`Insufficient credits. Available: ${availableCredit}, Requested: ${amount}`);
      }

      const newTradedCredit = (currentCredit.tradedCredit || 0) + amount;

      return await carbonCreditService.updateCarbonCredit(creditId, {
        totalCredit: currentCredit.totalCredit || 0,
        tradedCredit: newTradedCredit,
        description,
      });
    } catch (error) {
      console.error('Error trading carbon credits:', error);
      throw error;
    }
  },

  /**
   * Format credit amount for display
   * @param {number} credit - Credit amount
   * @param {number} decimals - Number of decimal places (default: 2)
   * @returns {string} Formatted credit (e.g., "0.52 tín chỉ")
   */
  formatCredit: (credit, decimals = 2) => {
    if (typeof credit !== 'number') {
      return '0 tín chỉ';
    }
    return `${credit.toFixed(decimals)} tín chỉ`;
  },

  /**
   * Calculate available credit
   * @param {Object} credit - Carbon credit object
   * @returns {number} Available credit amount
   */
  calculateAvailableCredit: (credit) => {
    if (!credit) return 0;
    const total = credit.totalCredit || 0;
    const traded = credit.tradedCredit || 0;
    return Math.max(0, total - traded);
  },

  /**
   * Calculate credit percentage
   * @param {number} amount - Amount to calculate
   * @param {number} total - Total amount
   * @returns {number} Percentage (0-100)
   */
  calculatePercentage: (amount, total) => {
    if (!total || total === 0) return 0;
    return Math.min(100, Math.max(0, (amount / total) * 100));
  },
};

export default carbonCreditService;
