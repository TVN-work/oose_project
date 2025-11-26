import apiClient from '../api/client';
import { API_ENDPOINTS } from '../../config/api';

/**
 * Media Service
 * Handles media upload and retrieval (images table)
 */
const mediaService = {
  /**
   * Upload an image
   * @param {File} imageFile - Image file to upload
   * @returns {Promise<Object>} Upload result with pathUrl
   * 
   * Response format:
   * {
   *   "pathUrl": "/api/media/get/0bae3b39-7614-4758-9c20-ccf7702bd8bb"
   * }
   */
  uploadImage: async (imageFile) => {
    try {
      if (!imageFile) {
        throw new Error('Image file is required');
      }

      // Create FormData for multipart/form-data
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await apiClient.post('/media', formData, {
        headers: {
          'accept': '*/*',
          'Content-Type': 'multipart/form-data',
        },
      });

      return response;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },

  /**
   * Upload multiple images
   * @param {Array<File>} imageFiles - Array of image files to upload
   * @returns {Promise<Array>} Array of upload results
   */
  uploadMultipleImages: async (imageFiles) => {
    try {
      if (!Array.isArray(imageFiles) || imageFiles.length === 0) {
        throw new Error('Image files array is required');
      }

      // Upload images sequentially to avoid overwhelming the server
      const results = [];
      for (const imageFile of imageFiles) {
        const result = await mediaService.uploadImage(imageFile);
        results.push(result);
      }

      return results;
    } catch (error) {
      console.error('Error uploading multiple images:', error);
      throw error;
    }
  },

  /**
   * Get image URL by ID
   * @param {string} imageId - Image ID
   * @returns {string} Full image URL
   */
  getImageUrl: (imageId) => {
    if (!imageId) return '';

    // If imageId is already a full path, return it
    if (imageId.startsWith('/api/media/get/')) {
      return imageId;
    }

    // If imageId is already a full URL, return it
    if (imageId.startsWith('http://') || imageId.startsWith('https://')) {
      return imageId;
    }

    // Otherwise, construct the URL
    return `/api/media/get/${imageId}`;
  },

  /**
   * Get full image URL (with base URL for external access)
   * @param {string} imageId - Image ID or path
   * @returns {string} Full image URL with domain
   */
  getFullImageUrl: (imageId) => {
    if (!imageId) return '';

    // If already a full URL, return it
    if (imageId.startsWith('http://') || imageId.startsWith('https://')) {
      return imageId;
    }

    const path = mediaService.getImageUrl(imageId);

    // Use VITE_API_URL for API base URL (relative /api in production)
    // In development with Vite proxy, use empty string to let proxy handle it
    const baseUrl = import.meta.env.VITE_API_URL || '';

    // Remove '/api' prefix if exists since we'll add the full base URL
    const cleanPath = path.startsWith('/api') ? path : `/api${path}`;

    return `${baseUrl}${cleanPath}`;
  },

  /**
   * Extract image ID from pathUrl
   * @param {string} pathUrl - Path URL from upload response
   * @returns {string} Image ID
   * 
   * Example: "/api/media/get/0bae3b39-7614-4758-9c20-ccf7702bd8bb" -> "0bae3b39-7614-4758-9c20-ccf7702bd8bb"
   */
  extractImageId: (pathUrl) => {
    if (!pathUrl) return '';

    // Extract ID from path like "/api/media/get/{id}"
    const match = pathUrl.match(/\/api\/media\/get\/([^/]+)$/);
    return match ? match[1] : pathUrl;
  },

  /**
   * Validate image file
   * @param {File} file - File to validate
   * @param {Object} options - Validation options
   * @param {number} options.maxSizeMB - Maximum file size in MB (default: 5)
   * @param {Array<string>} options.allowedTypes - Allowed MIME types (default: common image types)
   * @returns {Object} Validation result { valid: boolean, error: string }
   */
  validateImageFile: (file, options = {}) => {
    const {
      maxSizeMB = 5,
      allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    } = options;

    if (!file) {
      return { valid: false, error: 'File is required' };
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
      };
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      return {
        valid: false,
        error: `File size (${fileSizeMB.toFixed(2)}MB) exceeds maximum allowed size (${maxSizeMB}MB)`,
      };
    }

    return { valid: true, error: null };
  },

  /**
   * Format file size for display
   * @param {number} bytes - File size in bytes
   * @returns {string} Formatted file size (e.g., "2.5 MB")
   */
  formatFileSize: (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  },

  /**
   * Create image preview URL from File object
   * @param {File} file - Image file
   * @returns {string} Object URL for preview
   */
  createPreviewUrl: (file) => {
    if (!file) return '';
    return URL.createObjectURL(file);
  },

  /**
   * Revoke preview URL to free memory
   * @param {string} url - Object URL to revoke
   */
  revokePreviewUrl: (url) => {
    if (url && url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  },
};

export default mediaService;
