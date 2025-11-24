import apiClient from '../api/client';
import { API_ENDPOINTS } from '../../config/api';

/**
 * Vehicle Service
 * Handles vehicle operations (vehicle table)
 * Manage user's registered vehicles
 */
const vehicleService = {
  /**
   * Get all vehicles with optional filters and pagination
   * @param {Object} params - Query parameters
   * @param {string} params.ownerId - Owner ID filter (optional)
   * @param {string} params.vin - VIN filter (optional)
   * @param {string} params.vehicleTypeId - Vehicle type ID filter (optional)
   * @param {boolean} params.enabled - Enabled status filter (optional)
   * @param {number} params.page - Page number (default: 0)
   * @param {number} params.entry - Items per page (default: 10)
   * @param {string} params.field - Sort field (default: 'id')
   * @param {string} params.sort - Sort direction: 'ASC' or 'DESC' (default: 'DESC')
   * @returns {Promise<Array>} List of vehicles
   * 
   * Response format:
   * [
   *   {
   *     "id": "string",
   *     "ownerId": "string",
   *     "vin": "string",
   *     "licensePlate": "string",
   *     "registrationNumber": "string",
   *     "color": "string",
   *     "registrationDate": "2025-11-23",
   *     "mileage": 0,
   *     "verified": true,
   *     "registrationImageUrl": ["string"],
   *     "note": "string",
   *     "journey": {
   *       "id": "string",
   *       "distanceKm": 0.1,
   *       "energyUsed": 0.1,
   *       "co2Reduced": 0.1
   *     },
   *     "vehicleType": {
   *       "id": "1",
   *       "manufacturer": "VinFast",
   *       "model": "VF e34",
   *       "co2PerKm": 0.12
   *     }
   *   }
   * ]
   */
  getAllVehicles: async (params = {}) => {
    try {
      const {
        ownerId,
        vin,
        vehicleTypeId,
        enabled,
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
      if (ownerId) queryParams.append('ownerId', ownerId);
      if (vin) queryParams.append('vin', vin);
      if (vehicleTypeId) queryParams.append('vehicleTypeId', vehicleTypeId);
      if (enabled !== undefined) queryParams.append('enabled', enabled.toString());

      const response = await apiClient.get(`/vehicles?${queryParams.toString()}`, {
        headers: {
          'accept': '*/*',
        },
      });

      return response;
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      throw error;
    }
  },

  /**
   * Get vehicle by ID
   * @param {string} vehicleId - Vehicle ID
   * @returns {Promise<Object>} Vehicle details
   * 
   * Response includes vehicleType and journey data
   */
  getVehicleById: async (vehicleId) => {
    try {
      const response = await apiClient.get(`/vehicles/${vehicleId}`, {
        headers: {
          'accept': '*/*',
        },
      });

      return response;
    } catch (error) {
      console.error('Error fetching vehicle by ID:', error);
      throw error;
    }
  },

  /**
   * Create a new vehicle
   * @param {Object} vehicleData - Vehicle data
   * @param {string} vehicleData.ownerId - Owner ID (required)
   * @param {string} vehicleData.vin - Vehicle Identification Number (required)
   * @param {string} vehicleData.licensePlate - License plate (required)
   * @param {string} vehicleData.registrationNumber - Registration number (optional)
   * @param {string} vehicleData.color - Vehicle color (optional)
   * @param {string} vehicleData.registrationDate - Registration date YYYY-MM-DD (optional)
   * @param {number} vehicleData.mileage - Current mileage (optional)
   * @param {string} vehicleData.vehicleTypeId - Vehicle type ID (required)
   * @param {Array<string>} vehicleData.registrationImageUrl - Registration image URLs (optional)
   * @param {string} vehicleData.note - Additional notes (optional)
   * @returns {Promise<Object>} Created vehicle
   */
  createVehicle: async (vehicleData) => {
    try {
      const response = await apiClient.post('/vehicles', vehicleData, {
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json',
        },
      });

      return response;
    } catch (error) {
      console.error('Error creating vehicle:', error);
      throw error;
    }
  },

  /**
   * Update a vehicle (PATCH - partial update with FormData)
   * @param {string} vehicleId - Vehicle ID
   * @param {Object} vehicleData - Updated vehicle data
   * @param {string} vehicleData.status - Vehicle status: PENDING, ACTIVE, INACTIVE (optional)
   * @param {string} vehicleData.note - Additional notes (optional)
   * @returns {Promise<Object>} Updated vehicle
   */
  updateVehicle: async (vehicleId, vehicleData) => {
    try {
      // Create FormData for multipart/form-data
      const formData = new FormData();

      if (vehicleData.status) {
        formData.append('status', vehicleData.status);
      }

      if (vehicleData.note !== undefined) {
        formData.append('note', vehicleData.note);
      }

      const response = await apiClient.patch(`/vehicles/${vehicleId}`, formData, {
        headers: {
          'accept': '*/*',
          'Content-Type': 'multipart/form-data',
        },
      });

      return response;
    } catch (error) {
      console.error('Error updating vehicle:', error);
      throw error;
    }
  },

  /**
   * Delete a vehicle
   * @param {string} vehicleId - Vehicle ID
   * @returns {Promise<void>}
   */
  deleteVehicle: async (vehicleId) => {
    try {
      const response = await apiClient.delete(`/vehicles/${vehicleId}`, {
        headers: {
          'accept': '*/*',
        },
      });

      return response;
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      throw error;
    }
  },

  /**
   * Get current user's vehicles
   * Uses ownerId from localStorage
   * @param {Object} params - Additional query parameters
   * @returns {Promise<Array>} List of user's vehicles
   */
  getMyVehicles: async (params = {}) => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('User ID not found. Please login again.');
      }

      return await vehicleService.getAllVehicles({
        ...params,
        ownerId: userId,
      });
    } catch (error) {
      console.error('Error fetching my vehicles:', error);
      throw error;
    }
  },

  /**
   * Get verified vehicles only
   * @param {Object} params - Additional query parameters
   * @returns {Promise<Array>} List of verified vehicles
   */
  getVerifiedVehicles: async (params = {}) => {
    try {
      const allVehicles = await vehicleService.getAllVehicles(params);
      return allVehicles.filter(vehicle => vehicle.verified === true);
    } catch (error) {
      console.error('Error fetching verified vehicles:', error);
      throw error;
    }
  },

  /**
   * Get active vehicles (enabled=true)
   * @param {Object} params - Additional query parameters
   * @returns {Promise<Array>} List of active vehicles
   */
  getActiveVehicles: async (params = {}) => {
    try {
      return await vehicleService.getAllVehicles({
        ...params,
        enabled: true,
      });
    } catch (error) {
      console.error('Error fetching active vehicles:', error);
      throw error;
    }
  },

  /**
   * Format vehicle display name
   * @param {Object} vehicle - Vehicle object
   * @returns {string} Formatted name (e.g., "VinFast VF e34 (30G-123.45)" or "30G-123.45")
   */
  formatVehicleName: (vehicle) => {
    if (!vehicle) return '';

    const { licensePlate, vehicleType } = vehicle;

    // If vehicleType exists, show manufacturer + model + license plate
    if (vehicleType) {
      const vehicleName = `${vehicleType.manufacturer} ${vehicleType.model}`;
      return licensePlate ? `${vehicleName} (${licensePlate})` : vehicleName;
    }

    // Otherwise just show license plate
    return licensePlate || 'Vehicle';
  },

  /**
   * Validate VIN (Vehicle Identification Number)
   * VIN is typically 17 characters alphanumeric
   * @param {string} vin - VIN to validate
   * @returns {boolean} True if valid
   */
  validateVIN: (vin) => {
    if (!vin) return false;

    // VIN format: 17 alphanumeric characters (excluding I, O, Q)
    const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/i;
    return vinRegex.test(vin.trim());
  },

  /**
   * Validate license plate format (Vietnamese format)
   * @param {string} licensePlate - License plate to validate
   * @returns {boolean} True if valid
   */
  validateLicensePlate: (licensePlate) => {
    if (!licensePlate) return false;

    // Vietnamese license plate formats:
    // - XX[A-Z]-XXX.XX (e.g., 30G-123.45)
    // - XXX-XXXXX (e.g., 51-12345)
    // - XX-XXXXX (e.g., 29-12345)
    const vnPlateRegex = /^\d{2,3}[A-Z]?-\d{3,5}\.?\d{0,2}$/i;
    return vnPlateRegex.test(licensePlate.trim());
  },

  /**
   * Format license plate (uppercase and trim)
   * @param {string} licensePlate - License plate to format
   * @returns {string} Formatted license plate
   */
  formatLicensePlate: (licensePlate) => {
    if (!licensePlate) return '';
    return licensePlate.trim().toUpperCase();
  },

  /**
   * Format VIN (uppercase and trim)
   * @param {string} vin - VIN to format
   * @returns {string} Formatted VIN
   */
  formatVIN: (vin) => {
    if (!vin) return '';
    return vin.trim().toUpperCase();
  },

  /**
   * Get vehicle status display
   * @param {string} status - Vehicle status
   * @returns {Object} Display info { text, color }
   */
  getStatusDisplay: (status) => {
    const statusMap = {
      'PENDING': { text: 'Chờ xác minh', color: 'yellow' },
      'ACTIVE': { text: 'Đã kích hoạt', color: 'green' },
      'INACTIVE': { text: 'Vô hiệu hóa', color: 'gray' },
      'REJECTED': { text: 'Từ chối', color: 'red' },
    };

    return statusMap[status] || { text: status || 'Unknown', color: 'gray' };
  },

  /**
   * Calculate total CO2 reduced from journey data
   * @param {Object} journey - Journey object
   * @returns {number} Total CO2 reduced
   */
  getTotalCO2Reduced: (journey) => {
    if (!journey) return 0;
    return journey.co2Reduced || 0;
  },

  /**
   * Calculate total distance from journey data
   * @param {Object} journey - Journey object
   * @returns {number} Total distance in km
   */
  getTotalDistance: (journey) => {
    if (!journey) return 0;
    return journey.distanceKm || 0;
  },

  /**
   * Calculate total energy used from journey data
   * @param {Object} journey - Journey object
   * @returns {number} Total energy used
   */
  getTotalEnergyUsed: (journey) => {
    if (!journey) return 0;
    return journey.energyUsed || 0;
  },
};

export default vehicleService;
