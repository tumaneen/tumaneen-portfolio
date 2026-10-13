import React, { useState, useEffect } from 'react';
import { PageId, Project } from './types/portfolio';
import { PROJECTS } from './data/portfolioData';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CosmicStarfield } from './components/CosmicStarfield';
import { CosmicCursor } from './components/CosmicCursor';
import { GrainOverlay } from './components/GrainOverlay';
import { CaseStudyModal } from './components/CaseStudyModal';
import { HomePage } from './pages/HomePage';
import { WorkPage } from './pages/WorkPage';
import { ServicesPage } from './pages/ServicesPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [prefilledNotes, setPrefilledNotes] = useState<string>('');
  const [grainIntensity, setGrainIntensity] = useState<'subtle' | 'medium' | 'heavy' | 'off'>('medium');

  const handleNavigate = (page: PageId) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePreFillContact = (notes: string) => {
    setPrefilledNotes(notes);
  };

  const cycleGrain = () => {
    setGrainIntensity((prev) => {
      if (prev === 'medium') return 'heavy';
      if (prev === 'heavy') return 'subtle';
      if (prev === 'subtle') return 'off';
      return 'medium';
    });
  };

  // Keyboard shortcut for quick home navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'h' || e.key === 'H') {
        handleNavigate('home');
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0b0908] text-[#e7d8cc] flex flex-col font-sans selection:bg-[#ea580c] selection:text-black">
      
      {/* 1. Interactive Starfield Canvas (Subtle twinkling stars & mouse parallax) */}
      <CosmicStarfield />

      {/* 2. Custom Celestial Orbit Cursor (Astrolabe reticle & orbiting satellite) */}
      <CosmicCursor />

      {/* 3. Vintage Risograph / Film Grain Overlay */}
      <GrainOverlay intensity={grainIntensity} onCycleIntensity={cycleGrain} />

      {/* 3. Top Navigation Bar (Strict 3-zone Top Bar Contract) */}
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />

      {/* 4. Dynamic Page View with Smooth Transition */}
      <main className="flex-1 z-10 page-fade-in" key={currentPage}>
        {currentPage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onOpenProject={(project) => setActiveProject(project)}
            featuredProjects={PROJECTS}
          />
        )}

        {currentPage === 'work' && (
          <WorkPage
            projects={PROJECTS}
            onOpenProject={(project) => setActiveProject(project)}
          />
        )}

        {currentPage === 'services' && (
          <ServicesPage
            onNavigate={handleNavigate}
            onPreFillContact={handlePreFillContact}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'contact' && (
          <ContactPage initialServiceNotes={prefilledNotes} />
        )}
      </main>

      {/* 5. Rich Editorial Footer with Rising Crescent Glow */}
      <Footer
        onNavigate={handleNavigate}
        grainIntensity={grainIntensity}
        onCycleGrain={cycleGrain}
      />

      {/* 6. Case Study Deep-Dive Modal */}
      <CaseStudyModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
        onSelectProject={(p) => setActiveProject(p)}
        allProjects={PROJECTS}
      />

    </div>
  );
}
