import React, { useState } from 'react';
import MainLayout from './layouts/MainLayout';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LinkCards from './components/LinkCards';
import Projects from './components/Projects';
import About from './components/About';
import Blog from './components/Blog';
import Guestbook from './components/Guestbook';
import PageLoader from './components/PageLoader';
import ContentLoader from './components/ContentLoader';
import CommandPalette from './components/CommandPalette';

function App() {
  const [activeSection, setActiveSection] = useState(() => {
    const hash = window.location.hash.slice(1);
    const sections = ['Home', 'Blog', 'Projects', 'About', 'Guestbook'];
    const hashSection = sections.find(s => s.toLowerCase() === hash.toLowerCase());
    if (hashSection) return hashSection;
    const savedSection = localStorage.getItem('last_section');
    if (savedSection && sections.includes(savedSection)) return savedSection;
    return 'Home';
  });
  const [isLoadingSection, setIsLoadingSection] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  React.useEffect(() => {
    // Command Palette Keyboard Shortcut
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  React.useEffect(() => {
    // Handle back/forward navigation or manual hash changes
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      const sections = ['Home', 'Blog', 'Projects', 'About', 'Guestbook'];
      const section = sections.find(s => s.toLowerCase() === hash.toLowerCase());
      if (section) {
        setActiveSection(section);
        localStorage.setItem('last_section', section);
      } else if (!hash) {
        setActiveSection('Home');
        localStorage.setItem('last_section', 'Home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSetSection = (section) => {
    if (section === activeSection) return;
    setIsLoadingSection(true);
    
    // Allow React to batch the loading state before changing the section
    setTimeout(() => {
      setActiveSection(section);
      localStorage.setItem('last_section', section);
      if (section === 'Home') {
        window.history.pushState(null, '', window.location.pathname);
      } else {
        window.location.hash = section.toLowerCase();
      }
    }, 10);
  };

  const handleSectionLoaded = () => {
    setIsLoadingSection(false);
  };

    return (
    <>
      <PageLoader isLoading={isLoadingSection} />
      <CommandPalette 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        onSelect={handleSetSection} 
      />
      <MainLayout>
      <Navbar 
        activeSection={activeSection} 
        setActiveSection={handleSetSection} 
        onOpenSearch={() => setIsSearchOpen(true)} 
      />
      
      {isLoadingSection && <ContentLoader />}
      
      <div className={isLoadingSection ? 'hidden' : 'block'}>
        {activeSection === 'Home' && (
          <>
            <main className="flex flex-col md:flex-row justify-between items-start w-full gap-8 md:gap-4 relative">
              <Hero />
              <LinkCards setActiveSection={handleSetSection} />
            </main>
            <Guestbook isHome={true} setActiveSection={handleSetSection} onLoad={handleSectionLoaded} />
          </>
        )}

        {activeSection === 'Projects' && (
          <Projects onLoad={handleSectionLoaded} />
        )}

        {activeSection === 'Blog' && (
          <Blog onLoad={handleSectionLoaded} />
        )}

        {activeSection === 'About' && (
          <About onLoad={handleSectionLoaded} />
        )}

        {activeSection === 'Guestbook' && (
          <Guestbook onLoad={handleSectionLoaded} />
        )}
      </div>
    </MainLayout>
    </>
  );
}

export default App;
