import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PageId, Project } from '../types/portfolio';
import { InteractiveOrbit } from '../components/InteractiveOrbit';
import { BrandingCover } from '../components/BrandingCover';
import { ArrowRight, ArrowDown, Sparkles } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: PageId) => void;
  onOpenProject: (project: Project) => void;
  featuredProjects: Project[];
}

interface AstraBackgroundStarDot {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  homeXNorm: number;
  homeYNorm: number;
  size: number;
  color: string;
  speed: number;
  swirl: number;
  flowPhase: number;
  flowFreq: number;
  alpha: number;
  twinklePhase: number;
  echoDots: { x: number; y: number }[];
}

interface TextAppearMetric {
  opacity: number;
  translateY: number;
  scale: number;
}

const SURROUNDING_STAR_DOT_COLORS = [
  '#ffffff',
  '#fffbeb',
  '#fef08a',
  '#fde047',
  '#facc15',
  '#fb923c',
  '#f97316',
  '#ea580c',
];

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenProject,
  featuredProjects,
}) => {
  const [scrollY, setScrollY] = useState(0);
  const [formationPulse, setFormationPulse] = useState(0);

  // Section & Shape slot refs
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const heroSlotRef = useRef<HTMLDivElement | null>(null);
  const aboutSlotRef = useRef<HTMLDivElement | null>(null);
  const servicesSlotRef = useRef<HTMLDivElement | null>(null);
  const orbitRebirthSlotRef = useRef<HTMLDivElement | null>(null);
  const projectsSlotRef = useRef<HTMLDivElement | null>(null);
  const atomSlotRef = useRef<HTMLDivElement | null>(null);

  // Refs for scroll-driven text appearance (appears as we scroll down & never fades away)
  const heroTextRef = useRef<HTMLDivElement | null>(null);
  const aboutTextRef = useRef<HTMLDivElement | null>(null);
  const servicesTextRef = useRef<HTMLDivElement | null>(null);
  const rebirthTextRef = useRef<HTMLDivElement | null>(null);
  const projectsTextRef = useRef<HTMLDivElement | null>(null);
  const atomTextRef = useRef<HTMLDivElement | null>(null);

  const maxRevealRef = useRef({
    hero: 1,
    about: 0,
    services: 0,
    rebirth: 0,
    projects: 0,
    atom: 0,
  });

  const persistentBgCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastScrollYRef = useRef(0);
  const scrollVelocityRef = useRef(0);
  const scrollRafRef = useRef<number | null>(null);

  // Main Page Special Theme Morph Progress (0 -> 1 while scrolling the first half of the Main Page):
  // - 0.0: Celestial Compass Rose & Solar Eclipse Astrolabe in Orbit
  // - 1.0: Graphic Designer's Fountain-Pen Nib & Drafting Compass in Orbit
  const [heroMorphProgress, setHeroMorphProgress] = useState(0);

  // Unified "Before-Project" style Appearance (`sectionForms`: 0 = circular star motion -> 1 = locked shape)
  // applied to ALL shapes!
  const [sectionForms, setSectionForms] = useState({
    hero: 1,
    about: 0,
    services: 0,
    rebirth: 0,
    atom: 0,
  });

  // Unified "Before-Project" style Disappearance (`sectionSpreads`: 0 = locked shape -> 1 = swirling spread-away)
  // applied to ALL shapes!
  const [sectionSpreads, setSectionSpreads] = useState({
    hero: 0,
    about: 0,
    services: 0,
    rebirth: 0,
    atom: 0,
  });

  const [activeBgFocus, setActiveBgFocus] = useState<{
    viewportX: number;
    viewportY: number;
    littleSpread: number;
    isCircularVortex: boolean;
    stage: 1 | 2 | 3 | 4 | 5 | 6;
  }>({
    viewportX: typeof window !== 'undefined' ? window.innerWidth / 2 : 600,
    viewportY: typeof window !== 'undefined' ? window.innerHeight / 2 : 400,
    littleSpread: 0,
    isCircularVortex: false,
    stage: 1,
  });

  const activeBgFocusRef = useRef(activeBgFocus);
  useEffect(() => {
    activeBgFocusRef.current = activeBgFocus;
  }, [activeBgFocus]);

  const [textTransitions, setTextTransitions] = useState<{
    hero: TextAppearMetric;
    about: TextAppearMetric;
    services: TextAppearMetric;
    rebirth: TextAppearMetric;
    projects: TextAppearMetric;
    atom: TextAppearMetric;
  }>({
    hero: { opacity: 1, translateY: 0, scale: 1 },
    about: { opacity: 0, translateY: 44, scale: 0.98 },
    services: { opacity: 0, translateY: 44, scale: 0.98 },
    rebirth: { opacity: 0, translateY: 44, scale: 0.98 },
    projects: { opacity: 0, translateY: 44, scale: 0.98 },
    atom: { opacity: 0, translateY: 44, scale: 0.98 },
  });

  const computeAppearMetric = (
    el: HTMLElement | null,
    key: keyof typeof maxRevealRef.current
  ): TextAppearMetric => {
    if (key === 'hero' || !el || typeof window === 'undefined') {
      return { opacity: 1, translateY: 0, scale: 1 };
    }
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || 800;

    const rawProgress = (vh * 0.94 - rect.top) / (vh * 0.34);
    const clampedProgress = Math.min(1, Math.max(0, rawProgress));
    const smoothProgress =
      clampedProgress * clampedProgress * (3 - 2 * clampedProgress);

    const finalReveal = Math.max(maxRevealRef.current[key], smoothProgress);
    maxRevealRef.current[key] = finalReveal;

    return {
      opacity: finalReveal,
      translateY: (1 - finalReveal) * 44,
      scale: 0.98 + finalReveal * 0.02,
    };
  };

  /**
   * Unified "Before-Project" Appearance Choreography (`0 -> 1`):
   * As any section scrolls into view from below, its stars start in concentric circular motion (`0`)
   * and smoothly condense/lock into the refined shape (`1`) as it reaches the viewport!
   */
  const computeBeforeProjectStyleAppearance = (
    el: HTMLElement | null,
    isHero = false
  ): number => {
    if (isHero) return 1;
    if (typeof window === 'undefined' || !el) return 0;
    const vh = window.innerHeight || 800;
    const r = el.getBoundingClientRect();
    const slotCenter = r.top + r.height / 2;

    const raw = (vh * 0.92 - slotCenter) / (vh * 0.34);
    const clamped = Math.min(1, Math.max(0, raw));
    return clamped * clamped * (3 - 2 * clamped);
  };

  /**
   * Unified "Before-Project" Disappearance Choreography (`0 -> 1`):
   * - On Main Page (`isHero = true`): stays locked (`0`) while scrolling the first half of the page
   *   and morphing into the Fountain-Pen Nib emblem; once half the page is left (`rect.bottom <= vh * 0.52`),
   *   it smoothly swirls and spreads away (`0 -> 1`)!
   * - On all other sections: stays locked (`0`) while centered, and smoothly swirls & spreads away (`0 -> 1`)
   *   as you scroll down past `vh * 0.42` — identical to the Before-Project shape!
   */
  const computeBeforeProjectStyleDisappearance = (
    el: HTMLElement | null,
    isHero = false
  ): number => {
    if (typeof window === 'undefined' || !el) return 0;
    const vh = window.innerHeight || 800;
    const rect = el.getBoundingClientRect();

    if (isHero) {
      const halfPageThreshold = vh * 0.52;
      if (rect.bottom > halfPageThreshold) {
        return 0;
      }
      const raw = (halfPageThreshold - rect.bottom) / (vh * 0.42);
      const clamped = Math.min(1, Math.max(0, raw));
      return clamped * clamped * (3 - 2 * clamped);
    }

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
    const slotCenter = rect.top + rect.height / 2;
    const threshold = isMobile ? vh * 0.28 : vh * 0.42;
    if (slotCenter < threshold) {
      const raw = (threshold - slotCenter) / threshold;
      const clamped = Math.min(1, Math.max(0, raw));
      return clamped * clamped * (3 - 2 * clamped);
    }

    return 0;
  };

  const updateScrollChoreography = useCallback(() => {
    const sy = window.scrollY;
    const dy = sy - lastScrollYRef.current;
    lastScrollYRef.current = sy;
    scrollVelocityRef.current = Math.max(-22, Math.min(22, dy));
    setScrollY(sy);

    const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1200;

    // 1. Update scroll-driven text appearance
    setTextTransitions({
      hero: computeAppearMetric(heroTextRef.current, 'hero'),
      about: computeAppearMetric(aboutTextRef.current, 'about'),
      services: computeAppearMetric(servicesTextRef.current, 'services'),
      rebirth: computeAppearMetric(rebirthTextRef.current, 'rebirth'),
      projects: computeAppearMetric(projectsTextRef.current, 'projects'),
      atom: computeAppearMetric(atomTextRef.current, 'atom'),
    });

    // 2. Main Page Theme Emblem Morphing during the first half of the Main Page:
    // Smoothly morphs from 0.0 (Celestial Compass & Eclipse Astrolabe) -> 1.0 (Atelier Fountain-Pen Nib in Orbit)
    if (heroSectionRef.current) {
      const heroRect = heroSectionRef.current.getBoundingClientRect();
      const totalMorphScrollDistance = Math.max(220, heroRect.height - vh * 0.52);
      const scrolledInHero = Math.max(0, sy);
      const morphRaw = Math.min(1, scrolledInHero / totalMorphScrollDistance);
      setHeroMorphProgress(morphRaw);
    }

    // 3. Unified "Before-Project" Appearance (circular motion -> locked shape) for ALL sections
    const aboutForm = computeBeforeProjectStyleAppearance(aboutSlotRef.current);
    const servicesForm = computeBeforeProjectStyleAppearance(servicesSlotRef.current);
    const rebirthForm = computeBeforeProjectStyleAppearance(orbitRebirthSlotRef.current);
    const atomForm = computeBeforeProjectStyleAppearance(atomSlotRef.current);

    setSectionForms({
      hero: 1,
      about: aboutForm,
      services: servicesForm,
      rebirth: rebirthForm,
      atom: atomForm,
    });

    // 4. Unified "Before-Project" Disappearance (swirling spread-away) for ALL sections
    const heroSpread = computeBeforeProjectStyleDisappearance(heroSectionRef.current, true);
    const aboutSpread = computeBeforeProjectStyleDisappearance(aboutSlotRef.current);
    const servicesSpread = computeBeforeProjectStyleDisappearance(servicesSlotRef.current);
    const rebirthSpread = computeBeforeProjectStyleDisappearance(orbitRebirthSlotRef.current);
    const atomSpread = computeBeforeProjectStyleDisappearance(atomSlotRef.current);

    setSectionSpreads({
      hero: heroSpread,
      about: aboutSpread,
      services: servicesSpread,
      rebirth: rebirthSpread,
      atom: atomSpread,
    });

    // 5. Determine which section is active on the current page for the unchanging Astra background stars
    const viewMidY = vh * 0.5;

    const slots: {
      stage: 1 | 2 | 3 | 4 | 5 | 6;
      el: HTMLElement | null;
      spread: number;
      isVortex: boolean;
    }[] = [
      { stage: 1, el: heroSlotRef.current, spread: heroSpread, isVortex: false },
      { stage: 2, el: aboutSlotRef.current, spread: aboutSpread, isVortex: true },
      { stage: 3, el: servicesSlotRef.current, spread: servicesSpread, isVortex: true },
      { stage: 4, el: orbitRebirthSlotRef.current, spread: rebirthSpread, isVortex: true },
      { stage: 5, el: projectsSlotRef.current, spread: 0.65, isVortex: false },
      { stage: 6, el: atomSlotRef.current, spread: atomSpread, isVortex: true },
    ];

    let closestStage: 1 | 2 | 3 | 4 | 5 | 6 = 1;
    let minDistance = Infinity;
    let focusX = vw / 2;
    let focusY = vh / 2;
    let focusSpread = 0;
    let focusVortex = false;

    for (const s of slots) {
      if (!s.el) continue;
      const r = s.el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dist = Math.abs(cy - viewMidY);
      if (dist < minDistance) {
        minDistance = dist;
        closestStage = s.stage;
        focusX = Math.min(vw - 100, Math.max(100, cx));
        focusY = Math.min(vh - 100, Math.max(100, cy));
        focusSpread = s.spread;
        focusVortex = s.isVortex;
      }
    }

    setActiveBgFocus({
      viewportX: focusX,
      viewportY: focusY,
      littleSpread: focusSpread,
      isCircularVortex: focusVortex,
      stage: closestStage,
    });
  }, []);

  useEffect(() => {
    updateScrollChoreography();
    const onScrollOrResize = () => {
      if (scrollRafRef.current !== null) return;
      scrollRafRef.current = requestAnimationFrame(() => {
        scrollRafRef.current = null;
        updateScrollChoreography();
      });
    };
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);
    const initTimer = setTimeout(updateScrollChoreography, 120);
    return () => {
      clearTimeout(initTimer);
      if (scrollRafRef.current !== null) {
        cancelAnimationFrame(scrollRafRef.current);
      }
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [updateScrollChoreography]);

  // Persistent Unchanging Full-Screen Astra-Style 3D Cosmic Starfield (`fixed inset-0`)
  // Calm, normal velocity across the entire page
  useEffect(() => {
    const canvas = persistentBgCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const spawnAstraStarDot = (randomInterior = false): AstraBackgroundStarDot => {
      const x = randomInterior
        ? Math.random() * width
        : Math.random() < 0.5
        ? Math.random() < 0.5
          ? Math.random() * 120
          : width - Math.random() * 120
        : Math.random() * width;
      const y = randomInterior
        ? Math.random() * height
        : Math.random() < 0.5
        ? Math.random() * 120
        : height - Math.random() * 120;
      const z = 0.25 + Math.random() * 1.1;

      return {
        x,
        y,
        z,
        vx: 0,
        vy: 0,
        homeXNorm: Math.random(),
        homeYNorm: Math.random(),
        size: (0.65 + Math.random() * 1.3) * (0.6 + z * 0.45),
        color:
          SURROUNDING_STAR_DOT_COLORS[
            Math.floor(Math.random() * SURROUNDING_STAR_DOT_COLORS.length)
          ],
        // Normal, calm cosmic drift speed
        speed: (0.42 + Math.random() * 0.58) * z,
        swirl: 0.24 + Math.random() * 0.32,
        flowPhase: Math.random() * Math.PI * 2,
        flowFreq: 0.38 + Math.random() * 0.48,
        alpha: (0.28 + Math.random() * 0.56) * Math.min(1, 0.45 + z * 0.55),
        twinklePhase: Math.random() * Math.PI * 2,
        echoDots: [],
      };
    };

    const starDots: AstraBackgroundStarDot[] = Array.from({ length: 340 }, () =>
      spawnAstraStarDot(true)
    );

    let tick = 0;
    let lastFrameTime = performance.now();
    let smoothedScrollVel = 0;

    const render = (now: number) => {
      animId = requestAnimationFrame(render);
      const rawDt = (now - lastFrameTime) / 16.6667;
      lastFrameTime = now;
      const dt = Math.min(2.0, Math.max(0.4, rawDt));

      tick += 0.0065 * dt;
      smoothedScrollVel += (scrollVelocityRef.current - smoothedScrollVel) * (0.06 * dt);
      scrollVelocityRef.current *= 0.88;

      ctx.clearRect(0, 0, width, height);

      const focus = activeBgFocusRef.current;
      const targetX = focus.viewportX || width / 2;
      const targetY = focus.viewportY || height / 2;
      const spreadAway = focus.littleSpread;

      for (let i = 0; i < starDots.length; i++) {
        const s = starDots[i];

        const dx = targetX - s.x;
        const dy = targetY - s.y;
        const dist = Math.hypot(dx, dy) || 1;
        const nx = dx / dist;
        const ny = dy / dist;

        const curlAngle =
          Math.sin(s.x * 0.0025 + tick * s.flowFreq + s.flowPhase) +
          Math.cos(s.y * 0.0025 - tick * s.flowFreq);
        const curlVx = Math.cos(curlAngle) * 0.25 * s.z;
        const curlVy = Math.sin(curlAngle) * 0.25 * s.z;

        const swirlFactor = focus.isCircularVortex ? s.swirl * 1.35 : s.swirl;
        const radialDir = 1 - spreadAway * 1.45;

        const vx = ((nx * radialDir - ny * swirlFactor) * s.speed + curlVx) * dt;
        const vy =
          ((ny * radialDir + nx * swirlFactor) * s.speed +
            curlVy -
            smoothedScrollVel * s.z * 0.12) *
          dt;

        s.x += vx;
        s.y += vy;

        if (s.y < -50) s.y = height + 40;
        if (s.y > height + 50) s.y = -40;
        if (s.x < -50) s.x = width + 40;
        if (s.x > width + 50) s.x = -40;

        if (dist < 72 && spreadAway < 0.3) {
          const replacement = spawnAstraStarDot(false);
          replacement.homeXNorm = s.homeXNorm;
          replacement.homeYNorm = s.homeYNorm;
          starDots[i] = replacement;
          continue;
        }

        const twinkle = 0.85 + 0.2 * Math.sin(tick * 2.0 + s.twinklePhase);
        const r = Math.max(0.58, s.size * twinkle);

        ctx.beginPath();
        ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = s.alpha;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [formationPulse]);

  const heroRotation = Math.min(360, scrollY * 1.1);
  const heroSpinDegrees = Math.min(360, Math.round(heroRotation));
  const is360Complete = heroSpinDegrees >= 360;

  // Hold the Main Page shape smoothly in view while scrolling the first half of the Main Page
  const isCompactViewport = typeof window !== 'undefined' && window.innerWidth < 640;
  const heroHoldTranslateY =
    typeof window !== 'undefined'
      ? Math.min(
          scrollY * (isCompactViewport ? 0.16 : 0.42),
          window.innerHeight * (isCompactViewport ? 0.07 : 0.22)
        ) *
        (1 - sectionSpreads.hero * 0.6)
      : 0;

  const getAppearStyle = (metric: TextAppearMetric): React.CSSProperties => ({
    opacity: metric.opacity,
    transform: `translate3d(0, ${metric.translateY.toFixed(1)}px, 0) scale(${metric.scale.toFixed(3)})`,
    transition: 'opacity 0.18s ease-out, transform 0.18s ease-out',
    willChange: 'opacity, transform',
  });

  const heroStageName =
    heroMorphProgress < 0.5
      ? 'CELESTIAL COMPASS & NIB'
      : 'ATELIER EMBLEM IN ROTATION';

  const activeShapeLabel =
    activeBgFocus.stage === 1
      ? 'PROLOGUE · TUMANEEN ATELIER'
      : activeBgFocus.stage === 2
      ? '01. BIOGRAPHY & PHILOSOPHY'
      : activeBgFocus.stage === 3
      ? '02. SERVICES & CAPABILITIES'
      : activeBgFocus.stage === 4
      ? '03. SYSTEMIC ARCHITECTURE'
      : activeBgFocus.stage === 5
      ? '04. SELECTED COMMISSIONS'
      : '05. ATOMIC CRAFT & CONTACT';

  return (
    <div className="relative overflow-x-clip">
      
      {/* 1. UNIFORM ASTRA-STYLE 3D BACKGROUND STARS PAGE (`fixed inset-0`) */}
      <canvas
        ref={persistentBgCanvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-95"
        aria-hidden="true"
      />

      {/* Live Unchanging Background Stars Status Pill */}
      <div className="fixed bottom-4 left-4 z-40 pointer-events-none hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0b0908]/85 border border-orange-500/30 backdrop-blur-md text-[10px] font-mono tracking-widest text-orange-400 shadow-[0_0_20px_rgba(234,88,12,0.18)]">
        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
        <span>{activeShapeLabel}</span>
      </div>

      {/* 2. FULL-PAGE SCROLL CHAPTERS WITH UNIFIED "BEFORE-PROJECT" APPEARANCE & DISAPPEARANCE */}
      <div className="relative space-y-12 sm:space-y-20 lg:space-y-24">
        
        {/* ========================================================
            STAGE 1: HERO COVER PAGE
            - Special Theme Emblem: Celestial Compass & Solar Eclipse Astrolabe
              morphing into the Graphic Designer's Fountain-Pen Nib in Planetary Orbit!
            - Disappears with the Before-Project swirling spread once half the page is left!
            ======================================================== */}
        <section
          ref={heroSectionRef}
          className="relative min-h-[calc(100svh-4rem)] sm:min-h-[104vh] lg:min-h-[112vh] flex flex-col justify-between py-4 sm:py-8"
        >
          <div
            ref={heroTextRef}
            style={getAppearStyle(textTransitions.hero)}
            className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 text-center flex-1 flex flex-col items-center justify-between gap-4 sm:gap-3 z-10 relative"
          >
            {/* Top Header Group */}
            <div className="space-y-2.5 w-full">
              <div className="inline-flex items-center justify-center gap-2 text-[10px] sm:text-xs font-mono tracking-[0.12em] sm:tracking-[0.28em] text-stone-200 uppercase bg-[#140f0c]/85 px-3 sm:px-4 py-1.5 rounded-full border border-orange-500/25 backdrop-blur-sm max-w-full">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping shrink-0" />
                <span className="truncate">FATIMAH GHANI · GRAPHIC DESIGNER & CS STUDENT</span>
              </div>

              <div className="space-y-1">
                <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold uppercase tracking-tight text-[#ea580c] leading-[0.92] text-glow-orange">
                  IDEAS IN ORBIT
                </h1>
                <p className="text-[10px] sm:text-xs md:text-sm font-mono tracking-[0.2em] sm:tracking-[0.35em] text-orange-400/90 uppercase pt-1">
                  TUMANEEN CREATIVE ATELIER
                </p>
              </div>

              <p className="text-xs sm:text-sm md:text-base text-stone-300 font-sans leading-relaxed max-w-2xl mx-auto px-1">
                Freelance branding & logo designer crafting timeless brand identities, expressive typography, packaging, and visual systems—pursuing a dedicated role as a Graphic Designer.
              </p>

              {/* Quick Direct Portfolio Contact Bar */}
              <div className="pt-1 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] font-mono text-stone-300">
                <a
                  href="mailto:fatimahghani.2026@gmail.com"
                  className="px-2.5 sm:px-3 py-1 rounded-full bg-[#140f0c]/90 border border-orange-500/25 hover:border-orange-500/60 hover:text-orange-400 transition-colors max-w-full truncate"
                >
                  ✉ fatimahghani.2026@gmail.com
                </a>
                <a
                  href="https://linkedin.com/in/fatimahghani"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 sm:px-3 py-1 rounded-full bg-[#140f0c]/90 border border-orange-500/25 hover:border-orange-500/60 hover:text-orange-400 transition-colors max-w-full truncate"
                >
                  in linkedin.com/in/fatimahghani
                </a>
                <a
                  href="https://behance.net/fatimahghani"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 sm:px-3 py-1 rounded-full bg-[#140f0c]/90 border border-orange-500/25 hover:border-orange-500/60 hover:text-orange-400 transition-colors max-w-full truncate"
                >
                  Bē behance.net/fatimahghani
                </a>
              </div>
            </div>

            {/* Stage 1 Main Page Special Theme Emblem */}
            <div
              style={{
                transform: `translate3d(0, ${heroHoldTranslateY.toFixed(1)}px, 0)`,
                willChange: 'transform',
              }}
              className="my-auto py-2 sm:py-1 flex flex-col items-center justify-center w-full"
            >
              <div
                ref={heroSlotRef}
                className="w-full max-w-[260px] sm:max-w-[440px] md:max-w-[540px] lg:max-w-[640px] xl:max-w-[700px] flex items-center justify-center"
              >
                <InteractiveOrbit
                  shapeMode="sun"
                  size="hero-xl"
                  scrollRotation={heroRotation}
                  heroMorphProgress={heroMorphProgress}
                  orbitRebirthProgress={sectionForms.hero}
                  spreadAmount={sectionSpreads.hero}
                  isCentered={true}
                  formationTrigger={formationPulse}
                />
              </div>

              {/* Live Main Page Theme Emblem HUD */}
              <div className="mt-2 sm:mt-1 flex flex-wrap items-center justify-center gap-2 sm:gap-3 z-30 px-2">
                <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#120e0c]/90 border border-orange-500/35 text-[10px] sm:text-[11px] font-mono tracking-wider sm:tracking-widest text-orange-400 shadow-[0_0_20px_rgba(234,88,12,0.25)] max-w-full">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shrink-0" />
                  <span className="truncate">
                    {sectionSpreads.hero > 0.05
                      ? 'DYNAMIC INTERACTION · VISUAL HARMONY'
                      : `${heroStageName} · ${heroSpinDegrees}°`}
                  </span>
                  {is360Complete && <span className="text-amber-300 shrink-0">✓</span>}
                </div>

                <button
                  onClick={() => setFormationPulse((p) => p + 1)}
                  className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-orange-500/15 hover:bg-orange-500/30 border border-orange-500/40 text-[10px] sm:text-[11px] font-mono tracking-wider text-amber-300 uppercase transition-all cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 shrink-0" />
                  <span>RE-FORM ATELIER EMBLEM</span>
                </button>
              </div>
            </div>

            {/* Bottom Scroll Down Guide */}
            <div className="pt-3 sm:pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 z-30 relative w-full sm:w-auto">
              <button
                onClick={() => {
                  const el = document.getElementById('about-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center gap-2.5 sm:gap-3 px-5 sm:px-7 py-2.5 rounded-full border border-orange-500/50 bg-[#16110e] text-orange-400 hover:bg-orange-500 hover:text-black font-mono text-[11px] sm:text-xs uppercase tracking-[0.14em] sm:tracking-[0.2em] transition-all shadow-[0_0_25px_rgba(234,88,12,0.3)] cursor-pointer group w-full sm:w-auto"
              >
                <span>EXPLORE DESIGN ETHOS & WORK</span>
                <ArrowDown className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-1 shrink-0" />
              </button>

              <button
                onClick={() => onNavigate('contact')}
                className="text-xs font-mono text-stone-400 hover:text-white uppercase tracking-wider transition-colors cursor-pointer py-1"
              >
                START A COLLABORATION →
              </button>
            </div>
          </div>
        </section>


        {/* ========================================================
            STAGE 2: ABOUT ME & SKILLS SECTION
            - Uses the exact same Before-Project circular-motion appearance (`orbitRebirthProgress`)
              and swirling disappearance (`spreadAmount`)!
            ======================================================== */}
        <section
          id="about-section"
          className="relative min-h-0 lg:min-h-[88vh] flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-24 scroll-mt-16 space-y-12 sm:space-y-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-16 items-center w-full">
            
            {/* Left Column: About Fatimah Ghani Text */}
            <div
              ref={aboutTextRef}
              style={getAppearStyle(textTransitions.about)}
              className="lg:col-span-6 space-y-5 sm:space-y-6 text-left z-30 relative"
            >
              <div className="inline-flex items-center gap-2 text-xs font-mono tracking-[0.2em] sm:tracking-[0.25em] text-orange-400 uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                <span>01. ABOUT ME</span>
              </div>

              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold uppercase text-[#ea580c] leading-tight text-glow-orange">
                FATIMAH GHANI
              </h2>

              <p className="text-sm sm:text-base text-stone-200 font-sans leading-relaxed max-w-xl">
                I am a brand identity and packaging designer blending the analytical precision of <span className="text-white font-medium">Computer Science</span> with an uncompromising dedication to visual craft. Through my independent studio practice, I design bespoke brand marks, tactile packaging architecture, editorial layouts, and motion graphics—actively <span className="text-orange-400 font-medium">pursuing dedicated Graphic Designer and Brand Identity roles</span>.
              </p>

              <div className="space-y-2.5 pt-1 font-mono text-xs text-stone-300">
                <div className="flex items-start sm:items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0 mt-1.5 sm:mt-0" />
                  <span>Academic Foundation · Final-Year BS Computer Science</span>
                </div>
                <div className="flex items-start sm:items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0 mt-1.5 sm:mt-0" />
                  <span>Specialization · Brand Identity Systems, Packaging & Typography</span>
                </div>
                <div className="flex items-start sm:items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0 mt-1.5 sm:mt-0" />
                  <span>Studio Practice · Independent Branding & Packaging Designer</span>
                </div>
                <div className="flex items-start sm:items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0 mt-1.5 sm:mt-0" />
                  <span>Career Objective · Seeking Dedicated Graphic Designer & Studio Roles</span>
                </div>
                <div className="flex items-start sm:items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0 mt-1.5 sm:mt-0" />
                  <span className="text-orange-300">Tumaneen Atelier · Comprehensive Creative Direction & Visual Systems</span>
                </div>
              </div>

              <div className="pt-3 flex flex-wrap items-center gap-4 sm:gap-6">
                <button
                  onClick={() => onNavigate('about')}
                  className="inline-flex items-center gap-2 text-xs font-mono text-orange-400 hover:text-white uppercase tracking-wider transition-colors cursor-pointer group"
                >
                  <span className="border-b border-orange-500/40 pb-0.5 group-hover:border-orange-400">
                    READ FULL PROFILE
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('services-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-stone-400 hover:text-stone-200 uppercase tracking-wider cursor-pointer"
                >
                  <span>NEXT: SERVICES</span>
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Column: Refined Signature Emblem with Before-Project Appearance & Disappearance */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center relative">
              <div
                ref={aboutSlotRef}
                className="w-full max-w-[240px] sm:max-w-[350px] md:max-w-[420px] lg:max-w-[480px] flex items-center justify-center relative"
              >
                <InteractiveOrbit
                  shapeMode="logo"
                  size="large"
                  scrollRotation={scrollY * 0.12}
                  orbitRebirthProgress={sectionForms.about}
                  spreadAmount={sectionSpreads.about}
                  isCentered={true}
                  formationTrigger={formationPulse}
                />
              </div>
              <div
                style={getAppearStyle(textTransitions.about)}
                className="mt-2 inline-flex items-center gap-2 text-[10px] font-mono tracking-wider sm:tracking-widest text-orange-400/80 uppercase text-center"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse shrink-0" />
                <span>
                  {sectionForms.about < 0.45
                    ? 'CALLIGRAPHIC HARMONY · FORM IN FLUX'
                    : 'TUMANEEN (طَمْأَنِينَة) · BESPOKE CALLIGRAPHIC MONOGRAM'}
                </span>
              </div>
            </div>

          </div>

          {/* Portfolio-Style Categorized Skills Matrix (Single Clean Heading per Card) */}
          <div
            style={getAppearStyle(textTransitions.about)}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pt-6 border-t border-orange-500/15 z-30 relative"
          >
            {/* 1. Software */}
            <div className="p-5 sm:p-6 rounded bg-[#120e0c]/90 border border-orange-500/25 backdrop-blur-sm space-y-4">
              <h3 className="text-base font-display font-bold text-orange-400 uppercase tracking-wider">
                01. Software
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  'Adobe Photoshop',
                  'Adobe Illustrator',
                  'Figma',
                  'Canva',
                  'Affinity Designer',
                ].map((tool) => (
                  <span
                    key={tool}
                    className="px-3 py-1 rounded bg-[#1a1410] border border-orange-500/30 text-xs font-mono text-orange-200"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* 2. Design Skills */}
            <div className="p-5 sm:p-6 rounded bg-[#120e0c]/90 border border-orange-500/25 backdrop-blur-sm space-y-4">
              <h3 className="text-base font-display font-bold text-orange-400 uppercase tracking-wider">
                02. Design Skills
              </h3>
              <div className="flex flex-wrap gap-1.5">
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
                ].map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded bg-[#1a1410] border border-orange-500/20 text-[11px] font-mono text-stone-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* 3. Technical & Contact */}
            <div className="p-5 sm:p-6 rounded bg-[#120e0c]/90 border border-orange-500/25 backdrop-blur-sm space-y-4 flex flex-col justify-between md:col-span-2 lg:col-span-1">
              <div className="space-y-4">
                <h3 className="text-base font-display font-bold text-orange-400 uppercase tracking-wider">
                  03. Technical
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    'HTML/CSS (basic)',
                    'AI-assisted design tools (Midjourney, DALL·E, etc.)',
                  ].map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded bg-[#1a1410] border border-orange-500/30 text-xs font-mono text-orange-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-orange-500/15 space-y-1.5 text-xs font-mono">
                <a href="mailto:fatimahghani.2026@gmail.com" className="block text-stone-300 hover:text-orange-400 truncate">
                  ✉ fatimahghani.2026@gmail.com
                </a>
                <a href="https://linkedin.com/in/fatimahghani" target="_blank" rel="noopener noreferrer" className="block text-stone-300 hover:text-orange-400 truncate">
                  ↗ linkedin.com/in/fatimahghani
                </a>
                <a href="https://behance.net/fatimahghani" target="_blank" rel="noopener noreferrer" className="block text-stone-300 hover:text-orange-400 truncate">
                  ↗ behance.net/fatimahghani
                </a>
              </div>
            </div>
          </div>
        </section>


        {/* ========================================================
            STAGE 3: SERVICES SECTION
            - Hand appears BEFORE Services Text during mobile scrolling!
            - On desktop, Hand is in the left column (order-1) and Text is in the right column (order-2).
            ======================================================== */}
        <section
          id="services-section"
          className="relative min-h-0 lg:min-h-[88vh] flex items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20 lg:py-24 scroll-mt-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-center w-full">
            
            {/* Hand Column: Placed FIRST on mobile (order-1) & left column on desktop (lg:order-1) */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center relative order-1 lg:order-1 mb-4 sm:mb-6 lg:mb-0">
              <div
                ref={servicesSlotRef}
                className="w-full max-w-[240px] sm:max-w-[350px] md:max-w-[420px] lg:max-w-[480px] flex items-center justify-center relative"
              >
                <InteractiveOrbit
                  shapeMode="hand"
                  size="large"
                  scrollRotation={scrollY * 0.12}
                  orbitRebirthProgress={sectionForms.services}
                  spreadAmount={sectionSpreads.services}
                  isCentered={true}
                  formationTrigger={formationPulse}
                />
              </div>
              <div
                style={getAppearStyle(textTransitions.services)}
                className="mt-2 inline-flex items-center gap-2 text-[10px] font-mono tracking-wider sm:tracking-widest text-orange-400/80 uppercase text-center"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse shrink-0" />
                <span>
                  {sectionForms.services < 0.45
                    ? 'THE MAKER’S INTUITION · EXPLORATORY CRAFT'
                    : 'HAND OF CRAFT & DIGITAL PRECISION · ATELIER ESSENCE'}
                </span>
              </div>
            </div>

            {/* Services Text Column: Placed SECOND on mobile (order-2) & right column on desktop (lg:order-2) */}
            <div
              ref={servicesTextRef}
              style={getAppearStyle(textTransitions.services)}
              className="lg:col-span-6 space-y-5 sm:space-y-6 text-left order-2 lg:order-2 z-30 relative"
            >
              <div className="inline-flex flex-wrap items-center gap-2 text-[10px] sm:text-xs font-mono tracking-[0.18em] sm:tracking-[0.25em] text-orange-400 uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                <span>02. SERVICES & EXPERTISE</span>
                <span className="text-stone-600">·</span>
                <span>CREATIVE CAPABILITIES</span>
              </div>

              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold uppercase text-[#ea580c] leading-tight text-glow-orange">
                WHAT I DESIGN
              </h2>

              <p className="text-sm sm:text-base text-stone-300 font-sans leading-relaxed max-w-xl">
                Combining freelance logo and brand identity experience with mastery across Adobe Illustrator, Photoshop, Figma, Affinity Designer, Canva, and After Effects.
              </p>

              <div className="space-y-3 pt-1">
                
                {/* Service 1: LOGO & BRAND IDENTITY */}
                <div
                  onClick={() => onNavigate('services')}
                  className="p-3.5 sm:p-5 rounded bg-[#130f0d]/85 backdrop-blur-sm border border-orange-500/20 hover:border-orange-500/50 hover:bg-[#181310] transition-all cursor-pointer group flex items-start gap-3 sm:gap-4"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <svg width="22" height="22" viewBox="0 0 48 48" fill="none" className="text-orange-400 group-hover:scale-110 transition-transform">
                      <circle cx="24" cy="24" r="9" fill="#ea580c" />
                      <ellipse cx="24" cy="24" rx="19" ry="6" stroke="#fb923c" strokeWidth="1.5" transform="rotate(-20 24 24)" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs font-mono text-orange-400">
                      <span>01.</span>
                      <h3 className="font-display font-bold text-base sm:text-lg text-white group-hover:text-orange-400 transition-colors">
                        LOGO & BRAND IDENTITY DESIGN
                      </h3>
                    </div>
                    <p className="text-xs text-stone-400 font-sans mt-1 leading-relaxed">
                      Bespoke logo design, visual identity systems, typography hierarchy, color theory, and realistic brand mockups.
                    </p>
                  </div>
                </div>

                {/* Service 2: PRINT, PACKAGING & ILLUSTRATION */}
                <div
                  onClick={() => onNavigate('services')}
                  className="p-3.5 sm:p-5 rounded bg-[#130f0d]/85 backdrop-blur-sm border border-orange-500/20 hover:border-orange-500/50 hover:bg-[#181310] transition-all cursor-pointer group flex items-start gap-3 sm:gap-4"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <svg width="22" height="22" viewBox="0 0 48 48" fill="none" className="text-orange-400 group-hover:scale-110 transition-transform">
                      <ellipse cx="24" cy="14" rx="14" ry="4.5" stroke="#fb923c" strokeWidth="1.5" />
                      <path d="M10 14v8c0 2.5 6.3 4.5 14 4.5s14-2 14-4.5v-8" stroke="#ea580c" strokeWidth="1.5" />
                      <path d="M10 22v8c0 2.5 6.3 4.5 14 4.5s14-2 14-4.5v-8" stroke="#c2410c" strokeWidth="1.5" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs font-mono text-orange-400">
                      <span>02.</span>
                      <h3 className="font-display font-bold text-base sm:text-lg text-white group-hover:text-orange-400 transition-colors">
                        PRINT, PACKAGING & ILLUSTRATION
                      </h3>
                    </div>
                    <p className="text-xs text-stone-400 font-sans mt-1 leading-relaxed">
                      Packaging design, print layouts & composition, custom vector illustration, posters, and tactile mockup design.
                    </p>
                  </div>
                </div>

                {/* Service 3: UI/UX, SOCIAL MEDIA & MOTION GRAPHICS */}
                <div
                  onClick={() => onNavigate('services')}
                  className="p-3.5 sm:p-5 rounded bg-[#130f0d]/85 backdrop-blur-sm border border-orange-500/20 hover:border-orange-500/50 hover:bg-[#181310] transition-all cursor-pointer group flex items-start gap-3 sm:gap-4"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <svg width="22" height="22" viewBox="0 0 48 48" fill="none" className="text-orange-400 group-hover:scale-110 transition-transform">
                      <circle cx="24" cy="24" r="6" fill="#fb923c" />
                      <circle cx="24" cy="24" r="14" stroke="#ea580c" strokeWidth="1.5" strokeDasharray="3 4" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs font-mono text-orange-400">
                      <span>03.</span>
                      <h3 className="font-display font-bold text-base sm:text-lg text-white group-hover:text-orange-400 transition-colors">
                        UI/UX, SOCIAL & MOTION GRAPHICS
                      </h3>
                    </div>
                    <p className="text-xs text-stone-400 font-sans mt-1 leading-relaxed">
                      Figma UI/UX design, social media graphics, After Effects animation/motion graphics, basic HTML/CSS, and AI-assisted ideation (Midjourney, DALL·E).
                    </p>
                  </div>
                </div>

              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6">
                <button
                  onClick={() => onNavigate('services')}
                  className="inline-flex items-center gap-2 text-xs font-mono text-orange-400 hover:text-orange-300 uppercase tracking-wider cursor-pointer group py-1"
                >
                  <span>OPEN SCOPE ESTIMATOR & FULL CAPABILITIES</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform shrink-0" />
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('orbit-rebirth-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-stone-400 hover:text-stone-200 uppercase tracking-wider cursor-pointer py-1"
                >
                  <span>DISCOVER DESIGN PHILOSOPHY</span>
                  <ArrowDown className="w-3.5 h-3.5 shrink-0" />
                </button>
              </div>
            </div>

          </div>
        </section>


        {/* ========================================================
            STAGE 4: BEFORE FEATURED PROJECTS — DESIGN PHILOSOPHY & VISUAL SYSTEMS
            ======================================================== */}
        <section
          id="orbit-rebirth-section"
          className="relative min-h-0 lg:min-h-[88vh] flex items-center py-12 sm:py-20 lg:py-24 scroll-mt-16"
        >
          <div
            ref={rebirthTextRef}
            style={getAppearStyle(textTransitions.rebirth)}
            className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5 sm:space-y-6 relative z-10 w-full"
          >
            <div className="inline-flex items-center justify-center gap-2 text-[10px] sm:text-xs font-mono tracking-[0.14em] sm:tracking-[0.25em] text-orange-400 uppercase bg-[#140f0c]/85 px-3 sm:px-4 py-1.5 rounded-full border border-orange-500/25 max-w-full">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping shrink-0" />
              <span className="truncate">03. DESIGN PHILOSOPHY · VISUAL SYSTEMS ARCHITECTURE</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold uppercase text-[#ea580c] leading-tight text-glow-orange">
              {sectionForms.rebirth < 0.45
                ? 'IDEAS IN CONVERGENCE'
                : 'SYSTEMS IN ORBIT'}
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-stone-300 font-sans leading-relaxed max-w-xl mx-auto">
              Before an identity takes shape, scattered inspirations, cultural nuances, and typographic tension converge into a unified visual system. Design is the gravitational pull that transforms complex concepts into enduring brand experiences.
            </p>

            <div className="py-2 flex flex-col items-center justify-center">
              <div
                ref={orbitRebirthSlotRef}
                className="w-full max-w-[240px] sm:max-w-[350px] md:max-w-[420px] lg:max-w-[480px] flex items-center justify-center relative"
              >
                <InteractiveOrbit
                  shapeMode="vortex-orbit"
                  size="large"
                  scrollRotation={scrollY * 0.28}
                  orbitRebirthProgress={sectionForms.rebirth}
                  spreadAmount={sectionSpreads.rebirth}
                  isCentered={true}
                  formationTrigger={formationPulse}
                />
              </div>

              <div className="mt-4 inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-[#120e0c]/90 border border-orange-500/35 text-[10px] sm:text-[11px] font-mono tracking-wider sm:tracking-widest text-orange-400 shadow-[0_0_20px_rgba(234,88,12,0.2)] max-w-full">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shrink-0" />
                <span className="truncate">
                  {sectionForms.rebirth < 0.45
                    ? 'EXPLORATION & CONVERGENCE · THE CREATIVE PROCESS'
                    : 'COHESIVE ECOSYSTEM · 360° BRAND ARCHITECTURE'}
                </span>
              </div>
            </div>
          </div>
        </section>


        {/* ========================================================
            STAGE 5: FEATURED PROJECTS (VERTICAL STACK SHOWCASE)
            ======================================================== */}
        <section
          id="projects-section"
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 scroll-mt-24"
        >
          <div
            ref={projectsSlotRef}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
            aria-hidden="true"
          />

          <div
            ref={projectsTextRef}
            style={getAppearStyle(textTransitions.projects)}
            className="relative z-30"
          >
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 pb-6 sm:pb-8 mb-8 sm:mb-10">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono tracking-[0.2em] sm:tracking-[0.25em] text-orange-400 uppercase mb-2">
                  <span>04. SELECTED WORKS</span>
                  <span className="text-stone-600">·</span>
                  <span>ARCHIVE INDEX</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-display font-bold uppercase text-white leading-tight">
                  FEATURED PROJECTS
                </h2>
              </div>

              <button
                onClick={() => onNavigate('work')}
                className="inline-flex items-center gap-2 text-xs font-mono tracking-[0.2em] text-stone-400 hover:text-orange-400 uppercase transition-colors cursor-pointer group self-start sm:self-auto"
              >
                <span>VIEW ALL WORKS</span>
                <span className="text-[10px] text-orange-500 font-mono">({featuredProjects.length})</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </div>

            <div className="flex flex-col space-y-8 sm:space-y-12 lg:space-y-14">
              {featuredProjects.filter((p) => p.featured).slice(0, 5).map((project, idx) => (
                <article
                  key={project.id}
                  onClick={() => onOpenProject(project)}
                  className="group cursor-pointer grid grid-cols-1 lg:grid-cols-12 bg-[#110e0c]/90 backdrop-blur-md border border-orange-500/20 hover:border-orange-500/60 transition-all duration-300 overflow-hidden rounded-sm hover:shadow-[0_0_40px_rgba(234,88,12,0.22)] min-h-[320px] sm:min-h-[400px]"
                >
                  <div
                    className={`relative lg:col-span-7 xl:col-span-8 w-full min-h-[260px] sm:min-h-[340px] lg:min-h-full overflow-hidden bg-[#070605] ${
                      idx % 2 === 1 ? 'lg:order-2' : 'lg:order-1'
                    }`}
                  >
                    <BrandingCover project={project} className="w-full h-full min-h-[260px] sm:min-h-[340px]" />
                  </div>

                  <div
                    className={`lg:col-span-5 xl:col-span-4 p-5 sm:p-8 lg:p-10 flex flex-col justify-between bg-[#14100d]/95 border-t lg:border-t-0 ${
                      idx % 2 === 1
                        ? 'lg:order-1 lg:border-r border-orange-500/15'
                        : 'lg:order-2 lg:border-l border-orange-500/15'
                    }`}
                  >
                    <div className="space-y-3.5 sm:space-y-4">
                      <div className="flex items-center justify-between gap-2 text-xs font-mono">
                        <span className="text-orange-400 font-semibold tracking-[0.15em] sm:tracking-[0.2em] uppercase truncate">
                          {project.brandingType || project.category}
                        </span>
                        <span className="text-stone-400 shrink-0">
                          {project.year} · NO. {project.number}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-white group-hover:text-orange-400 transition-colors tracking-wide uppercase">
                          {project.title}
                        </h3>
                        <p className="text-xs font-mono text-stone-400 uppercase tracking-wider">
                          {project.subtitle}
                        </p>
                      </div>

                      <p className="text-xs sm:text-sm text-stone-300 font-sans leading-relaxed pt-1">
                        {project.tagline}
                      </p>

                      <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] font-mono text-stone-400">
                        {project.deliverables.slice(0, 3).map((item, dIdx) => (
                          <React.Fragment key={item}>
                            {dIdx > 0 && <span aria-hidden="true" className="text-orange-500/60">·</span>}
                            <span>{item}</span>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    <div className="pt-5 mt-5 sm:pt-6 sm:mt-6 border-t border-orange-500/15 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-1.5">
                        {project.palette.map((swatch) => (
                          <span
                            key={swatch.hex}
                            className="w-3.5 h-3.5 rounded-full border border-white/20"
                            style={{ backgroundColor: swatch.hex }}
                            title={`${swatch.name} (${swatch.hex})`}
                          />
                        ))}
                      </div>

                      <div className="inline-flex items-center gap-2 text-xs font-mono tracking-wider text-orange-400 group-hover:text-white uppercase transition-colors">
                        <span>VIEW BRANDING STUDY</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="text-center pt-8 sm:pt-10">
              <button
                onClick={() => onNavigate('work')}
                className="inline-flex items-center gap-2 text-xs font-mono tracking-wider sm:tracking-widest text-stone-400 hover:text-orange-400 uppercase transition-colors cursor-pointer"
              >
                <span>OPEN COMPREHENSIVE ARCHIVE & MONOGRAPHS</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </button>
            </div>
          </div>
        </section>


        {/* ========================================================
            STAGE 6: POST-FEATURED PROJECTS — ATOMIC CRAFT & FIRST PRINCIPLES
            ======================================================== */}
        <section
          id="atom-finale-section"
          className="relative min-h-0 lg:min-h-[88vh] flex items-center py-12 sm:py-20 lg:py-24 scroll-mt-16"
        >
          <div
            ref={atomTextRef}
            style={getAppearStyle(textTransitions.atom)}
            className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5 sm:space-y-6 relative z-10 w-full"
          >
            <div className="inline-flex items-center justify-center gap-2 text-[10px] sm:text-xs font-mono tracking-[0.14em] sm:tracking-[0.25em] text-orange-400 uppercase bg-[#140f0c]/85 px-3 sm:px-4 py-1.5 rounded-full border border-orange-500/25 max-w-full">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping shrink-0" />
              <span className="truncate">05. ATOMIC PRECISION · CRAFTED FIRST PRINCIPLES</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold uppercase text-[#ea580c] leading-tight text-glow-orange">
              IDEAS DISTILLED TO<br />
              <span className="italic font-normal text-[#f97316]">ATOMIC CLARITY</span>
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-stone-300 font-sans leading-relaxed max-w-xl mx-auto">
              Every enduring visual identity is constructed from foundational elements: grid discipline, mathematical kerning, chromatic resonance, and tactile balance. When distilled to their purest form, these principles create brands that leave a lasting imprint.
            </p>

            <div className="py-2 flex flex-col items-center justify-center relative">
              <div
                ref={atomSlotRef}
                className="w-full max-w-[240px] sm:max-w-[350px] md:max-w-[420px] lg:max-w-[480px] flex items-center justify-center relative"
              >
                <InteractiveOrbit
                  shapeMode="atom"
                  size="large"
                  scrollRotation={scrollY * 0.22}
                  orbitRebirthProgress={sectionForms.atom}
                  spreadAmount={sectionSpreads.atom}
                  isCentered={true}
                  formationTrigger={formationPulse}
                />
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:gap-3 z-30 px-2">
                <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#120e0c]/90 border border-orange-500/35 text-[10px] sm:text-[11px] font-mono tracking-wider sm:tracking-widest text-orange-400 shadow-[0_0_20px_rgba(234,88,12,0.2)] max-w-full">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shrink-0" />
                  <span className="truncate">
                    {sectionForms.atom < 0.45
                      ? 'FOUNDATIONAL PRINCIPLES · COMPOSITION IN FLUX'
                      : 'ATOMIC PRECISION · SCALABLE BRAND SYSTEMS'}
                  </span>
                </div>

                <button
                  onClick={() => setFormationPulse((p) => p + 1)}
                  className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-orange-500/15 hover:bg-orange-500/30 border border-orange-500/40 text-[10px] sm:text-[11px] font-mono tracking-wider text-amber-300 uppercase transition-all cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 shrink-0" />
                  <span>RE-ENGAGE SYSTEM</span>
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('contact')}
                className="inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3 rounded-full border border-orange-500/50 bg-[#16110e] text-orange-400 hover:bg-orange-500 hover:text-black font-mono text-xs uppercase tracking-[0.16em] sm:tracking-[0.2em] transition-all shadow-[0_0_25px_rgba(234,88,12,0.3)] cursor-pointer group w-full sm:w-auto"
              >
                <span>INITIATE A NEW COMMISSION</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 shrink-0" />
              </button>
            </div>
          </div>
        </section>

      </div>

    </div>
  );
};
