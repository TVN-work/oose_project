import { useState, useRef, useCallback } from 'react';

/**
 * Custom hook to manage Alert notifications (replacing toast)
 * Returns showAlert function and alert state
 */
export const useAlert = () => {
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState('success');
  const alertTimeoutRef = useRef(null);

  const showAlert = useCallback((message, type = 'success', duration = 5000) => {
    // Clear existing timeout if any
    if (alertTimeoutRef.current) {
      clearTimeout(alertTimeoutRef.current);
    }

    setAlertType(type);
    setAlertMessage(message);

    // Auto dismiss after duration
    if (duration > 0) {
      alertTimeoutRef.current = setTimeout(() => {
        setAlertMessage(null);
        alertTimeoutRef.current = null;
      }, duration);
    }
  }, []);

  const hideAlert = useCallback(() => {
    if (alertTimeoutRef.current) {
      clearTimeout(alertTimeoutRef.current);
      alertTimeoutRef.current = null;
    }
    setAlertMessage(null);
  }, []);

  return {
    alertMessage,
    alertType,
    showAlert,
    hideAlert
  };
};

