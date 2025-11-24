import apiClient from '../api/client';

/**
 * Transaction Service
 * Handles transaction operations (transaction table)
 * Manage carbon credit purchase transactions
 */

/**
 * Listing types for transactions
 */
export const TRANSACTION_LISTING_TYPES = {
  FIXED_PRICE: 'FIXED_PRICE',
  AUCTION: 'AUCTION',
};

/**
 * Transaction statuses
 */
export const TRANSACTION_STATUSES = {
  PENDING_PAYMENT: 'PENDING_PAYMENT',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  CANCELED: 'CANCELED',
};

/**
 * Payment methods
 */
export const PAYMENT_METHODS = {
  WALLET: 'WALLET',
  VN_PAY: 'VN_PAY',
};

const transactionService = {
  /**
   * Get all transactions with filters and pagination
   * @param {Object} params - Query parameters
   * @param {string} params.listingId - Listing ID filter (optional)
   * @param {string} params.buyerId - Buyer ID filter (optional)
   * @param {string} params.sellerId - Seller ID filter (optional)
   * @param {number} params.amount - Amount filter (optional)
   * @param {number} params.credit - Credit filter (optional)
   * @param {string} params.status - Status filter: 'PENDING_PAYMENT', 'SUCCESS', 'FAILED', 'CANCELED' (optional)
   * @param {string} params.paymentMethod - Payment method filter: 'WALLET', 'VN_PAY' (optional)
   * @param {string} params.paidAt - Paid at date filter in ISO format (optional)
   * @param {number} params.page - Page number (default: 0)
   * @param {number} params.entry - Items per page (default: 10)
   * @param {string} params.field - Sort field (default: 'id')
   * @param {string} params.sort - Sort direction: 'ASC' or 'DESC' (default: 'DESC')
   * @returns {Promise<Array>} List of transactions
   * 
   * Response format:
   * [
   *   {
   *     "createdAt": "2025-11-24T17:22:52.893Z",
   *     "updatedAt": "2025-11-24T17:22:52.893Z",
   *     "id": "string",
   *     "listingId": "string",
   *     "buyerId": "string",
   *     "sellerId": "string",
   *     "amount": 0.1,
   *     "credit": 0.1,
   *     "status": "PENDING_PAYMENT",
   *     "paymentMethod": "WALLET",
   *     "paymentUrl": "string",
   *     "paidAt": "2025-11-24T17:22:52.893Z"
   *   }
   * ]
   */
  getAllTransactions: async (params = {}) => {
    try {
      const {
        listingId,
        buyerId,
        sellerId,
        amount,
        credit,
        status,
        paymentMethod,
        paidAt,
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
      if (listingId) queryParams.append('listingId', listingId);
      if (buyerId) queryParams.append('buyerId', buyerId);
      if (sellerId) queryParams.append('sellerId', sellerId);
      if (amount !== undefined) queryParams.append('amount', amount.toString());
      if (credit !== undefined) queryParams.append('credit', credit.toString());
      if (status) queryParams.append('status', status);
      if (paymentMethod) queryParams.append('paymentMethod', paymentMethod);
      if (paidAt) queryParams.append('paidAt', paidAt);

      const response = await apiClient.get(`/transactions?${queryParams.toString()}`, {
        headers: {
          'accept': 'application/json',
        },
      });

      return response;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  },

  /**
   * Create a new transaction
   * @param {Object} transactionData - Transaction data
   * @param {string} transactionData.listingId - Listing ID (required)
   * @param {string} transactionData.buyerId - Buyer user ID (required)
   * @param {string} transactionData.sellerId - Seller user ID (required)
   * @param {number} transactionData.amount - Transaction amount (required)
   * @param {number} transactionData.credit - Credit amount (required)
   * @param {string} transactionData.listingType - Listing type: 'FIXED_PRICE' or 'AUCTION' (required)
   * @returns {Promise<Object>} Created transaction
   * 
   * Response format:
   * {
   *   "createdAt": "2025-11-24T17:14:38.964Z",
   *   "updatedAt": "2025-11-24T17:14:38.964Z",
   *   "id": "string",
   *   "listingId": "string",
   *   "buyerId": "string",
   *   "sellerId": "string",
   *   "amount": 0.1,
   *   "credit": 0.1,
   *   "status": "PENDING_PAYMENT",
   *   "paymentMethod": "WALLET",
   *   "paymentUrl": "string",
   *   "paidAt": "2025-11-24T17:14:38.964Z"
   * }
   */
  createTransaction: async (transactionData) => {
    try {
      const formData = new FormData();

      formData.append('listingId', transactionData.listingId);
      formData.append('buyerId', transactionData.buyerId);
      formData.append('sellerId', transactionData.sellerId);
      formData.append('amount', transactionData.amount.toString());
      formData.append('credit', transactionData.credit.toString());
      formData.append('listingType', transactionData.listingType);

      const response = await apiClient.post('/transactions', formData, {
        headers: {
          'accept': '*/*',
          'Content-Type': 'multipart/form-data',
        },
      });

      return response;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  },

  /**
   * Get transaction by ID
   * @param {string} transactionId - Transaction ID
   * @returns {Promise<Object>} Transaction details
   * 
   * Response format:
   * {
   *   "createdAt": "2025-11-24T17:15:09.731Z",
   *   "updatedAt": "2025-11-24T17:15:09.731Z",
   *   "id": "string",
   *   "listingId": "string",
   *   "buyerId": "string",
   *   "sellerId": "string",
   *   "amount": 0.1,
   *   "credit": 0.1,
   *   "status": "PENDING_PAYMENT",
   *   "paymentMethod": "WALLET",
   *   "paymentUrl": "string",
   *   "paidAt": "2025-11-24T17:15:09.731Z"
   * }
   */
  getTransactionById: async (transactionId) => {
    try {
      const response = await apiClient.get(`/transactions/${transactionId}`, {
        headers: {
          'accept': '*/*',
        },
      });

      return response;
    } catch (error) {
      console.error('Error fetching transaction by ID:', error);
      throw error;
    }
  },

  /**
   * Update transaction status
   * @param {string} transactionId - Transaction ID
   * @param {string} status - New status: 'PENDING_PAYMENT', 'SUCCESS', 'FAILED', 'CANCELED'
   * @returns {Promise<Object>} Updated transaction
   * 
   * Response format:
   * {
   *   "createdAt": "2025-11-24T17:16:33.362Z",
   *   "updatedAt": "2025-11-24T17:16:33.362Z",
   *   "id": "string",
   *   "listingId": "string",
   *   "buyerId": "string",
   *   "sellerId": "string",
   *   "amount": 0.1,
   *   "credit": 0.1,
   *   "status": "PENDING_PAYMENT",
   *   "paymentMethod": "WALLET",
   *   "paymentUrl": "string",
   *   "paidAt": "2025-11-24T17:16:33.362Z"
   * }
   */
  updateTransactionStatus: async (transactionId, status) => {
    try {
      const response = await apiClient.patch(`/transactions/${transactionId}?status=${status}`, null, {
        headers: {
          'accept': '*/*',
        },
      });

      return response;
    } catch (error) {
      console.error('Error updating transaction status:', error);
      throw error;
    }
  },

  /**
   * Pay for a transaction
   * @param {string} transactionId - Transaction ID
   * @param {string} paymentMethod - Payment method: 'WALLET' or 'VN_PAY'
   * @returns {Promise<Object>} Payment response
   * 
   * Response format:
   * {
   *   "transactionId": "string",
   *   "status": "string",
   *   "paymentUrl": "string"
   * }
   */
  payTransaction: async (transactionId, paymentMethod) => {
    try {
      const response = await apiClient.post(`/transactions/${transactionId}/pay?paymentMethod=${paymentMethod}`, null, {
        headers: {
          'accept': '*/*',
        },
      });

      return response;
    } catch (error) {
      console.error('Error paying transaction:', error);
      throw error;
    }
  },

  /**
   * Get transaction status display
   * @param {string} status - Transaction status
   * @returns {Object} Display info { text, color }
   */
  getStatusDisplay: (status) => {
    const statusMap = {
      'PENDING_PAYMENT': { text: 'Chờ thanh toán', color: 'yellow' },
      'SUCCESS': { text: 'Thành công', color: 'green' },
      'FAILED': { text: 'Thất bại', color: 'red' },
      'CANCELED': { text: 'Đã hủy', color: 'gray' },
    };

    return statusMap[status] || { text: status || 'Unknown', color: 'gray' };
  },

  /**
   * Get payment method display
   * @param {string} method - Payment method
   * @returns {Object} Display info { text, color }
   */
  getPaymentMethodDisplay: (method) => {
    const methodMap = {
      'WALLET': { text: 'Ví điện tử', color: 'blue' },
      'VN_PAY': { text: 'VNPay', color: 'orange' },
    };

    return methodMap[method] || { text: method || 'Unknown', color: 'gray' };
  },

  /**
   * Get listing type display
   * @param {string} type - Listing type
   * @returns {Object} Display info { text, color }
   */
  getListingTypeDisplay: (type) => {
    const typeMap = {
      'FIXED_PRICE': { text: 'Giá cố định', color: 'blue' },
      'AUCTION': { text: 'Đấu giá', color: 'purple' },
    };

    return typeMap[type] || { text: type || 'Unknown', color: 'gray' };
  },

  /**
   * Validate transaction data
   * @param {Object} transactionData - Transaction data to validate
   * @returns {Object} Validation result { valid: boolean, errors: Array }
   */
  validateTransactionData: (transactionData) => {
    const errors = [];

    if (!transactionData.listingId) {
      errors.push('Listing ID is required');
    }

    if (!transactionData.buyerId) {
      errors.push('Buyer ID is required');
    }

    if (!transactionData.sellerId) {
      errors.push('Seller ID is required');
    }

    if (!transactionData.amount || transactionData.amount <= 0) {
      errors.push('Amount must be greater than 0');
    }

    if (!transactionData.credit || transactionData.credit <= 0) {
      errors.push('Credit must be greater than 0');
    }

    if (!transactionData.listingType) {
      errors.push('Listing type is required');
    }

    if (transactionData.listingType && !Object.values(TRANSACTION_LISTING_TYPES).includes(transactionData.listingType)) {
      errors.push(`Listing type must be one of: ${Object.values(TRANSACTION_LISTING_TYPES).join(', ')}`);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  /**
   * Format amount for display
   * @param {number} amount - Amount
   * @param {string} currency - Currency symbol (default: 'VND')
   * @returns {string} Formatted amount
   */
  formatAmount: (amount, currency = 'VND') => {
    if (typeof amount !== 'number') return '0';

    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: currency === 'VND' ? 'VND' : 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
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
   * Check if transaction is successful
   * @param {Object} transaction - Transaction object
   * @returns {boolean} True if transaction is successful
   */
  isTransactionSuccessful: (transaction) => {
    if (!transaction) return false;
    return transaction.status === TRANSACTION_STATUSES.SUCCESS;
  },

  /**
   * Check if transaction is pending
   * @param {Object} transaction - Transaction object
   * @returns {boolean} True if transaction is pending payment
   */
  isTransactionPending: (transaction) => {
    if (!transaction) return false;
    return transaction.status === TRANSACTION_STATUSES.PENDING_PAYMENT;
  },

  /**
   * Check if transaction can be canceled
   * @param {Object} transaction - Transaction object
   * @returns {boolean} True if transaction can be canceled
   */
  canCancelTransaction: (transaction) => {
    if (!transaction) return false;
    return transaction.status === TRANSACTION_STATUSES.PENDING_PAYMENT;
  },
};

export default transactionService;
