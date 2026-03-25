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
  const [activeSection, setActiveSection] = useState('Home');

  return (
    <MainLayout>
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />
      
      {activeSection === 'Home' && (
        <>
          <main className="flex flex-col md:flex-row justify-between items-start w-full gap-8 md:gap-4 relative">
            <Hero />
            <LinkCards setActiveSection={setActiveSection} />
          </main>
          <Guestbook isHome={true} setActiveSection={setActiveSection} />
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
