import apiClient from '../api/client';
import { API_ENDPOINTS } from '../../config/api';
import { mockBuyerService, shouldUseMock } from '../mock';

export const buyerService = {
  // Market Service - Marketplace (Use Case 9: Search Carbon Credits)
  getMarketplace: async (params = {}) => {
    if (shouldUseMock()) return mockBuyerService?.getMarketplace?.(params) || [];
    try {
      return await apiClient.get(API_ENDPOINTS.MARKET.MARKETPLACE, { params });
    } catch (error) {
      if (import.meta.env.DEV) return mockBuyerService?.getMarketplace?.(params) || [];
      throw error;
    }
  },

  searchMarketplace: async (searchParams) => {
    if (shouldUseMock()) return mockBuyerService?.getMarketplace?.(searchParams) || [];
    try {
      return await apiClient.post(API_ENDPOINTS.MARKET.SEARCH, searchParams);
    } catch (error) {
      if (import.meta.env.DEV) return mockBuyerService?.getMarketplace?.(searchParams) || [];
      throw error;
    }
  },

  getListingDetail: async (listingId) => {
    if (shouldUseMock()) return mockBuyerService?.getListingDetail?.(listingId) || null;
    try {
      return await apiClient.get(API_ENDPOINTS.MARKET.LISTING_DETAIL.replace(':id', listingId));
    } catch (error) {
      if (import.meta.env.DEV) return mockBuyerService?.getListingDetail?.(listingId) || null;
      throw error;
    }
  },

  // Market Service - Auction (Use Case 11: Join Auction)
  getAuction: async (auctionId) => {
    // Returns market_listing with listing_type='auction' and related bids
    if (shouldUseMock()) return mockBuyerService?.getAuction?.(auctionId) || { id: auctionId, status: 'active', currentBid: 5000 };
    try {
      return await apiClient.get(API_ENDPOINTS.MARKET.AUCTION.replace(':id', auctionId));
    } catch (error) {
      if (import.meta.env.DEV) return mockBuyerService?.getAuction?.(auctionId) || { id: auctionId, status: 'active', currentBid: 5000 };
      throw error;
    }
  },

  // Market Service - Bids
  getBids: async (listingId, params = {}) => {
    // Returns bid table data filtered by listing_id
    if (shouldUseMock()) return [];
    try {
      return await apiClient.get(API_ENDPOINTS.MARKET.BIDS, { params: { listing_id: listingId, ...params } });
    } catch (error) {
      if (import.meta.env.DEV) return [];
      throw error;
    }
  },

  getBidById: async (bidId) => {
    if (shouldUseMock()) return { id: bidId, amount: 5000 };
    try {
      return await apiClient.get(API_ENDPOINTS.MARKET.BID_DETAIL.replace(':id', bidId));
    } catch (error) {
      if (import.meta.env.DEV) return { id: bidId, amount: 5000 };
      throw error;
    }
  },

  placeBid: async (listingId, bidAmount) => {
    // Creates bid record in bid table
    if (shouldUseMock()) return mockBuyerService?.placeBid?.(listingId, bidAmount) || { success: true, bidId: 'bid-123' };
    try {
      return await apiClient.post(API_ENDPOINTS.MARKET.PLACE_BID.replace(':id', listingId), {
        amount: bidAmount,
      });
    } catch (error) {
      if (import.meta.env.DEV) return mockBuyerService?.placeBid?.(listingId, bidAmount) || { success: true, bidId: 'bid-123' };
      throw error;
    }
  },

  getAuctionStatus: async (auctionId) => {
    if (shouldUseMock()) return { status: 'active', timeRemaining: 3600 };
    try {
      return await apiClient.get(API_ENDPOINTS.MARKET.AUCTION_STATUS.replace(':id', auctionId));
    } catch (error) {
      if (import.meta.env.DEV) return { status: 'active', timeRemaining: 3600 };
      throw error;
    }
  },

  // Transaction Service - Purchase (Use Case 10: Direct Purchase)
  purchase: async (creditId, amount, quantity) => {
    // Use Case 10: Direct Purchase (include: Online Payment)
    if (shouldUseMock()) return mockBuyerService?.purchase?.(creditId, amount, quantity) || { transactionId: 'tx-123' };
    try {
      return await apiClient.post(API_ENDPOINTS.TRANSACTION.PURCHASE, {
        creditId,
        amount,
        quantity,
      });
    } catch (error) {
      if (import.meta.env.DEV) return mockBuyerService?.purchase?.(creditId, amount, quantity) || { transactionId: 'tx-123' };
      throw error;
    }
  },

  // Transaction Service - Payment (Use Case 12: Online Payment)
  processPayment: async (transactionId, paymentData) => {
    // Use Case 12: Online Payment (include from Direct Purchase or Auction win)
    if (shouldUseMock()) return mockBuyerService?.processPayment?.(transactionId, paymentData) || { success: true, paymentId: 'pay-123' };
    try {
      return await apiClient.post(API_ENDPOINTS.TRANSACTION.PAYMENT.replace(':id', transactionId), paymentData);
    } catch (error) {
      if (import.meta.env.DEV) return mockBuyerService?.processPayment?.(transactionId, paymentData) || { success: true, paymentId: 'pay-123' };
      throw error;
    }
  },

  getPaymentMethods: async () => {
    if (shouldUseMock()) return mockBuyerService?.getPaymentMethods?.() || [];
    try {
      return await apiClient.get(API_ENDPOINTS.TRANSACTION.PAYMENT_METHODS);
    } catch (error) {
      if (import.meta.env.DEV) return mockBuyerService?.getPaymentMethods?.() || [];
      throw error;
    }
  },

  // Transaction Service - Purchase History (Use Case 14: Manage Purchase History)
  getPurchaseHistory: async (params = {}) => {
    if (shouldUseMock()) return mockBuyerService?.getPurchaseHistory?.(params) || [];
    try {
      return await apiClient.get(API_ENDPOINTS.TRANSACTION.BUYER_TRANSACTIONS, { params });
    } catch (error) {
      if (import.meta.env.DEV) return mockBuyerService?.getPurchaseHistory?.(params) || [];
      throw error;
    }
  },

  // Certificate Service - Certificates (Use Case 13: Receive Carbon Certificate)
  getCertificates: async (params = {}) => {
    // Use Case 13: Receive Carbon Certificate (extend from Purchase Success)
    if (shouldUseMock()) return mockBuyerService?.getCertificates?.(params) || [];
    try {
      return await apiClient.get(API_ENDPOINTS.CERTIFICATE.CERTIFICATES, { params });
    } catch (error) {
      if (import.meta.env.DEV) return mockBuyerService?.getCertificates?.(params) || [];
      throw error;
    }
  },

  getCertificateDetail: async (certificateId) => {
    if (shouldUseMock()) return { id: certificateId, credits: 0.025 };
    try {
      return await apiClient.get(API_ENDPOINTS.CERTIFICATE.CERTIFICATE_DETAIL.replace(':id', certificateId));
    } catch (error) {
      if (import.meta.env.DEV) return { id: certificateId, credits: 0.025 };
      throw error;
    }
  },

  downloadCertificate: async (certificateId) => {
    if (shouldUseMock()) return { downloadUrl: '#' };
    try {
      return await apiClient.get(API_ENDPOINTS.CERTIFICATE.DOWNLOAD_CERTIFICATE.replace(':id', certificateId), {
        responseType: 'blob',
      });
    } catch (error) {
      if (import.meta.env.DEV) return { downloadUrl: '#' };
      throw error;
    }
  },

  // Dashboard Stats
  getDashboardStats: async () => {
    if (shouldUseMock()) return mockBuyerService?.getDashboardStats?.() || {};
    try {
      return await apiClient.get('/buyer/dashboard/stats');
    } catch (error) {
      if (import.meta.env.DEV) return mockBuyerService?.getDashboardStats?.() || {};
      throw error;
    }
  },
};

export default buyerService;

