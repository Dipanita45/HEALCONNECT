import React from "react";

const TableSkeleton = ({ rows = 5, cols = 4 }) => {
  return (
    <div className="animate-pulse w-full">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4 mb-3">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <div
              key={colIndex}
              className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default TableSkeleton;