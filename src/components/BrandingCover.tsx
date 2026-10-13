import React from 'react';
import { Project } from '../types/portfolio';

interface BrandingCoverProps {
  project: Project;
  className?: string;
  size?: 'card' | 'hero' | 'compact';
}

export const BrandingCover: React.FC<BrandingCoverProps> = ({
  project,
  className = '',
  size = 'card'
}) => {
  // Determine branding display title according to user instruction:
  // e.g. "CANDLE BRANDING", "COFFEE SHOP BRANDING", "FRAGRANCE BRANDING"
  const brandingName = (project.brandingType || project.category || 'BRAND IDENTITY').toUpperCase();

  // Project-specific accent colors and visual motifs
  const getThemeConfig = (id: string) => {
    switch (id) {
      case 'lumera':
        return {
          glowColor: 'rgba(245, 158, 11, 0.18)',
          accentBorder: 'rgba(245, 158, 11, 0.35)',
          tagColor: 'text-amber-400',
          arabicSubtitle: 'شمع معطر · إضاءة وذكرى',
          descriptor: 'Scented Candle Atelier · Vessel Architecture & Unboxing Ritual',
          patternType: 'sunburst',
          badgeText: 'CANDLE BRANDING'
        };
      case 'roast-and-rhythm':
        return {
          glowColor: 'rgba(199, 90, 46, 0.22)',
          accentBorder: 'rgba(199, 90, 46, 0.4)',
          tagColor: 'text-orange-400',
          arabicSubtitle: 'چائے، گفتگو اور سکون · A Modern Mehfil',
          descriptor: 'Café Identity · Expressive Packaging & Storefront Culture',
          patternType: 'rhythm',
          badgeText: 'COFFEE SHOP BRANDING'
        };
      case 'riwaq-fragrances':
      default:
        return {
          glowColor: 'rgba(120, 12, 24, 0.25)',
          accentBorder: 'rgba(180, 83, 9, 0.35)',
          tagColor: 'text-amber-300',
          arabicSubtitle: 'رواق · دار العطور المعمارية',
          descriptor: 'Architectural Fragrance House · Dual-Script Identity & Flacons',
          patternType: 'arch',
          badgeText: 'FRAGRANCE BRANDING'
        };
    }
  };

  const config = getThemeConfig(project.id);
  const primarySwatch = project.palette?.[0]?.hex || '#d97706';

  return (
    <div
      className={`relative w-full h-full overflow-hidden select-none flex flex-col justify-between p-6 sm:p-8 lg:p-10 transition-all duration-500 ${className}`}
      style={{
        backgroundColor: '#0a0807',
        backgroundImage: `
          radial-gradient(circle at 50% 45%, ${config.glowColor} 0%, transparent 70%),
          linear-gradient(to bottom, rgba(16,13,10,0.92), rgba(8,6,5,0.98))
        `
      }}
    >
      {/* Subtle Geometric Background Watermark */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.06] flex items-center justify-center overflow-hidden">
        {config.patternType === 'arch' && (
          <svg className="w-[120%] h-[120%] text-white" viewBox="0 0 200 200" fill="none" stroke="currentColor">
            <path d="M 40 180 V 80 A 60 60 0 0 1 160 80 V 180" strokeWidth="1" />
            <path d="M 60 180 V 90 A 40 40 0 0 1 140 90 V 180" strokeWidth="0.75" />
            <circle cx="100" cy="50" r="12" strokeWidth="0.75" />
          </svg>
        )}
        {config.patternType === 'sunburst' && (
          <svg className="w-[120%] h-[120%] text-amber-200" viewBox="0 0 200 200" fill="none" stroke="currentColor">
            <circle cx="100" cy="100" r="45" strokeWidth="1" />
            <circle cx="100" cy="100" r="65" strokeWidth="0.75" strokeDasharray="3 3" />
            {Array.from({ length: 16 }).map((_, i) => (
              <line
                key={i}
                x1="100"
                y1="15"
                x2="100"
                y2="35"
                strokeWidth="1"
                transform={`rotate(${i * 22.5} 100 100)`}
              />
            ))}
          </svg>
        )}
        {config.patternType === 'rhythm' && (
          <svg className="w-[120%] h-[120%] text-orange-300" viewBox="0 0 200 200" fill="none" stroke="currentColor">
            <circle cx="100" cy="100" r="30" strokeWidth="1" />
            <circle cx="100" cy="100" r="55" strokeWidth="0.75" />
            <circle cx="100" cy="100" r="80" strokeWidth="0.5" strokeDasharray="4 4" />
          </svg>
        )}
      </div>

      {/* Architectural Corner Crosshairs & Frame Border */}
      <div className="absolute inset-3 sm:inset-4 border border-orange-500/20 rounded pointer-events-none transition-colors duration-300 group-hover:border-orange-500/40" />
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 w-2 h-2 border-t-2 border-l-2 border-orange-500/60 pointer-events-none" />
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-2 h-2 border-t-2 border-r-2 border-orange-500/60 pointer-events-none" />
      <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 w-2 h-2 border-b-2 border-l-2 border-orange-500/60 pointer-events-none" />
      <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 w-2 h-2 border-b-2 border-r-2 border-orange-500/60 pointer-events-none" />

      {/* Top Header Row */}
      <div className="relative z-10 flex items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#16120e]/90 border border-orange-500/30 backdrop-blur-sm">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: primarySwatch }}
          />
          <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.2em] text-orange-300 font-semibold uppercase">
            {config.badgeText}
          </span>
        </div>

        <div className="text-[10px] sm:text-[11px] font-mono tracking-widest text-stone-400 uppercase">
          NO. {project.number} · {project.year}
        </div>
      </div>

      {/* Centerpiece: The Branding Name according to theme */}
      <div className="relative z-10 my-auto py-6 sm:py-8 text-center space-y-3 sm:space-y-4">
        {/* Subtle Dual-Script / Architectural Tag */}
        {config.arabicSubtitle && (
          <div className="text-xs sm:text-sm font-sans tracking-widest text-stone-400 opacity-80">
            {config.arabicSubtitle}
          </div>
        )}

        {/* Primary Branding Name Title (e.g. CANDLE BRANDING / COFFEE SHOP BRANDING / FRAGRANCE BRANDING) */}
        <div className="relative inline-block">
          <h2
            className={`font-display font-extrabold uppercase tracking-[0.08em] sm:tracking-[0.12em] text-white leading-tight ${
              size === 'hero'
                ? 'text-3xl sm:text-5xl lg:text-6xl'
                : 'text-2xl sm:text-3xl lg:text-4xl'
            } group-hover:text-orange-300 transition-colors duration-300`}
          >
            {brandingName}
          </h2>
          <div className="h-0.5 w-16 sm:w-24 mx-auto mt-2.5 sm:mt-3 bg-gradient-to-r from-transparent via-orange-500/70 to-transparent" />
        </div>

        {/* Client & Project Subtitle */}
        <div className="space-y-1">
          <p className="text-xs sm:text-sm font-display uppercase tracking-wider text-stone-300 font-medium">
            {project.title}
          </p>
          <p className="text-[11px] sm:text-xs font-mono text-stone-400 uppercase tracking-widest max-w-md mx-auto line-clamp-1">
            {config.descriptor}
          </p>
        </div>
      </div>

      {/* Bottom Footer Row with Palette & Spec Pills */}
      <div className="relative z-10 pt-4 border-t border-orange-500/15 flex flex-wrap items-center justify-between gap-3 text-[10px] font-mono text-stone-400">
        <div className="flex items-center gap-1.5">
          <span className="text-stone-400 uppercase tracking-wider text-[9px] mr-1 hidden sm:inline">PALETTE:</span>
          {project.palette?.slice(0, 5).map((color) => (
            <span
              key={color.hex}
              className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border border-white/20"
              style={{ backgroundColor: color.hex }}
              title={`${color.name} (${color.hex})`}
            />
          ))}
        </div>

        <div className="inline-flex items-center gap-1.5 uppercase tracking-wider text-orange-400/90 group-hover:text-white transition-colors">
          <span>CURATED CASE STUDY</span>
          <span aria-hidden="true">→</span>
        </div>
      </div>
    </div>
  );
};
