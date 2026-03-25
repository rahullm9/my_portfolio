import React, { useState } from 'react';
import { FiCommand, FiSun, FiMoon, FiMenu } from 'react-icons/fi';
import useDarkMode from '../hooks/useDarkMode';

const Navbar = ({ activeSection = 'Home', setActiveSection }) => {
  const [colorTheme, setTheme] = useDarkMode();
  const isDark = colorTheme === 'light'; // If the next theme is light, we are currently in dark mode
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = ['Home', 'Blog', 'Projects', 'About', 'Guestbook'];

  return (
    <nav className="relative flex justify-between items-center w-full mb-4 md:mb-20 mt-2 md:mt-4 transition-colors">
      {/* Logo */}
      <div className="text-2xl font-bold font-mono tracking-tighter">
        <a href="/" className="hover:text-primary transition-colors text-gray-900 dark:text-gray-100">~/</a>
      </div>

      {/* Nav Links (Desktop) */}
      <div className="hidden md:flex items-center space-x-6">
        {navLinks.map((link) => (
          <button
            key={link}
            onClick={() => setActiveSection && setActiveSection(link)}
            className={`relative pb-1 text-sm font-medium transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 hover:after:w-full ${
              activeSection === link 
                ? 'text-gray-900 dark:text-gray-100 after:w-full' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 after:w-0'
            }`}
          >
            {link}
          </button>
        ))}

        {/* Icons */}
        <div className="flex items-center space-x-3 ml-4">
          <button className="p-2 rounded-full bg-gray-100 dark:bg-[#111] hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
            <FiCommand size={18} />
          </button>
          <button
            onClick={() => setTheme(colorTheme)}
            className="p-2 rounded-full bg-gray-100 dark:bg-[#111] hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Icon */}
      <div className="md:hidden flex items-center space-x-3">
        <button
          onClick={() => setTheme(colorTheme)}
          className="p-2 rounded-full bg-gray-100 dark:bg-[#111] hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-gray-800 dark:text-gray-200"
        >
          {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
        </button>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-full bg-gray-100 dark:bg-[#111] hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-gray-800 dark:text-gray-200"
        >
          <FiMenu size={20} />
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-14 left-0 w-full bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 rounded-xl shadow-lg p-4 z-50 md:hidden flex flex-col space-y-4 transition-colors duration-300">
          {navLinks.map((link) => (
            <button
              key={link}
              onClick={() => {
                if (setActiveSection) setActiveSection(link);
                setIsMobileMenuOpen(false);
              }}
              className={`text-left text-base font-medium transition-colors ${
                activeSection === link 
                  ? 'text-primary' 
                  : 'text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary'
              }`}
            >
              {link}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
