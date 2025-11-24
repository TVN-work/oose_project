import apiClient from '../api/client';

/**
 * Verification Service
 * Handles verification request operations (verify_requests table)
 * Manage vehicle and journey verification requests
 */

/**
 * Verification request types
 */
export const VERIFICATION_TYPES = {
  VEHICLE: 'VEHICLE',
  JOURNEY: 'JOURNEY',
};

/**
 * Verification request statuses
 */
export const VERIFICATION_STATUSES = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
};

const verificationService = {
  /**
   * Get all verification requests with filters and pagination
   * @param {Object} params - Query parameters
   * @param {string} params.userId - User ID filter (optional)
   * @param {string} params.type - Type filter: 'VEHICLE' or 'JOURNEY' (optional)
   * @param {string} params.status - Status filter: 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED' (optional)
   * @param {string} params.referenceId - Reference ID filter (optional)
   * @param {string} params.title - Title filter (optional)
   * @param {string} params.description - Description filter (optional)
   * @param {number} params.page - Page number (default: 0)
   * @param {number} params.entry - Items per page (default: 10)
   * @param {string} params.field - Sort field (default: 'id')
   * @param {string} params.sort - Sort direction: 'ASC' or 'DESC' (default: 'DESC')
   * @returns {Promise<Array>} List of verification requests
   * 
   * Response format:
   * [
   *   {
   *     "createdAt": "2025-11-23T14:35:45.213Z",
   *     "updatedAt": "2025-11-23T14:35:45.213Z",
   *     "id": "string",
   *     "userId": "string",
   *     "type": "VEHICLE",
   *     "referenceId": "string",
   *     "title": "string",
   *     "description": "string",
   *     "documentUrl": ["string"],
   *     "status": "PENDING",
   *     "note": "string"
   *   }
   * ]
   */
  getAllVerificationRequests: async (params = {}) => {
    try {
      const {
        userId,
        type,
        status,
        referenceId,
        title,
        description,
        page = 0,
        entry = 10,
        field = 'id',
        sort = 'DESC',
      } = params;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        entry: entry.toString(),
        field,
        sort,
      });

      // Add optional filters
      if (userId) queryParams.append('userId', userId);
      if (type) queryParams.append('type', type);
      if (status) queryParams.append('status', status);
      if (referenceId) queryParams.append('referenceId', referenceId);
      if (title) queryParams.append('title', title);
      if (description) queryParams.append('description', description);

      const response = await apiClient.get(`/verify-requests?${queryParams.toString()}`, {
        headers: {
          'accept': '*/*',
        },
      });

      return response;
    } catch (error) {
      console.error('Error fetching verification requests:', error);
      throw error;
    }
  },

  /**
   * Get verification request by ID
   * @param {string} requestId - Verification request ID
   * @returns {Promise<Object>} Verification request details
   * 
   * Response format:
   * {
   *   "createdAt": "2025-11-23T14:37:47.650Z",
   *   "updatedAt": "2025-11-23T14:37:47.650Z",
   *   "id": "string",
   *   "userId": "string",
   *   "type": "VEHICLE",
   *   "referenceId": "string",
   *   "title": "string",
   *   "description": "string",
   *   "documentUrl": ["string"],
   *   "status": "PENDING",
   *   "note": "string"
   * }
   */
  getVerificationRequestById: async (requestId) => {
    try {
      const response = await apiClient.get(`/verify-requests/${requestId}`, {
        headers: {
          'accept': '*/*',
        },
      });

      return response;
    } catch (error) {
      console.error('Error fetching verification request by ID:', error);
      throw error;
    }
  },

  /**
   * Update verification request (status and note)
   * @param {string} requestId - Verification request ID
   * @param {Object} updateData - Update data
   * @param {string} updateData.status - New status: 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED' (required)
   * @param {string} updateData.note - Verification note (optional)
   * @returns {Promise<Object>} Updated verification request
   * 
   * Response format:
   * {
   *   "createdAt": "2025-11-23T14:38:15.303Z",
   *   "updatedAt": "2025-11-23T14:38:15.303Z",
   *   "id": "string",
   *   "userId": "string",
   *   "type": "VEHICLE",
   *   "referenceId": "string",
   *   "title": "string",
   *   "description": "string",
   *   "documentUrl": ["string"],
   *   "status": "PENDING",
   *   "note": "string"
   * }
   */
  updateVerificationRequest: async (requestId, updateData) => {
    try {
      const formData = new FormData();

      if (updateData.status) {
        formData.append('status', updateData.status);
      }

      if (updateData.note) {
        formData.append('note', updateData.note);
      }

      const response = await apiClient.patch(`/verify-requests/${requestId}`, formData, {
        headers: {
          'accept': '*/*',
          'Content-Type': 'multipart/form-data',
        },
      });

      return response;
    } catch (error) {
      console.error('Error updating verification request:', error);
      throw error;
    }
  },

  /**
   * Get verification type display
   * @param {string} type - Verification type
   * @returns {Object} Display info { text, color }
   */
  getTypeDisplay: (type) => {
    const typeMap = {
      'VEHICLE': { text: 'Xe', color: 'blue' },
      'JOURNEY': { text: 'Hành trình', color: 'green' },
    };

    return typeMap[type] || { text: type || 'Unknown', color: 'gray' };
  },

  /**
   * Get verification status display
   * @param {string} status - Verification status
   * @returns {Object} Display info { text, color }
   */
  getStatusDisplay: (status) => {
    const statusMap = {
      'PENDING': { text: 'Chờ xác minh', color: 'yellow' },
      'APPROVED': { text: 'Đã duyệt', color: 'green' },
      'REJECTED': { text: 'Từ chối', color: 'red' },
      'CANCELLED': { text: 'Đã hủy', color: 'gray' },
    };

    return statusMap[status] || { text: status || 'Unknown', color: 'gray' };
  },

  /**
   * Validate verification request update data
   * @param {Object} updateData - Update data to validate
   * @returns {Object} Validation result { valid: boolean, errors: Array }
   */
  validateUpdateData: (updateData) => {
    const errors = [];

    if (!updateData.status) {
      errors.push('Status is required');
    }

    if (updateData.status && !Object.values(VERIFICATION_STATUSES).includes(updateData.status)) {
      errors.push(`Status must be one of: ${Object.values(VERIFICATION_STATUSES).join(', ')}`);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  /**
   * Format date for display
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date
   */
  formatDate: (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  },
};

export default verificationService;
