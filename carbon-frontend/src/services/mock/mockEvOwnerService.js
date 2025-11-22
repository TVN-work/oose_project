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

