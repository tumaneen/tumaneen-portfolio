import React, { useEffect, useState, useRef } from 'react';

export const CosmicCursor: React.FC = () => {
  const [isFinePointer, setIsFinePointer] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isClicking, setIsClicking] = useState<boolean>(false);
  const [cursorText, setCursorText] = useState<string>('');

  const mousePos = useRef<{ x: number; y: number }>({ x: -100, y: -100 });
  const ringPos = useRef<{ x: number; y: number }>({ x: -100, y: -100 });
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    // Check if the user device has a mouse/fine pointer (never show on touchscreens)
    const mediaQuery = window.matchMedia('(pointer: fine)');
    setIsFinePointer(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsFinePointer(e.matches);
    };
    mediaQuery.addEventListener('change', handleMediaChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);

  useEffect(() => {
    if (!isFinePointer) return;

    // Enable custom cursor CSS class on body
    document.documentElement.classList.add('custom-cursor-enabled');

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      setIsVisible(true);

      // Instantaneous position for central star dot (zero latency)
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      // Check if hovering over interactive elements
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest('button, a, input, textarea, [role="button"], select, label, .cursor-pointer');
        const customCursorTarget = target.closest('[data-cursor]');
        
        if (customCursorTarget) {
          const text = customCursorTarget.getAttribute('data-cursor') || '';
          setCursorText(text);
          setIsHovered(true);
        } else if (interactive) {
          setCursorText('');
          setIsHovered(true);
        } else {
          setCursorText('');
          setIsHovered(false);
        }
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Smooth Lerp animation loop for the outer celestial orbit ring
    const render = () => {
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.22;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.22;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      rafId.current = requestAnimationFrame(render);
    };

    rafId.current = requestAnimationFrame(render);

    return () => {
      document.documentElement.classList.remove('custom-cursor-enabled');
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isFinePointer]);

  if (!isFinePointer) return null;

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-[99999] transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    >
      {/* 1. CENTRAL STAR SPARK / ASTROLABE PIN (0-latency precision point) */}
      <div
        ref={dotRef}
        className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-75"
        style={{ willChange: 'transform' }}
      >
        <div
          className={`rounded-full transition-all duration-200 ${
            isClicking
              ? 'w-1.5 h-1.5 bg-[#ea580c] scale-150 shadow-[0_0_12px_#ea580c]'
              : isHovered
              ? 'w-2 h-2 bg-[#fb923c] shadow-[0_0_15px_#fb923c]'
              : 'w-1.5 h-1.5 bg-[#f97316] shadow-[0_0_8px_#ea580c]'
          }`}
        />
      </div>

      {/* 2. OUTER CELESTIAL ORBIT & RETICLE (Smooth lerp trailing with satellite & astrolabe notches) */}
      <div
        ref={ringRef}
        className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ willChange: 'transform' }}
      >
        <div
          className={`relative flex items-center justify-center rounded-full transition-all duration-300 ease-out ${
            isClicking
              ? 'w-8 h-8 scale-90 border-2 border-orange-500 shadow-[0_0_20px_rgba(234,88,12,0.6)]'
              : isHovered
              ? 'w-12 h-12 border border-orange-400 bg-orange-500/10 shadow-[0_0_25px_rgba(251,146,60,0.35)]'
              : 'w-9 h-9 border border-orange-500/35 shadow-[0_0_10px_rgba(234,88,12,0.15)]'
          }`}
        >
          {/* Continuous rotating celestial satellite dot */}
          <div className="absolute inset-0 animate-[spin_6s_linear_infinite]">
            <span
              className={`absolute -top-1 left-1/2 -translate-x-1/2 rounded-full transition-colors duration-200 ${
                isHovered
                  ? 'w-1.5 h-1.5 bg-amber-300 shadow-[0_0_8px_#fde047]'
                  : 'w-1 h-1 bg-orange-400 shadow-[0_0_4px_#ea580c]'
              }`}
            />
          </div>

          {/* Astrolabe / Celestial Compass Crosshair Hairline Ticks (North, East, South, West) */}
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-0.5 h-1 bg-orange-500/50" />
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0.5 h-1 bg-orange-500/50" />
          <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-1 h-0.5 bg-orange-500/50" />
          <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-1 h-0.5 bg-orange-500/50" />

          {/* Optional Hover Action Label (e.g. "VIEW", "EXPLORE") */}
          {cursorText && (
            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] font-mono tracking-widest text-orange-300 uppercase whitespace-nowrap bg-[#120e0c]/90 px-1.5 py-0.5 rounded border border-orange-500/30">
              {cursorText}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
