import { mockDashboardStats, mockCarbonWallet, mockListings, mockTransactions, delay } from './mockData';

export const mockEvOwnerService = {
  getTrips: async (params = {}) => {
    await delay(600);
    return {
      data: [],
      total: 0,
      page: 1,
      limit: 10,
    };
  },

  uploadTrip: async (tripData) => {
    await delay(1200);
    return {
      id: `trip-${Date.now()}`,
      ...tripData,
      status: 'pending',
      credits: 15.5,
    };
  },

  getTripById: async (tripId) => {
    await delay(400);
    return {
      id: tripId,
      distance: 125,
      credits: 15.5,
      status: 'verified',
    };
  },

  getCarbonWallet: async () => {
    await delay(500);
    return mockCarbonWallet;
  },

  getWalletTransactions: async (params = {}) => {
    await delay(500);
    return {
      data: mockCarbonWallet.transactions,
      total: mockCarbonWallet.transactions.length,
    };
  },

  getListings: async (params = {}) => {
    await delay(500);
    return {
      data: mockListings,
      total: mockListings.length,
    };
  },

  createListing: async (listingData) => {
    await delay(800);
    return {
      id: `listing-${Date.now()}`,
      ...listingData,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  },

  updateListing: async (listingId, listingData) => {
    await delay(600);
    return {
      id: listingId,
      ...listingData,
      updatedAt: new Date().toISOString(),
    };
  },

  deleteListing: async (listingId) => {
    await delay(400);
    return { success: true };
  },

  getPriceSuggestion: async (vehicleType, creditAmount, marketType) => {
    await delay(800);
    const basePrice = marketType === 'compliance' ? 150 : 5;
    const vehicleFactor = {
      motorcycle: 0.9,
      car: 1.1,
      truck: 1.3,
      logistics: 1.6,
    }[vehicleType] || 1.0;
    
    return {
      suggestedPrice: basePrice * vehicleFactor,
      confidence: 0.85,
      marketAverage: basePrice * vehicleFactor * 0.95,
    };
  },

  getTransactions: async (params = {}) => {
    await delay(500);
    return {
      data: mockTransactions,
      total: mockTransactions.length,
    };
  },

  getTransactionById: async (transactionId) => {
    await delay(400);
    return mockTransactions.find(tx => tx.id === transactionId) || mockTransactions[0];
  },

  cancelTransaction: async (transactionId) => {
    await delay(500);
    return { success: true };
  },

  getReports: async (params = {}) => {
    await delay(600);
    return {
      co2Data: mockDashboardStats.EV_OWNER.charts.co2Trend,
      revenueData: mockDashboardStats.EV_OWNER.charts.revenueTrend,
      summary: {
        totalCo2: 18.1,
        totalRevenue: 8750,
        totalCredits: 245,
      },
    };
  },

  getDashboardStats: async () => {
    await delay(500);
    return mockDashboardStats.EV_OWNER;
  },

  exportReport: async (format, params = {}) => {
    await delay(1000);
    // Return mock blob
    return new Blob(['Mock report data'], { type: format === 'pdf' ? 'application/pdf' : 'text/csv' });
  },

  withdraw: async (amount, paymentMethod) => {
    await delay(1000);
    return {
      transactionId: `withdraw-${Date.now()}`,
      amount,
      paymentMethod,
      status: 'pending',
    };
  },
};

export default mockEvOwnerService;

