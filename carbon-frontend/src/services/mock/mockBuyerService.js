import { mockMarketplaceCredits, mockCertificates, mockTransactions, mockDashboardStats, delay } from './mockData';

export const mockBuyerService = {
  getMarketplace: async (params = {}) => {
    await delay(600);
    return {
      data: mockMarketplaceCredits,
      total: mockMarketplaceCredits.length,
    };
  },

  getListingDetail: async (listingId) => {
    await delay(500);
    const listing = mockMarketplaceCredits.find(item => item.id === listingId);
    if (listing) {
      return {
        ...listing,
        rating: 4.8,
        reviews: 127,
        memberSince: 'Tháng 3, 2024',
        totalSold: 2340,
        responseTime: '< 2 giờ',
        description: `Tín chỉ carbon được tạo ra từ việc sử dụng xe ${listing.vehicle} cho các chuyến đi trong nội thành ${listing.region}. Xe được bảo dưỡng định kỳ và đảm bảo hiệu suất tối ưu, góp phần giảm thiểu lượng khí thải CO2 so với xe xăng truyền thống.`,
      };
    }
    return null;
  },

  purchase: async ({ creditId, amount, quantity }) => {
    await delay(1200);
    
    // Import mockDatabase to create transaction
    const mockDatabase = (await import('./mockDatabaseService')).default;
    
    // Get current user ID (buyer)
    const buyerId = localStorage.getItem('currentUserId') || 'buyer-user-id';
    
    // Find listing to get seller_id
    const listing = mockDatabase.findListingById(creditId);
    if (!listing) {
      throw new Error('Listing not found');
    }
    
    // Create transaction in database
    const transaction = mockDatabase.createTransaction({
      buyer_id: buyerId,
      seller_id: listing.seller_id,
      listing_id: creditId,
      credit: quantity,
      amount: amount,
      payment_method: 'e_wallet',
      payment_url: `/payment/redirect/${Date.now()}`,
      status: 'PENDING_PAYMENT', // Use database status format
    });
    
    // Dispatch event to notify other components
    window.dispatchEvent(new CustomEvent('transaction-created', {
      detail: { transaction }
    }));
    
    return {
      transactionId: transaction.id,
      creditId,
      amount,
      quantity,
      status: transaction.status,
      transaction,
    };
  },

  getCertificates: async (params = {}) => {
    await delay(500);
    return {
      data: mockCertificates,
      total: mockCertificates.length,
    };
  },

  getPurchaseHistory: async (params = {}) => {
    await delay(500);
    return {
      data: mockTransactions,
      total: mockTransactions.length,
    };
  },

  getPaymentMethods: async () => {
    await delay(300);
    return [
      { id: 'ewallet', name: 'E-Wallet', enabled: true },
      { id: 'banking', name: 'Banking', enabled: true },
      { id: 'credit_card', name: 'Credit Card', enabled: true },
    ];
  },

  getDashboardStats: async () => {
    await delay(500);
    return mockDashboardStats.BUYER;
  },
};

export default mockBuyerService;

