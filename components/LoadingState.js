import React from 'react';

const LoadingState = ({
  message = "Loading...",
  size = "medium",
  showSpinner = true,
  className = "",
  type = "default" // default, pulse, skeleton
}) => {
  // Size variations
  const sizeClasses = {
    small: {
      container: 'p-2',
      spinner: 'w-4 h-4',
      text: 'text-sm',
      pulse: 'h-4',
      skeleton: 'h-12'
    },
    medium: {
      container: 'p-4',
      spinner: 'w-6 h-6',
      text: 'text-base',
      pulse: 'h-6',
      skeleton: 'h-16'
    },
    large: {
      container: 'p-6',
      spinner: 'w-8 h-8',
      text: 'text-lg',
      pulse: 'h-8',
      skeleton: 'h-20'
    }
  };

  const sizes = sizeClasses[size];

  // Skeleton loading for data cards
  if (type === 'skeleton') {
    return (
      <div className={`animate-pulse ${sizes.container} ${className}`}>
        <div className={`bg-gray-200 dark:bg-gray-700 rounded ${sizes.skeleton} mb-2`}></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  // Pulse loading for simple content
  if (type === 'pulse') {
    return (
      <div className={`animate-pulse ${sizes.container} ${className}`}>
        <div className={`bg-gray-200 dark:bg-gray-700 rounded ${sizes.pulse}`}></div>
      </div>
    );
  }

  // Default loading with spinner and text
  return (
    <div className={`flex items-center justify-center ${sizes.container} ${className}`}>
      {showSpinner && (
        <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizes.spinner} mr-3`}></div>
      )}
      <span className={`text-gray-600 dark:text-gray-400 ${sizes.text}`}>
        {message}
      </span>
    </div>
  );
};

// Health metrics loading skeleton
export const HealthMetricSkeleton = ({ title = "Loading..." }) => (
  <div className="p-4 flex flex-col w-full overflow-hidden rounded-lg shadow-xs bg-white dark:bg-gray-800">
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
      <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
      <div className="text-center text-gray-400 text-sm">{title}</div>
    </div>
  </div>
);

// Chart loading skeleton
export const ChartSkeleton = ({ height = "450px" }) => (
  <div className="w-full animate-pulse" style={{ height }}>
    <div className="h-full bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-2">📊</div>
        <div className="text-gray-500">Loading chart...</div>
      </div>
    </div>
  </div>
);

export default LoadingState;
