import React from 'react';

const ContentLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[60vh] space-y-6">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing ring */}
        <div className="absolute w-16 h-16 border-4 border-primary/20 rounded-full animate-pulse"></div>
        {/* Inner spinning ring */}
        <div className="w-12 h-12 border-4 border-transparent border-t-primary border-b-primary rounded-full animate-spin shadow-[0_0_15px_rgba(168,85,247,0.5)]"></div>
      </div>
      <p className="text-gray-500 dark:text-gray-400 font-medium tracking-wide animate-pulse">
        Loading...
      </p>
    </div>
  );
};

export default ContentLoader;
