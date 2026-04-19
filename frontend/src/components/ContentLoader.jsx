import React from 'react';

const ContentLoader = () => {
  return (
    <div className="w-full max-w-[1000px] mt-10 md:mt-32 mb-10 mx-auto px-2">
      <div className="animate-pulse flex flex-col space-y-8">
        
        {/* Skeleton Top Row */}
        <div className="flex items-center space-x-4">
          {/* Avatar Skeleton */}
          <div className="w-14 h-14 bg-gray-200 dark:bg-zinc-800 rounded-full"></div>
          
          {/* Title/Subtitle Skeleton */}
          <div className="space-y-3">
            <div className="h-3.5 bg-gray-200 dark:bg-zinc-800 rounded w-48"></div>
            <div className="h-3 bg-gray-200 dark:bg-zinc-800 rounded w-32"></div>
          </div>
        </div>

        {/* Skeleton Body Lines */}
        <div className="space-y-4">
          <div className="h-3 bg-gray-200 dark:bg-zinc-800 rounded w-full"></div>
          <div className="h-3 bg-gray-200 dark:bg-zinc-800 rounded w-[90%]"></div>
          <div className="h-3 bg-gray-200 dark:bg-zinc-800 rounded w-[60%]"></div>
        </div>
      </div>
    </div>
  );
};

export default ContentLoader;
