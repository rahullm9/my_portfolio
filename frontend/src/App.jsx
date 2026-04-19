import React, { useState } from 'react';
import MainLayout from './layouts/MainLayout';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LinkCards from './components/LinkCards';
import Projects from './components/Projects';
import About from './components/About';
import Blog from './components/Blog';
import Guestbook from './components/Guestbook';

function App() {
  const [activeSection, setActiveSection] = useState(() => {
    // Priority 1: URL Hash
    const hash = window.location.hash.slice(1);
    const sections = ['Home', 'Blog', 'Projects', 'About', 'Guestbook'];
    const hashSection = sections.find(s => s.toLowerCase() === hash.toLowerCase());
    if (hashSection) return hashSection;

    // Priority 2: LocalStorage
    const savedSection = localStorage.getItem('last_section');
    if (savedSection && sections.includes(savedSection)) return savedSection;

    // Default
    return 'Home';
  });

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
    setActiveSection(section);
    localStorage.setItem('last_section', section);
    if (section === 'Home') {
      window.history.pushState(null, '', window.location.pathname);
    } else {
      window.location.hash = section.toLowerCase();
    }
  };

  return (
    <MainLayout>
      <Navbar activeSection={activeSection} setActiveSection={handleSetSection} />
      
      {activeSection === 'Home' && (
        <>
          <main className="flex flex-col md:flex-row justify-between items-start w-full gap-8 md:gap-4 relative">
            <Hero />
            <LinkCards setActiveSection={handleSetSection} />
          </main>
          <Guestbook isHome={true} setActiveSection={handleSetSection} />
        </>
      )}

      {activeSection === 'Projects' && (
        <Projects />
      )}

      {activeSection === 'Blog' && (
        <Blog />
      )}

      {activeSection === 'About' && (
        <About />
      )}

      {activeSection === 'Guestbook' && (
        <Guestbook />
      )}
    </MainLayout>
  );
}

export default App;
