import React from "react";

const SkeletonLoader = ({ height = "h-4", width = "w-full", className = "" }) => {
  return (
    <div
      className={`animate-pulse bg-gray-300 dark:bg-gray-700 rounded ${height} ${width} ${className}`}
    ></div>
  );
};

export default SkeletonLoader;