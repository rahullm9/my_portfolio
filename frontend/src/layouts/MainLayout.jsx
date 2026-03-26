import React from 'react';

const MainLayout = ({ children }) => {
  return (
    <div className="gradient-bg min-h-screen flex flex-col font-sans text-gray-900 dark:text-gray-200 transition-colors duration-300">
      <div className="max-w-[1000px] w-full mx-auto px-6 pt-4 pb-12 md:pt-6 flex-grow">
        {children}
      </div>
      
      <footer className="w-full py-8 mt-auto border-t border-gray-200 dark:border-white/10 text-center transition-colors duration-300">
        <div className="max-w-[1000px] mx-auto px-6">
          <p className="text-[13px] font-medium text-gray-500 dark:text-gray-400 tracking-wide">
            &copy; {new Date().getFullYear()} Rahul. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
