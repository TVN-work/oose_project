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
    return {
      transactionId: `purchase-${Date.now()}`,
      creditId,
      amount,
      quantity,
      status: 'pending',
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

