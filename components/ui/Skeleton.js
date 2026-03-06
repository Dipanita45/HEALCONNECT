import React from 'react';

const Skeleton = ({
  variant = 'text',
  width,
  height,
  className = '',
  style = {},
}) => {
  const baseClasses = 'animate-pulse bg-gray-200 dark:bg-gray-700';
  
  const variantClasses = {
    text: 'rounded-md w-full h-4 mb-2',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
  };

  const combinedStyle = {
    width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
    height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
    ...style,
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant] || ''} ${className}`}
      style={combinedStyle}
      aria-hidden="true"
    />
  );
};

export default Skeleton;
