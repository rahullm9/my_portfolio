import React, { useState, useEffect, useRef } from 'react';
import { FiSearch, FiFileText, FiUser, FiCode, FiMessageSquare, FiHome, FiX } from 'react-icons/fi';

const PAGES = [
  { name: 'Home', icon: <FiHome className="text-gray-400 group-hover:text-primary transition-colors" /> },
  { name: 'Blog', icon: <FiFileText className="text-gray-400 group-hover:text-primary transition-colors" /> },
  { name: 'Projects', icon: <FiCode className="text-gray-400 group-hover:text-primary transition-colors" /> },
  { name: 'About', icon: <FiUser className="text-gray-400 group-hover:text-primary transition-colors" /> },
  { name: 'Guestbook', icon: <FiMessageSquare className="text-gray-400 group-hover:text-primary transition-colors" /> }
];

const CommandPalette = ({ isOpen, onClose, onSelect }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const filteredPages = PAGES.filter(page => 
    page.name.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      // Timeout ensures focus happens after the element is mounted/rendered
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [isOpen]);

  // Handle keyboard navigation inside the modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
        e.preventDefault();
      } else if (e.key === 'ArrowDown') {
        setSelectedIndex(prev => (prev < filteredPages.length - 1 ? prev + 1 : prev));
        e.preventDefault();
      } else if (e.key === 'ArrowUp') {
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
        e.preventDefault();
      } else if (e.key === 'Enter') {
        if (filteredPages[selectedIndex]) {
          onSelect(filteredPages[selectedIndex].name);
          onClose();
        }
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredPages, selectedIndex, onClose, onSelect]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 animate-fade-in backdrop-blur-sm bg-black/20 dark:bg-black/50">
      {/* Background click to close */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Modal Content */}
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-[#111] rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-white/10 animate-slide-up origin-top"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Area */}
        <div className="flex items-center px-4 border-b border-gray-100 dark:border-white/10">
          <FiSearch className="text-gray-400 dark:text-gray-500 mr-3" size={20} />
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Search pages..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="flex-1 bg-transparent py-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none text-[15px]"
          />
          <button onClick={onClose} className="p-1 rounded-md text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
            <FiX size={18} />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto py-2">
          {filteredPages.length > 0 ? (
            filteredPages.map((page, index) => (
              <button
                key={page.name}
                onClick={() => {
                  onSelect(page.name);
                  onClose();
                }}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`w-full flex items-center px-4 py-3 text-left transition-colors group ${
                  index === selectedIndex
                    ? 'bg-gray-100 dark:bg-white/5'
                    : 'bg-transparent'
                }`}
              >
                <span className="mr-3">{page.icon}</span>
                <span className={`text-[15px] ${index === selectedIndex ? 'text-primary font-medium' : 'text-gray-700 dark:text-gray-300'}`}>
                  {page.name}
                </span>
                
                {index === selectedIndex && (
                  <span className="ml-auto text-[11px] font-bold text-gray-400 tracking-wider">
                    ENTER
                  </span>
                )}
              </button>
            ))
          ) : (
            <div className="px-4 py-10 text-center text-gray-500 dark:text-gray-400 text-sm">
              No results found for "{query}"
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="px-4 py-3 bg-gray-50 dark:bg-black/20 border-t border-gray-100 dark:border-white/5 flex items-center gap-4 text-[11px] text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-black font-sans shadow-sm">↑</kbd>
            <kbd className="px-1.5 py-0.5 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-black font-sans shadow-sm">↓</kbd>
            <span>to navigate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-black font-sans shadow-sm">Enter</kbd>
            <span>to select</span>
          </div>
          <div className="flex items-center gap-1.5 ml-auto">
            <kbd className="px-1.5 py-0.5 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-black font-sans shadow-sm">Esc</kbd>
            <span>to close</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
