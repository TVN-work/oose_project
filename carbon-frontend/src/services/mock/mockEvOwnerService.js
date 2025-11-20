import { mockDashboardStats, mockCarbonWallet, mockListings, mockTransactions, delay } from './mockData';
import { mockVerifierService } from './mockVerifierService';

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
    
    // Get wallet from localStorage if exists, otherwise use default
    const WALLET_STORAGE_KEY = 'mock_carbon_wallet';
    try {
      const stored = localStorage.getItem(WALLET_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error reading wallet from localStorage:', error);
    }
    
    // Save default wallet to localStorage
    localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(mockCarbonWallet));
    return mockCarbonWallet;
  },

  // Add credits to wallet (called when verification is approved)
  addCreditsToWallet: async (creditData) => {
    await delay(500);
    
    const WALLET_STORAGE_KEY = 'mock_carbon_wallet';
    let wallet;
    
    try {
      const stored = localStorage.getItem(WALLET_STORAGE_KEY);
      wallet = stored ? JSON.parse(stored) : { ...mockCarbonWallet };
    } catch (error) {
      wallet = { ...mockCarbonWallet };
    }
    
    const creditAmount = creditData.amount || creditData.creditAmount || 0;
    
    // Update wallet balance
    wallet.balance = (wallet.balance || 0) + creditAmount;
    wallet.available = (wallet.available || 0) + creditAmount;
    wallet.totalEarned = (wallet.totalEarned || 0) + creditAmount;
    wallet.statistics.totalCredits = wallet.balance;
    wallet.statistics.availableCredits = wallet.available;
    
    // Add transaction
    const transaction = {
      id: `tx-${Date.now()}`,
      type: 'earned',
      amount: creditAmount,
      description: creditData.description || `Tín chỉ được cấp từ xác minh #${creditData.verificationRequestId || 'N/A'}`,
      date: new Date().toISOString(),
      status: 'completed',
      source: 'verification',
      verificationRequestId: creditData.verificationRequestId,
      tripId: creditData.tripId,
      calculationId: creditData.calculationId,
    };
    
    wallet.transactions = wallet.transactions || [];
    wallet.transactions.unshift(transaction); // Add to beginning
    
    // Save to localStorage
    localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(wallet));
    
    return {
      success: true,
      wallet,
      transaction,
      newBalance: wallet.balance,
    };
  },

  getWalletTransactions: async (params = {}) => {
    await delay(500);
    
    // Get wallet from localStorage to get latest transactions
    const WALLET_STORAGE_KEY = 'mock_carbon_wallet';
    try {
      const stored = localStorage.getItem(WALLET_STORAGE_KEY);
      if (stored) {
        const wallet = JSON.parse(stored);
        return {
          data: wallet.transactions || [],
          total: wallet.transactions?.length || 0,
        };
      }
    } catch (error) {
      console.error('Error reading wallet transactions from localStorage:', error);
    }
    
    // Return default transactions if no wallet found
    return {
      data: mockCarbonWallet.transactions || [],
      total: mockCarbonWallet.transactions?.length || 0,
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

  // Carbon Calculation methods
  // Flow: API Gateway → Carbon-Calculation Service → EV-Data Service → Calculate → CVA Service
  calculateCarbonCredits: async (tripId) => {
    // Import Carbon Calculation Service
    const { mockCarbonCalculationService } = await import('./mockCarbonCalculationService');
    
    // This simulates: API Gateway → Carbon-Calculation Service
    const result = await mockCarbonCalculationService.calculate(tripId);
    
    // Return with tripId for reference
    return {
      ...result,
      tripId,
    };
  },

  getCalculationStatus: async (calculationId) => {
    // Import Carbon Calculation Service
    const { mockCarbonCalculationService } = await import('./mockCarbonCalculationService');
    
    const status = await mockCarbonCalculationService.getStatus(calculationId);
    
    // Also get verification request ID if available
    const CALCULATION_STORAGE_KEY = 'mock_calculations';
    try {
      const stored = localStorage.getItem(CALCULATION_STORAGE_KEY);
      if (stored) {
        const calculations = JSON.parse(stored);
        const calculation = calculations[calculationId];
        if (calculation) {
          return {
            ...status,
            verificationRequestId: calculation.verificationRequestId,
            verified: calculation.verified,
            creditsIssued: calculation.creditsIssued,
          };
        }
      }
    } catch (error) {
      console.error('Error reading calculation:', error);
    }
    
    return status;
  },

  getCalculationResult: async (calculationId) => {
    await delay(500);
    return {
      co2Reduced: 2.1,
      credits: 0.025,
      status: 'verified',
      calculationId,
    };
  },
};

export default mockEvOwnerService;

