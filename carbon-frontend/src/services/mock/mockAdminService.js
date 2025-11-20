// Mock Admin Service
// This will be used when backend is not available

export const mockAdminService = {
  getUsers: async (params = {}) => {
    return [
      {
        id: 'U001',
        name: 'Nguyễn Văn An',
        email: 'an.nguyen@email.com',
        role: 'EV Owner',
        status: 'active',
      },
    ];
  },

  getTransactions: async (params = {}) => {
    return [
      {
        id: 'TX001',
        seller: 'Nguyễn Văn An',
        buyer: 'Green Corp',
        credits: '0.025',
        value: '₫125,000',
        status: 'completed',
      },
    ];
  },

  getWallets: async (params = {}) => {
    return [
      {
        user: 'Green Corporation',
        balance: '₫2,450,000',
        status: 'active',
      },
    ];
  },

  getListings: async (params = {}) => {
    return [
      {
        id: 'L001',
        seller: 'Nguyễn Văn An',
        credits: '0.045',
        price: '₫225,000',
        status: 'pending',
      },
    ];
  },
};

