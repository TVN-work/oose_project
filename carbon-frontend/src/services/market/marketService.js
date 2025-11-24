import apiClient from '../api/client';

/**
 * Market Service
 * Handles market listing operations (listing table)
 * Manage carbon credit marketplace listings
 */

/**
 * Listing types
 */
export const LISTING_TYPES = {
  FIXED_PRICE: 'FIXED_PRICE',
  AUCTION: 'AUCTION',
};

/**
 * Listing statuses
 */
export const LISTING_STATUSES = {
  ACTIVE: 'ACTIVE',
  BIDDING: 'BIDDING',
  PENDING_PAYMENT: 'PENDING_PAYMENT',
  SOLD: 'SOLD',
  ENDED: 'ENDED',
  CANCELED: 'CANCELED',
  EXPIRED: 'EXPIRED',
};

const marketService = {
  /**
   * Get all listings with filters and pagination
   * @param {Object} params - Query parameters
   * @param {string} params.sellerId - Seller ID filter (optional)
   * @param {string} params.creditId - Credit ID filter (optional)
   * @param {string} params.type - Type filter: 'FIXED_PRICE' or 'AUCTION' (optional)
   * @param {string} params.status - Status filter: 'ACTIVE', 'BIDDING', 'PENDING_PAYMENT', 'SOLD', 'ENDED', 'CANCELED', 'EXPIRED' (optional)
   * @param {number} params.minPrice - Minimum price filter (optional)
   * @param {number} params.maxPrice - Maximum price filter (optional)
   * @param {number} params.minQuantity - Minimum quantity filter (optional)
   * @param {number} params.maxQuantity - Maximum quantity filter (optional)
   * @param {string} params.startFrom - Start date filter in ISO format (optional)
   * @param {string} params.endBefore - End date filter in ISO format (optional)
   * @param {number} params.page - Page number (default: 0)
   * @param {number} params.entry - Items per page (default: 10)
   * @param {string} params.field - Sort field (default: 'id')
   * @param {string} params.sort - Sort direction: 'ASC' or 'DESC' (default: 'DESC')
   * @returns {Promise<Array>} List of listings
   * 
   * Response format:
   * [
   *   {
   *     "id": "string",
   *     "sellerId": "string",
   *     "pricePerCredit": 0.1,
   *     "bidResponseList": [
   *       {
   *         "id": "string",
   *         "bidderName": "string",
   *         "amount": 0.1
   *       }
   *     ],
   *     "quantity": 0.1,
   *     "type": "FIXED_PRICE",
   *     "status": "ACTIVE",
   *     "createdAt": "2025-11-24T16:51:11.319Z",
   *     "updatedAt": "2025-11-24T16:51:11.319Z",
   *     "endTime": "2025-11-24T16:51:11.319Z"
   *   }
   * ]
   */
  getAllListings: async (params = {}) => {
    try {
      const {
        sellerId,
        creditId,
        type,
        status,
        minPrice,
        maxPrice,
        minQuantity,
        maxQuantity,
        startFrom,
        endBefore,
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

      // Add optional filters
      if (sellerId) queryParams.append('sellerId', sellerId);
      if (creditId) queryParams.append('creditId', creditId);
      if (type) queryParams.append('type', type);
      if (status) queryParams.append('status', status);
      if (minPrice !== undefined) queryParams.append('minPrice', minPrice.toString());
      if (maxPrice !== undefined) queryParams.append('maxPrice', maxPrice.toString());
      if (minQuantity !== undefined) queryParams.append('minQuantity', minQuantity.toString());
      if (maxQuantity !== undefined) queryParams.append('maxQuantity', maxQuantity.toString());
      if (startFrom) queryParams.append('startFrom', startFrom);
      if (endBefore) queryParams.append('endBefore', endBefore);

      const response = await apiClient.get(`/listing?${queryParams.toString()}`, {
        headers: {
          'accept': '*/*',
        },
      });

      return response;
    } catch (error) {
      console.error('Error fetching listings:', error);
      throw error;
    }
  },

  /**
   * Create a new listing
   * @param {Object} listingData - Listing data
   * @param {string} listingData.sellerId - Seller user ID (required)
   * @param {string} listingData.creditId - Carbon credit ID (required)
   * @param {number} listingData.pricePerCredit - Price per credit (required)
   * @param {number} listingData.quantity - Quantity of credits (required)
   * @param {string} listingData.type - Listing type: 'FIXED_PRICE' or 'AUCTION' (required)
   * @param {string} listingData.endTime - End time in ISO format (optional)
   * @returns {Promise<Object>} Created listing
   * 
   * Response format:
   * {
   *   "id": "string",
   *   "sellerId": "string",
   *   "pricePerCredit": 0.1,
   *   "bidResponseList": [
   *     {
   *       "id": "string",
   *       "bidderName": "string",
   *       "amount": 0.1
   *     }
   *   ],
   *   "quantity": 0.1,
   *   "type": "FIXED_PRICE",
   *   "status": "ACTIVE",
   *   "createdAt": "2025-11-24T16:36:28.164Z",
   *   "updatedAt": "2025-11-24T16:36:28.164Z",
   *   "endTime": "2025-11-24T16:36:28.164Z"
   * }
   */
  createListing: async (listingData) => {
    try {
      const formData = new FormData();

      formData.append('sellerId', listingData.sellerId);
      formData.append('creditId', listingData.creditId);
      formData.append('pricePerCredit', listingData.pricePerCredit.toString());
      formData.append('quantity', listingData.quantity.toString());
      formData.append('type', listingData.type);

      if (listingData.endTime) {
        formData.append('endTime', listingData.endTime);
      }

      const response = await apiClient.post('/listing', formData, {
        headers: {
          'accept': '*/*',
          'Content-Type': 'multipart/form-data',
        },
      });

      return response;
    } catch (error) {
      console.error('Error creating listing:', error);
      throw error;
    }
  },

  /**
   * Get listing by ID
   * @param {string} listingId - Listing ID
   * @returns {Promise<Object>} Listing details
   * 
   * Response format:
   * {
   *   "id": "string",
   *   "sellerId": "string",
   *   "pricePerCredit": 0.1,
   *   "bidResponseList": [
   *     {
   *       "id": "string",
   *       "bidderName": "string",
   *       "amount": 0.1
   *     }
   *   ],
   *   "quantity": 0.1,
   *   "type": "FIXED_PRICE",
   *   "status": "ACTIVE",
   *   "createdAt": "2025-11-24T16:38:22.580Z",
   *   "updatedAt": "2025-11-24T16:38:22.580Z",
   *   "endTime": "2025-11-24T16:38:22.580Z"
   * }
   */
  getListingById: async (listingId) => {
    try {
      const response = await apiClient.get(`/listing/${listingId}`, {
        headers: {
          'accept': '*/*',
        },
      });

      return response;
    } catch (error) {
      console.error('Error fetching listing by ID:', error);
      throw error;
    }
  },

  /**
   * Update listing status
   * @param {string} listingId - Listing ID
   * @param {string} status - New status: 'ACTIVE', 'BIDDING', 'PENDING_PAYMENT', 'SOLD', 'ENDED', 'CANCELED', 'EXPIRED'
   * @returns {Promise<Object>} Updated listing
   * 
   * Response format:
   * {
   *   "id": "string",
   *   "sellerId": "string",
   *   "pricePerCredit": 0.1,
   *   "bidResponseList": [
   *     {
   *       "id": "string",
   *       "bidderName": "string",
   *       "amount": 0.1
   *     }
   *   ],
   *   "quantity": 0.1,
   *   "type": "FIXED_PRICE",
   *   "status": "ACTIVE",
   *   "createdAt": "2025-11-24T16:39:52.204Z",
   *   "updatedAt": "2025-11-24T16:39:52.204Z",
   *   "endTime": "2025-11-24T16:39:52.204Z"
   * }
   */
  updateListingStatus: async (listingId, status) => {
    try {
      const response = await apiClient.patch(`/listing/${listingId}?status=${status}`, null, {
        headers: {
          'accept': '*/*',
        },
      });

      return response;
    } catch (error) {
      console.error('Error updating listing status:', error);
      throw error;
    }
  },

  /**
   * Get listing type display
   * @param {string} type - Listing type
   * @returns {Object} Display info { text, color }
   */
  getTypeDisplay: (type) => {
    const typeMap = {
      'FIXED_PRICE': { text: 'Giá cố định', color: 'blue' },
      'AUCTION': { text: 'Đấu giá', color: 'purple' },
    };

    return typeMap[type] || { text: type || 'Unknown', color: 'gray' };
  },

  /**
   * Get listing status display
   * @param {string} status - Listing status
   * @returns {Object} Display info { text, color }
   */
  getStatusDisplay: (status) => {
    const statusMap = {
      'ACTIVE': { text: 'Đang hoạt động', color: 'green' },
      'BIDDING': { text: 'Đang đấu giá', color: 'blue' },
      'PENDING_PAYMENT': { text: 'Chờ thanh toán', color: 'yellow' },
      'SOLD': { text: 'Đã bán', color: 'gray' },
      'ENDED': { text: 'Đã kết thúc', color: 'gray' },
      'CANCELED': { text: 'Đã hủy', color: 'red' },
      'EXPIRED': { text: 'Đã hết hạn', color: 'orange' },
    };

    return statusMap[status] || { text: status || 'Unknown', color: 'gray' };
  },

  /**
   * Validate listing data
   * @param {Object} listingData - Listing data to validate
   * @returns {Object} Validation result { valid: boolean, errors: Array }
   */
  validateListingData: (listingData) => {
    const errors = [];

    if (!listingData.sellerId) {
      errors.push('Seller ID is required');
    }

    if (!listingData.creditId) {
      errors.push('Credit ID is required');
    }

    if (!listingData.pricePerCredit || listingData.pricePerCredit <= 0) {
      errors.push('Price per credit must be greater than 0');
    }

    if (!listingData.quantity || listingData.quantity <= 0) {
      errors.push('Quantity must be greater than 0');
    }

    if (!listingData.type) {
      errors.push('Listing type is required');
    }

    if (listingData.type && !Object.values(LISTING_TYPES).includes(listingData.type)) {
      errors.push(`Listing type must be one of: ${Object.values(LISTING_TYPES).join(', ')}`);
    }

    // Validate endTime for auction type
    if (listingData.type === LISTING_TYPES.AUCTION && !listingData.endTime) {
      errors.push('End time is required for auction listings');
    }

    // Validate endTime is in the future
    if (listingData.endTime) {
      const endTime = new Date(listingData.endTime);
      const now = new Date();
      if (endTime <= now) {
        errors.push('End time must be in the future');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  /**
   * Calculate total price
   * @param {number} pricePerCredit - Price per credit
   * @param {number} quantity - Quantity
   * @returns {number} Total price
   */
  calculateTotalPrice: (pricePerCredit, quantity) => {
    if (typeof pricePerCredit !== 'number' || typeof quantity !== 'number') return 0;
    return pricePerCredit * quantity;
  },

  /**
   * Format price for display
   * @param {number} price - Price
   * @param {string} currency - Currency symbol (default: 'VND')
   * @returns {string} Formatted price
   */
  formatPrice: (price, currency = 'VND') => {
    if (typeof price !== 'number') return '0';

    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: currency === 'VND' ? 'VND' : 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  },

  /**
   * Format date for display
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date
   */
  formatDate: (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  },

  /**
   * Check if listing is active
   * @param {Object} listing - Listing object
   * @returns {boolean} True if listing is active
   */
  isListingActive: (listing) => {
    if (!listing) return false;

    if (listing.status !== LISTING_STATUSES.ACTIVE) return false;

    // Check if listing has expired
    if (listing.endTime) {
      const endTime = new Date(listing.endTime);
      const now = new Date();
      if (endTime <= now) return false;
    }

    return true;
  },

  /**
   * Get highest bid from bid list
   * @param {Array} bidResponseList - List of bids
   * @returns {Object|null} Highest bid or null
   */
  getHighestBid: (bidResponseList) => {
    if (!Array.isArray(bidResponseList) || bidResponseList.length === 0) return null;

    return bidResponseList.reduce((highest, current) => {
      return current.amount > highest.amount ? current : highest;
    }, bidResponseList[0]);
  },

  /**
   * Count total bids
   * @param {Array} bidResponseList - List of bids
   * @returns {number} Total number of bids
   */
  countBids: (bidResponseList) => {
    if (!Array.isArray(bidResponseList)) return 0;
    return bidResponseList.length;
  },
};

export default marketService;
