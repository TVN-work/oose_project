import apiClient from '../api/client';
import { API_ENDPOINTS } from '../../config/api';
import { mockEvOwnerService, shouldUseMock } from '../mock';

export const evOwnerService = {
  // Vehicle Service - Trip Management (Use Case 1: Sync EV Trip Data)
  getTrips: async (params = {}) => {
    if (shouldUseMock()) return mockEvOwnerService.getTrips(params);
    try {
      return await apiClient.get(API_ENDPOINTS.VEHICLE.TRIPS, { params });
    } catch (error) {
      if (import.meta.env.DEV) return mockEvOwnerService.getTrips(params);
      throw error;
    }
  },

  uploadTrip: async (tripData) => {
    // Use Case 1: Upload trip data → Vehicle Service
    // After upload, trigger carbon calculation (Use Case 2)
    if (shouldUseMock()) return mockEvOwnerService.uploadTrip(tripData);
    try {
      const response = await apiClient.post(API_ENDPOINTS.VEHICLE.UPLOAD_TRIP, tripData);
      // Trigger carbon calculation automatically after upload
      if (response.tripId) {
        // Start calculation in background (async)
        evOwnerService.calculateCarbonCredits(response.tripId).catch(console.error);
      }
      return response;
    } catch (error) {
      if (import.meta.env.DEV) return mockEvOwnerService.uploadTrip(tripData);
      throw error;
    }
  },

  getTripById: async (tripId) => {
    if (shouldUseMock()) return mockEvOwnerService.getTripById(tripId);
    try {
      return await apiClient.get(API_ENDPOINTS.VEHICLE.TRIP_DETAIL.replace(':id', tripId));
    } catch (error) {
      if (import.meta.env.DEV) return mockEvOwnerService.getTripById(tripId);
      throw error;
    }
  },

  getVehicleInfo: async () => {
    if (shouldUseMock()) return { vehicleType: 'car', model: 'Tesla Model 3' };
    try {
      return await apiClient.get(API_ENDPOINTS.VEHICLE.VEHICLE_INFO);
    } catch (error) {
      if (import.meta.env.DEV) return { vehicleType: 'car', model: 'Tesla Model 3' };
      throw error;
    }
  },

  updateVehicleInfo: async (vehicleData) => {
    if (shouldUseMock()) return { success: true };
    try {
      return await apiClient.put(API_ENDPOINTS.VEHICLE.UPDATE_VEHICLE, vehicleData);
    } catch (error) {
      if (import.meta.env.DEV) return { success: true };
      throw error;
    }
  },

  // Carbon Calculation Service - CO2 & Credit Calculation (Use Case 2)
  calculateCarbonCredits: async (tripId) => {
    // Use Case 2: Calculate CO2 & convert to credits
    // This triggers: Vehicle Service → Carbon Calculation Service → Verification Service
    if (shouldUseMock()) {
      const { mockEvOwnerService } = await import('../mock/mockEvOwnerService');
      return mockEvOwnerService.calculateCarbonCredits(tripId);
    }
    try {
      return await apiClient.post(API_ENDPOINTS.CARBON_CALCULATION.CALCULATE, { tripId });
    } catch (error) {
      if (import.meta.env.DEV) {
        const { mockEvOwnerService } = await import('../mock/mockEvOwnerService');
        return mockEvOwnerService.calculateCarbonCredits(tripId);
      }
      throw error;
    }
  },

  getCalculationStatus: async (calculationId) => {
    if (shouldUseMock()) {
      const { mockEvOwnerService } = await import('../mock/mockEvOwnerService');
      return mockEvOwnerService.getCalculationStatus(calculationId);
    }
    try {
      return await apiClient.get(API_ENDPOINTS.CARBON_CALCULATION.CALCULATION_STATUS.replace(':id', calculationId));
    } catch (error) {
      if (import.meta.env.DEV) {
        const { mockEvOwnerService } = await import('../mock/mockEvOwnerService');
        return mockEvOwnerService.getCalculationStatus(calculationId);
      }
      throw error;
    }
  },

  getCalculationResult: async (calculationId) => {
    if (shouldUseMock()) {
      const { mockEvOwnerService } = await import('../mock/mockEvOwnerService');
      return mockEvOwnerService.getCalculationResult(calculationId);
    }
    try {
      return await apiClient.get(API_ENDPOINTS.CARBON_CALCULATION.CALCULATION_RESULT.replace(':id', calculationId));
    } catch (error) {
      if (import.meta.env.DEV) {
        const { mockEvOwnerService } = await import('../mock/mockEvOwnerService');
        return mockEvOwnerService.getCalculationResult(calculationId);
      }
      throw error;
    }
  },

  // Wallet Service - Carbon Wallet (Use Case 3: Manage Carbon Wallet)
  getCarbonWallet: async () => {
    if (shouldUseMock()) return mockEvOwnerService.getCarbonWallet();
    try {
      return await apiClient.get(API_ENDPOINTS.WALLET.CARBON_WALLET);
    } catch (error) {
      if (import.meta.env.DEV) return mockEvOwnerService.getCarbonWallet();
      throw error;
    }
  },

  getWalletTransactions: async (params = {}) => {
    if (shouldUseMock()) return mockEvOwnerService.getWalletTransactions(params);
    try {
      return await apiClient.get(API_ENDPOINTS.WALLET.CARBON_WALLET_TRANSACTIONS, { params });
    } catch (error) {
      if (import.meta.env.DEV) return mockEvOwnerService.getWalletTransactions(params);
      throw error;
    }
  },

  // Wallet Service - Payment Wallet
  getPaymentWallet: async () => {
    if (shouldUseMock()) return { balance: 5000000, currency: 'VND' };
    try {
      return await apiClient.get(API_ENDPOINTS.WALLET.PAYMENT_WALLET);
    } catch (error) {
      if (import.meta.env.DEV) return { balance: 5000000, currency: 'VND' };
      throw error;
    }
  },

  // Wallet Service - Withdraw (Use Case 6: Withdraw Earnings)
  withdraw: async (amount, paymentMethod) => {
    if (shouldUseMock()) return mockEvOwnerService.withdraw(amount, paymentMethod);
    try {
      return await apiClient.post(API_ENDPOINTS.WALLET.WITHDRAW, {
        amount,
        paymentMethod,
      });
    } catch (error) {
      if (import.meta.env.DEV) return mockEvOwnerService.withdraw(amount, paymentMethod);
      throw error;
    }
  },

  // Market Service - Listings (Use Case 4: List Carbon Credit)
  getListings: async (params = {}) => {
    if (shouldUseMock()) return mockEvOwnerService.getListings(params);
    try {
      return await apiClient.get(API_ENDPOINTS.MARKET.LISTINGS, { params });
    } catch (error) {
      if (import.meta.env.DEV) return mockEvOwnerService.getListings(params);
      throw error;
    }
  },

  createListing: async (listingData) => {
    // Use Case 4: Create listing (extend: Direct Sale or Auction)
    if (shouldUseMock()) return mockEvOwnerService.createListing(listingData);
    try {
      return await apiClient.post(API_ENDPOINTS.MARKET.CREATE_LISTING, listingData);
    } catch (error) {
      if (import.meta.env.DEV) return mockEvOwnerService.createListing(listingData);
      throw error;
    }
  },

  updateListing: async (listingId, listingData) => {
    if (shouldUseMock()) return mockEvOwnerService.updateListing(listingId, listingData);
    try {
      return await apiClient.put(API_ENDPOINTS.MARKET.UPDATE_LISTING.replace(':id', listingId), listingData);
    } catch (error) {
      if (import.meta.env.DEV) return mockEvOwnerService.updateListing(listingId, listingData);
      throw error;
    }
  },

  deleteListing: async (listingId) => {
    if (shouldUseMock()) return mockEvOwnerService.deleteListing(listingId);
    try {
      return await apiClient.delete(API_ENDPOINTS.MARKET.UPDATE_LISTING.replace(':id', listingId));
    } catch (error) {
      if (import.meta.env.DEV) return mockEvOwnerService.deleteListing(listingId);
      throw error;
    }
  },

  // Market Service - AI Price Suggestion (Use Case 8: AI Price Recommendation)
  getPriceSuggestion: async (vehicleType, creditAmount, marketType) => {
    if (shouldUseMock()) return mockEvOwnerService.getPriceSuggestion(vehicleType, creditAmount, marketType);
    try {
      return await apiClient.post(API_ENDPOINTS.MARKET.AI_PRICE_SUGGESTION, {
        vehicleType,
        creditAmount,
        marketType,
      });
    } catch (error) {
      if (import.meta.env.DEV) return mockEvOwnerService.getPriceSuggestion(vehicleType, creditAmount, marketType);
      throw error;
    }
  },

  // Transaction Service - Transactions (Use Case 5: Manage Transactions)
  getTransactions: async (params = {}) => {
    if (shouldUseMock()) return mockEvOwnerService.getTransactions(params);
    try {
      return await apiClient.get(API_ENDPOINTS.TRANSACTION.EV_OWNER_TRANSACTIONS, { params });
    } catch (error) {
      if (import.meta.env.DEV) return mockEvOwnerService.getTransactions(params);
      throw error;
    }
  },

  getTransactionById: async (transactionId) => {
    if (shouldUseMock()) return mockEvOwnerService.getTransactionById(transactionId);
    try {
      return await apiClient.get(API_ENDPOINTS.TRANSACTION.TRANSACTION_DETAIL.replace(':id', transactionId));
    } catch (error) {
      if (import.meta.env.DEV) return mockEvOwnerService.getTransactionById(transactionId);
      throw error;
    }
  },

  cancelTransaction: async (transactionId) => {
    if (shouldUseMock()) return mockEvOwnerService.cancelTransaction(transactionId);
    try {
      return await apiClient.post(API_ENDPOINTS.TRANSACTION.CANCEL_TRANSACTION.replace(':id', transactionId));
    } catch (error) {
      if (import.meta.env.DEV) return mockEvOwnerService.cancelTransaction(transactionId);
      throw error;
    }
  },

  completeTransaction: async (transactionId) => {
    if (shouldUseMock()) return { success: true };
    try {
      return await apiClient.post(API_ENDPOINTS.TRANSACTION.COMPLETE_TRANSACTION.replace(':id', transactionId));
    } catch (error) {
      if (import.meta.env.DEV) return { success: true };
      throw error;
    }
  },

  // Reports (Use Case 7: View Personal Report)
  getReports: async (params = {}) => {
    if (shouldUseMock()) return mockEvOwnerService.getReports(params);
    try {
      // Reports can come from multiple services, using a combined endpoint
      return await apiClient.get('/reports/ev-owner', { params });
    } catch (error) {
      if (import.meta.env.DEV) return mockEvOwnerService.getReports(params);
      throw error;
    }
  },

  getDashboardStats: async () => {
    if (shouldUseMock()) return mockEvOwnerService.getDashboardStats();
    try {
      // Dashboard stats combine data from multiple services
      return await apiClient.get('/reports/ev-owner/dashboard');
    } catch (error) {
      if (import.meta.env.DEV) return mockEvOwnerService.getDashboardStats();
      throw error;
    }
  },

  exportReport: async (format, params = {}) => {
    if (shouldUseMock()) return mockEvOwnerService.exportReport(format, params);
    try {
      return await apiClient.get(`/reports/ev-owner/export/${format}`, {
        params,
        responseType: 'blob',
      });
    } catch (error) {
      if (import.meta.env.DEV) return mockEvOwnerService.exportReport(format, params);
      throw error;
    }
  },
};

export default evOwnerService;

