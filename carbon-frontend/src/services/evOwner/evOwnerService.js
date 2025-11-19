import apiClient from '../api/client';
import { API_ENDPOINTS } from '../../config/api';

export const evOwnerService = {
  // Trips Management
  getTrips: async (params = {}) => {
    return apiClient.get(API_ENDPOINTS.EV_OWNER.TRIPS, { params });
  },

  uploadTrip: async (tripData) => {
    return apiClient.post(API_ENDPOINTS.EV_OWNER.TRIPS, tripData);
  },

  getTripById: async (tripId) => {
    return apiClient.get(`${API_ENDPOINTS.EV_OWNER.TRIPS}/${tripId}`);
  },

  // Carbon Wallet
  getCarbonWallet: async () => {
    return apiClient.get(API_ENDPOINTS.EV_OWNER.CARBON_WALLET);
  },

  getWalletTransactions: async (params = {}) => {
    return apiClient.get(`${API_ENDPOINTS.EV_OWNER.CARBON_WALLET}/transactions`, { params });
  },

  // Listings Management
  getListings: async (params = {}) => {
    return apiClient.get(API_ENDPOINTS.EV_OWNER.LISTINGS, { params });
  },

  createListing: async (listingData) => {
    return apiClient.post(API_ENDPOINTS.EV_OWNER.LISTINGS, listingData);
  },

  updateListing: async (listingId, listingData) => {
    return apiClient.put(`${API_ENDPOINTS.EV_OWNER.LISTINGS}/${listingId}`, listingData);
  },

  deleteListing: async (listingId) => {
    return apiClient.delete(`${API_ENDPOINTS.EV_OWNER.LISTINGS}/${listingId}`);
  },

  // AI Price Suggestion
  getPriceSuggestion: async (vehicleType, creditAmount, marketType) => {
    return apiClient.post(API_ENDPOINTS.EV_OWNER.AI_PRICE_SUGGESTION, {
      vehicleType,
      creditAmount,
      marketType,
    });
  },

  // Transactions
  getTransactions: async (params = {}) => {
    return apiClient.get(API_ENDPOINTS.EV_OWNER.TRANSACTIONS, { params });
  },

  getTransactionById: async (transactionId) => {
    return apiClient.get(`${API_ENDPOINTS.EV_OWNER.TRANSACTIONS}/${transactionId}`);
  },

  cancelTransaction: async (transactionId) => {
    return apiClient.post(`${API_ENDPOINTS.EV_OWNER.TRANSACTIONS}/${transactionId}/cancel`);
  },

  // Reports
  getReports: async (params = {}) => {
    return apiClient.get(API_ENDPOINTS.EV_OWNER.REPORTS, { params });
  },

  getDashboardStats: async () => {
    return apiClient.get(`${API_ENDPOINTS.EV_OWNER.REPORTS}/dashboard`);
  },

  exportReport: async (format, params = {}) => {
    return apiClient.get(`${API_ENDPOINTS.EV_OWNER.REPORTS}/export/${format}`, {
      params,
      responseType: 'blob',
    });
  },

  // Withdraw
  withdraw: async (amount, paymentMethod) => {
    return apiClient.post(API_ENDPOINTS.EV_OWNER.WITHDRAW, {
      amount,
      paymentMethod,
    });
  },
};

export default evOwnerService;

