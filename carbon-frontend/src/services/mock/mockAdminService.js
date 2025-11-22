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

  rejectListing: async (listingId, reason) => {
    // Import evOwnerService to refund credits
    const { mockEvOwnerService } = await import('./mockEvOwnerService');
    
    // Get listing info to find quantity
    const LISTINGS_STORAGE_KEY = 'mock_listings';
    try {
      const storedListings = localStorage.getItem(LISTINGS_STORAGE_KEY);
      if (storedListings) {
        const listings = JSON.parse(storedListings);
        const listing = listings.find(l => l.id === listingId);
        
        if (listing && listing.quantity) {
          // Refund credits back to wallet
          await mockEvOwnerService.refundCreditsFromListing(
            listingId,
            listing.quantity,
            reason || 'Niêm yết không hợp lệ'
          );
        }
      }
    } catch (error) {
      console.error('Error refunding credits:', error);
    }
    
    return { success: true, rejected: true };
  },
};

