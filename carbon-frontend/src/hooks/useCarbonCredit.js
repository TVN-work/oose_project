import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import carbonCreditService from '../services/carbonCredit/carbonCreditService';

/**
 * Hook to fetch all carbon credits with pagination
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.entry - Items per page
 * @param {string} params.field - Sort field
 * @param {string} params.sort - Sort direction
 */
export const useCarbonCredits = (params = {}) => {
  return useQuery({
    queryKey: ['carbonCredits', 'all', params],
    queryFn: () => carbonCreditService.getAllCarbonCredits(params),
    staleTime: 30000, // 30 seconds
    retry: 1,
  });
};

/**
 * Hook to fetch carbon credit by ID
 * @param {string} creditId - Carbon credit ID
 */
export const useCarbonCredit = (creditId) => {
  return useQuery({
    queryKey: ['carbonCredits', creditId],
    queryFn: () => carbonCreditService.getCarbonCreditById(creditId),
    enabled: !!creditId,
    staleTime: 30000,
    retry: 1,
  });
};

/**
 * Hook to fetch carbon credit by user ID
 * @param {string} userId - User ID
 */
export const useCarbonCreditByUserId = (userId) => {
  return useQuery({
    queryKey: ['carbonCredits', 'user', userId],
    queryFn: () => carbonCreditService.getCarbonCreditByUserId(userId),
    enabled: !!userId,
    staleTime: 30000,
    retry: 1,
  });
};

/**
 * Hook to fetch current user's carbon credit
 */
export const useMyCarbonCredit = () => {
  const userId = localStorage.getItem('userId');

  return useQuery({
    queryKey: ['carbonCredits', 'my-credit', userId],
    queryFn: () => carbonCreditService.getMyCarbonCredit(),
    enabled: !!userId,
    staleTime: 30000,
    retry: 1,
  });
};

/**
 * Hook to update carbon credit
 */
export const useUpdateCarbonCredit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ creditId, data }) =>
      carbonCreditService.updateCarbonCredit(creditId, data),
    onSuccess: (data, variables) => {
      // Invalidate carbon credit queries
      queryClient.invalidateQueries({ queryKey: ['carbonCredits'] });

      // Update specific credit cache
      queryClient.setQueryData(['carbonCredits', variables.creditId], data);
    },
  });
};

/**
 * Hook to update current user's carbon credit
 */
export const useUpdateMyCarbonCredit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => carbonCreditService.updateMyCarbonCredit(data),
    onSuccess: () => {
      // Invalidate all carbon credit queries to refresh
      queryClient.invalidateQueries({ queryKey: ['carbonCredits'] });
    },
  });
};

/**
 * Hook to add carbon credits
 */
export const useAddCarbonCredits = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ creditId, data }) =>
      carbonCreditService.addCarbonCredits(creditId, data),
    onSuccess: (data, variables) => {
      // Invalidate carbon credit queries
      queryClient.invalidateQueries({ queryKey: ['carbonCredits'] });

      // Update specific credit cache
      queryClient.setQueryData(['carbonCredits', variables.creditId], data);
    },
  });
};

/**
 * Hook to trade carbon credits
 */
export const useTradeCarbonCredits = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ creditId, data }) =>
      carbonCreditService.tradeCarbonCredits(creditId, data),
    onSuccess: (data, variables) => {
      // Invalidate carbon credit queries
      queryClient.invalidateQueries({ queryKey: ['carbonCredits'] });

      // Update specific credit cache
      queryClient.setQueryData(['carbonCredits', variables.creditId], data);
    },
  });
};

/**
 * Hook for carbon credit utilities
 */
export const useCarbonCreditUtils = () => {
  return {
    formatCredit: carbonCreditService.formatCredit,
    calculateAvailableCredit: carbonCreditService.calculateAvailableCredit,
    calculatePercentage: carbonCreditService.calculatePercentage,
  };
};
