import React, { useState } from 'react';
import { PageId } from '../types/portfolio';
import { SoundscapePlayer } from './SoundscapePlayer';
import { Menu, X, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { id: PageId; label: string }[] = [
    { id: 'work', label: 'WORK' },
    { id: 'services', label: 'SERVICES' },
    { id: 'about', label: 'ABOUT' },
    { id: 'contact', label: 'CONTACT' },
  ];

  const handleNavClick = (page: PageId) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0b0908]/90 backdrop-blur-md border-b border-orange-500/15 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">
        
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => handleNavClick('home')}
          className="text-base sm:text-xl font-mono tracking-widest text-[#e7d8cc] hover:text-orange-400 transition-colors flex items-center gap-1.5 sm:gap-2 cursor-pointer group shrink-0"
          aria-label="Return to Tumaneen homepage"
        >
          <span className="text-orange-500 font-bold group-hover:rotate-90 transition-transform duration-300">+</span>
          <span className="font-semibold tracking-[0.18em] sm:tracking-[0.22em]">TUMANEEN</span>
        </button>

        {/* Zone 2: 4 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-12">
          {navLinks.map((link) => {
            const isActive = currentPage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-xs font-mono tracking-[0.2em] transition-all relative py-1 cursor-pointer ${
                  isActive
                    ? 'text-orange-400 font-medium'
                    : 'text-[#e7d8cc]/70 hover:text-[#e7d8cc]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-orange-500 shadow-[0_0_8px_#f97316]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions (Soundscape toggle + Right editorial motto) */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Soundscape Ambient vinyl player */}
          <SoundscapePlayer />

          {/* Editorial Tagline matching reference top right: '— DESIGN FOR A BRIGHTER TOMORROW' */}
          <div className="hidden lg:flex items-center gap-2 text-[11px] font-mono tracking-wider text-stone-400/80">
            <span className="w-4 h-[1px] bg-orange-500/50" />
            <span>DESIGN FOR A BRIGHTER TOMORROW</span>
          </div>

          {/* Quick CTA button */}
          <button
            onClick={() => handleNavClick('contact')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono tracking-wider text-orange-400 border border-orange-500/40 hover:border-orange-500 hover:bg-orange-500/10 transition-all rounded cursor-pointer"
          >
            <span>INQUIRE</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-stone-300 hover:text-orange-400 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#120f0d] border-b border-orange-500/20 px-6 py-6 space-y-4 animate-fadeIn">
          <div className="flex flex-col space-y-3 font-mono text-sm tracking-widest">
            <button
              onClick={() => handleNavClick('home')}
              className={`text-left py-2 ${currentPage === 'home' ? 'text-orange-400 font-bold' : 'text-stone-300'}`}
            >
              HOME
            </button>
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-left py-2 border-t border-stone-800/60 ${
                  currentPage === link.id ? 'text-orange-400 font-bold' : 'text-stone-300'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-orange-500/20 flex items-center justify-between">
            <span className="text-xs font-mono text-stone-400">DESIGN FOR A BRIGHTER TOMORROW</span>
            <button
              onClick={() => handleNavClick('contact')}
              className="px-3 py-1.5 text-xs font-mono text-orange-400 border border-orange-500/50 rounded"
            >
              GET IN TOUCH →
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
