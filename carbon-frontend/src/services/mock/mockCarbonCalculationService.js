// Mock Carbon Calculation Service
// Simulates the flow: Calculation → Verification → Wallet (via Calculation Service)

import { mockVerifierService } from './mockVerifierService';
import { mockEvOwnerService } from './mockEvOwnerService';

// Store calculation results
const CALCULATION_STORAGE_KEY = 'mock_calculations';

const getStoredCalculations = () => {
  try {
    const stored = localStorage.getItem(CALCULATION_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    return {};
  }
};

const saveCalculation = (calculationId, data) => {
  const calculations = getStoredCalculations();
  calculations[calculationId] = data;
  localStorage.setItem(CALCULATION_STORAGE_KEY, JSON.stringify(calculations));
};

export const mockCarbonCalculationService = {
  // Step 1: Calculate CO2 and credits
  // This simulates: API Gateway → Carbon-Calculation Service → EV-Data Service → Calculate → CVA Service
  calculate: async (tripId) => {
    const calculationId = `calc-${Date.now()}`;
    
    // Simulate: Get trip data from EV-Data Service
    const tripData = {
      tripId,
      distance: 125.7,
      energy: 18.5,
      co2Reduced: 15.08, // kg
      credits: 0.015, // tons CO2 = credits
    };
    
    // Save calculation
    saveCalculation(calculationId, {
      calculationId,
      tripId,
      status: 'calculating',
      tripData,
      createdAt: new Date().toISOString(),
    });
    
    // Simulate calculation process
    setTimeout(async () => {
      // After calculation, automatically send verification request to CVA Service
      // This simulates: Carbon-Calculation Service → CVA Service (Kafka: credit.calculated)
      const verificationData = {
        calculationId,
        tripId,
        credits: tripData.credits,
        creditAmount: tripData.credits,
        co2Reduced: tripData.co2Reduced,
        evOwner: 'EV Owner',
        vehicle: 'Electric Vehicle',
        mileage: `${tripData.distance} km`,
      };
      
      // Create verification request in CVA Service
      // This simulates: Carbon-Calculation Service → CVA Service (gửi yêu cầu xác minh)
      let verificationRequest = null;
      if (mockVerifierService.createVerificationRequest) {
        verificationRequest = mockVerifierService.createVerificationRequest(verificationData);
      }
      
      // Update calculation status
      saveCalculation(calculationId, {
        calculationId,
        tripId,
        status: 'pending_verification',
        tripData,
        verificationRequestId: verificationRequest?.id,
        createdAt: new Date().toISOString(),
      });
    }, 2000);
    
    return {
      calculationId,
      status: 'calculating',
      tripId,
    };
  },

  // Step 2: Get calculation status
  getStatus: async (calculationId) => {
    const calculations = getStoredCalculations();
    const calculation = calculations[calculationId];
    
    if (!calculation) {
      return { status: 'not_found' };
    }
    
    return {
      status: calculation.status || 'calculating',
      credits: calculation.tripData?.credits,
      co2Reduced: calculation.tripData?.co2Reduced,
    };
  },

  // Step 3: Handle verification result from CVA Service
  // This is called when CVA approves/rejects
  // Simulates: CVA Service → Carbon-Calculation Service (trả kết quả)
  handleVerificationResult: async (verificationRequestId, result) => {
    const calculations = getStoredCalculations();
    const calculation = Object.values(calculations).find(
      calc => calc.verificationRequestId === verificationRequestId
    );
    
    if (!calculation) {
      return { success: false, error: 'Calculation not found' };
    }
    
    if (result.status === 'approved') {
      // If approved: Carbon-Calculation Service → Carbon-Wallet Service
      // This simulates the flow: Calculation Service issues credits to wallet
      const creditAmount = calculation.tripData.credits;
      
      const walletResult = await mockEvOwnerService.addCreditsToWallet({
        amount: creditAmount,
        source: 'verification',
        verificationRequestId,
        tripId: calculation.tripId,
        calculationId: calculation.calculationId,
        description: `Tín chỉ được cấp từ yêu cầu xác minh #${verificationRequestId}`,
      });
      
      // Update calculation status
      saveCalculation(calculation.calculationId, {
        ...calculation,
        status: 'completed',
        verified: true,
        creditsIssued: creditAmount,
        walletResult,
      });
      
      // Simulate: Carbon-Wallet Service → API Gateway (xác nhận cấp tín chỉ thành công)
      // Create notification for EV Owner
      mockVerifierService.createNotificationForEVOwner({
        type: 'credit_issued',
        message: `✅ Tín chỉ carbon đã được duyệt và cấp vào ví! Số lượng: ${creditAmount} tín chỉ`,
        requestId: verificationRequestId,
        creditAmount,
        newBalance: walletResult.newBalance,
        calculationId: calculation.calculationId,
        tripId: calculation.tripId,
        timestamp: new Date().toISOString(),
      });
      
      return {
        success: true,
        status: 'completed',
        creditsIssued: creditAmount,
        newBalance: walletResult.newBalance,
      };
    } else if (result.status === 'rejected') {
      // If rejected: Carbon-Calculation Service → API Gateway (báo lỗi xác minh)
      saveCalculation(calculation.calculationId, {
        ...calculation,
        status: 'rejected',
        verified: false,
        rejectionReason: result.rejectionReason,
      });
      
      // Create notification for EV Owner
      mockVerifierService.createNotificationForEVOwner({
        type: 'verification_rejected',
        message: `❌ Yêu cầu xác minh #${verificationRequestId} đã bị từ chối. Lý do: ${result.rejectionReason}`,
        requestId: verificationRequestId,
        rejectionReason: result.rejectionReason,
        calculationId: calculation.calculationId,
        tripId: calculation.tripId,
        timestamp: new Date().toISOString(),
      });
      
      return {
        success: false,
        status: 'rejected',
        rejectionReason: result.rejectionReason,
      };
    }
  },
};

