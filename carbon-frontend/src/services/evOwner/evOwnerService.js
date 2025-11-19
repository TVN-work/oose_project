import apiClient from '../api/client';
import { API_ENDPOINTS } from '../../config/api';
import { mockEvOwnerService, shouldUseMock } from '../mock';

export const evOwnerService = {
  // Trips Management
  getTrips: async (params = {}) => {
    if (shouldUseMock()) return mockEvOwnerService.getTrips(params);
    try {
      return await apiClient.get(API_ENDPOINTS.EV_OWNER.TRIPS, { params });
    } catch (error) {
      if (import.meta.env.DEV) return mockEvOwnerService.getTrips(params);
      throw error;
    }
  },

  uploadTrip: async (tripData) => {
    if (shouldUseMock()) return mockEvOwnerService.uploadTrip(tripData);
    try {
      return await apiClient.post(API_ENDPOINTS.EV_OWNER.TRIPS, tripData);
    } catch (error) {
      if (import.meta.env.DEV) return mockEvOwnerService.uploadTrip(tripData);
      throw error;
    }
  },

  getTripById: async (tripId) => {
    if (shouldUseMock()) return mockEvOwnerService.getTripById(tripId);
    try {
      return await apiClient.get(`${API_ENDPOINTS.EV_OWNER.TRIPS}/${tripId}`);
    } catch (error) {
      if (import.meta.env.DEV) return mockEvOwnerService.getTripById(tripId);
      throw error;
    }
  },

  // Carbon Wallet
  getCarbonWallet: async () => {
    if (shouldUseMock()) return mockEvOwnerService.getCarbonWallet();
    try {
      return await apiClient.get(API_ENDPOINTS.EV_OWNER.CARBON_WALLET);
    } catch (error) {
      if (import.meta.env.DEV) return mockEvOwnerService.getCarbonWallet();
      throw error;
    }
  },

  getWalletTransactions: async (params = {}) => {
    if (shouldUseMock()) return mockEvOwnerService.getWalletTransactions(params);
    try {
      return await apiClient.get(`${API_ENDPOINTS.EV_OWNER.CARBON_WALLET}/transactions`, { params });
    } catch (error) {
      if (import.meta.env.DEV) return mockEvOwnerService.getWalletTransactions(params);
      throw error;
    }
  },

  // Listings Management
  getListings: async (params = {}) => {
    if (shouldUseMock()) return mockEvOwnerService.getListings(params);
    try {
      return await apiClient.get(API_ENDPOINTS.EV_OWNER.LISTINGS, { params });
    } catch (error) {
      if (import.meta.env.DEV) return mockEvOwnerService.getListings(params);
      throw error;
    }
  },

  createListing: async (listingData) => {
    if (shouldUseMock()) return mockEvOwnerService.createListing(listingData);
    try {
      return await apiClient.post(API_ENDPOINTS.EV_OWNER.LISTINGS, listingData);
    } catch (error) {
      if (import.meta.env.DEV) return mockEvOwnerService.createListing(listingData);
      throw error;
    }
  },

  updateListing: async (listingId, listingData) => {
    if (shouldUseMock()) return mockEvOwnerService.updateListing(listingId, listingData);
    try {
      return await apiClient.put(`${API_ENDPOINTS.EV_OWNER.LISTINGS}/${listingId}`, listingData);
    } catch (error) {
      if (import.meta.env.DEV) return mockEvOwnerService.updateListing(listingId, listingData);
      throw error;
    }
  },

  deleteListing: async (listingId) => {
    if (shouldUseMock()) return mockEvOwnerService.deleteListing(listingId);
    try {
      return await apiClient.delete(`${API_ENDPOINTS.EV_OWNER.LISTINGS}/${listingId}`);
    } catch (error) {
      if (import.meta.env.DEV) return mockEvOwnerService.deleteListing(listingId);
      throw error;
    }
  },

  // AI Price Suggestion
  getPriceSuggestion: async (vehicleType, creditAmount, marketType) => {
    if (shouldUseMock()) return mockEvOwnerService.getPriceSuggestion(vehicleType, creditAmount, marketType);
    try {
      return await apiClient.post(API_ENDPOINTS.EV_OWNER.AI_PRICE_SUGGESTION, {
        vehicleType,
        creditAmount,
        marketType,
      });
    } catch (error) {
      if (import.meta.env.DEV) return mockEvOwnerService.getPriceSuggestion(vehicleType, creditAmount, marketType);
      throw error;
    }
  },

  // Transactions
  getTransactions: async (params = {}) => {
    if (shouldUseMock()) return mockEvOwnerService.getTransactions(params);
    try {
      return await apiClient.get(API_ENDPOINTS.EV_OWNER.TRANSACTIONS, { params });
    } catch (error) {
      if (import.meta.env.DEV) return mockEvOwnerService.getTransactions(params);
      throw error;
    }
  },

  getTransactionById: async (transactionId) => {
    if (shouldUseMock()) return mockEvOwnerService.getTransactionById(transactionId);
    try {
      return await apiClient.get(`${API_ENDPOINTS.EV_OWNER.TRANSACTIONS}/${transactionId}`);
    } catch (error) {
      if (import.meta.env.DEV) return mockEvOwnerService.getTransactionById(transactionId);
      throw error;
    }
  },

  cancelTransaction: async (transactionId) => {
    if (shouldUseMock()) return mockEvOwnerService.cancelTransaction(transactionId);
    try {
      return await apiClient.post(`${API_ENDPOINTS.EV_OWNER.TRANSACTIONS}/${transactionId}/cancel`);
    } catch (error) {
      if (import.meta.env.DEV) return mockEvOwnerService.cancelTransaction(transactionId);
      throw error;
    }
  },

  // Reports
  getReports: async (params = {}) => {
    if (shouldUseMock()) return mockEvOwnerService.getReports(params);
    try {
      return await apiClient.get(API_ENDPOINTS.EV_OWNER.REPORTS, { params });
    } catch (error) {
      if (import.meta.env.DEV) return mockEvOwnerService.getReports(params);
      throw error;
    }
  },

  getDashboardStats: async () => {
    if (shouldUseMock()) return mockEvOwnerService.getDashboardStats();
    try {
      return await apiClient.get(`${API_ENDPOINTS.EV_OWNER.REPORTS}/dashboard`);
    } catch (error) {
      if (import.meta.env.DEV) return mockEvOwnerService.getDashboardStats();
      throw error;
    }
  },

  exportReport: async (format, params = {}) => {
    if (shouldUseMock()) return mockEvOwnerService.exportReport(format, params);
    try {
      return await apiClient.get(`${API_ENDPOINTS.EV_OWNER.REPORTS}/export/${format}`, {
        params,
        responseType: 'blob',
      });
    } catch (error) {
      if (import.meta.env.DEV) return mockEvOwnerService.exportReport(format, params);
      throw error;
    }
  },

  // Withdraw
  withdraw: async (amount, paymentMethod) => {
    if (shouldUseMock()) return mockEvOwnerService.withdraw(amount, paymentMethod);
    try {
      return await apiClient.post(API_ENDPOINTS.EV_OWNER.WITHDRAW, {
        amount,
        paymentMethod,
      });
    } catch (error) {
      if (import.meta.env.DEV) return mockEvOwnerService.withdraw(amount, paymentMethod);
      throw error;
    }
  },
};

export default evOwnerService;

