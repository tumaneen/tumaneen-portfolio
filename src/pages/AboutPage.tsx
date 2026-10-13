import React from 'react';
import { PageId } from '../types/portfolio';
import { DESIGNER_MANIFESTO, EDITORIAL_POSTER_IMAGE } from '../data/portfolioData';
import { ArrowRight, Cpu, Mail, ExternalLink, Sparkles, GraduationCap, Palette } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: PageId) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 sm:py-16 space-y-24">
      
      {/* Page Header */}
      <div className="border-b border-orange-500/15 pb-12 space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono tracking-[0.25em] text-orange-400 uppercase">
          <span>ABOUT ME</span>
          <span className="text-stone-600">/</span>
          <span>TUMANEEN</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-bold uppercase text-[#ea580c] leading-[0.95] text-glow-orange">
              FATIMAH GHANI<br />
              <span className="italic font-normal text-[#f97316]">BRAND IDENTITY & PACKAGING DESIGNER</span>
            </h1>
          </div>

          <div className="lg:col-span-4 text-xs font-mono text-stone-300 space-y-1.5 bg-[#120e0c] p-4 rounded border border-orange-500/20">
            <p className="text-orange-400 font-bold tracking-wider">INDEPENDENT BRAND & PACKAGING DESIGNER</p>
            <p className="text-stone-300">FINAL-YEAR BS COMPUTER SCIENCE</p>
            <p className="text-stone-400">SEEKING BRAND IDENTITY & GRAPHIC DESIGN ROLES</p>
          </div>
        </div>
      </div>

      {/* Main Narrative Split: Portrait/Poster & About Story */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Visual: Studio Archival Poster with warm celestial aesthetic */}
        <div className="lg:col-span-5 relative space-y-4">
          <div className="relative aspect-[3/4] rounded overflow-hidden border border-orange-500/30 bg-[#0d0a08] shadow-[0_0_50px_rgba(234,88,12,0.15)] group">
            <img
              src={EDITORIAL_POSTER_IMAGE}
              alt="Tumaneen — Fatimah Ghani Graphic Design Portfolio"
              className="w-full h-full object-cover filter contrast-125 brightness-90 group-hover:scale-105 transition-transform duration-700 ease-out"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0a08] via-transparent to-transparent opacity-80" />
            
            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-[10px] font-mono text-orange-400 uppercase tracking-widest block mb-1">
                TUMANEEN ARCHIVE
              </span>
              <p className="text-base font-display font-semibold text-white">
                "Systems thinking, typographic sensitivity, and tactile unboxing architecture."
              </p>
            </div>
          </div>

          {/* Direct Contact Card under Portrait */}
          <div className="p-4 sm:p-5 rounded bg-[#120e0c] border border-orange-500/25 space-y-2.5 font-mono text-xs">
            <div className="text-[10px] text-orange-400 uppercase tracking-widest font-bold">
              CONTACT
            </div>
            <a
              href="mailto:fatimahghani.2026@gmail.com"
              className="flex items-center justify-between gap-2 text-stone-200 hover:text-orange-400 transition-colors py-1 border-b border-orange-500/10"
            >
              <span className="truncate">Email: fatimahghani.2026@gmail.com</span>
              <Mail className="w-3.5 h-3.5 text-orange-400 shrink-0" />
            </a>
            <a
              href="https://linkedin.com/in/fatimahghani"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-2 text-stone-200 hover:text-orange-400 transition-colors py-1 border-b border-orange-500/10"
            >
              <span className="truncate">LinkedIn: linkedin.com/in/fatimahghani</span>
              <ExternalLink className="w-3.5 h-3.5 text-orange-400 shrink-0" />
            </a>
            <a
              href="https://behance.net/fatimahghani"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-2 text-stone-200 hover:text-orange-400 transition-colors py-1"
            >
              <span className="truncate">Behance: behance.net/fatimahghani</span>
              <ExternalLink className="w-3.5 h-3.5 text-orange-400 shrink-0" />
            </a>
          </div>
        </div>

        {/* Right Prose: Fatimah's Portfolio Story (No duplicate heading) */}
        <div className="lg:col-span-7 space-y-6 text-stone-300 font-sans text-base leading-relaxed">
          <p className="text-lg sm:text-xl text-orange-200 font-serif italic leading-relaxed">
            "{DESIGNER_MANIFESTO.bio}"
          </p>

          {DESIGNER_MANIFESTO.storyParagraphs.map((para, idx) => (
            <p key={idx} className="text-stone-300 leading-relaxed">
              {para}
            </p>
          ))}

          {/* 4 Key Pillars from Fatimah's Profile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded bg-[#14100d] border border-orange-500/20 space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-orange-400 uppercase">
                <GraduationCap className="w-4 h-4" />
                <span>EDUCATION</span>
              </div>
              <p className="text-sm font-display font-bold text-white">BS Computer Science (Final-Year)</p>
              <p className="text-xs text-stone-400">Harmonizing computational systems and structural discipline with visual design.</p>
            </div>

            <div className="p-4 rounded bg-[#14100d] border border-orange-500/20 space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-orange-400 uppercase">
                <Palette className="w-4 h-4" />
                <span>SPECIALIZATION</span>
              </div>
              <p className="text-sm font-display font-bold text-white">Brand Identity Systems & Packaging</p>
              <p className="text-xs text-stone-400">Architectural flacons, unboxing rituals, and bilingual typographic harmony.</p>
            </div>

            <div className="p-4 rounded bg-[#14100d] border border-orange-500/20 space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-orange-400 uppercase">
                <Sparkles className="w-4 h-4" />
                <span>STUDIO ATELIER</span>
              </div>
              <p className="text-sm font-display font-bold text-white">Independent Practice & Art Direction</p>
              <p className="text-xs text-stone-400">Comprehensive brand design for luxury fragrance, candle, and café brands.</p>
            </div>

            <div className="p-4 rounded bg-[#14100d] border border-orange-500/20 space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-orange-400 uppercase">
                <ArrowRight className="w-4 h-4" />
                <span>CAREER OBJECTIVE</span>
              </div>
              <p className="text-sm font-display font-bold text-white">Open to Full-Time & Studio Roles</p>
              <p className="text-xs text-stone-400">Eager to bring disciplined brand craft and fresh perspective to creative teams.</p>
            </div>
          </div>
        </div>

      </div>

      {/* Complete Categorized Skills Arsenal (Single Clean Heading per Card) */}
      <div className="space-y-10 border-t border-orange-500/15 pt-16">
        <div className="space-y-2">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white uppercase">
            SKILLS
          </h2>
          <p className="text-sm text-stone-400 font-sans max-w-2xl">
            Software proficiency, multidisciplinary design capabilities, and technical tools.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Category 1: Software */}
          <div className="p-8 rounded bg-[#110e0c] border border-orange-500/25 space-y-4">
            <h3 className="text-xl font-display font-bold text-orange-400 uppercase">01. Software</h3>
            <div className="flex flex-wrap gap-2">
              {[
                'Adobe Photoshop',
                'Adobe Illustrator',
                'Figma',
                'Canva',
                'Affinity Designer',
              ].map((item) => (
                <span
                  key={item}
                  className="px-3 py-1.5 rounded bg-[#181310] border border-orange-500/30 text-xs font-mono text-orange-200"
                >
                  ✦ {item}
                </span>
              ))}
            </div>
          </div>

          {/* Category 2: Design */}
          <div className="p-8 rounded bg-[#110e0c] border border-orange-500/25 space-y-4">
            <h3 className="text-xl font-display font-bold text-orange-400 uppercase">02. Design</h3>
            <div className="flex flex-wrap gap-2">
              {[
                'Logo Design',
                'Brand Identity Design',
                'Typography',
                'Color Theory',
                'Layout & Composition',
                'Print Design',
                'Packaging Design',
                'Social Media Graphics',
                'UI/UX Design',
                'Illustration',
                'Mockup Design',
                'Motion Graphics/Animation (After Effects)',
              ].map((item) => (
                <span
                  key={item}
                  className="px-2.5 py-1 rounded bg-[#181310] border border-orange-500/20 text-xs font-mono text-stone-200"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Category 3: Technical */}
          <div className="p-8 rounded bg-[#110e0c] border border-orange-500/25 space-y-4">
            <h3 className="text-xl font-display font-bold text-orange-400 uppercase">03. Technical</h3>
            <div className="flex flex-wrap gap-2">
              {[
                'HTML/CSS (basic)',
                'AI-assisted design tools (Midjourney, DALL·E, etc.)',
              ].map((item) => (
                <span
                  key={item}
                  className="px-3 py-1.5 rounded bg-[#181310] border border-orange-500/30 text-xs font-mono text-orange-200"
                >
                  ✦ {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4 Studio Tenets */}
      <div className="space-y-10 border-t border-orange-500/15 pt-16">
        <div className="space-y-2">
          <span className="text-xs font-mono text-orange-400 uppercase tracking-widest">CREATIVE PHILOSOPHY</span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
            FOUR PRINCIPLES OF MY DESIGN PRACTICE
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {DESIGNER_MANIFESTO.tenets.map((tenet, idx) => (
            <div
              key={idx}
              className="p-8 rounded bg-[#110e0c] border border-orange-500/20 hover:border-orange-500/50 transition-colors space-y-3"
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-orange-500 font-bold">0{idx + 1}.</span>
                <span className="text-stone-500">PHILOSOPHY</span>
              </div>
              <h3 className="text-xl font-display font-bold text-white">
                {tenet.title}
              </h3>
              <p className="text-sm text-stone-400 font-sans leading-relaxed">
                {tenet.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Next Step CTA */}
      <div className="text-center pt-8 space-y-4">
        <p className="text-xs font-mono uppercase tracking-widest text-stone-400">
          AVAILABLE FOR GRAPHIC DESIGNER ROLES & FREELANCE BRANDING PROJECTS
        </p>
        <button
          onClick={() => {
            onNavigate('contact');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full border border-orange-500 bg-orange-500/10 hover:bg-orange-500 text-orange-400 hover:text-black font-mono text-xs uppercase tracking-[0.2em] transition-all cursor-pointer shadow-[0_0_25px_rgba(234,88,12,0.3)]"
        >
          <span>CONNECT WITH FATIMAH GHANI</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};

