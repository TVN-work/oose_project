import apiClient from '../api/client';
import { API_ENDPOINTS } from '../../config/api';

/**
 * Vehicle Type Service
 * Handles vehicle type operations (vehicle_type table)
 * Get information about different EV types (VinFast VF e34, Tesla Model 3, etc.)
 */
const vehicleTypeService = {
  /**
   * Get all vehicle types with optional filters and pagination
   * @param {Object} params - Query parameters
   * @param {string} params.manufacturer - Manufacturer filter (optional)
   * @param {string} params.model - Model filter (optional)
   * @param {number} params.page - Page number (default: 0)
   * @param {number} params.entry - Items per page (default: 10)
   * @param {string} params.field - Sort field (default: 'id')
   * @param {string} params.sort - Sort direction: 'ASC' or 'DESC' (default: 'DESC')
   * @returns {Promise<Array>} List of vehicle types
   * 
   * Response format:
   * [
   *   {
   *     "id": "1",
   *     "manufacturer": "VinFast",
   *     "model": "VF e34",
   *     "co2PerKm": 0.12
   *   }
   * ]
   */
  getAllVehicleTypes: async (params = {}) => {
    try {
      const {
        manufacturer,
        model,
        page = 0,
        entry = 10,
        field = 'id',
        sort = 'DESC'
      } = params;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        entry: entry.toString(),
        field,
        sort,
      });

      // Add optional filters
      if (manufacturer) queryParams.append('manufacturer', manufacturer);
      if (model) queryParams.append('model', model);

      const response = await apiClient.get(`/vehicle-types?${queryParams.toString()}`, {
        headers: {
          'accept': '*/*',
        },
      });

      return response;
    } catch (error) {
      console.error('Error fetching vehicle types:', error);
      throw error;
    }
  },

  /**
   * Get vehicle type by ID
   * @param {string} typeId - Vehicle type ID
   * @returns {Promise<Object>} Vehicle type details
   * 
   * Response format:
   * {
   *   "id": "049ea2e8-3b4b-4ad5-a3ed-0aee9c2b01fd",
   *   "manufacturer": "VinFast",
   *   "model": "VF e34",
   *   "co2PerKm": 0.12
   * }
   */
  getVehicleTypeById: async (typeId) => {
    try {
      const response = await apiClient.get(`/vehicle-types/${typeId}`, {
        headers: {
          'accept': '*/*',
        },
      });

      return response;
    } catch (error) {
      console.error('Error fetching vehicle type by ID:', error);
      throw error;
    }
  },

  /**
   * Create a new vehicle type
   * @param {Object} vehicleTypeData - Vehicle type data
   * @param {string} vehicleTypeData.manufacturer - Manufacturer name (required)
   * @param {string} vehicleTypeData.model - Model name (required)
   * @param {number} vehicleTypeData.co2PerKm - CO2 emission per km (required)
   * @returns {Promise<Object>} Created vehicle type
   */
  createVehicleType: async (vehicleTypeData) => {
    try {
      const response = await apiClient.post('/vehicle-types', vehicleTypeData, {
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json',
        },
      });

      return response;
    } catch (error) {
      console.error('Error creating vehicle type:', error);
      throw error;
    }
  },

  /**
   * Create multiple vehicle types at once
   * @param {Array<Object>} vehicleTypesArray - Array of vehicle type data
   * @returns {Promise<Array>} Created vehicle types
   * 
   * Request format:
   * [
   *   {
   *     "manufacturer": "VinFast",
   *     "model": "VF 8",
   *     "co2PerKm": 0.12
   *   }
   * ]
   */
  createMultipleVehicleTypes: async (vehicleTypesArray) => {
    try {
      const response = await apiClient.post('/vehicle-types/add-all', vehicleTypesArray, {
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json',
        },
      });

      return response;
    } catch (error) {
      console.error('Error creating multiple vehicle types:', error);
      throw error;
    }
  },

  /**
   * Update a vehicle type (PATCH - partial update with FormData)
   * @param {string} typeId - Vehicle type ID
   * @param {Object} vehicleTypeData - Updated vehicle type data
   * @param {string} vehicleTypeData.manufacturer - Manufacturer name (optional)
   * @param {string} vehicleTypeData.model - Model name (optional)
   * @param {number} vehicleTypeData.co2PerKm - CO2 emission per km (optional)
   * @returns {Promise<Object>} Updated vehicle type
   */
  updateVehicleType: async (typeId, vehicleTypeData) => {
    try {
      // Create FormData for multipart/form-data
      const formData = new FormData();

      if (vehicleTypeData.manufacturer) {
        formData.append('manufacturer', vehicleTypeData.manufacturer);
      }

      if (vehicleTypeData.model) {
        formData.append('model', vehicleTypeData.model);
      }

      if (vehicleTypeData.co2PerKm !== undefined) {
        formData.append('co2PerKm', vehicleTypeData.co2PerKm.toString());
      }

      const response = await apiClient.patch(`/vehicle-types/${typeId}`, formData, {
        headers: {
          'accept': '*/*',
          'Content-Type': 'multipart/form-data',
        },
      });

      return response;
    } catch (error) {
      console.error('Error updating vehicle type:', error);
      throw error;
    }
  },

  /**
   * Delete a vehicle type
   * @param {string} typeId - Vehicle type ID
   * @returns {Promise<void>}
   */
  deleteVehicleType: async (typeId) => {
    try {
      const response = await apiClient.delete(`/vehicle-types/${typeId}`, {
        headers: {
          'accept': '*/*',
        },
      });

      return response;
    } catch (error) {
      console.error('Error deleting vehicle type:', error);
      throw error;
    }
  },

  /**
   * Get vehicle types by manufacturer
   * @param {string} manufacturer - Manufacturer name
   * @param {Object} params - Additional query parameters
   * @returns {Promise<Array>} List of vehicle types for the manufacturer
   */
  getVehicleTypesByManufacturer: async (manufacturer, params = {}) => {
    try {
      return await vehicleTypeService.getAllVehicleTypes({
        ...params,
        manufacturer,
      });
    } catch (error) {
      console.error('Error fetching vehicle types by manufacturer:', error);
      throw error;
    }
  },

  /**
   * Get vehicle types by model
   * @param {string} model - Model name
   * @param {Object} params - Additional query parameters
   * @returns {Promise<Array>} List of vehicle types for the model
   */
  getVehicleTypesByModel: async (model, params = {}) => {
    try {
      return await vehicleTypeService.getAllVehicleTypes({
        ...params,
        model,
      });
    } catch (error) {
      console.error('Error fetching vehicle types by model:', error);
      throw error;
    }
  },

  /**
   * Format vehicle type display name
   * @param {Object} vehicleType - Vehicle type object
   * @returns {string} Formatted name (e.g., "VinFast VF e34")
   */
  formatVehicleTypeName: (vehicleType) => {
    if (!vehicleType) return '';
    const { manufacturer, model } = vehicleType;
    return `${manufacturer} ${model}`;
  },

  /**
   * Get unique manufacturers from vehicle types
   * @param {Array} vehicleTypes - List of vehicle types
   * @returns {Array} List of unique manufacturer names
   */
  getUniqueManufacturers: (vehicleTypes) => {
    if (!Array.isArray(vehicleTypes)) return [];
    const manufacturers = vehicleTypes.map(type => type.manufacturer).filter(Boolean);
    return [...new Set(manufacturers)].sort();
  },

  /**
   * Get unique models from vehicle types
   * @param {Array} vehicleTypes - List of vehicle types
   * @returns {Array} List of unique model names
   */
  getUniqueModels: (vehicleTypes) => {
    if (!Array.isArray(vehicleTypes)) return [];
    const models = vehicleTypes.map(type => type.model).filter(Boolean);
    return [...new Set(models)].sort();
  },

  /**
   * Format CO2 per km value
   * @param {number} co2PerKm - CO2 emission per km
   * @returns {string} Formatted CO2 value (e.g., "0.12 kg/km")
   */
  formatCO2PerKm: (co2PerKm) => {
    if (typeof co2PerKm !== 'number') return '0 kg/km';
    return `${co2PerKm.toFixed(2)} kg/km`;
  },

  /**
   * Calculate CO2 for a given distance
   * @param {Object} vehicleType - Vehicle type object
   * @param {number} distanceKm - Distance in km
   * @returns {number} Total CO2 emission
   */
  calculateCO2ForDistance: (vehicleType, distanceKm) => {
    if (!vehicleType || !vehicleType.co2PerKm || !distanceKm) return 0;
    return vehicleType.co2PerKm * distanceKm;
  },
};

export default vehicleTypeService;
