import React from 'react';
import { PageId } from '../types/portfolio';
import { ArrowRight, Sparkles } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageId) => void;
  grainIntensity: 'subtle' | 'medium' | 'heavy' | 'off';
  onCycleGrain: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, grainIntensity, onCycleGrain }) => {
  return (
    <footer className="relative bg-[#090706] text-[#e7d8cc] border-t border-orange-500/20 overflow-hidden pt-20 pb-12">
      
      {/* Background Celestial Crescent Horizon Glow (as in reference image) */}
      <div className="absolute right-0 bottom-0 w-[550px] h-[340px] pointer-events-none opacity-45 overflow-hidden">
        <div className="absolute -right-24 bottom-[-180px] w-[500px] h-[500px] rounded-full border-t border-r border-orange-500/60 shadow-[0_0_100px_rgba(234,88,12,0.4)] bg-gradient-to-tl from-transparent via-orange-950/40 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        
        {/* Main Call to Action Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end pb-16 border-b border-orange-500/15">
          
          {/* Big Editorial Headline */}
          <div className="lg:col-span-7">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold uppercase tracking-tight text-[#ea580c] leading-[1.05] text-glow-orange">
              LET’S CREATE<br />
              <span className="italic font-normal text-[#f97316]">SOMETHING MEANINGFUL</span>
            </h2>
          </div>

          {/* Subtitle & Pill Button */}
          <div className="lg:col-span-5 flex flex-col items-start lg:items-end justify-between gap-6">
            <p className="text-sm sm:text-base text-stone-400 font-sans leading-relaxed max-w-md lg:text-right">
              Have a project in mind or just want to say hello? I'm always open to new ideas, collaborations, and curious conversations.
            </p>

            <button
              onClick={() => {
                onNavigate('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full border border-orange-500/50 bg-[#16110e] text-orange-400 font-mono text-xs uppercase tracking-[0.2em] hover:bg-orange-500 hover:text-black hover:shadow-[0_0_30px_rgba(234,88,12,0.5)] transition-all cursor-pointer group"
            >
              <span>GET IN TOUCH</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Bottom Metadata & Links Bar matching reference */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6 text-[10px] sm:text-[11px] font-mono tracking-wider sm:tracking-widest text-stone-500 text-center md:text-left">
          
          {/* Copyright */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-3">
            <span className="text-stone-200 font-semibold tracking-[0.22em]">TUMANEEN</span>
            <span className="text-orange-500/60">·</span>
            <span className="text-stone-400">FATIMAH GHANI © 2026</span>
          </div>

          {/* Social & Contact Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
            <a
              href="https://behance.net/fatimahghani"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-orange-400 transition-colors uppercase"
            >
              BEHANCE
            </a>
            <a
              href="https://linkedin.com/in/fatimahghani"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-orange-400 transition-colors uppercase"
            >
              LINKEDIN
            </a>
            <a
              href="mailto:fatimahghani.2026@gmail.com"
              className="hover:text-orange-400 transition-colors uppercase break-all"
            >
              FATIMAHGHANI.2026@GMAIL.COM
            </a>
          </div>

          {/* Right Tagline & Grain Control */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-stone-400">
            <button
              onClick={onCycleGrain}
              title="Click to cycle grainy texture intensity"
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono border border-orange-500/20 hover:border-orange-500/50 text-stone-400 hover:text-orange-400 transition-colors cursor-pointer"
            >
              <Sparkles className="w-2.5 h-2.5 text-orange-500" />
              <span>GRAIN: {grainIntensity.toUpperCase()}</span>
            </button>

            <span className="hidden sm:inline text-stone-600">|</span>
            <span className="tracking-wider uppercase text-stone-400/80">A BRIGHTER TOMORROW ANYWAY</span>
          </div>

        </div>
      </div>
    </footer>
  );
};
