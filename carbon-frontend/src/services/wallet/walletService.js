import apiClient from '../api/client';
import { API_ENDPOINTS } from '../../config/api';

/**
 * Wallet Service
 * Handles payment wallet operations (wallet table)
 * For carbon credits, use evOwnerService carbon wallet methods
 */
const walletService = {
  /**
   * Get all wallets with pagination and sorting
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 0)
   * @param {number} params.entry - Items per page (default: 10)
   * @param {string} params.field - Field to sort by (default: 'id')
   * @param {string} params.sort - Sort direction: 'ASC' or 'DESC' (default: 'DESC')
   * @returns {Promise<Array>} List of wallets
   * 
   * Response format:
   * [
   *   {
   *     "id": "dcd7bff0-4074-42a8-a862-99a745222389",
   *     "balance": 0
   *   }
   * ]
   */
  getAllWallets: async (params = {}) => {
    try {
      const { page = 0, entry = 10, field = 'id', sort = 'DESC' } = params;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        entry: entry.toString(),
        field,
        sort,
      });

      const response = await apiClient.get(`/wallet?${queryParams.toString()}`, {
        headers: {
          'accept': '*/*',
        },
      });

      return response;
    } catch (error) {
      console.error('Error fetching wallets:', error);
      throw error;
    }
  },

  /**
   * Get wallet by wallet ID
   * @param {string} walletId - Wallet ID
   * @returns {Promise<Object>} Wallet details
   * 
   * Response format:
   * {
   *   "id": "23067afc-188f-4aad-80e7-e8ddc468b694",
   *   "balance": 0
   * }
   */
  getWalletById: async (walletId) => {
    try {
      const response = await apiClient.get(`/wallet/${walletId}`, {
        headers: {
          'accept': '*/*',
        },
      });

      return response;
    } catch (error) {
      console.error('Error fetching wallet by ID:', error);
      throw error;
    }
  },

  /**
   * Get wallet by user ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User's wallet details
   * 
   * Response format:
   * {
   *   "id": "23067afc-188f-4aad-80e7-e8ddc468b694",
   *   "balance": 0
   * }
   */
  getWalletByUserId: async (userId) => {
    try {
      const response = await apiClient.get(`/wallet/user/${userId}`, {
        headers: {
          'accept': '*/*',
        },
      });

      return response;
    } catch (error) {
      console.error('Error fetching wallet by user ID:', error);
      throw error;
    }
  },

  /**
   * Get current user's wallet (uses userId from localStorage)
   * @returns {Promise<Object>} Current user's wallet details
   */
  getMyWallet: async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('User ID not found. Please login again.');
      }

      return await walletService.getWalletByUserId(userId);
    } catch (error) {
      console.error('Error fetching my wallet:', error);
      throw error;
    }
  },

  /**
   * Update wallet balance (deposit)
   * @param {string} walletId - Wallet ID
   * @param {Object} data - Update data
   * @param {number} data.amount - Amount to add (in VND)
   * @param {string} data.description - Transaction description
   * @returns {Promise<Object>} Updated wallet
   * 
   * Response format:
   * {
   *   "id": "23067afc-188f-4aad-80e7-e8ddc468b694",
   *   "balance": 12120000
   * }
   */
  updateWalletBalance: async (walletId, data) => {
    try {
      const { amount, description = '' } = data;

      if (!amount || amount <= 0) {
        throw new Error('Amount must be greater than 0');
      }

      // Create FormData for multipart/form-data
      const formData = new FormData();
      formData.append('amount', amount.toString());
      formData.append('description', description);

      const response = await apiClient.patch(`/wallet/${walletId}`, formData, {
        headers: {
          'accept': '*/*',
          'Content-Type': 'multipart/form-data',
        },
      });

      return response;
    } catch (error) {
      console.error('Error updating wallet balance:', error);
      throw error;
    }
  },

  /**
   * Deposit to current user's wallet
   * @param {Object} data - Deposit data
   * @param {number} data.amount - Amount to deposit (in VND)
   * @param {string} data.description - Transaction description
   * @returns {Promise<Object>} Updated wallet
   */
  depositToMyWallet: async (data) => {
    try {
      // Get current user's wallet first
      const wallet = await walletService.getMyWallet();

      // Update balance
      return await walletService.updateWalletBalance(wallet.id, data);
    } catch (error) {
      console.error('Error depositing to my wallet:', error);
      throw error;
    }
  },

  /**
   * Format balance for display
   * @param {number} balance - Balance in VND
   * @returns {string} Formatted balance (e.g., "12,120,000 VNĐ")
   */
  formatBalance: (balance) => {
    if (typeof balance !== 'number') {
      return '0 VNĐ';
    }
    return `${balance.toLocaleString('vi-VN')} VNĐ`;
  },

  /**
   * Convert VND to USD (approximate)
   * @param {number} vnd - Amount in VND
   * @param {number} exchangeRate - Exchange rate (default: 25000)
   * @returns {number} Amount in USD
   */
  vndToUsd: (vnd, exchangeRate = 25000) => {
    return vnd / exchangeRate;
  },

  /**
   * Convert USD to VND
   * @param {number} usd - Amount in USD
   * @param {number} exchangeRate - Exchange rate (default: 25000)
   * @returns {number} Amount in VND
   */
  usdToVnd: (usd, exchangeRate = 25000) => {
    return usd * exchangeRate;
  },
};

export default walletService;
