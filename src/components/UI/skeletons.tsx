import React from "react";

export const ProfileSkeleton = () => {
  return (
    <div role="status" className="flex max-w-sm animate-pulse gap-1">
      <div className="mb-4 h-8 w-32 rounded-full bg-skeleton-black dark:bg-skeleton-black" />
      <div className="mb-4 h-8 w-8 rounded-full bg-skeleton-black dark:bg-skeleton-black" />
    </div>
  );
};
