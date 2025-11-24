import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import journeyService from '../services/journey/journeyService';

/**
 * Hook to fetch journey by ID
 * @param {string} journeyId - Journey ID
 */
export const useJourney = (journeyId) => {
  return useQuery({
    queryKey: ['journeys', journeyId],
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

