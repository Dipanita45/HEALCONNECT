import React from "react";
import SkeletonLoader from "./SkeletonLoader";

const CardSkeleton = () => {
  return (
    <div className="p-4 border rounded-lg shadow-sm space-y-3">
      <SkeletonLoader height="h-6" width="w-1/2" />
      <SkeletonLoader height="h-4" />
      <SkeletonLoader height="h-4" width="w-5/6" />
      <SkeletonLoader height="h-4" width="w-2/3" />
    </div>
  );
};

export default CardSkeleton;