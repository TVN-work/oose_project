import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import transactionService from '../services/transaction/transactionService';

/**
 * Hook to fetch all transactions with filters and pagination
 * @param {Object} params - Query parameters (listingId, buyerId, sellerId, amount, credit, status, paymentMethod, paidAt, page, entry, field, sort)
 */
export const useTransactions = (params = {}) => {
  return useQuery({
    queryKey: ['transactions', params],
    queryFn: () => transactionService.getAllTransactions(params),
    staleTime: 30000, // 30 seconds
    retry: 1,
  });
};

/**
 * Hook to fetch transaction by ID
 * @param {string} transactionId - Transaction ID
 */
export const useTransaction = (transactionId) => {
  return useQuery({
    queryKey: ['transactions', transactionId],
    queryFn: () => transactionService.getTransactionById(transactionId),
    enabled: !!transactionId,
    staleTime: 30000, // 30 seconds
    retry: 1,
  });
};

/**
 * Hook to create a new transaction
 */
export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transactionData) => transactionService.createTransaction(transactionData),
    onSuccess: (newTransaction) => {
      // Invalidate transactions list
      queryClient.invalidateQueries({ queryKey: ['transactions'] });

      // Invalidate related listing (to update status)
      queryClient.invalidateQueries({ queryKey: ['listings'] });

      // Add to cache
      queryClient.setQueryData(['transactions', newTransaction.id], newTransaction);
    },
  });
};

/**
 * Hook to update transaction status
 */
export const useUpdateTransactionStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ transactionId, status }) =>
      transactionService.updateTransactionStatus(transactionId, status),
    onSuccess: (updatedTransaction, variables) => {
      // Invalidate transactions list
      queryClient.invalidateQueries({ queryKey: ['transactions'] });

      // Invalidate related listing
      queryClient.invalidateQueries({ queryKey: ['listings'] });

      // Update specific transaction cache
      queryClient.setQueryData(['transactions', variables.transactionId], updatedTransaction);
    },
  });
};

/**
 * Hook to pay for a transaction
 */
export const usePayTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ transactionId, paymentMethod }) =>
      transactionService.payTransaction(transactionId, paymentMethod),
    onSuccess: (paymentResponse, variables) => {
      // Invalidate transactions list
      queryClient.invalidateQueries({ queryKey: ['transactions'] });

      // Invalidate specific transaction
      queryClient.invalidateQueries({ queryKey: ['transactions', variables.transactionId] });

      // Invalidate related listing
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });
};

/**
 * Hook for transaction utilities
 */
export const useTransactionUtils = () => {
  return {
    getStatusDisplay: transactionService.getStatusDisplay,
    getPaymentMethodDisplay: transactionService.getPaymentMethodDisplay,
    getListingTypeDisplay: transactionService.getListingTypeDisplay,
    validateTransactionData: transactionService.validateTransactionData,
    formatAmount: transactionService.formatAmount,
    formatDate: transactionService.formatDate,
    isTransactionSuccessful: transactionService.isTransactionSuccessful,
    isTransactionPending: transactionService.isTransactionPending,
    canCancelTransaction: transactionService.canCancelTransaction,
  };
};
