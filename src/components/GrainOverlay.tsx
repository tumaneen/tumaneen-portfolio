import React from 'react';

interface GrainOverlayProps {
  intensity: 'subtle' | 'medium' | 'heavy' | 'off';
  onCycleIntensity?: () => void;
}

export const GrainOverlay: React.FC<GrainOverlayProps> = ({ intensity, onCycleIntensity }) => {
  if (intensity === 'off') return null;

  const opacityClass =
    intensity === 'subtle'
      ? 'opacity-[0.035]'
      : intensity === 'heavy'
      ? 'opacity-[0.09]'
      : 'opacity-[0.06]';

  return (
    <>
      {/* SVG Turbulence filter */}
      <svg className="hidden" aria-hidden="true">
        <filter id="retro-film-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>

      <div
        className={`fixed inset-0 pointer-events-none z-50 ${opacityClass} mix-blend-overlay`}
        style={{
          filter: 'url(#retro-film-grain)',
          transform: 'translateZ(0)',
          willChange: 'transform'
        }}
        aria-hidden="true"
      />
    </>
  );
};
