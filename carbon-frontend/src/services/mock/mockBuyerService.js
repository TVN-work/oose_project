import { mockMarketplaceCredits, mockCertificates, mockTransactions, mockDashboardStats, delay } from './mockData';

export const mockBuyerService = {
  getMarketplace: async (params = {}) => {
    await delay(600);
    
    // Import mockDatabase to get real listings
    const mockDatabase = (await import('./mockDatabaseService')).default;
    const { mockUsers, mockVehicles } = await import('./mockData');
    
    // Get all active listings (not sold yet)
    const allListings = mockDatabase.findAllListings().filter(l => !l.buyer_id);
    
    // Apply filters
    let filteredListings = allListings;
    
    // Filter by listing type
    if (params.type) {
      filteredListings = filteredListings.filter(l => {
        if (params.type === 'buy-now') return l.listing_type === 'fixed_price';
        if (params.type === 'auction') return l.listing_type === 'auction';
        return true;
      });
    }
    
    // Filter by price range (convert VND to USD for comparison)
    if (params.minPrice || params.maxPrice) {
      const USD_TO_VND_RATE = 25000;
      filteredListings = filteredListings.filter(l => {
        const priceInUsd = l.price_per_credit || 0;
        if (params.minPrice && priceInUsd < params.minPrice) return false;
        if (params.maxPrice && priceInUsd > params.maxPrice) return false;
        return true;
      });
    }
    
    // Filter by quantity range
    if (params.minQuantity || params.maxQuantity) {
      filteredListings = filteredListings.filter(l => {
        const quantity = l.quantity || 0;
        if (params.minQuantity && quantity < params.minQuantity) return false;
        if (params.maxQuantity && quantity > params.maxQuantity) return false;
        return true;
      });
    }
    
    // Search by seller name or vehicle
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filteredListings = filteredListings.filter(l => {
        const seller = mockDatabase.findUserById(l.seller_id);
        const sellerName = seller?.full_name || '';
        return sellerName.toLowerCase().includes(searchLower);
      });
    }
    
    // Convert to marketplace format
    const marketplaceCredits = filteredListings.map(listing => {
      const seller = mockDatabase.findUserById(listing.seller_id);
      const sellerVehicles = mockDatabase.vehicles.filter(v => v.owner_id === listing.seller_id);
      const vehicle = sellerVehicles[0];
      
      // Get CO2 reduced from journeys (estimate based on quantity)
      const co2Saved = (listing.quantity || 0) * 0.1; // Estimate: 1 credit ≈ 0.1 ton CO2
      
      // Calculate time left for auction
      let timeLeft = null;
      if (listing.listing_type === 'auction' && listing.start_time) {
        const endTime = new Date(listing.start_time);
        endTime.setDate(endTime.getDate() + 7); // 7 days from start
        const now = new Date();
        const diff = endTime - now;
        if (diff > 0) {
          const hours = Math.floor(diff / 3600000);
          const minutes = Math.floor((diff % 3600000) / 60000);
          timeLeft = `${hours}h ${minutes}m`;
        }
      }
      
      // Map region based on seller (simplified - can be enhanced with actual location data)
      const regionMap = {
        'hanoi': 'Hà Nội',
        'hcm': 'TP.HCM',
        'danang': 'Đà Nẵng',
        'haiphong': 'Hải Phòng',
        'cantho': 'Cần Thơ',
      };
      const defaultRegion = 'Hà Nội'; // Default region
      
      return {
        id: listing.id,
        owner: seller?.full_name || 'Unknown',
        vehicle: vehicle ? `${vehicle.license_plate || 'Vehicle'}` : 'Electric Vehicle',
        credits: listing.quantity || 0,
        price: listing.price_per_credit || 0,
        region: defaultRegion, // Default, can be enhanced with location data from seller/vehicle
        co2Saved: parseFloat(co2Saved.toFixed(2)),
        verified: true, // Assume verified if listed
        type: listing.listing_type === 'fixed_price' ? 'buy-now' : 'auction',
        timeLeft: timeLeft,
        startingPrice: listing.starting_price || listing.price_per_credit,
        sellerId: listing.seller_id,
        created_at: listing.created_at, // Add created_at for date display
        status: listing.buyer_id ? 'SOLD' : (listing.listing_type === 'auction' ? 'BIDDING' : 'ACTIVE'), // Add status
      };
    });
    
    // Filter by region if specified
    let finalCredits = marketplaceCredits;
    if (params.region) {
      const regionMap = {
        'hanoi': 'Hà Nội',
        'hcm': 'TP.HCM',
        'danang': 'Đà Nẵng',
        'haiphong': 'Hải Phòng',
        'cantho': 'Cần Thơ',
      };
      const targetRegion = regionMap[params.region] || params.region;
      finalCredits = marketplaceCredits.filter(c => c.region === targetRegion);
    }
    
    return {
      data: finalCredits,
      total: finalCredits.length,
    };
  },

  getListingDetail: async (listingId) => {
    await delay(500);
    
    // Import mockDatabase to get real listing
    const mockDatabase = (await import('./mockDatabaseService')).default;
    const { mockUsers } = await import('./mockData');
    
    const listing = mockDatabase.findListingById(listingId);
    if (!listing) return null;
    
    const seller = mockDatabase.findUserById(listing.seller_id);
    const sellerVehicles = mockDatabase.vehicles.filter(v => v.owner_id === listing.seller_id);
    const vehicle = sellerVehicles[0];
    
    // Get seller stats
    const sellerTransactions = mockDatabase.findTransactionsBySellerId(listing.seller_id);
    const completedTransactions = sellerTransactions.filter(t => 
      t.status?.toUpperCase() === 'COMPLETED' || t.status === 'completed'
    );
    const totalSold = completedTransactions.reduce((sum, t) => sum + (t.credit || 0), 0);
    
    // Get bids for auction
    const bids = listing.listing_type === 'auction' 
      ? mockDatabase.findBidsByListingId(listingId)
      : [];
    
    const co2Saved = (listing.quantity || 0) * 0.1;
    
    return {
      id: listing.id,
      owner: seller?.full_name || 'Unknown',
      vehicle: vehicle ? `${vehicle.license_plate || 'Vehicle'}` : 'Electric Vehicle',
      credits: listing.quantity || 0,
      price: listing.price_per_credit || 0,
      region: 'Hà Nội',
      co2Saved: parseFloat(co2Saved.toFixed(2)),
      verified: true,
      type: listing.listing_type === 'fixed_price' ? 'buy-now' : 'auction',
      startingPrice: listing.starting_price || listing.price_per_credit,
      sellerId: listing.seller_id,
      rating: 4.8,
      reviews: 127,
      memberSince: seller?.created_at ? new Date(seller.created_at).toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' }) : 'N/A',
      totalSold: totalSold,
      responseTime: '< 2 giờ',
      description: `Tín chỉ carbon được tạo ra từ việc sử dụng xe điện cho các chuyến đi. Xe được bảo dưỡng định kỳ và đảm bảo hiệu suất tối ưu, góp phần giảm thiểu lượng khí thải CO2 so với xe xăng truyền thống.`,
      bids: bids.map(bid => ({
        id: bid.id,
        bidder: mockDatabase.findUserById(bid.bidder_id)?.full_name || 'Unknown',
        amount: bid.amount,
        createdAt: bid.created_at,
      })),
      highestBid: bids.length > 0 ? Math.max(...bids.map(b => b.amount)) : null,
      currentBid: listing.listing_type === 'auction' ? (bids.length > 0 ? Math.max(...bids.map(b => b.amount)) : listing.starting_price) : null,
    };
  },

  // Auction methods - Use Case 11: Join Auction
  getAuction: async (auctionId) => {
    await delay(500);
    
    // Import mockDatabase to get real auction listing
    const mockDatabase = (await import('./mockDatabaseService')).default;
    
    const listing = mockDatabase.findListingById(auctionId);
    if (!listing || listing.listing_type !== 'auction') {
      throw new Error('Auction not found');
    }
    
    const seller = mockDatabase.findUserById(listing.seller_id);
    const sellerVehicles = mockDatabase.vehicles.filter(v => v.owner_id === listing.seller_id);
    const vehicle = sellerVehicles[0];
    
    // Get all bids for this auction
    const bids = mockDatabase.findBidsByListingId(auctionId);
    const sortedBids = bids.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    // Calculate current price (highest bid or starting price)
    const highestBid = bids.length > 0 ? Math.max(...bids.map(b => b.amount)) : null;
    const currentPrice = highestBid || listing.starting_price || listing.price_per_credit;
    
    // Calculate end time (7 days from start_time)
    const startTime = listing.start_time ? new Date(listing.start_time) : new Date();
    const endTime = new Date(startTime);
    endTime.setDate(endTime.getDate() + 7);
    const now = new Date();
    const isEnded = now >= endTime;
    
    // Get unique participants
    const participants = new Set(bids.map(b => b.bidder_id));
    
    return {
      id: listing.id,
      seller: seller ? {
        id: seller.id,
        full_name: seller.full_name,
        email: seller.email,
      } : null,
      vehicle: vehicle ? {
        id: vehicle.id,
        license_plate: vehicle.license_plate,
        model: vehicle.model || 'Electric Vehicle',
      } : null,
      quantity: listing.quantity || 0,
      startingPrice: listing.starting_price || listing.price_per_credit || 0,
      currentPrice: currentPrice,
      endTime: endTime.toISOString(),
      isEnded: isEnded,
      status: isEnded ? 'ended' : 'active',
      bids: sortedBids.map(bid => ({
        id: bid.id,
        bidder: mockDatabase.findUserById(bid.bidder_id)?.full_name || 'Unknown',
        bidderId: bid.bidder_id,
        amount: bid.amount,
        createdAt: bid.created_at,
      })),
      totalBids: bids.length,
      participants: participants.size,
      highestBidId: listing.highest_bid_id,
    };
  },

  placeBid: async (auctionId, amount) => {
    await delay(800);
    
    // Import mockDatabase to create bid
    const mockDatabase = (await import('./mockDatabaseService')).default;
    
    // Get current user ID (buyer)
    const buyerId = localStorage.getItem('currentUserId') || 'buyer-user-id';
    const buyer = mockDatabase.findUserById(buyerId);
    
    // Find listing
    const listing = mockDatabase.findListingById(auctionId);
    if (!listing || listing.listing_type !== 'auction') {
      throw new Error('Auction not found');
    }
    
    // Check if auction is ended
    const startTime = listing.start_time ? new Date(listing.start_time) : new Date();
    const endTime = new Date(startTime);
    endTime.setDate(endTime.getDate() + 7);
    if (new Date() >= endTime) {
      throw new Error('Auction has ended');
    }
    
    // Get current highest bid
    const existingBids = mockDatabase.findBidsByListingId(auctionId);
    const highestBid = existingBids.length > 0 ? Math.max(...existingBids.map(b => b.amount)) : listing.starting_price || listing.price_per_credit;
    
    // Validate bid amount (must be higher than current highest bid)
    if (amount <= highestBid) {
      throw new Error(`Bid amount must be higher than current highest bid (${highestBid})`);
    }
    
    // Create bid in database
    const bid = mockDatabase.createBid({
      bidder_id: buyerId,
      listing_id: auctionId,
      amount: amount,
      bidder_name: buyer?.full_name || 'Unknown',
    });
    
    // Update listing's highest_bid_id
    mockDatabase.updateListing(auctionId, {
      highest_bid_id: bid.id,
    });
    
    // Dispatch event to notify components
    window.dispatchEvent(new CustomEvent('bid-placed', {
      detail: {
        bidId: bid.id,
        auctionId: auctionId,
        amount: amount,
      }
    }));
    
    return {
      bidId: bid.id,
      auctionId: auctionId,
      amount: amount,
      status: 'success',
    };
  },

  purchase: async (creditId, amount, quantity) => {
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
    
    // Check if listing is already sold
    if (listing.buyer_id) {
      throw new Error('Listing has already been sold');
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
    
    // Import mockDatabase to get real certificates from completed transactions
    const mockDatabase = (await import('./mockDatabaseService')).default;
    
    // Get current user ID (buyer)
    const buyerId = localStorage.getItem('currentUserId') || 'buyer-user-id';
    
    // Get all completed transactions where user is buyer
    const completedTransactions = mockDatabase.findTransactionsByBuyerId(buyerId).filter(t => 
      t.status?.toUpperCase() === 'COMPLETED' || t.status === 'completed'
    );
    
    // Convert transactions to certificates format with full details
    const certificates = completedTransactions.map(tx => {
      const listing = mockDatabase.findListingById(tx.listing_id);
      const seller = mockDatabase.findUserById(tx.seller_id);
      
      // Get seller's vehicles to find the vehicle used for this listing
      const sellerVehicles = mockDatabase.findVehiclesByOwnerId(tx.seller_id);
      const vehicle = sellerVehicles[0] || null;
      
      // Get vehicle type if vehicle exists
      let vehicleType = null;
      if (vehicle && vehicle.vehicle_type_id) {
        vehicleType = mockDatabase.vehicleTypes.find(vt => vt.id === vehicle.vehicle_type_id);
      }
      
      // Get journey data for this vehicle to calculate CO2
      let journey = null;
      let totalDistance = 0;
      let totalCo2Reduced = 0;
      if (vehicle) {
        journey = mockDatabase.findJourneyByVehicleId(vehicle.id);
        if (journey) {
          totalDistance = journey.distance_km || 0;
          totalCo2Reduced = journey.co2reduced || 0;
        }
      }
      
      const date = new Date(tx.created_at);
      const USD_TO_VND_RATE = 25000;
      const amountInVnd = (tx.amount || 0) * USD_TO_VND_RATE;
      const pricePerCredit = tx.credit > 0 ? (tx.amount || 0) / tx.credit : 0;
      
      // Calculate CO2 saved: use actual journey data if available, otherwise estimate
      const co2Saved = totalCo2Reduced > 0 
        ? (tx.credit || 0) * (totalCo2Reduced / (listing?.quantity || 1)) // Proportional CO2 from journey
        : (tx.credit || 0) * 0.1; // Estimate: 1 credit ≈ 0.1 ton CO2
      
      // Generate certificate serial number (CC-YYYYMMDD-XXXXX)
      const serialNumber = `CC-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}-${tx.id.substring(0, 5).toUpperCase()}`;
      
      // Generate QR code data (URL to verify certificate)
      const qrCodeData = `${window.location.origin}/verify/certificate/${tx.id}`;
      
      // Calculate expiry date (1 year from issue date)
      const expiryDate = new Date(date);
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      
      return {
        id: tx.id,
        serialNumber: serialNumber,
        date: date.toLocaleDateString('vi-VN'),
        time: date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        issueDate: date.toISOString(),
        expiryDate: expiryDate.toISOString(),
        expiryDateFormatted: expiryDate.toLocaleDateString('vi-VN'),
        owner: seller?.full_name || 'Unknown',
        ownerId: tx.seller_id,
        ownerEmail: seller?.email || '',
        vehicle: vehicle ? {
          id: vehicle.id,
          licensePlate: vehicle.license_plate || 'N/A',
          vin: vehicle.vin || 'N/A',
          manufacturer: vehicleType?.manufacturer || 'Unknown',
          model: vehicleType?.model || 'Unknown',
          category: vehicleType?.category || 'car',
          registrationDate: vehicle.registration_date || null,
        } : null,
        journey: journey ? {
          id: journey.id,
          totalDistance: totalDistance,
          totalCo2Reduced: totalCo2Reduced,
        } : null,
        credits: tx.credit || 0,
        co2Saved: parseFloat(co2Saved.toFixed(2)),
        value: amountInVnd,
        pricePerCredit: pricePerCredit,
        status: 'verified', // All completed transactions are verified
        standard: 'VCS Standard v3.0', // Carbon credit standard
        verificationStatus: 'verified',
        verifiedBy: 'CVA System', // Could be enhanced with actual verifier
        verifiedAt: tx.created_at,
        transactionId: tx.id,
        listingId: tx.listing_id,
        listingType: listing?.listing_type || 'fixed_price',
        qrCodeData: qrCodeData,
        paymentMethod: tx.payment_method || 'e_wallet',
      };
    });
    
    // Apply filters if any
    let filteredCertificates = certificates;
    if (params.status) {
      filteredCertificates = filteredCertificates.filter(c => c.status === params.status);
    }
    
    // Sort by date (newest first)
    filteredCertificates.sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate));
    
    return {
      data: filteredCertificates,
      total: filteredCertificates.length,
    };
  },

  getPurchaseHistory: async (params = {}) => {
    await delay(500);
    
    // Import mockDatabase to get real transactions
    const mockDatabase = (await import('./mockDatabaseService')).default;
    
    // Get current user ID (buyer)
    const buyerId = localStorage.getItem('currentUserId') || 'buyer-user-id';
    
    // Get all transactions where user is buyer
    let transactions = mockDatabase.findTransactionsByBuyerId(buyerId);
    
    // Apply filters
    if (params.status) {
      transactions = transactions.filter(t => 
        (t.status || '').toUpperCase() === params.status.toUpperCase()
      );
    }
    
    if (params.minPrice || params.maxPrice) {
      const USD_TO_VND_RATE = 25000;
      transactions = transactions.filter(t => {
        const amountInUsd = (t.amount || 0);
        if (params.minPrice && amountInUsd < params.minPrice) return false;
        if (params.maxPrice && amountInUsd > params.maxPrice) return false;
        return true;
      });
    }
    
    // Populate seller info
    const transactionsWithDetails = transactions.map(tx => {
      const seller = mockDatabase.findUserById(tx.seller_id);
      const listing = mockDatabase.findListingById(tx.listing_id);
      
      return {
        ...tx,
        seller: seller ? {
          id: seller.id,
          full_name: seller.full_name,
          email: seller.email,
        } : null,
        listing: listing ? {
          id: listing.id,
          quantity: listing.quantity,
          price_per_credit: listing.price_per_credit,
          listing_type: listing.listing_type,
        } : null,
      };
    });
    
    // Sort by created_at (newest first)
    transactionsWithDetails.sort((a, b) => 
      new Date(b.created_at) - new Date(a.created_at)
    );
    
    return {
      data: transactionsWithDetails,
      total: transactionsWithDetails.length,
    };
  },

  processPayment: async (transactionId, paymentData) => {
    await delay(2000);
    
    // Import mockDatabase to update transaction and add credits to buyer wallet
    const mockDatabase = (await import('./mockDatabaseService')).default;
    
    // Find transaction
    const transaction = mockDatabase.findTransactionById(transactionId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    
    // Simulate payment processing (90% success rate for demo)
    const paymentSuccess = Math.random() > 0.1;
    
    if (!paymentSuccess) {
      // Update transaction status to FAILED
      mockDatabase.updateTransactionStatus(transactionId, 'FAILED');
      throw new Error('Thanh toán thất bại. Vui lòng thử lại.');
    }
    
    // Update transaction status to PAYMENT_PROCESSING then COMPLETED
    mockDatabase.updateTransactionStatus(transactionId, 'PAYMENT_PROCESSING');
    await delay(500);
    mockDatabase.updateTransactionStatus(transactionId, 'COMPLETED');
    
    // Add credits to buyer's carbon wallet (API Gateway → Carbon-Wallet Service)
    const buyerId = transaction.buyer_id;
    const carbonCredit = mockDatabase.carbonCredits.find(cc => cc.owner_id === buyerId);
    
    if (carbonCredit) {
      // Add credits to buyer's wallet
      carbonCredit.available_credit = (carbonCredit.available_credit || 0) + (transaction.credit || 0);
      carbonCredit.total_credit = (carbonCredit.total_credit || 0) + (transaction.credit || 0);
      
      // Create audit log
      mockDatabase.createAudit({
        owner_id: buyerId,
        action: 'credit_purchased',
        amount: transaction.credit || 0,
        balance_after: carbonCredit.available_credit,
        description: `Mua ${transaction.credit || 0} tín chỉ từ listing ${transaction.listing_id}`,
        reference_id: transactionId,
        type: 'credit',
      });
    }
    
    // Update listing to mark as sold
    const listing = mockDatabase.findListingById(transaction.listing_id);
    if (listing) {
      listing.buyer_id = buyerId;
      listing.updated_at = new Date().toISOString();
    }
    
    // Dispatch event to notify components
    window.dispatchEvent(new CustomEvent('credits-purchased', {
      detail: {
        transactionId: transactionId,
        credits: transaction.credit || 0,
        amount: transaction.amount || 0,
        newBalance: carbonCredit?.available_credit || 0,
      }
    }));
    
    return {
      success: true,
      paymentId: `pay-${Date.now()}`,
      transactionId: transactionId,
      credits: transaction.credit || 0,
      newBalance: carbonCredit?.available_credit || 0,
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
    
    // Import mockDatabase to get real data
    const mockDatabase = (await import('./mockDatabaseService')).default;
    
    // Get current user ID (buyer)
    const buyerId = localStorage.getItem('currentUserId') || 'buyer-user-id';
    
    // Get all completed transactions where user is buyer
    const completedTransactions = mockDatabase.findTransactionsByBuyerId(buyerId).filter(t => 
      t.status?.toUpperCase() === 'COMPLETED' || t.status === 'completed'
    );
    
    // Helper function to get time ago
    const getTimeAgo = (date) => {
      const now = new Date();
      const diff = now - date;
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);
      
      if (minutes < 60) return `${minutes} phút trước`;
      if (hours < 24) return `${hours} giờ trước`;
      if (days < 7) return `${days} ngày trước`;
      return `${Math.floor(days / 7)} tuần trước`;
    };
    
    // Helper function to format currency
    const formatCurrency = (amount) => {
      const formatted = new Intl.NumberFormat('vi-VN').format(Math.round(amount));
      return `${formatted} VNĐ`;
    };
    
    // Calculate stats
    const USD_TO_VND_RATE = 25000;
    const totalSpent = completedTransactions.reduce((sum, t) => sum + (t.amount || 0) * USD_TO_VND_RATE, 0);
    const creditsPurchased = completedTransactions.reduce((sum, t) => sum + (t.credit || 0), 0);
    const co2Reduced = creditsPurchased * 0.1; // Estimate: 1 credit ≈ 0.1 ton CO2
    const certificates = completedTransactions.length; // Each completed transaction = 1 certificate
    
    // Calculate trends (compare last month with previous month)
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const previousMonth = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    
    const lastMonthTransactions = completedTransactions.filter(t => {
      const txDate = new Date(t.created_at);
      return txDate >= lastMonth && txDate < now;
    });
    
    const previousMonthTransactions = completedTransactions.filter(t => {
      const txDate = new Date(t.created_at);
      return txDate >= previousMonth && txDate < lastMonth;
    });
    
    const lastMonthCredits = lastMonthTransactions.reduce((sum, t) => sum + (t.credit || 0), 0);
    const previousMonthCredits = previousMonthTransactions.reduce((sum, t) => sum + (t.credit || 0), 0);
    const creditsChange = previousMonthCredits > 0 
      ? ((lastMonthCredits - previousMonthCredits) / previousMonthCredits) * 100 
      : 0;
    
    const lastMonthSpent = lastMonthTransactions.reduce((sum, t) => sum + (t.amount || 0) * USD_TO_VND_RATE, 0);
    const previousMonthSpent = previousMonthTransactions.reduce((sum, t) => sum + (t.amount || 0) * USD_TO_VND_RATE, 0);
    const spentChange = previousMonthSpent > 0 
      ? ((lastMonthSpent - previousMonthSpent) / previousMonthSpent) * 100 
      : 0;
    
    const lastMonthCertificates = lastMonthTransactions.length;
    const previousMonthCertificates = previousMonthTransactions.length;
    const certificatesChange = previousMonthCertificates > 0 
      ? ((lastMonthCertificates - previousMonthCertificates) / previousMonthCertificates) * 100 
      : 0;
    
    const lastMonthCo2 = lastMonthCredits * 0.1;
    const previousMonthCo2 = previousMonthCredits * 0.1;
    const co2Change = previousMonthCo2 > 0 
      ? ((lastMonthCo2 - previousMonthCo2) / previousMonthCo2) * 100 
      : 0;
    
    // Generate chart data (last 6 months)
    const months = ['Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
    const purchaseTrendData = months.map((month, index) => {
      const monthTransactions = completedTransactions.filter(t => {
        const txDate = new Date(t.created_at);
        return txDate.getMonth() === (now.getMonth() - (5 - index) + 12) % 12;
      });
      return {
        month: month,
        value: monthTransactions.reduce((sum, t) => sum + (t.credit || 0), 0),
      };
    });
    
    const spendingTrendData = months.map((month, index) => {
      const monthTransactions = completedTransactions.filter(t => {
        const txDate = new Date(t.created_at);
        return txDate.getMonth() === (now.getMonth() - (5 - index) + 12) % 12;
      });
      return {
        month: month,
        value: monthTransactions.reduce((sum, t) => sum + (t.amount || 0) * USD_TO_VND_RATE, 0),
      };
    });
    
    // Certificate distribution (by type or status)
    const certificateDistribution = [
      { name: 'Đã có', value: certificates, color: '#3b82f6' },
      { name: 'Đang xử lý', value: 0, color: '#f59e0b' },
    ];
    
    // Get recent activities (last 5 transactions)
    const recentActivities = completedTransactions.slice(-5).map(tx => {
      const seller = mockDatabase.findUserById(tx.seller_id);
      const date = new Date(tx.created_at);
      const amountInVnd = (tx.amount || 0) * USD_TO_VND_RATE;
      
      return {
        icon: '✅',
        title: `Mua thành công ${tx.credit || 0} tín chỉ`,
        description: `Từ ${seller?.full_name || 'Unknown'}`,
        value: `+${formatCurrency(amountInVnd)}`,
        color: 'green',
        date: tx.created_at,
        time: date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };
    });
    
    // Add certificate activities
    const certificateActivities = completedTransactions.slice(-3).map(tx => {
      const date = new Date(tx.created_at);
      
      return {
        icon: '🏆',
        title: 'Nhận chứng nhận mới',
        description: `Chứng nhận ${tx.id}`,
        color: 'blue',
        date: tx.created_at,
        time: date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };
    });
    
    // Combine and sort by date
    const allActivities = [...recentActivities, ...certificateActivities]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
    
    return {
      stats: {
        creditsPurchased: creditsPurchased,
        totalSpent: totalSpent,
        certificates: certificates,
        co2Reduced: parseFloat(co2Reduced.toFixed(2)),
      },
      trends: {
        creditsChange: creditsChange,
        spentChange: spentChange,
        certificatesChange: certificatesChange,
        co2Change: co2Change,
      },
      charts: {
        purchaseTrend: purchaseTrendData,
        spendingTrend: spendingTrendData,
        certificateDistribution: certificateDistribution,
      },
      recentActivities: allActivities,
    };
  },
};

export default mockBuyerService;

