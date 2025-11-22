import { mockDashboardStats, mockCarbonWallet, mockListings, mockTransactions, mockVehicleTypes, mockVehicles, mockJourneys, mockJourneyHistories, mockAudits, mockPaymentWalletTransactions, delay } from './mockData';
import { mockVerifierService } from './mockVerifierService';

export const mockEvOwnerService = {
  // Vehicle Types
  getVehicleTypes: async () => {
    await delay(400);
    return mockVehicleTypes || [];
  },

  // Vehicles
  getVehicles: async (params = {}) => {
    await delay(400);
    
    // Populate vehicleType for each vehicle (JOIN operation)
    const vehiclesWithType = mockVehicles.map(vehicle => {
      const vehicleType = mockVehicleTypes?.find(vt => vt.id === vehicle.vehicle_type_id);
      return {
        ...vehicle,
        vehicleType: vehicleType || null,
      };
    });
    
    return {
      data: vehiclesWithType || [],
      total: vehiclesWithType?.length || 0,
      page: params.page || 1,
      limit: params.limit || 10,
    };
  },

  getVehicleById: async (vehicleId) => {
    await delay(300);
    const vehicle = mockVehicles?.find(v => v.id === vehicleId);
    if (vehicle && vehicle.vehicle_type_id) {
      const vehicleType = mockVehicleTypes?.find(vt => vt.id === vehicle.vehicle_type_id);
      return {
        ...vehicle,
        vehicleType: vehicleType,
      };
    }
    return vehicle || null;
  },

  createVehicle: async (vehicleData) => {
    await delay(600);
    
    // Check for duplicate VIN or license plate
    const duplicateVin = mockVehicles?.find(v => v.vin === vehicleData.vin);
    if (duplicateVin) {
      throw new Error('VIN already exists');
    }
    
    const duplicatePlate = mockVehicles?.find(v => v.license_plate === vehicleData.licensePlate);
    if (duplicatePlate) {
      throw new Error('License plate already exists');
    }
    
    const newVehicle = {
      id: `vehicle-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      owner_id: 'current-user-id',
      vehicle_type_id: vehicleData.vehicleTypeId,
      vin: vehicleData.vin,
      license_plate: vehicleData.licensePlate,
      registration_date: vehicleData.registrationDate || null,
      registration_image_url: vehicleData.registrationImageUrl || null,
      mileage: vehicleData.mileage || 0,
    };
    
    mockVehicles.push(newVehicle);
    
    // Populate vehicleType before returning
    const vehicleType = mockVehicleTypes?.find(vt => vt.id === vehicleData.vehicleTypeId);
    
    return {
      success: true,
      data: {
        ...newVehicle,
        vehicleType: vehicleType || null,
      },
      message: 'Vehicle created successfully',
    };
  },

  updateVehicle: async (vehicleId, vehicleData) => {
    await delay(500);
    
    const vehicleIndex = mockVehicles?.findIndex(v => v.id === vehicleId);
    if (vehicleIndex === -1) {
      throw new Error('Vehicle not found');
    }
    
    // Check for duplicate VIN (excluding current vehicle)
    if (vehicleData.vin) {
      const duplicateVin = mockVehicles?.find(v => v.vin === vehicleData.vin && v.id !== vehicleId);
      if (duplicateVin) {
        throw new Error('VIN already exists');
      }
    }
    
    // Check for duplicate license plate (excluding current vehicle)
    if (vehicleData.licensePlate) {
      const duplicatePlate = mockVehicles?.find(v => v.license_plate === vehicleData.licensePlate && v.id !== vehicleId);
      if (duplicatePlate) {
        throw new Error('License plate already exists');
      }
    }
    
    // Update vehicle
    mockVehicles[vehicleIndex] = {
      ...mockVehicles[vehicleIndex],
      updated_at: new Date().toISOString(),
      vehicle_type_id: vehicleData.vehicleTypeId || mockVehicles[vehicleIndex].vehicle_type_id,
      vin: vehicleData.vin || mockVehicles[vehicleIndex].vin,
      license_plate: vehicleData.licensePlate || mockVehicles[vehicleIndex].license_plate,
      registration_date: vehicleData.registrationDate !== undefined ? vehicleData.registrationDate : mockVehicles[vehicleIndex].registration_date,
      registration_image_url: vehicleData.registrationImageUrl !== undefined ? vehicleData.registrationImageUrl : mockVehicles[vehicleIndex].registration_image_url,
      mileage: vehicleData.mileage !== undefined ? vehicleData.mileage : mockVehicles[vehicleIndex].mileage,
    };
    
    // Populate vehicleType before returning
    const vehicleType = mockVehicleTypes?.find(vt => vt.id === mockVehicles[vehicleIndex].vehicle_type_id);
    
    return {
      success: true,
      data: {
        ...mockVehicles[vehicleIndex],
        vehicleType: vehicleType || null,
      },
      message: 'Vehicle updated successfully',
    };
  },

  deleteVehicle: async (vehicleId) => {
    await delay(400);
    
    const vehicleIndex = mockVehicles?.findIndex(v => v.id === vehicleId);
    if (vehicleIndex === -1) {
      throw new Error('Vehicle not found');
    }
    
    // Check if vehicle has journeys
    const hasJourneys = mockJourneys?.some(j => j.vehicle_id === vehicleId);
    if (hasJourneys) {
      throw new Error('Cannot delete vehicle with journey history');
    }
    
    mockVehicles.splice(vehicleIndex, 1);
    
    return {
      success: true,
      message: 'Vehicle deleted successfully',
    };
  },

  // Journeys
  getJourneys: async (params = {}) => {
    await delay(600);
    
    // Populate vehicle info for each journey
    const journeysWithVehicles = (mockJourneys || []).map(journey => {
      const vehicle = mockVehicles?.find(v => v.id === journey.vehicle_id);
      const vehicleType = vehicle ? mockVehicleTypes?.find(vt => vt.id === vehicle.vehicle_type_id) : null;
      
      return {
        ...journey,
        vehicle: vehicle ? {
          ...vehicle,
          vehicleType: vehicleType,
        } : null,
      };
    });
    
    return {
      data: journeysWithVehicles,
      total: journeysWithVehicles.length,
      page: params.page || 1,
      limit: params.limit || 10,
    };
  },

  getJourneyHistories: async (journeyId, params = {}) => {
    await delay(400);
    const histories = mockJourneyHistories?.filter(h => h.journey_id === journeyId) || [];
    return {
      data: histories,
      total: histories.length,
      page: params.page || 1,
      limit: params.limit || 10,
    };
  },
  
  // Get ALL journey histories for current user with vehicle info
  getAllJourneyHistories: async (params = {}) => {
    await delay(400);
    
    // Get all journey histories and populate journey + vehicle info
    const historiesWithInfo = (mockJourneyHistories || []).map(history => {
      const journey = mockJourneys?.find(j => j.id === history.journey_id);
      const vehicle = journey ? mockVehicles?.find(v => v.id === journey.vehicle_id) : null;
      const vehicleType = vehicle ? mockVehicleTypes?.find(vt => vt.id === vehicle.vehicle_type_id) : null;
      
      return {
        ...history,
        journey: journey || null,
        vehicle: vehicle ? {
          ...vehicle,
          vehicleType: vehicleType || null,
        } : null,
      };
    });
    
    // Sort by created_at DESC (newest first)
    historiesWithInfo.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    return {
      data: historiesWithInfo,
      total: historiesWithInfo.length,
      page: params.page || 1,
      limit: params.limit || 10,
    };
  },

  // Audits
  getAudits: async (params = {}) => {
    await delay(400);
    return {
      data: mockAudits || [],
      total: mockAudits?.length || 0,
      page: params.page || 1,
      limit: params.limit || 10,
    };
  },

  // Legacy methods for backward compatibility
  getTrips: async (params = {}) => {
    return mockEvOwnerService.getJourneys(params);
  },

  uploadTrip: async (tripData) => {
    await delay(1200);
    
    // Find or create journey for this vehicle
    let journey = mockJourneys.find(j => j.vehicle_id === tripData.vehicleId);
    
    if (!journey) {
      // Create new journey if vehicle doesn't have one yet (1:1 with vehicle)
      journey = {
        id: `journey-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        vehicle_id: tripData.vehicleId,
        distance_km: 0,
        energy_used: 0,
        avg_speed: 0,
        co2reduced: 0,
        journey_status: 'active',
      };
      mockJourneys.push(journey);
    }
    
    // Create journey history entry (detail record for this specific trip)
    const newJourneyHistory = {
      id: `journey-history-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      journey_id: journey.id,
      distance: tripData.distance || 0,
      energy_used: tripData.energyUsed || 0,
      average_speed: tripData.avgSpeed || 0,
      certificate_image_url: null,
      note: tripData.notes || 'Uploaded via file/form',
      status: 0, // 0 = pending verification
      verified_by: null,
    };
    
    mockJourneyHistories.push(newJourneyHistory);
    
    // Update journey totals (aggregate from all history entries)
    journey.distance_km += newJourneyHistory.distance;
    journey.energy_used += newJourneyHistory.energy_used;
    journey.updated_at = new Date().toISOString();
    journey.journey_status = 'verifying'; // Change status to verifying
    
    console.log('✅ Mock: Added new journey history:', newJourneyHistory.id);
    console.log('📊 Total journey histories:', mockJourneyHistories.length);
    
    return {
      success: true,
      data: {
        id: newJourneyHistory.id,
        journeyId: journey.id,
        ...tripData,
        status: 'pending_verification',
        message: 'Trip uploaded successfully. Waiting for verification.',
      },
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

  getPaymentWalletTransactions: async (params = {}) => {
    await delay(500);
    return {
      data: mockPaymentWalletTransactions || [],
      total: mockPaymentWalletTransactions?.length || 0,
    };
  },

  // Refund credits when listing is rejected by CVA
  refundCreditsFromListing: async (listingId, quantity, reason) => {
    await delay(500);
    
    if (!quantity || quantity <= 0) {
      return { success: false, message: 'Invalid quantity' };
    }
    
    const WALLET_STORAGE_KEY = 'mock_carbon_wallet';
    let wallet;
    
    try {
      const stored = localStorage.getItem(WALLET_STORAGE_KEY);
      wallet = stored ? JSON.parse(stored) : { ...mockCarbonWallet };
    } catch (error) {
      wallet = { ...mockCarbonWallet };
    }
    
    // Add credits back to wallet
    wallet.balance = (wallet.balance || 0) + quantity;
    wallet.available = (wallet.available || 0) + quantity;
    wallet.statistics.availableCredits = wallet.balance;
    
    // Add transaction to history
    const transaction = {
      id: `tx-refund-${Date.now()}`,
      type: 'listing_rejected',
      amount: quantity, // Positive because credits are refunded
      description: `Hoàn trả tín chỉ - Niêm yết bị từ chối`,
      date: new Date().toISOString(),
      status: 'completed',
      listingId: listingId,
      reason: reason || 'Niêm yết không hợp lệ',
    };
    
    wallet.transactions = wallet.transactions || [];
    wallet.transactions.unshift(transaction); // Add to beginning
    
    // Save to localStorage
    localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(wallet));
    
    // Dispatch event to notify EV Owner about refund
    window.dispatchEvent(new CustomEvent('listing-rejected', {
      detail: {
        type: 'listing_rejected',
        listingId: listingId,
        quantity: quantity,
        reason: reason || 'Niêm yết không hợp lệ',
        newBalance: wallet.balance,
        message: `${quantity} tín chỉ đã được hoàn trả vào ví`,
      },
    }));
    
    return {
      success: true,
      wallet,
      transaction,
      newBalance: wallet.balance,
      message: `${quantity} tín chỉ đã được hoàn trả vào ví`,
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
    
    // Subtract credits from wallet when creating listing (regardless of CVA verification status)
    const quantity = listingData.quantity || 0;
    const listingId = `listing-${Date.now()}`;
    
    if (quantity > 0) {
      const WALLET_STORAGE_KEY = 'mock_carbon_wallet';
      let wallet;
      
      try {
        const stored = localStorage.getItem(WALLET_STORAGE_KEY);
        wallet = stored ? JSON.parse(stored) : { ...mockCarbonWallet };
      } catch (error) {
        wallet = { ...mockCarbonWallet };
      }
      
      // Check if user has enough credits
      if ((wallet.balance || 0) < quantity) {
        const error = new Error('Insufficient credits');
        error.response = { status: 400, data: { message: `Số dư không đủ! Bạn chỉ có ${wallet.balance || 0} tín chỉ.` } };
        throw error;
      }
      
      // Update wallet balance (subtract credits)
      wallet.balance = (wallet.balance || 0) - quantity;
      wallet.available = (wallet.available || 0) - quantity;
      wallet.statistics.availableCredits = wallet.balance;
      
      // Add transaction to history
      const transaction = {
        id: `tx-${Date.now()}`,
        type: 'listing_created',
        amount: -quantity, // Negative because credits are deducted
        description: 'Tạo niêm yết tín chỉ',
        date: new Date().toISOString(),
        status: 'completed',
        listingId: listingId,
      };
      
      wallet.transactions = wallet.transactions || [];
      wallet.transactions.unshift(transaction); // Add to beginning
      
      // Save to localStorage
      localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(wallet));
      
      // Store listing info for potential refund (in case of rejection)
      const LISTINGS_STORAGE_KEY = 'mock_listings';
      try {
        const storedListings = localStorage.getItem(LISTINGS_STORAGE_KEY);
        const listings = storedListings ? JSON.parse(storedListings) : [];
        listings.push({
          id: listingId,
          quantity: quantity,
          sellerId: 'current-user-id', // In real app, get from auth context
          createdAt: new Date().toISOString(),
        });
        localStorage.setItem(LISTINGS_STORAGE_KEY, JSON.stringify(listings));
      } catch (error) {
        console.error('Error storing listing info:', error);
      }
    }
    
    return {
      id: listingId,
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
    
    // Import mockDatabase to get transactions from database
    const mockDatabase = (await import('./mockDatabaseService')).default;
    
    // Get current user ID from localStorage or use default
    const currentUserId = localStorage.getItem('currentUserId') || 'current-user-id';
    
    // Get all transactions where user is seller
    const transactions = mockDatabase.findTransactionsBySellerId(currentUserId);
    
    // Populate buyer and seller info if needed
    const transactionsWithDetails = transactions.map(tx => {
      const buyer = mockDatabase.findUserById(tx.buyer_id);
      const seller = mockDatabase.findUserById(tx.seller_id);
      
      return {
        ...tx,
        buyer: buyer ? {
          id: buyer.id,
          full_name: buyer.full_name,
          email: buyer.email,
        } : null,
        seller: seller ? {
          id: seller.id,
          full_name: seller.full_name,
          email: seller.email,
        } : null,
      };
    });
    
    return {
      data: transactionsWithDetails,
      total: transactionsWithDetails.length,
    };
  },

  getTransactionById: async (transactionId) => {
    await delay(400);
    
    // Import mockDatabase to get transaction from database
    const mockDatabase = (await import('./mockDatabaseService')).default;
    
    const transaction = mockDatabase.findTransactionById(transactionId);
    if (!transaction) return null;
    
    // Populate buyer and seller info
    const buyer = mockDatabase.findUserById(transaction.buyer_id);
    const seller = mockDatabase.findUserById(transaction.seller_id);
    
    return {
      ...transaction,
      buyer: buyer ? {
        id: buyer.id,
        full_name: buyer.full_name,
        email: buyer.email,
      } : null,
      seller: seller ? {
        id: seller.id,
        full_name: seller.full_name,
        email: seller.email,
      } : null,
    };
  },

  cancelTransaction: async (transactionId) => {
    await delay(500);
    
    // Import mockDatabase to update transaction status
    const mockDatabase = (await import('./mockDatabaseService')).default;
    
    const updated = mockDatabase.updateTransactionStatus(transactionId, 'CANCELLED');
    if (!updated) {
      throw new Error('Transaction not found');
    }
    
    return { success: true, data: updated };
  },

  completeTransaction: async (transactionId) => {
    await delay(500);
    
    // Import mockDatabase to update transaction status
    const mockDatabase = (await import('./mockDatabaseService')).default;
    
    const updated = mockDatabase.updateTransactionStatus(transactionId, 'COMPLETED');
    if (!updated) {
      throw new Error('Transaction not found');
    }
    
    return { success: true, data: updated };
  },

  getReports: async (params = {}) => {
    await delay(600);
    
    // Import mockDatabase to get real data
    const mockDatabase = (await import('./mockDatabaseService')).default;
    
    // Get current user ID
    const currentUserId = localStorage.getItem('currentUserId') || mockUsers.EV_OWNER.id;
    
    // Get all journeys for this user (through vehicles)
    const userVehicles = mockDatabase.vehicles.filter(v => v.owner_id === currentUserId);
    const vehicleIds = userVehicles.map(v => v.id);
    const userJourneys = mockDatabase.journeys.filter(j => vehicleIds.includes(j.vehicle_id));
    
    // Get all transactions where user is seller
    const userTransactions = mockDatabase.transactions.filter(t => 
      t.seller_id === currentUserId && 
      (t.status?.toUpperCase() === 'COMPLETED' || t.status === 'completed')
    );
    
    // Get carbon credits for user
    const carbonCredit = mockDatabase.carbonCredits.find(cc => cc.owner_id === currentUserId);
    
    // Calculate CO₂ data by month (last 12 months)
    const co2ByMonth = {};
    const revenueByMonth = {};
    const monthNames = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
    
    // Initialize last 12 months
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = monthNames[date.getMonth()];
      co2ByMonth[monthKey] = { month: monthLabel, value: 0 };
      revenueByMonth[monthKey] = { month: monthLabel, value: 0 };
    }
    
    // Aggregate CO₂ by month from journeys
    userJourneys.forEach(journey => {
      if (journey.co2reduced) {
        const date = new Date(journey.created_at);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (co2ByMonth[monthKey]) {
          co2ByMonth[monthKey].value += journey.co2reduced;
        }
      }
    });
    
    // Aggregate revenue by month from transactions
    // Note: transaction.amount is already in the currency used (could be USD or VND)
    // For now, assume it's in USD and convert to VND
    const USD_TO_VND_RATE = 25000;
    userTransactions.forEach(transaction => {
      if (transaction.amount) {
        const date = new Date(transaction.created_at);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (revenueByMonth[monthKey]) {
          // Transaction amount is in USD, convert to VND
          revenueByMonth[monthKey].value += transaction.amount * USD_TO_VND_RATE;
        }
      }
    });
    
    // Convert to arrays and sort by month (oldest first)
    const co2Data = Object.values(co2ByMonth)
      .sort((a, b) => {
        const aKey = Object.keys(co2ByMonth).find(k => co2ByMonth[k] === a);
        const bKey = Object.keys(co2ByMonth).find(k => co2ByMonth[k] === b);
        return aKey.localeCompare(bKey);
      });
    
    const revenueData = Object.values(revenueByMonth)
      .sort((a, b) => {
        const aKey = Object.keys(revenueByMonth).find(k => revenueByMonth[k] === a);
        const bKey = Object.keys(revenueByMonth).find(k => revenueByMonth[k] === b);
        return aKey.localeCompare(bKey);
      });
    
    // Calculate totals
    const totalCo2 = userJourneys.reduce((sum, j) => sum + (j.co2reduced || 0), 0);
    const totalRevenue = userTransactions.reduce((sum, t) => sum + (t.amount || 0) * USD_TO_VND_RATE, 0);
    const totalCredits = carbonCredit?.total_credit || 0;
    const soldCredits = carbonCredit?.traded_credit || 0;
    
    // Calculate this month and last month
    const thisMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthKey = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}`;
    
    const thisMonthCo2 = co2ByMonth[thisMonthKey]?.value || 0;
    const lastMonthCo2 = co2ByMonth[lastMonthKey]?.value || 0;
    const thisMonthRevenue = revenueByMonth[thisMonthKey]?.value || 0;
    const lastMonthRevenue = revenueByMonth[lastMonthKey]?.value || 0;
    
    // Calculate changes
    const co2Change = lastMonthCo2 > 0 ? ((thisMonthCo2 - lastMonthCo2) / lastMonthCo2 * 100) : 0;
    const revenueChange = lastMonthRevenue > 0 ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100) : 0;
    
    // AI Prediction: Simple linear regression based on last 3 months
    const last3MonthsCo2 = co2Data.slice(-3).map(d => d.value);
    const last3MonthsRevenue = revenueData.slice(-3).map(d => d.value);
    
    const avgCo2Growth = last3MonthsCo2.length >= 2 
      ? (last3MonthsCo2[last3MonthsCo2.length - 1] - last3MonthsCo2[0]) / (last3MonthsCo2.length - 1)
      : 0;
    const avgRevenueGrowth = last3MonthsRevenue.length >= 2
      ? (last3MonthsRevenue[last3MonthsRevenue.length - 1] - last3MonthsRevenue[0]) / (last3MonthsRevenue.length - 1)
      : 0;
    
    const predictedCo2 = Math.max(0, thisMonthCo2 + avgCo2Growth);
    const predictedRevenue = Math.max(0, thisMonthRevenue + avgRevenueGrowth);
    
    const co2PredictionChange = thisMonthCo2 > 0 ? ((predictedCo2 - thisMonthCo2) / thisMonthCo2 * 100) : 0;
    const revenuePredictionChange = thisMonthRevenue > 0 ? ((predictedRevenue - thisMonthRevenue) / thisMonthRevenue * 100) : 0;
    
    return {
      co2Data: co2Data.slice(-12), // Last 12 months
      revenueData: revenueData.slice(-12), // Last 12 months
      summary: {
        totalCo2: parseFloat(totalCo2.toFixed(2)),
        totalRevenue: totalRevenue,
        totalCredits: totalCredits,
        soldCredits: soldCredits,
        thisMonthCo2: parseFloat(thisMonthCo2.toFixed(2)),
        lastMonthCo2: parseFloat(lastMonthCo2.toFixed(2)),
        thisMonthRevenue: thisMonthRevenue,
        lastMonthRevenue: lastMonthRevenue,
        co2Change: parseFloat(co2Change.toFixed(1)),
        revenueChange: parseFloat(revenueChange.toFixed(1)),
      },
      prediction: {
        nextMonthCo2: parseFloat(predictedCo2.toFixed(2)),
        nextMonthRevenue: predictedRevenue,
        co2Change: parseFloat(co2PredictionChange.toFixed(1)),
        revenueChange: parseFloat(revenuePredictionChange.toFixed(1)),
        confidence: 85, // Based on data availability
      },
    };
  },

  getDashboardStats: async () => {
    await delay(500);
    
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
    
    // Import mockDatabase to get real data
    const mockDatabase = (await import('./mockDatabaseService')).default;
    
    // Get current user ID
    const currentUserId = localStorage.getItem('currentUserId') || mockUsers.EV_OWNER.id;
    
    // Get all journeys for this user (through vehicles)
    const userVehicles = mockDatabase.vehicles.filter(v => v.owner_id === currentUserId);
    const vehicleIds = userVehicles.map(v => v.id);
    const userJourneys = mockDatabase.journeys.filter(j => vehicleIds.includes(j.vehicle_id));
    
    // Get all transactions where user is seller
    const userTransactions = mockDatabase.transactions.filter(t => 
      t.seller_id === currentUserId && 
      (t.status?.toUpperCase() === 'COMPLETED' || t.status === 'completed')
    );
    
    // Get all listings for this user
    const userListings = mockDatabase.marketListings.filter(l => l.seller_id === currentUserId);
    
    // Get carbon credits for user
    const carbonCredit = mockDatabase.carbonCredits.find(cc => cc.owner_id === currentUserId);
    
    // Calculate stats
    const totalCo2 = userJourneys.reduce((sum, j) => sum + (j.co2reduced || 0), 0);
    const totalDistance = userJourneys.reduce((sum, j) => sum + (j.distance_km || 0), 0);
    const USD_TO_VND_RATE = 25000;
    const totalRevenue = userTransactions.reduce((sum, t) => sum + (t.amount || 0) * USD_TO_VND_RATE, 0);
    
    const availableCredits = carbonCredit?.available_credit || 0;
    const totalCredits = carbonCredit?.total_credit || 0;
    const soldCredits = carbonCredit?.traded_credit || 0;
    
    // Calculate listings stats
    const activeListings = userListings.filter(l => 
      !l.buyer_id && (l.listing_type === 'fixed_price' || l.listing_type === 'auction')
    );
    const listedCredits = activeListings.reduce((sum, l) => sum + (l.quantity || 0), 0);
    
    // Calculate trends (last 6 months)
    const now = new Date();
    const co2Trend = [];
    const revenueTrend = [];
    const monthNames = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = monthNames[date.getMonth()];
      
      // Calculate CO₂ for this month
      const monthCo2 = userJourneys
        .filter(j => {
          const jDate = new Date(j.created_at);
          return `${jDate.getFullYear()}-${String(jDate.getMonth() + 1).padStart(2, '0')}` === monthKey;
        })
        .reduce((sum, j) => sum + (j.co2reduced || 0), 0);
      
      // Calculate revenue for this month
      const monthRevenue = userTransactions
        .filter(t => {
          const tDate = new Date(t.created_at);
          return `${tDate.getFullYear()}-${String(tDate.getMonth() + 1).padStart(2, '0')}` === monthKey;
        })
        .reduce((sum, t) => sum + (t.amount || 0) * USD_TO_VND_RATE, 0);
      
      co2Trend.push({ month: monthLabel, value: parseFloat(monthCo2.toFixed(2)) });
      revenueTrend.push({ month: monthLabel, value: monthRevenue });
    }
    
    // Calculate changes (this month vs last month)
    const thisMonth = co2Trend[co2Trend.length - 1];
    const lastMonth = co2Trend[co2Trend.length - 2] || { value: 0 };
    const co2Change = lastMonth.value > 0 
      ? ((thisMonth.value - lastMonth.value) / lastMonth.value * 100) 
      : 0;
    
    const thisMonthRevenue = revenueTrend[revenueTrend.length - 1];
    const lastMonthRevenue = revenueTrend[revenueTrend.length - 2] || { value: 0 };
    const revenueChange = lastMonthRevenue.value > 0
      ? ((thisMonthRevenue.value - lastMonthRevenue.value) / lastMonthRevenue.value * 100)
      : 0;
    
    // Get recent activities (last 10 activities)
    const recentActivities = [];
    
    // Add recent journeys (uploads)
    userJourneys.slice(-5).forEach(journey => {
      const timeAgo = getTimeAgo(new Date(journey.created_at));
      recentActivities.push({
        icon: '📤',
        title: 'Tải dữ liệu hành trình thành công',
        description: `${journey.distance_km?.toFixed(1) || 0} km • Tạo ${(journey.co2reduced || 0).toFixed(2)} tấn CO₂`,
        time: timeAgo,
        value: `+${(journey.co2reduced || 0).toFixed(2)} tấn`,
        color: 'green',
        type: 'upload',
        date: journey.created_at,
      });
    });
    
    // Add recent transactions (sales)
    userTransactions.slice(-5).forEach(transaction => {
      const timeAgo = getTimeAgo(new Date(transaction.created_at));
      recentActivities.push({
        icon: '💰',
        title: 'Bán tín chỉ thành công',
        description: `${transaction.credit || 0} tín chỉ cho người mua`,
        time: timeAgo,
        value: `+${formatCurrency(transaction.amount * USD_TO_VND_RATE)}`,
        color: 'blue',
        type: 'sale',
        date: transaction.created_at,
      });
    });
    
    // Add recent listings
    userListings.slice(-3).forEach(listing => {
      const timeAgo = getTimeAgo(new Date(listing.created_at));
      recentActivities.push({
        icon: '🏷️',
        title: 'Niêm yết tín chỉ mới',
        description: `${listing.quantity || 0} tín chỉ với giá ${formatCurrency((listing.price_per_credit || 0) * USD_TO_VND_RATE)}/tín chỉ`,
        time: timeAgo,
        value: null,
        color: 'purple',
        type: 'listing',
        date: listing.created_at,
      });
    });
    
    // Sort by date (newest first) and take last 4
    recentActivities.sort((a, b) => new Date(b.date) - new Date(a.date));
    const finalActivities = recentActivities.slice(0, 4);
    
    // Credit distribution
    const creditDistribution = [
      { name: 'Đã bán', value: soldCredits, color: '#10b981' },
      { name: 'Đang niêm yết', value: listedCredits, color: '#3b82f6' },
      { name: 'Có sẵn', value: availableCredits, color: '#8b5cf6' },
    ];
    
    // Weekly revenue (last 7 days)
    const weeklyRevenue = [];
    const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dayKey = date.toISOString().split('T')[0];
      const dayName = dayNames[date.getDay()];
      
      const dayRevenue = userTransactions
        .filter(t => {
          const tDate = new Date(t.created_at);
          return tDate.toISOString().split('T')[0] === dayKey;
        })
        .reduce((sum, t) => sum + (t.amount || 0) * USD_TO_VND_RATE, 0);
      
      weeklyRevenue.push({ day: dayName, value: dayRevenue });
    }
    
    return {
      stats: {
        availableCredits: availableCredits,
        totalRevenue: totalRevenue,
        totalDistance: totalDistance,
        totalCo2Saved: parseFloat(totalCo2.toFixed(2)),
      },
      trends: {
        creditsChange: 10.0, // Estimate
        revenueChange: parseFloat(revenueChange.toFixed(1)),
        distanceChange: 8.9, // Estimate
        co2Change: parseFloat(co2Change.toFixed(1)),
      },
      charts: {
        weeklyRevenue: weeklyRevenue,
        co2Trend: co2Trend,
        revenueTrend: revenueTrend,
        creditDistribution: creditDistribution,
      },
      recentActivities: finalActivities,
    };
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

