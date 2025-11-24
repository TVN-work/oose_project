import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import marketService from '../services/market/marketService';

/**
 * Hook to fetch all listings with filters and pagination
 * @param {Object} params - Query parameters (sellerId, creditId, type, status, minPrice, maxPrice, minQuantity, maxQuantity, startFrom, endBefore, page, entry, field, sort)
 */
export const useListings = (params = {}) => {
  return useQuery({
    queryKey: ['listings', params],
    queryFn: () => marketService.getAllListings(params),
    staleTime: 30000, // 30 seconds
    retry: 1,
  });
};

/**
 * Hook to fetch listing by ID
 * @param {string} listingId - Listing ID
 */
export const useListing = (listingId) => {
  return useQuery({
    queryKey: ['listings', listingId],
    queryFn: () => marketService.getListingById(listingId),
    enabled: !!listingId,
    staleTime: 30000, // 30 seconds
    retry: 1,
  });
};

/**
 * Hook to create a new listing
 */
export const useCreateListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (listingData) => marketService.createListing(listingData),
    onSuccess: (newListing) => {
      // Invalidate listings list
      queryClient.invalidateQueries({ queryKey: ['listings'] });

      // Add to cache
      queryClient.setQueryData(['listings', newListing.id], newListing);
    },
  });
};

/**
 * Hook to update listing status
 */
export const useUpdateListingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ listingId, status }) =>
      marketService.updateListingStatus(listingId, status),
    onSuccess: (updatedListing, variables) => {
      // Invalidate listings list
      queryClient.invalidateQueries({ queryKey: ['listings'] });

      // Update specific listing cache
      queryClient.setQueryData(['listings', variables.listingId], updatedListing);
    },
  });
};

/**
 * Hook for market utilities
 */
export const useMarketUtils = () => {
  return {
    getTypeDisplay: marketService.getTypeDisplay,
    getStatusDisplay: marketService.getStatusDisplay,
    validateListingData: marketService.validateListingData,
    calculateTotalPrice: marketService.calculateTotalPrice,
    formatPrice: marketService.formatPrice,
    formatDate: marketService.formatDate,
    isListingActive: marketService.isListingActive,
    getHighestBid: marketService.getHighestBid,
    countBids: marketService.countBids,
  };
};
