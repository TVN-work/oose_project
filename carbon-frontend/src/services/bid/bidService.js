import apiClient from '../api/client';

/**
 * Bid Service
 * Handles bid operations (bid table)
 * Manage bids for auction listings
 */

const bidService = {
  /**
   * Create a new bid
   * @param {Object} bidData - Bid data
   * @param {string} bidData.bidderId - Bidder user ID (required)
   * @param {string} bidData.bidderName - Bidder name (required)
   * @param {string} bidData.listingId - Listing ID (required)
   * @param {number} bidData.bidAmount - Bid amount (required)
   * @returns {Promise<Object>} Created bid
   * 
   * Response format:
   * {
   *   "id": "string",
   *   "bidderName": "string",
   *   "amount": 0.1
   * }
   */
  createBid: async (bidData) => {
    try {
      const response = await apiClient.post('/bid', bidData, {
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json',
        },
      });

      return response;
    } catch (error) {
      console.error('Error creating bid:', error);
      throw error;
    }
  },

  /**
   * Get bid by ID
   * @param {string} bidId - Bid ID
   * @returns {Promise<Object>} Bid details
   * 
   * Response format:
   * {
   *   "id": "string",
   *   "bidderName": "string",
   *   "amount": 0.1
   * }
   */
  getBidById: async (bidId) => {
    try {
      const response = await apiClient.get(`/bid/${bidId}`, {
        headers: {
          'accept': '*/*',
        },
      });

      return response;
    } catch (error) {
      console.error('Error fetching bid by ID:', error);
      throw error;
    }
  },

  /**
   * Get all bids with pagination and sorting
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 0)
   * @param {number} params.size - Page size (default: 10)
   * @param {string} params.sortBy - Sort field (default: 'amount')
   * @param {string} params.sort - Sort direction: 'ASC' or 'DESC' (default: 'DESC')
   * @param {string} params.listingId - Filter by listing ID (optional)
   * @returns {Promise<Object>} Paginated bids
   * 
   * Response format:
   * {
   *   "content": [
   *     {
   *       "id": "string",
   *       "bidderName": "string",
   *       "amount": 0.1
   *     }
   *   ],
   *   "totalElements": 0,
   *   "totalPages": 0,
   *   "number": 0,
   *   "size": 0
   * }
   */
  getAllBids: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();

      // Add pagination params
      if (params.page !== undefined) queryParams.append('page', params.page);
      if (params.size !== undefined) queryParams.append('size', params.size);

      // Add sorting params (Spring Boot format)
      // sortBy = field name (e.g., 'amount', 'createdAt')
      // sort = direction (e.g., 'ASC', 'DESC')
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sort) queryParams.append('sort', params.sort.toUpperCase());

      // Add filter params
      if (params.listingId) queryParams.append('listingId', params.listingId);

      const queryString = queryParams.toString();
      const url = `/bid${queryString ? `?${queryString}` : ''}`;

      console.log('🌐 Fetching bids from:', url);

      const response = await apiClient.get(url, {
        headers: {
          'accept': '*/*',
        },
      });

      console.log('✅ Bids response:', response);
      return response;
    } catch (error) {
      console.error('Error fetching all bids:', error);
      throw error;
    }
  },

  /**
   * Delete a bid
   * @param {string} bidId - Bid ID
   * @returns {Promise<void>}
   */
  deleteBid: async (bidId) => {
    try {
      const response = await apiClient.delete(`/bid/${bidId}`, {
        headers: {
          'accept': '*/*',
        },
      });

      return response;
    } catch (error) {
      console.error('Error deleting bid:', error);
      throw error;
    }
  },

  /**
   * Validate bid data
   * @param {Object} bidData - Bid data to validate
   * @returns {Object} Validation result { valid: boolean, errors: Array }
   */
  validateBidData: (bidData) => {
    const errors = [];

    if (!bidData.bidderId) {
      errors.push('Bidder ID is required');
    }

    if (!bidData.bidderName) {
      errors.push('Bidder name is required');
    }

    if (!bidData.listingId) {
      errors.push('Listing ID is required');
    }

    if (!bidData.bidAmount || bidData.bidAmount <= 0) {
      errors.push('Bid amount must be greater than 0');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  /**
   * Format bid amount for display
   * @param {number} amount - Bid amount
   * @param {string} currency - Currency symbol (default: 'VND')
   * @returns {string} Formatted amount
   */
  formatBidAmount: (amount, currency = 'VND') => {
    if (typeof amount !== 'number') return '0';

    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: currency === 'VND' ? 'VND' : 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  },

  /**
   * Check if bid amount is valid for listing
   * @param {number} bidAmount - Bid amount
   * @param {number} currentPrice - Current listing price or highest bid
   * @param {number} minIncrement - Minimum bid increment (optional, default: 0)
   * @returns {boolean} True if bid amount is valid
   */
  isValidBidAmount: (bidAmount, currentPrice, minIncrement = 0) => {
    if (typeof bidAmount !== 'number' || bidAmount <= 0) return false;
    if (typeof currentPrice !== 'number') return false;

    return bidAmount >= currentPrice + minIncrement;
  },
};

export default bidService;
