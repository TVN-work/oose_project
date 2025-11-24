import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import vehicleTypeService from '../services/vehicle/vehicleTypeService';

/**
 * Hook to fetch all vehicle types with filters and pagination
 * @param {Object} params - Query parameters (manufacturer, model, page, entry, field, sort)
 */
export const useVehicleTypes = (params = {}) => {
  return useQuery({
    queryKey: ['vehicleTypes', params],
    queryFn: () => vehicleTypeService.getAllVehicleTypes(params),
    staleTime: 300000, // 5 minutes (vehicle types rarely change)
    retry: 1,
  });
};

/**
 * Hook to fetch vehicle type by ID
 * @param {string} typeId - Vehicle type ID
 */
export const useVehicleType = (typeId) => {
  return useQuery({
    queryKey: ['vehicleTypes', typeId],
    queryFn: () => vehicleTypeService.getVehicleTypeById(typeId),
    enabled: !!typeId,
    staleTime: 300000,
    retry: 1,
  });
};

/**
 * Hook to fetch vehicle types by manufacturer
 * @param {string} manufacturer - Manufacturer name
 * @param {Object} params - Additional query parameters
 */
export const useVehicleTypesByManufacturer = (manufacturer, params = {}) => {
  return useQuery({
    queryKey: ['vehicleTypes', 'manufacturer', manufacturer, params],
    queryFn: () => vehicleTypeService.getVehicleTypesByManufacturer(manufacturer, params),
    enabled: !!manufacturer,
    staleTime: 300000,
    retry: 1,
  });
};

/**
 * Hook to fetch vehicle types by model
 * @param {string} model - Model name
 * @param {Object} params - Additional query parameters
 */
export const useVehicleTypesByModel = (model, params = {}) => {
  return useQuery({
    queryKey: ['vehicleTypes', 'model', model, params],
    queryFn: () => vehicleTypeService.getVehicleTypesByModel(model, params),
    enabled: !!model,
    staleTime: 300000,
    retry: 1,
  });
};

/**
 * Hook to get unique manufacturers from vehicle types
 */
export const useVehicleManufacturers = () => {
  const { data: vehicleTypes, ...rest } = useVehicleTypes();

  const manufacturers = vehicleTypes
    ? vehicleTypeService.getUniqueManufacturers(vehicleTypes)
    : [];

  return {
    data: manufacturers,
    ...rest,
  };
};

/**
 * Hook to get unique models from vehicle types
 */
export const useVehicleModels = () => {
  const { data: vehicleTypes, ...rest } = useVehicleTypes();

  const models = vehicleTypes
    ? vehicleTypeService.getUniqueModels(vehicleTypes)
    : [];

  return {
    data: models,
    ...rest,
  };
};

/**
 * Hook to create a new vehicle type
 */
export const useCreateVehicleType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vehicleTypeData) => vehicleTypeService.createVehicleType(vehicleTypeData),
    onSuccess: (newVehicleType) => {
      // Invalidate vehicle types list
      queryClient.invalidateQueries({ queryKey: ['vehicleTypes'] });

      // Optionally add to cache
      queryClient.setQueryData(['vehicleTypes', newVehicleType.id], newVehicleType);
    },
  });
};

/**
 * Hook to create multiple vehicle types at once
 */
export const useCreateMultipleVehicleTypes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vehicleTypesArray) => vehicleTypeService.createMultipleVehicleTypes(vehicleTypesArray),
    onSuccess: () => {
      // Invalidate vehicle types list
      queryClient.invalidateQueries({ queryKey: ['vehicleTypes'] });
    },
  });
};

/**
 * Hook to update a vehicle type
 */
export const useUpdateVehicleType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ typeId, vehicleTypeData }) =>
      vehicleTypeService.updateVehicleType(typeId, vehicleTypeData),
    onSuccess: (updatedVehicleType, variables) => {
      // Invalidate vehicle types list
      queryClient.invalidateQueries({ queryKey: ['vehicleTypes'] });

      // Update specific vehicle type cache
      queryClient.setQueryData(['vehicleTypes', variables.typeId], updatedVehicleType);
    },
  });
};

/**
 * Hook to delete a vehicle type
 */
export const useDeleteVehicleType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (typeId) => vehicleTypeService.deleteVehicleType(typeId),
    onSuccess: (_, typeId) => {
      // Invalidate vehicle types list
      queryClient.invalidateQueries({ queryKey: ['vehicleTypes'] });

      // Remove from cache
      queryClient.removeQueries({ queryKey: ['vehicleTypes', typeId] });
    },
  });
};

/**
 * Hook for vehicle type utilities
 */
export const useVehicleTypeUtils = () => {
  return {
    formatVehicleTypeName: vehicleTypeService.formatVehicleTypeName,
    getUniqueManufacturers: vehicleTypeService.getUniqueManufacturers,
    getUniqueModels: vehicleTypeService.getUniqueModels,
    formatCO2PerKm: vehicleTypeService.formatCO2PerKm,
    calculateCO2ForDistance: vehicleTypeService.calculateCO2ForDistance,
  };
};
