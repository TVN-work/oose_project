import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import bidService from '../services/bid/bidService';

/**
 * Hook to fetch bid by ID
 * @param {string} bidId - Bid ID
 */
export const useBid = (bidId) => {
  return useQuery({
    queryKey: ['bids', bidId],
    queryFn: () => bidService.getBidById(bidId),
    enabled: !!bidId,
    staleTime: 30000, // 30 seconds
    retry: 1,
  });
};

/**
 * Hook to create a new bid
 */
export const useCreateBid = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bidData) => bidService.createBid(bidData),
    onSuccess: (newBid) => {
      // Invalidate bids list
      queryClient.invalidateQueries({ queryKey: ['bids'] });

      // Invalidate related listing (to update bid list)
      queryClient.invalidateQueries({ queryKey: ['listings'] });

      // Add to cache
      queryClient.setQueryData(['bids', newBid.id], newBid);
    },
  });
};

/**
 * Hook to delete a bid
 */
export const useDeleteBid = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bidId) => bidService.deleteBid(bidId),
    onSuccess: (_, bidId) => {
      // Invalidate bids list
      queryClient.invalidateQueries({ queryKey: ['bids'] });

      // Invalidate related listing
      queryClient.invalidateQueries({ queryKey: ['listings'] });

      // Remove from cache
      queryClient.removeQueries({ queryKey: ['bids', bidId] });
    },
  });
};

/**
 * Hook for bid utilities
 */
export const useBidUtils = () => {
  return {
    validateBidData: bidService.validateBidData,
    formatBidAmount: bidService.formatBidAmount,
    isValidBidAmount: bidService.isValidBidAmount,
  };
};
