import { toast } from 'react-hot-toast';

// Error types for different scenarios
export const ERROR_TYPES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  SENSOR_DISCONNECTED: 'SENSOR_DISCONNECTED',
  FIREBASE_ERROR: 'FIREBASE_ERROR',
  DATA_FETCH_ERROR: 'DATA_FETCH_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR'
};

// Error messages for user display
export const ERROR_MESSAGES = {
  [ERROR_TYPES.NETWORK_ERROR]: "Network connection lost. Please check your internet connection.",
  [ERROR_TYPES.SENSOR_DISCONNECTED]: "Sensor disconnected. Please check device connection.",
  [ERROR_TYPES.FIREBASE_ERROR]: "Database connection failed. Trying to reconnect...",
  [ERROR_TYPES.DATA_FETCH_ERROR]: "Couldn't load data. Please try again.",
  [ERROR_TYPES.TIMEOUT_ERROR]: "Request timed out. Please check sensor connection or network."
};

// Determine error type based on error message/code
export const getErrorType = (error) => {
  if (!error) return ERROR_TYPES.DATA_FETCH_ERROR;

  const errorMessage = error.message || error.toString().toLowerCase();

  if (errorMessage.includes('network') || errorMessage.includes('offline')) {
    return ERROR_TYPES.NETWORK_ERROR;
  }

  if (errorMessage.includes('permission-denied') || errorMessage.includes('firestore')) {
    return ERROR_TYPES.FIREBASE_ERROR;
  }

  if (errorMessage.includes('timeout')) {
    return ERROR_TYPES.TIMEOUT_ERROR;
  }

  return ERROR_TYPES.DATA_FETCH_ERROR;
};

// Show user-friendly error message
export const showErrorToast = (error, customMessage = null) => {
  const errorType = getErrorType(error);
  const message = customMessage || ERROR_MESSAGES[errorType];

  toast.error(message, {
    duration: 5000,
    position: 'top-right',
    style: {
      background: '#fee2e2',
      color: '#991b1b',
      border: '1px solid #fca5a5',
    },
    icon: '⚠️',
  });
};

// Show retry option
export const showRetryToast = (retryCallback, message = "Connection failed. Click to retry.") => {
  toast.error(message, {
    duration: 8000,
    position: 'top-right',
    style: {
      background: '#fee2e2',
      color: '#991b1b',
      border: '1px solid #fca5a5',
      cursor: 'pointer',
    },
    icon: '🔄',
    onClick: retryCallback,
  });
};

// Retry mechanism with exponential backoff
export const createRetryFunction = (asyncFunction, maxRetries = 3, baseDelay = 1000) => {
  return async (...args) => {
    let lastError;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await asyncFunction(...args);
      } catch (error) {
        lastError = error;

        if (attempt === maxRetries) {
          throw error;
        }

        // Exponential backoff: wait baseDelay * 2^attempt milliseconds
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  };
};

// Network status checker
export const checkNetworkStatus = () => {
  return navigator.onLine;
};

// Firebase connection checker
export const checkFirebaseConnection = async (db) => {
  try {
    const { connectFirestoreEmulator } = await import('firebase/firestore');
    return true;
  } catch (error) {
    return false;
  }
};
