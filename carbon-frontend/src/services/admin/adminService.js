import apiClient from '../api/client';
import { API_ENDPOINTS } from '../../config/api';
import { mockAdminService, shouldUseMock } from '../mock';

export const adminService = {
  // Admin Service - User Management (Use Case 19)
  getUsers: async (params = {}) => {
    if (shouldUseMock()) return mockAdminService?.getUsers?.(params) || [];
    try {
      return await apiClient.get(API_ENDPOINTS.ADMIN.USERS, { params });
    } catch (error) {
      if (import.meta.env.DEV) return mockAdminService?.getUsers?.(params) || [];
      throw error;
    }
  },

  getUserDetail: async (userId) => {
    if (shouldUseMock()) return { id: userId, name: 'User', role: 'EV_OWNER' };
    try {
      return await apiClient.get(API_ENDPOINTS.ADMIN.USER_DETAIL.replace(':id', userId));
    } catch (error) {
      if (import.meta.env.DEV) return { id: userId, name: 'User', role: 'EV_OWNER' };
      throw error;
    }
  },

  updateUser: async (userId, userData) => {
    if (shouldUseMock()) return { success: true };
    try {
      return await apiClient.put(API_ENDPOINTS.ADMIN.UPDATE_USER.replace(':id', userId), userData);
    } catch (error) {
      if (import.meta.env.DEV) return { success: true };
      throw error;
    }
  },

  lockUser: async (userId) => {
    if (shouldUseMock()) return { success: true, locked: true };
    try {
      return await apiClient.post(API_ENDPOINTS.ADMIN.LOCK_USER.replace(':id', userId));
    } catch (error) {
      if (import.meta.env.DEV) return { success: true, locked: true };
      throw error;
    }
  },

  unlockUser: async (userId) => {
    if (shouldUseMock()) return { success: true, unlocked: true };
    try {
      return await apiClient.post(API_ENDPOINTS.ADMIN.UNLOCK_USER.replace(':id', userId));
    } catch (error) {
      if (import.meta.env.DEV) return { success: true, unlocked: true };
      throw error;
    }
  },

  // Admin Service - Transaction Management (Use Case 20)
  getTransactions: async (params = {}) => {
    if (shouldUseMock()) return mockAdminService?.getTransactions?.(params) || [];
    try {
      return await apiClient.get(API_ENDPOINTS.ADMIN.TRANSACTIONS, { params });
    } catch (error) {
      if (import.meta.env.DEV) return mockAdminService?.getTransactions?.(params) || [];
      throw error;
    }
  },

  resolveDispute: async (transactionId, resolutionData) => {
    if (shouldUseMock()) return { success: true, resolved: true };
    try {
      return await apiClient.post(API_ENDPOINTS.ADMIN.RESOLVE_DISPUTE.replace(':id', transactionId), resolutionData);
    } catch (error) {
      if (import.meta.env.DEV) return { success: true, resolved: true };
      throw error;
    }
  },

  // Admin Service - Wallet Management (Use Case 21)
  getWallets: async (params = {}) => {
    if (shouldUseMock()) return mockAdminService?.getWallets?.(params) || [];
    try {
      return await apiClient.get(API_ENDPOINTS.ADMIN.WALLETS, { params });
    } catch (error) {
      if (import.meta.env.DEV) return mockAdminService?.getWallets?.(params) || [];
      throw error;
    }
  },

  getWalletDetail: async (walletId) => {
    if (shouldUseMock()) return { id: walletId, balance: 0 };
    try {
      return await apiClient.get(API_ENDPOINTS.ADMIN.WALLET_DETAIL.replace(':id', walletId));
    } catch (error) {
      if (import.meta.env.DEV) return { id: walletId, balance: 0 };
      throw error;
    }
  },

  freezeWallet: async (walletId) => {
    if (shouldUseMock()) return { success: true, frozen: true };
    try {
      return await apiClient.post(API_ENDPOINTS.ADMIN.FREEZE_WALLET.replace(':id', walletId));
    } catch (error) {
      if (import.meta.env.DEV) return { success: true, frozen: true };
      throw error;
    }
  },

  // Admin Service - Listing Management (Use Case 22)
  getListings: async (params = {}) => {
    if (shouldUseMock()) return mockAdminService?.getListings?.(params) || [];
    try {
      return await apiClient.get(API_ENDPOINTS.ADMIN.LISTINGS, { params });
    } catch (error) {
      if (import.meta.env.DEV) return mockAdminService?.getListings?.(params) || [];
      throw error;
    }
  },

  approveListing: async (listingId) => {
    if (shouldUseMock()) return { success: true, approved: true };
    try {
      return await apiClient.post(API_ENDPOINTS.ADMIN.APPROVE_LISTING.replace(':id', listingId));
    } catch (error) {
      if (import.meta.env.DEV) return { success: true, approved: true };
      throw error;
    }
  },

  rejectListing: async (listingId, reason) => {
    if (shouldUseMock()) {
      return mockAdminService?.rejectListing?.(listingId, reason) || { success: true, rejected: true };
    }
    try {
      return await apiClient.post(API_ENDPOINTS.ADMIN.REJECT_LISTING.replace(':id', listingId), { reason });
    } catch (error) {
      if (import.meta.env.DEV) {
        return mockAdminService?.rejectListing?.(listingId, reason) || { success: true, rejected: true };
      }
      throw error;
    }
  },

  // Admin Service - Reports (Use Case 23)
  getReports: async (params = {}) => {
    if (shouldUseMock()) return { reports: [] };
    try {
      return await apiClient.get(API_ENDPOINTS.ADMIN.REPORTS, { params });
    } catch (error) {
      if (import.meta.env.DEV) return { reports: [] };
      throw error;
    }
  },

  generateReport: async (reportType, params = {}) => {
    if (shouldUseMock()) return { reportId: 'report-123', downloadUrl: '#' };
    try {
      return await apiClient.post(API_ENDPOINTS.ADMIN.GENERATE_REPORT, {
        reportType,
        ...params,
      });
    } catch (error) {
      if (import.meta.env.DEV) return { reportId: 'report-123', downloadUrl: '#' };
      throw error;
    }
  },

  getSystemStats: async () => {
    if (shouldUseMock()) return { users: 1247, transactions: 847, credits: 12.47 };
    try {
      return await apiClient.get(API_ENDPOINTS.ADMIN.SYSTEM_STATS);
    } catch (error) {
      if (import.meta.env.DEV) return { users: 1247, transactions: 847, credits: 12.47 };
      throw error;
    }
  },
};

export default adminService;

