import { useMutation, useQueryClient } from '@tanstack/react-query';
import mediaService from '../services/media/mediaService';
import { useState } from 'react';

/**
 * Hook to upload a single image
 */
export const useUploadImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (imageFile) => mediaService.uploadImage(imageFile),
    onSuccess: (data) => {
      // Optionally invalidate relevant queries
      // queryClient.invalidateQueries({ queryKey: ['images'] });
    },
  });
};

/**
 * Hook to upload multiple images
 */
export const useUploadMultipleImages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (imageFiles) => mediaService.uploadMultipleImages(imageFiles),
    onSuccess: (data) => {
      // Optionally invalidate relevant queries
      // queryClient.invalidateQueries({ queryKey: ['images'] });
    },
  });
};

/**
 * Hook for image upload with preview and validation
 * Provides state management for image selection and preview
 */
export const useImageUpload = (options = {}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [validationError, setValidationError] = useState(null);

  const uploadMutation = useUploadImage();

  /**
   * Handle file selection
   * @param {File} file - Selected file
   */
  const handleFileSelect = (file) => {
    // Revoke previous preview URL if exists
    if (previewUrl) {
      mediaService.revokePreviewUrl(previewUrl);
    }

    // Validate file
    const validation = mediaService.validateImageFile(file, options);

    if (!validation.valid) {
      setValidationError(validation.error);
      setSelectedFile(null);
      setPreviewUrl(null);
      return false;
    }

    // Set file and create preview
    setValidationError(null);
    setSelectedFile(file);
    setPreviewUrl(mediaService.createPreviewUrl(file));

    return true;
  };

  /**
   * Handle file input change event
   * @param {Event} event - Input change event
   */
  const handleInputChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  /**
   * Clear selection and preview
   */
  const clearSelection = () => {
    if (previewUrl) {
      mediaService.revokePreviewUrl(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setValidationError(null);
  };

  /**
   * Upload the selected file
   */
  const uploadFile = async () => {
    if (!selectedFile) {
      throw new Error('No file selected');
    }

    return await uploadMutation.mutateAsync(selectedFile);
  };

  return {
    selectedFile,
    previewUrl,
    validationError,
    isUploading: uploadMutation.isPending,
    uploadError: uploadMutation.error,
    uploadResult: uploadMutation.data,
    handleFileSelect,
    handleInputChange,
    clearSelection,
    uploadFile,
    reset: () => {
      clearSelection();
      uploadMutation.reset();
    },
  };
};

/**
 * Hook for multiple images upload with preview and validation
 */
export const useMultipleImagesUpload = (options = {}) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);

  const uploadMutation = useUploadMultipleImages();

  /**
   * Handle multiple files selection
   * @param {FileList|Array<File>} files - Selected files
   */
  const handleFilesSelect = (files) => {
    // Revoke previous preview URLs
    previewUrls.forEach(url => mediaService.revokePreviewUrl(url));

    const filesArray = Array.from(files);
    const validFiles = [];
    const previews = [];
    const errors = [];

    filesArray.forEach((file, index) => {
      const validation = mediaService.validateImageFile(file, options);

      if (validation.valid) {
        validFiles.push(file);
        previews.push(mediaService.createPreviewUrl(file));
        errors.push(null);
      } else {
        errors.push(validation.error);
      }
    });

    setSelectedFiles(validFiles);
    setPreviewUrls(previews);
    setValidationErrors(errors);

    return validFiles.length > 0;
  };

  /**
   * Handle file input change event
   * @param {Event} event - Input change event
   */
  const handleInputChange = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleFilesSelect(files);
    }
  };

  /**
   * Remove a file from selection
   * @param {number} index - Index of file to remove
   */
  const removeFile = (index) => {
    // Revoke preview URL
    if (previewUrls[index]) {
      mediaService.revokePreviewUrl(previewUrls[index]);
    }

    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    setValidationErrors(prev => prev.filter((_, i) => i !== index));
  };

  /**
   * Clear all selections and previews
   */
  const clearSelection = () => {
    previewUrls.forEach(url => mediaService.revokePreviewUrl(url));
    setSelectedFiles([]);
    setPreviewUrls([]);
    setValidationErrors([]);
  };

  /**
   * Upload all selected files
   */
  const uploadFiles = async () => {
    if (selectedFiles.length === 0) {
      throw new Error('No files selected');
    }

    return await uploadMutation.mutateAsync(selectedFiles);
  };

  return {
    selectedFiles,
    previewUrls,
    validationErrors,
    isUploading: uploadMutation.isPending,
    uploadError: uploadMutation.error,
    uploadResults: uploadMutation.data,
    handleFilesSelect,
    handleInputChange,
    removeFile,
    clearSelection,
    uploadFiles,
    reset: () => {
      clearSelection();
      uploadMutation.reset();
    },
  };
};

/**
 * Hook for media utilities
 */
export const useMediaUtils = () => {
  return {
    getImageUrl: mediaService.getImageUrl,
    getFullImageUrl: mediaService.getFullImageUrl,
    extractImageId: mediaService.extractImageId,
    validateImageFile: mediaService.validateImageFile,
    formatFileSize: mediaService.formatFileSize,
    createPreviewUrl: mediaService.createPreviewUrl,
    revokePreviewUrl: mediaService.revokePreviewUrl,
  };
};
