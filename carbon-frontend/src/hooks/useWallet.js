import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import walletService from '../services/wallet/walletService';

/**
 * Hook to fetch all wallets with pagination
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.entry - Items per page
 * @param {string} params.field - Sort field
 * @param {string} params.sort - Sort direction
 */
export const useWallets = (params = {}) => {
  return useQuery({
    queryKey: ['wallets', 'all', params],
    queryFn: () => walletService.getAllWallets(params),
    staleTime: 30000, // 30 seconds
    retry: 1,
  });
};

/**
 * Hook to fetch wallet by ID
 * @param {string} walletId - Wallet ID
 */
export const useWallet = (walletId) => {
  return useQuery({
    queryKey: ['wallets', walletId],
    queryFn: () => walletService.getWalletById(walletId),
    enabled: !!walletId,
    staleTime: 30000,
    retry: 1,
  });
};

/**
 * Hook to fetch wallet by user ID
 * @param {string} userId - User ID
 */
export const useWalletByUserId = (userId) => {
  return useQuery({
    queryKey: ['wallets', 'user', userId],
    queryFn: () => walletService.getWalletByUserId(userId),
    enabled: !!userId,
    staleTime: 30000,
    retry: 1,
  });
};

/**
 * Hook to fetch current user's wallet
 */
export const useMyWallet = () => {
  const userId = localStorage.getItem('userId');

  return useQuery({
    queryKey: ['wallets', 'my-wallet', userId],
    queryFn: () => walletService.getMyWallet(),
    enabled: !!userId,
    staleTime: 30000,
    retry: 1,
  });
};

/**
 * Hook to update wallet balance
 */
export const useUpdateWalletBalance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ walletId, data }) =>
      walletService.updateWalletBalance(walletId, data),
    onSuccess: (data, variables) => {
      // Invalidate wallet queries
      queryClient.invalidateQueries({ queryKey: ['wallets'] });

      // Update specific wallet cache
      queryClient.setQueryData(['wallets', variables.walletId], data);
    },
  });
};

/**
 * Hook to deposit to current user's wallet
 */
export const useDepositToMyWallet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => walletService.depositToMyWallet(data),
    onSuccess: () => {
      // Invalidate all wallet queries to refresh balance
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
    },
  });
};

/**
 * Hook for wallet utilities
 */
export const useWalletUtils = () => {
  return {
    formatBalance: walletService.formatBalance,
    vndToUsd: walletService.vndToUsd,
    usdToVnd: walletService.usdToVnd,
  };
};
