import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import journeyService from '../services/journey/journeyService';

/**
 * Hook to fetch all journeys with filters
 * @param {Object} params - Query parameters
 * @param {string} params.journeyId - Filter by journey ID (optional)
 * @param {string} params.journeyStatus - Filter by status: PENDING, APPROVED, REJECTED, CANCELLED (optional)
 * @param {number} params.page - Page number (default: 0)
 * @param {number} params.entry - Entries per page (default: 10)
 * @param {string} params.field - Sort field (default: 'id')
 * @param {string} params.sort - Sort order: ASC, DESC (default: 'DESC')
 */
export const useJourneys = (params = {}) => {
  return useQuery({
    queryKey: ['journeys', params],
    queryFn: () => journeyService.getAllJourneys(params),
    staleTime: 60000,
    retry: 1,
  });
};

/**
 * Hook to fetch journey by ID
 * @param {string} journeyId - Journey ID
 */
export const useJourney = (journeyId) => {
  return useQuery({
    queryKey: ['journey', journeyId],
    queryFn: () => journeyService.getJourneyById(journeyId),
    enabled: !!journeyId,
    staleTime: 60000,
    retry: 1,
  });
};

/**
 * Hook to create a new journey
 */
export const useCreateJourney = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (journeyData) => journeyService.createJourney(journeyData),
    onSuccess: (newJourney) => {
      // Invalidate journeys list
      queryClient.invalidateQueries({ queryKey: ['journeys'] });

      // Optionally add to cache
      queryClient.setQueryData(['journeys', newJourney.id], newJourney);
    },
  });
};

/**
 * Hook for journey utilities
 */
export const useJourneyUtils = () => {
  return {
    getStatusDisplay: journeyService.getStatusDisplay,
    formatDistance: journeyService.formatDistance,
    formatSpeed: journeyService.formatSpeed,
    formatEnergy: journeyService.formatEnergy,
    validateJourneyData: journeyService.validateJourneyData,
  };
};

