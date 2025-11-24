import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import verificationService from '../services/verification/verificationService';

/**
 * Hook to fetch all verification requests with filters and pagination
 * @param {Object} params - Query parameters (userId, type, status, referenceId, title, description, page, entry, field, sort)
 */
export const useVerificationRequests = (params = {}) => {
  return useQuery({
    queryKey: ['verification-requests', params],
    queryFn: () => verificationService.getAllVerificationRequests(params),
    staleTime: 60000, // 1 minute
    retry: 1,
  });
};

/**
 * Hook to fetch verification request by ID
 * @param {string} requestId - Verification request ID
 */
export const useVerificationRequest = (requestId) => {
  return useQuery({
    queryKey: ['verification-requests', requestId],
    queryFn: () => verificationService.getVerificationRequestById(requestId),
    enabled: !!requestId,
    staleTime: 60000,
    retry: 1,
  });
};

/**
 * Hook to update a verification request
 */
export const useUpdateVerificationRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requestId, updateData }) =>
      verificationService.updateVerificationRequest(requestId, updateData),
    onSuccess: (updatedRequest, variables) => {
      // Invalidate verification requests list
      queryClient.invalidateQueries({ queryKey: ['verification-requests'] });

      // Update specific request cache
      queryClient.setQueryData(['verification-requests', variables.requestId], updatedRequest);
    },
  });
};

/**
 * Hook for verification utilities
 */
export const useVerificationUtils = () => {
  return {
    getTypeDisplay: verificationService.getTypeDisplay,
    getStatusDisplay: verificationService.getStatusDisplay,
    validateUpdateData: verificationService.validateUpdateData,
    formatDate: verificationService.formatDate,
  };
};
