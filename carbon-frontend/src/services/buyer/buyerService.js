import apiClient from '../api/client';
import { API_ENDPOINTS } from '../../config/api';
import { mockBuyerService, shouldUseMock } from '../mock';

export const buyerService = {
  getMarketplace: async (params = {}) => {
    if (shouldUseMock()) return mockBuyerService.getMarketplace(params);
    try {
      return await apiClient.get(API_ENDPOINTS.BUYER.MARKETPLACE, { params });
    } catch (error) {
      if (import.meta.env.DEV) return mockBuyerService.getMarketplace(params);
      throw error;
    }
  },

  getListingDetail: async (listingId) => {
    if (shouldUseMock()) return mockBuyerService.getListingDetail(listingId);
    try {
      return await apiClient.get(`${API_ENDPOINTS.BUYER.MARKETPLACE}/${listingId}`);
    } catch (error) {
      if (import.meta.env.DEV) return mockBuyerService.getListingDetail(listingId);
      throw error;
    }
  },

  purchase: async ({ creditId, amount, quantity }) => {
    if (shouldUseMock()) return mockBuyerService.purchase({ creditId, amount, quantity });
    try {
      return await apiClient.post(API_ENDPOINTS.BUYER.PURCHASE, { creditId, amount, quantity });
    } catch (error) {
      if (import.meta.env.DEV) return mockBuyerService.purchase({ creditId, amount, quantity });
      throw error;
    }
  },

  getCertificates: async (params = {}) => {
    if (shouldUseMock()) return mockBuyerService.getCertificates(params);
    try {
      return await apiClient.get(API_ENDPOINTS.BUYER.CERTIFICATES, { params });
    } catch (error) {
      if (import.meta.env.DEV) return mockBuyerService.getCertificates(params);
      throw error;
    }
  },

  getPurchaseHistory: async (params = {}) => {
    if (shouldUseMock()) return mockBuyerService.getPurchaseHistory(params);
    try {
      return await apiClient.get(API_ENDPOINTS.BUYER.PURCHASE_HISTORY, { params });
    } catch (error) {
      if (import.meta.env.DEV) return mockBuyerService.getPurchaseHistory(params);
      throw error;
    }
  },

  getPaymentMethods: async () => {
    if (shouldUseMock()) return mockBuyerService.getPaymentMethods();
    try {
      return await apiClient.get(`${API_ENDPOINTS.BUYER.PAYMENT}/methods`);
    } catch (error) {
      if (import.meta.env.DEV) return mockBuyerService.getPaymentMethods();
      throw error;
    }
  },

  getDashboardStats: async () => {
    if (shouldUseMock()) return mockBuyerService.getDashboardStats();
    try {
      return await apiClient.get(`${API_ENDPOINTS.BUYER.MARKETPLACE}/dashboard`);
    } catch (error) {
      if (import.meta.env.DEV) return mockBuyerService.getDashboardStats();
      throw error;
    }
  },
};

export default buyerService;

