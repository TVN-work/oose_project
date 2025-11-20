import apiClient from '../api/client';
import { API_ENDPOINTS } from '../../config/api';
import { mockVerifierService, shouldUseMock } from '../mock';

export const verifierService = {
  // Verification Service - Verification Requests (from verify_request table)
  getVerificationRequests: async (params = {}) => {
    if (shouldUseMock()) return mockVerifierService?.getVerificationRequests?.(params) || [];
    try {
      return await apiClient.get(API_ENDPOINTS.VERIFICATION.VERIFICATION_REQUESTS, { params });
    } catch (error) {
      if (import.meta.env.DEV) return mockVerifierService?.getVerificationRequests?.(params) || [];
      throw error;
    }
  },

  getVerificationRequestDetail: async (requestId) => {
    if (shouldUseMock()) return { id: requestId, status: 'pending' };
    try {
      return await apiClient.get(API_ENDPOINTS.VERIFICATION.REQUEST_DETAIL.replace(':id', requestId));
    } catch (error) {
      if (import.meta.env.DEV) return { id: requestId, status: 'pending' };
      throw error;
    }
  },

  createVerificationRequest: async (requestData) => {
    // Creates verify_request record
    if (shouldUseMock()) return { success: true, id: 'request-123' };
    try {
      return await apiClient.post(API_ENDPOINTS.VERIFICATION.CREATE_VERIFY_REQUEST, requestData);
    } catch (error) {
      if (import.meta.env.DEV) return { success: true, id: 'request-123' };
      throw error;
    }
  },

  // Use Case 15: Verify EV Data
  verifyEVData: async (requestId, verificationData) => {
    if (shouldUseMock()) return { success: true, verified: true };
    try {
      return await apiClient.post(API_ENDPOINTS.VERIFICATION.VERIFY_EV_DATA.replace(':id', requestId), verificationData);
    } catch (error) {
      if (import.meta.env.DEV) return { success: true, verified: true };
      throw error;
    }
  },

  // Use Case 16: Validate Emission Data
  validateEmissionData: async (requestId, validationData) => {
    if (shouldUseMock()) return { success: true, validated: true };
    try {
      return await apiClient.post(API_ENDPOINTS.VERIFICATION.VALIDATE_EMISSION.replace(':id', requestId), validationData);
    } catch (error) {
      if (import.meta.env.DEV) return { success: true, validated: true };
      throw error;
    }
  },

  // Use Case 17: Approve Credit Issuance
  approveRequest: async (requestId, approvalData = {}) => {
    if (shouldUseMock()) {
      return mockVerifierService.approveRequest(requestId, approvalData);
    }
    try {
      return await apiClient.post(API_ENDPOINTS.VERIFICATION.APPROVE_REQUEST.replace(':id', requestId), approvalData);
    } catch (error) {
      if (import.meta.env.DEV) return mockVerifierService.approveRequest(requestId, approvalData);
      throw error;
    }
  },

  rejectRequest: async (requestId, rejectionReason) => {
    if (shouldUseMock()) {
      return mockVerifierService.rejectRequest(requestId, rejectionReason);
    }
    try {
      return await apiClient.post(API_ENDPOINTS.VERIFICATION.REJECT_REQUEST.replace(':id', requestId), {
        reason: rejectionReason,
      });
    } catch (error) {
      if (import.meta.env.DEV) return mockVerifierService.rejectRequest(requestId, rejectionReason);
      throw error;
    }
  },

  // Use Case 18: Issue Carbon Credits
  issueCredits: async (requestId, creditData) => {
    // This will trigger: Verification Service → Wallet Service (Kafka: credit.issued)
    if (shouldUseMock()) return { success: true, creditsIssued: creditData.amount };
    try {
      return await apiClient.post(API_ENDPOINTS.VERIFICATION.ISSUE_CREDITS, {
        requestId,
        ...creditData,
      });
    } catch (error) {
      if (import.meta.env.DEV) return { success: true, creditsIssued: creditData.amount };
      throw error;
    }
  },

  // Reports
  getReports: async (params = {}) => {
    if (shouldUseMock()) return { reports: [] };
    try {
      return await apiClient.get(API_ENDPOINTS.VERIFICATION.REPORTS, { params });
    } catch (error) {
      if (import.meta.env.DEV) return { reports: [] };
      throw error;
    }
  },
};

export default verifierService;

