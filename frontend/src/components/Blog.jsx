import React from 'react';
import { FiTool } from 'react-icons/fi';

const Blog = () => {
  return (
    <div id="blog" className="flex-1 flex flex-col items-center justify-center min-h-[60vh] mt-10 md:mt-20 w-full animate-fade-in">
      <div className="relative group mb-10">
        {/* Animated glowing background */}
        <div className="absolute -inset-4 bg-primary/20 dark:bg-primary/30 blur-2xl rounded-full opacity-60 animate-pulse duration-[3000ms]"></div>
        
        {/* Icon Container */}
        <div className="relative p-6 sm:p-8 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 rounded-3xl shadow-xl transition-transform duration-500 hover:scale-[1.03]">
          <FiTool size={64} className="text-primary mx-auto" strokeWidth={1.5} />
        </div>
      </div>
      
      <h2 className="text-4xl md:text-5xl font-black font-sans tracking-tight mb-5 text-gray-900 dark:text-white transition-colors duration-300">
        Coming Soon
      </h2>
      
      <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md text-center leading-relaxed font-medium transition-colors">
        I'm currently crafting some deep dives, tutorials, and reflections. Grab a coffee and check back soon for fresh articles!
      </p>
    </div>
  );
};

export default Blog;
