// Mock Verifier Service
// This will be used when backend is not available
// Uses localStorage to persist verification requests across sessions

const STORAGE_KEY = 'mock_verification_requests';

// Initialize with default data if empty
const getStoredRequests = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading verification requests from localStorage:', error);
  }
  
  // Default data
  const defaultRequests = [
    {
      id: 'VR001',
      evOwner: 'Nguyễn Văn An',
      owner: 'Nguyễn Văn An',
      vehicle: 'Tesla Model 3',
      date: '15/12/2024',
      createdAt: new Date('2024-12-15').toISOString(),
      credits: '0.025',
      creditAmount: 0.025,
      status: 'pending',
      mileage: '28,500 km',
      co2Saved: '2.1 tấn',
      tripId: 'trip-001',
      calculationId: 'calc-001',
    },
    {
      id: 'VR002',
      evOwner: 'Trần Thị Bình',
      owner: 'Trần Thị Bình',
      vehicle: 'VinFast VF8',
      date: '14/12/2024',
      createdAt: new Date('2024-12-14').toISOString(),
      credits: '0.022',
      creditAmount: 0.022,
      status: 'approved',
      mileage: '22,300 km',
      co2Saved: '1.8 tấn',
      tripId: 'trip-002',
      calculationId: 'calc-002',
    },
  ];
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultRequests));
  return defaultRequests;
};

const saveRequests = (requests) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  } catch (error) {
    console.error('Error saving verification requests to localStorage:', error);
  }
};

export const mockVerifierService = {
  getVerificationRequests: async (params = {}) => {
    let requests = getStoredRequests();
    
    // Apply filters
    if (params.status) {
      requests = requests.filter(r => r.status === params.status);
    }
    if (params.date) {
      const filterDate = new Date(params.date);
      requests = requests.filter(r => {
        const requestDate = new Date(r.createdAt || r.date);
        return requestDate.toDateString() === filterDate.toDateString();
      });
    }
    
    // Sort by date (newest first)
    requests.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.date);
      const dateB = new Date(b.createdAt || b.date);
      return dateB - dateA;
    });
    
    return requests;
  },

  // Create a new verification request (called by Carbon-Calculation Service)
  // This simulates: Carbon-Calculation Service → CVA Service (gửi yêu cầu xác minh)
  createVerificationRequest: (calculationData) => {
    const requests = getStoredRequests();
    
    const newRequest = {
      id: `VR${String(requests.length + 1).padStart(3, '0')}`,
      evOwner: calculationData.evOwner || 'EV Owner',
      owner: calculationData.evOwner || 'EV Owner',
      vehicle: calculationData.vehicle || 'Electric Vehicle',
      date: new Date().toLocaleDateString('vi-VN'),
      createdAt: new Date().toISOString(),
      credits: String(calculationData.credits || calculationData.creditAmount || 0),
      creditAmount: calculationData.credits || calculationData.creditAmount || 0,
      status: 'pending',
      mileage: calculationData.mileage || '0 km',
      co2Saved: `${calculationData.co2Reduced || 0} tấn`,
      tripId: calculationData.tripId,
      calculationId: calculationData.calculationId,
      co2Reduced: calculationData.co2Reduced,
    };
    
    requests.unshift(newRequest); // Add to beginning
    saveRequests(requests);
    
    return newRequest;
  },

  // Update request status
  updateRequestStatus: (requestId, status, data = {}) => {
    const requests = getStoredRequests();
    const index = requests.findIndex(r => r.id === requestId);
    
    if (index !== -1) {
      requests[index] = {
        ...requests[index],
        status,
        ...data,
        updatedAt: new Date().toISOString(),
      };
      saveRequests(requests);
      return requests[index];
    }
    
    return null;
  },

  // Approve request
  // Flow: CVA Service → Carbon-Calculation Service (trả kết quả đã duyệt)
  approveRequest: async (requestId, approvalData = {}) => {
    const requests = getStoredRequests();
    const request = requests.find(r => r.id === requestId);
    
    if (!request) {
      throw new Error('Verification request not found');
    }
    
    // Update request status
    const updated = mockVerifierService.updateRequestStatus(requestId, 'approved', approvalData);
    
    // Send verification result back to Carbon-Calculation Service
    // This simulates: CVA Service → Carbon-Calculation Service (trả kết quả đã duyệt)
    if (updated && updated.status === 'approved') {
      const { mockCarbonCalculationService } = await import('./mockCarbonCalculationService');
      
      // Notify Carbon-Calculation Service about approval
      // Carbon-Calculation Service will then issue credits to wallet
      const result = await mockCarbonCalculationService.handleVerificationResult(requestId, {
        status: 'approved',
        creditAmount: updated.creditAmount || parseFloat(updated.credits) || 0,
      });
      
      return { 
        success: true, 
        approved: true, 
        request: updated,
        creditsIssued: result.creditsIssued,
        newBalance: result.newBalance,
      };
    }
    
    return { success: true, approved: true, request: updated };
  },

  // Reject request
  // Flow: CVA Service → Carbon-Calculation Service (trả kết quả từ chối)
  rejectRequest: async (requestId, rejectionReason) => {
    const requests = getStoredRequests();
    const request = requests.find(r => r.id === requestId);
    
    if (!request) {
      throw new Error('Verification request not found');
    }
    
    const updated = mockVerifierService.updateRequestStatus(requestId, 'rejected', {
      rejectionReason,
    });
    
    // Send verification result back to Carbon-Calculation Service
    // This simulates: CVA Service → Carbon-Calculation Service (trả kết quả từ chối)
    // Carbon-Calculation Service will then notify API Gateway about verification error
    if (updated) {
      const { mockCarbonCalculationService } = await import('./mockCarbonCalculationService');
      
      // Notify Carbon-Calculation Service about rejection
      await mockCarbonCalculationService.handleVerificationResult(requestId, {
        status: 'rejected',
        rejectionReason,
      });
    }
    
    return { success: true, rejected: true, request: updated };
  },

  // Create notification for EV Owner
  createNotificationForEVOwner: (notification) => {
    try {
      const NOTIFICATION_KEY = 'ev_owner_notifications';
      const notifications = JSON.parse(localStorage.getItem(NOTIFICATION_KEY) || '[]');
      notifications.unshift({
        id: `notif-${Date.now()}`,
        read: false,
        ...notification,
      });
      // Keep only last 50 notifications
      if (notifications.length > 50) {
        notifications.splice(50);
      }
      localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(notifications));
      
      // Trigger custom event for real-time updates
      // Use a small delay to ensure all listeners are ready
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('verification-status-changed', {
          detail: {
            ...notification,
            timestamp: new Date().toISOString(),
          },
        }));
        
        // Also trigger a global wallet update event
        window.dispatchEvent(new CustomEvent('wallet-updated', {
          detail: {
            type: notification.type,
            newBalance: notification.newBalance,
            creditAmount: notification.creditAmount,
          },
        }));
      }, 100);
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  },
};

