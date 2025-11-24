import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import vehicleService from '../services/vehicle/vehicleService';

/**
 * Hook to fetch all vehicles with filters and pagination
 * @param {Object} params - Query parameters (ownerId, vin, vehicleTypeId, enabled, page, entry, field, sort)
 */
export const useVehicles = (params = {}) => {
  return useQuery({
    queryKey: ['vehicles', params],
    queryFn: () => vehicleService.getAllVehicles(params),
    staleTime: 60000, // 1 minute
    retry: 1,
  });
};

/**
 * Hook to fetch current user's vehicles
 * @param {Object} params - Additional query parameters
 */
export const useMyVehicles = (params = {}) => {
  return useQuery({
    queryKey: ['vehicles', 'my-vehicles', params],
    queryFn: () => vehicleService.getMyVehicles(params),
    staleTime: 60000,
    retry: 1,
  });
};

/**
 * Hook to fetch active vehicles only (enabled=true)
 * @param {Object} params - Additional query parameters
 */
export const useActiveVehicles = (params = {}) => {
  return useQuery({
    queryKey: ['vehicles', 'active', params],
    queryFn: () => vehicleService.getActiveVehicles(params),
    staleTime: 60000,
    retry: 1,
  });
};

/**
 * Hook to fetch verified vehicles only
 * @param {Object} params - Additional query parameters
 */
export const useVerifiedVehicles = (params = {}) => {
  return useQuery({
    queryKey: ['vehicles', 'verified', params],
    queryFn: () => vehicleService.getVerifiedVehicles(params),
    staleTime: 60000,
    retry: 1,
  });
};

/**
 * Hook to fetch vehicle by ID
 * @param {string} vehicleId - Vehicle ID
 */
export const useVehicle = (vehicleId) => {
  return useQuery({
    queryKey: ['vehicles', vehicleId],
    queryFn: () => vehicleService.getVehicleById(vehicleId),
    enabled: !!vehicleId,
    staleTime: 60000,
    retry: 1,
  });
};

/**
 * Hook to create a new vehicle
 */
export const useCreateVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vehicleData) => vehicleService.createVehicle(vehicleData),
    onSuccess: (newVehicle) => {
      // Invalidate vehicles list
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });

      // Optionally add to cache
      queryClient.setQueryData(['vehicles', newVehicle.id], newVehicle);
    },
  });
};

/**
 * Hook to update a vehicle
 */
export const useUpdateVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ vehicleId, vehicleData }) =>
      vehicleService.updateVehicle(vehicleId, vehicleData),
    onSuccess: (updatedVehicle, variables) => {
      // Invalidate vehicles list
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });

      // Update specific vehicle cache
      queryClient.setQueryData(['vehicles', variables.vehicleId], updatedVehicle);
    },
  });
};

/**
 * Hook to delete a vehicle
 */
export const useDeleteVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vehicleId) => vehicleService.deleteVehicle(vehicleId),
    onSuccess: (_, vehicleId) => {
      // Invalidate vehicles list
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });

      // Remove from cache
      queryClient.removeQueries({ queryKey: ['vehicles', vehicleId] });
    },
  });
};

/**
 * Hook for vehicle utilities
 */
export const useVehicleUtils = () => {
  return {
    formatVehicleName: vehicleService.formatVehicleName,
    validateVIN: vehicleService.validateVIN,
    validateLicensePlate: vehicleService.validateLicensePlate,
    formatLicensePlate: vehicleService.formatLicensePlate,
    formatVIN: vehicleService.formatVIN,
    getStatusDisplay: vehicleService.getStatusDisplay,
    getTotalCO2Reduced: vehicleService.getTotalCO2Reduced,
    getTotalDistance: vehicleService.getTotalDistance,
    getTotalEnergyUsed: vehicleService.getTotalEnergyUsed,
  };
};
