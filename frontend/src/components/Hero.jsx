import React from 'react';

const Hero = () => {
  return (
    <div className="max-w-xl text-left mt-10 md:mt-20">
      <h1 className="text-5xl md:text-6xl font-bold font-sans tracking-tight mb-8 text-gray-900 dark:text-white transition-colors duration-300">
        Hi, I am <span className="text-primary">Rahul</span>
      </h1>

      <p className="text-gray-700 dark:text-gray-300 text-[1.1rem] leading-relaxed mb-6 font-medium transition-colors duration-300">
        I’m a developer who enjoys creating <strong className="text-gray-900 dark:text-gray-100 font-bold tracking-wide">clean, functional,</strong> and user-friendly web applications. As a Computer Science student focused on the <span className="border-b-2 border-primary pb-[1px] text-gray-900 dark:text-gray-100 font-semibold">Full stack</span>, I spend most of my time building projects, learning new technologies, and sharpening my problem-solving skills.
      </p>

      <p className="text-gray-700 dark:text-gray-300 text-[1.1rem] leading-relaxed font-medium transition-colors duration-300">
        This is my place for <span className="bg-primary/20 text-primary px-1.5 py-0.5 rounded-[4px] font-semibold">design, development & everything</span> in between. Welcome to my portfolio!
      </p>

      {/* Command Prompt Hint */}
      <div className="mt-16 flex items-center text-sm text-gray-600 dark:text-gray-400 font-medium transition-colors duration-300">
        <span>Press</span>
        <span className="mx-2 px-2 py-1 bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-md flex items-center shadow-sm text-gray-800 dark:text-gray-300 transition-colors duration-300">
          <kbd className="font-sans">⌘ + K</kbd>
        </span>
        <span>to start</span>
      </div>
    </div>
  );
};

export default Hero;
