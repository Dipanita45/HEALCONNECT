import React from 'react';
import { ERROR_TYPES } from '@lib/errorHandler';

const ErrorDisplay = ({
  error,
  isRetrying = false,
  onRetry,
  showRetryButton = true,
  className = "",
  size = "medium"
}) => {
  if (!error) return null;

  // Get appropriate icon and color based on error type
  const getErrorInfo = (errorType) => {
    switch (errorType) {
      case ERROR_TYPES.NETWORK_ERROR:
        return {
          icon: '🌐',
          color: 'text-orange-600',
          bgColor: 'bg-orange-50 border-orange-200',
          title: 'Network Error'
        };
      case ERROR_TYPES.SENSOR_DISCONNECTED:
        return {
          icon: '📡',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50 border-yellow-200',
          title: 'Sensor Disconnected'
        };
      case ERROR_TYPES.FIREBASE_ERROR:
        return {
          icon: '🔗',
          color: 'text-red-600',
          bgColor: 'bg-red-50 border-red-200',
          title: 'Database Error'
        };
      case ERROR_TYPES.TIMEOUT_ERROR:
        return {
          icon: '⏱️',
          color: 'text-purple-600',
          bgColor: 'bg-purple-50 border-purple-200',
          title: 'Connection Timeout'
        };
      default:
        return {
          icon: '⚠️',
          color: 'text-red-600',
          bgColor: 'bg-red-50 border-red-200',
          title: 'Error'
        };
    }
  };

  const errorInfo = getErrorInfo(error.type);

  // Size variations
  const sizeClasses = {
    small: {
      container: 'p-2 text-sm',
      icon: 'text-base',
      title: 'text-sm font-medium',
      message: 'text-xs',
      button: 'px-2 py-1 text-xs'
    },
    medium: {
      container: 'p-3 text-sm',
      icon: 'text-lg',
      title: 'text-sm font-semibold',
      message: 'text-sm',
      button: 'px-3 py-1 text-sm'
    },
    large: {
      container: 'p-4 text-base',
      icon: 'text-xl',
      title: 'text-base font-bold',
      message: 'text-base',
      button: 'px-4 py-2 text-sm'
    }
  };

  const sizes = sizeClasses[size];

  return (
    <div className={`border rounded-lg ${errorInfo.bgColor} ${sizes.container} ${className}`}>
      <div className="flex items-start space-x-3">
        <span className={`${errorInfo.icon} ${sizes.icon} mt-0.5`}>
          {errorInfo.icon}
        </span>
        <div className="flex-1 min-w-0">
          <h3 className={`${errorInfo.color} ${sizes.title}`}>
            {errorInfo.title}
          </h3>
          <p className={`${errorInfo.color} ${sizes.message} mt-1`}>
            {error.message || 'An error occurred'}
          </p>

          {showRetryButton && onRetry && (
            <button
              onClick={onRetry}
              disabled={isRetrying}
              className={`mt-2 ${sizes.button} font-medium rounded transition-colors ${
                isRetrying
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : `${errorInfo.color} hover:bg-opacity-10 border border-current hover:bg-current hover:text-white`
              }`}
            >
              {isRetrying ? 'Retrying...' : 'Try Again'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;
