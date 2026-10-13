import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles } from 'lucide-react';

export type StarShapeMode = 'sun' | 'logo' | 'hand' | 'vortex-orbit' | 'atom';

interface InteractiveOrbitProps {
  shapeMode?: StarShapeMode;
  onExploreClick?: () => void;
  scrollRotation?: number;
  heroMorphProgress?: number; // 0 -> 1 on Main Page: Burning Sun & Coronal Streams -> Swirling Spiral Galaxy Core
  spreadAmount?: number; // 0 = locked shape, 0 -> 1 = swirling disappearance into surrounding screen
  orbitRebirthProgress?: number; // 0 = circular star motion -> 1 = locked refined shape
  isCentered?: boolean;
  size?: 'hero-xl' | 'large' | 'compact' | 'responsive';
  className?: string;
  formationTrigger?: number;
}

interface StarDot {
  x: number;
  y: number;
  z: number;
  spawnX: number;
  spawnY: number;
  ox: number;
  oy: number;
  vx: number;
  vy: number;
  role: 'core' | 'orbit' | 'surrounding';
  theta: number;
  phi: number;
  sphereRadius: number;
  isEquatorialBelt: boolean;
  // Organized Grand-Design Spiral Galaxy Core parameters for the Main Page center
  galaxyTier: 'nucleus' | 'nucleus-ring' | 'spiral-arm' | 'resonance-ring' | 'star-node';
  galaxyU: number; // Normalized 0..1 position along spiral arm or ring
  galaxyArmIndex: number; // 0..3 for the 4 symmetric spiral arms
  galaxyStreamOffset: number; // Clean deterministic ribbon offset (-1, 0, +1)
  galaxyRingRadius: number; // Radius for concentric galactic resonance rings
  galaxyNodeIndex: number; // Index within micro-cluster node
  isGalacticNucleus: boolean;
  isPrimarySpine: boolean;
  // Planetary Orbit parameters (kept 100% identical!)
  orbitBand: number;
  orbitAngle: number;
  orbitSpeed: number;
  orbitRx: number;
  orbitRy: number;
  orbitTilt: number;
  isSatelliteCluster: boolean;
  satOffsetAngle: number;
  satOffsetR: number;
  circleRadius: number;
  circleAngle: number;
  circleAngularSpeed: number;
  spiralRadius: number;
  spiralAngle: number;
  spiralAngularSpeed: number;
  spiralInwardSpeed: number;
  flowPhase: number;
  flowFreq: number;
  spreadOffsetX: number;
  spreadOffsetY: number;
  spreadSwirlAngle: number;
  // About Section Target: Tumaneen Logotype
  logoX: number;
  logoY: number;
  isLogoEdge: boolean;
  // Services Section Target: Hand & Gear
  handX: number;
  handY: number;
  isHandEdge: boolean;
  dotSize: number;
  color: string;
  alpha: number;
  twinklePhase: number;
  captured: boolean;
}

const STAR_DOT_PALETTE = [
  '#ffffff',
  '#fffbeb',
  '#fef08a',
  '#fde047',
  '#facc15',
  '#fb923c',
  '#f97316',
  '#ea580c',
];

// Module-level caches so offscreen pixel sampling only runs ONCE
let cachedLogoPoints: { x: number; y: number; isEdge: boolean }[] | null = null;
let cachedHandPoints: { x: number; y: number; isEdge: boolean }[] | null = null;

/**
 * Draws the Tumaneen geometric Kufic-arch logotype
 * centered at (cx, cy) with the requested scale.
 */
function drawTumaneenLogotypeGeometry(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale: number
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);
  ctx.translate(-300, -168);

  const strokeW = 26;
  ctx.lineWidth = strokeW;
  ctx.lineCap = 'butt';
  ctx.lineJoin = 'miter';

  // 1. Far-Left Sweeping Outer Arch
  ctx.beginPath();
  ctx.arc(110, 308, 92, Math.PI, 1.5 * Math.PI, false);
  ctx.stroke();

  // 2. Left-Center Horizontal Foot + Vertical Rise + Sweeping Upper Arch
  ctx.beginPath();
  ctx.moveTo(64, 282);
  ctx.lineTo(146, 282);
  ctx.lineTo(146, 234);
  ctx.quadraticCurveTo(146, 148, 232, 148);
  ctx.lineTo(270, 148);
  ctx.stroke();

  // 3. Center Vertical Pillar with Rounded Top-Left Shoulder
  ctx.beginPath();
  ctx.moveTo(287, 256);
  ctx.lineTo(287, 118);
  ctx.quadraticCurveTo(287, 96, 313, 96);
  ctx.lineTo(313, 256);
  ctx.closePath();
  ctx.fill();

  // 4. Center Top Curved Crown / Flag
  ctx.beginPath();
  ctx.moveTo(314, 52);
  ctx.quadraticCurveTo(276, 56, 266, 94);
  ctx.lineTo(266, 114);
  ctx.quadraticCurveTo(284, 82, 314, 78);
  ctx.closePath();
  ctx.fill();

  // 5. Right-Center Arch + Vertical Drop + Long Horizontal Baseline + Curved Tip
  ctx.beginPath();
  ctx.arc(382, 214, 53, 1.14 * Math.PI, 2 * Math.PI, false);
  ctx.lineTo(435, 286);
  ctx.lineTo(524, 286);
  ctx.quadraticCurveTo(548, 286, 552, 310);
  ctx.stroke();

  // 6. Right Vertical Stem with Rounded Top-Left Shoulder
  ctx.beginPath();
  ctx.moveTo(460, 258);
  ctx.lineTo(460, 152);
  ctx.quadraticCurveTo(460, 132, 486, 132);
  ctx.lineTo(486, 258);
  ctx.closePath();
  ctx.fill();

  // 7. Far-Right Sweeping Outer Arch
  ctx.beginPath();
  ctx.arc(486, 310, 94, 1.5 * Math.PI, 2 * Math.PI, false);
  ctx.stroke();

  // 8. The 7 Signature Diacritical Circular Dots
  const dots: [number, number, number][] = [
    [42, 182, 15.5],
    [180, 100, 15.5],
    [186, 260, 14.5],
    [231, 216, 14.5],
    [300, 22, 15.5],
    [374, 216, 14.5],
    [473, 104, 15.5],
  ];

  for (const [dx, dy, dr] of dots) {
    ctx.beginPath();
    ctx.arc(dx, dy, dr, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * Draws the Services Hand + 8-Tooth Gear icon
 * on an offscreen canvas purely for star-dot sampling.
 */
function drawServicesHandGearGeometry(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale: number
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);
  ctx.translate(-300, -285);

  const gx = 395;
  const gy = 182;

  for (let k = 0; k < 8; k++) {
    ctx.save();
    ctx.translate(gx, gy);
    ctx.rotate((k * Math.PI) / 4);
    ctx.beginPath();
    ctx.roundRect(-18, -124, 36, 40, 8);
    ctx.fill();
    ctx.restore();
  }

  ctx.beginPath();
  ctx.arc(gx, gy, 96, 0, Math.PI * 2);
  ctx.arc(gx, gy, 64, 0, Math.PI * 2, true);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(38, 448);
  ctx.lineTo(38, 344);
  ctx.quadraticCurveTo(38, 320, 62, 312);
  ctx.lineTo(154, 278);
  ctx.quadraticCurveTo(182, 268, 212, 278);
  ctx.lineTo(352, 326);
  ctx.bezierCurveTo(384, 337, 382, 384, 346, 382);
  ctx.lineTo(242, 348);
  ctx.bezierCurveTo(222, 342, 214, 368, 234, 376);
  ctx.lineTo(348, 414);
  ctx.quadraticCurveTo(382, 424, 404, 386);
  ctx.lineTo(526, 346);
  ctx.bezierCurveTo(566, 334, 576, 386, 540, 406);
  ctx.lineTo(396, 480);
  ctx.quadraticCurveTo(366, 496, 332, 484);
  ctx.lineTo(156, 422);
  ctx.lineTo(74, 468);
  ctx.quadraticCurveTo(38, 482, 38, 448);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function sampleGeometryStarDots(
  logicalSize: number,
  targetCount: number,
  drawFn: (ctx: CanvasRenderingContext2D, cx: number, cy: number) => void,
  rangeX: number,
  rangeY: number
): { x: number; y: number; isEdge: boolean }[] {
  const offCanvas = document.createElement('canvas');
  offCanvas.width = logicalSize;
  offCanvas.height = logicalSize;
  const offCtx = offCanvas.getContext('2d');
  const center = logicalSize / 2;
  if (!offCtx) {
    return Array.from({ length: targetCount }, () => ({
      x: center,
      y: center,
      isEdge: false,
    }));
  }

  offCtx.clearRect(0, 0, logicalSize, logicalSize);
  offCtx.fillStyle = '#ffffff';
  offCtx.strokeStyle = '#ffffff';
  drawFn(offCtx, center, center);

  const imgData = offCtx.getImageData(0, 0, logicalSize, logicalSize).data;
  const isFilled = (px: number, py: number) => {
    const ix = Math.round(px);
    const iy = Math.round(py);
    if (ix < 0 || ix >= logicalSize || iy < 0 || iy >= logicalSize) return false;
    return imgData[(iy * logicalSize + ix) * 4 + 3] > 128;
  };

  const edges: { x: number; y: number; isEdge: boolean }[] = [];
  const interiors: { x: number; y: number; isEdge: boolean }[] = [];
  const step = 1.9;

  for (let y = center - rangeY; y <= center + rangeY; y += step) {
    for (let x = center - rangeX; x <= center + rangeX; x += step) {
      const jx = x + Math.sin(x * 12.9898 + y * 78.233) * 0.28;
      const jy = y + Math.cos(x * 39.346 + y * 11.135) * 0.28;
      if (isFilled(jx, jy)) {
        const edge =
          !isFilled(jx - step, jy) ||
          !isFilled(jx + step, jy) ||
          !isFilled(jx, jy - step) ||
          !isFilled(jx, jy + step);
        if (edge) {
          edges.push({ x: jx, y: jy, isEdge: true });
        } else {
          interiors.push({ x: jx, y: jy, isEdge: false });
        }
      }
    }
  }

  const ordered = [...edges, ...interiors];
  if (ordered.length === 0) {
    return Array.from({ length: targetCount }, () => ({
      x: center,
      y: center,
      isEdge: false,
    }));
  }

  const result: { x: number; y: number; isEdge: boolean }[] = [];
  const edgeQuota = Math.min(edges.length, Math.floor(targetCount * 0.65));
  for (let i = 0; i < edgeQuota; i++) {
    const idx = Math.floor((i * edges.length) / edgeQuota) % edges.length;
    result.push(edges[idx]);
  }
  const remCount = targetCount - result.length;
  const pool = interiors.length > 0 ? interiors : ordered;
  for (let i = 0; i < remCount; i++) {
    const idx = Math.floor((i * pool.length) / remCount) % pool.length;
    result.push(pool[idx]);
  }
  return result;
}

function getCachedLogotypeStarDots(logicalSize: number, targetCount: number) {
  if (cachedLogoPoints && cachedLogoPoints.length === targetCount) {
    return cachedLogoPoints;
  }
  cachedLogoPoints = sampleGeometryStarDots(
    logicalSize,
    targetCount,
    (ctx, cx, cy) => drawTumaneenLogotypeGeometry(ctx, cx, cy, 0.76),
    285,
    225
  );
  return cachedLogoPoints;
}

function getCachedServicesHandGearStarDots(logicalSize: number, targetCount: number) {
  if (cachedHandPoints && cachedHandPoints.length === targetCount) {
    return cachedHandPoints;
  }
  cachedHandPoints = sampleGeometryStarDots(
    logicalSize,
    targetCount,
    (ctx, cx, cy) => drawServicesHandGearGeometry(ctx, cx, cy, 0.8),
    275,
    255
  );
  return cachedHandPoints;
}

export const InteractiveOrbit: React.FC<InteractiveOrbitProps> = ({
  shapeMode = 'sun',
  scrollRotation = 0,
  heroMorphProgress = 0,
  spreadAmount = 0,
  orbitRebirthProgress = 1,
  isCentered = true,
  size = 'large',
  className = '',
  formationTrigger = 0,
}) => {
  const [speed, setSpeed] = useState<'normal' | 'fast' | 'gentle'>('normal');
  const [formationPhase, setFormationPhase] = useState<'converging' | 'stabilized'>('converging');
  const [cursorActive, setCursorActive] = useState(false);
  const [manualHeroShapeOffset, setManualHeroShapeOffset] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const isVisibleRef = useRef<boolean>(shapeMode === 'sun');
  const scatterRequestRef = useRef<boolean>(false);

  const scrollRotRef = useRef<number>(scrollRotation);
  const heroMorphRef = useRef<number>(heroMorphProgress);
  const manualHeroOffsetRef = useRef<number>(manualHeroShapeOffset);
  const spreadAmountRef = useRef<number>(spreadAmount);
  const orbitRebirthRef = useRef<number>(orbitRebirthProgress);
  const speedRef = useRef<'normal' | 'fast' | 'gentle'>(speed);

  const mouseRef = useRef<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    active: boolean;
  }>({
    x: -9999,
    y: -9999,
    vx: 0,
    vy: 0,
    active: false,
  });

  useEffect(() => {
    scrollRotRef.current = scrollRotation;
  }, [scrollRotation]);

  useEffect(() => {
    heroMorphRef.current = heroMorphProgress;
  }, [heroMorphProgress]);

  useEffect(() => {
    manualHeroOffsetRef.current = manualHeroShapeOffset;
  }, [manualHeroShapeOffset]);

  useEffect(() => {
    spreadAmountRef.current = spreadAmount;
  }, [spreadAmount]);

  useEffect(() => {
    orbitRebirthRef.current = orbitRebirthProgress;
  }, [orbitRebirthProgress]);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  const triggerReignite = useCallback(() => {
    setFormationPhase('converging');
    if (shapeMode === 'sun') {
      setManualHeroShapeOffset((prev) => (prev + 1) % 2);
    } else {
      scatterRequestRef.current = true;
    }
    setTimeout(() => {
      setFormationPhase('stabilized');
    }, 650);
  }, [shapeMode]);

  useEffect(() => {
    if (formationTrigger > 0) {
      scatterRequestRef.current = true;
      setFormationPhase('converging');
      const t = setTimeout(() => setFormationPhase('stabilized'), 650);
      return () => clearTimeout(t);
    }
  }, [formationTrigger]);

  // Pause off-screen canvases so only the visible section's constellation runs
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisibleRef.current = entry.isIntersecting;
      },
      { rootMargin: '240px 0px', threshold: [0, 0.05] }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    const logicalSize = 1400;
    canvas.width = logicalSize * dpr;
    canvas.height = logicalSize * dpr;
    ctx.scale(dpr, dpr);

    const cx = logicalSize / 2;
    const cy = logicalSize / 2;

    const isMainHeroShape = shapeMode === 'sun';
    const sunRadius = isMainHeroShape ? 132 : 102;

    // 1,620 ultra-refined core star dots on the Main Page forming the Burning Sun & Spiral Galaxy Core,
    // encircled by the exact same 760 Planetary Orbit dots + 220 surrounding stars!
    const coreCount = isMainHeroShape ? 1620 : 960;
    const orbitCount = isMainHeroShape ? 760 : 580;
    const surroundingCount = isMainHeroShape ? 220 : 200;
    const totalCount = coreCount + orbitCount + surroundingCount;

    const logoPoints =
      shapeMode === 'logo' ? getCachedLogotypeStarDots(logicalSize, totalCount) : [];
    const handPoints =
      shapeMode === 'hand' ? getCachedServicesHandGearStarDots(logicalSize, totalCount) : [];

    const dots: StarDot[] = [];
    const goldenRatio = (1 + Math.sqrt(5)) / 2;

    const createStarDot = (i: number, role: 'core' | 'orbit' | 'surrounding'): StarDot => {
      const iNorm = (i + 0.5) / coreCount;
      const phi =
        role === 'core'
          ? Math.acos(1 - 2 * iNorm)
          : Math.acos(1 - 2 * ((i % 400) / 400));
      const theta = (2 * Math.PI * i) / goldenRatio;

      // =========================================================================
      // 1. ORGANIZED GRAND-DESIGN SPIRAL GALAXY CORE PARAMETERS (ZERO RANDOM MESS)
      //    - Tier 1 (i = 0..219): Golden-Angle Fibonacci Galactic Nucleus (r = 0..29px)
      //    - Tier 2 (i = 220..319): Crisp Inner Galactic Accretion Ring (r = 34px)
      //    - Tier 3 (i = 320..1199): 4 Symmetric 3-Ribbon Logarithmic Spiral Arms (r = 35..138px)
      //    - Tier 4 (i = 1200..1479): 3 Concentric Galactic Resonance Rings (r = 58, 94, 136px)
      //    - Tier 5 (i = 1480..1619): 8 Galactic Star-Cluster Rosettes & Cardinal Ticks
      // =========================================================================
      let galaxyTier: StarDot['galaxyTier'] = 'spiral-arm';
      let galaxyU = 0;
      let galaxyArmIndex = i % 4;
      let galaxyStreamOffset = 0;
      let galaxyRingRadius = 58;
      let galaxyNodeIndex = 0;
      let isGalacticNucleus = false;
      let isPrimarySpine = false;

      if (role === 'core' && isMainHeroShape) {
        if (i < 220) {
          // Tier 1: Precision Fibonacci Phyllotaxis Galactic Nucleus
          galaxyTier = 'nucleus';
          isGalacticNucleus = true;
          galaxyU = i / 220;
          galaxyArmIndex = i % 4;
        } else if (i < 320) {
          // Tier 2: Crisp Inner Galactic Accretion Ring (r = 34px)
          galaxyTier = 'nucleus-ring';
          isGalacticNucleus = true;
          galaxyU = (i - 220) / 100;
          galaxyRingRadius = 34;
          isPrimarySpine = i % 2 === 0;
        } else if (i < 1200) {
          // Tier 3: 4 Symmetric 3-Ribbon Logarithmic Spiral Galaxy Arms (220 dots per arm)
          galaxyTier = 'spiral-arm';
          const armDotIdx = i - 320; // 0..879
          galaxyArmIndex = armDotIdx % 4; // 0, 1, 2, 3
          const idxInArm = Math.floor(armDotIdx / 4); // 0..219

          // Divide the 220 dots of each spiral arm into 3 crisp parallel ribbons:
          // - 0..109 (110 dots): Central Luminous Spine (offset = 0)
          // - 110..164 (55 dots): Inner Flanking Ribbon (offset = -1)
          // - 165..219 (55 dots): Outer Flanking Ribbon (offset = +1)
          if (idxInArm < 110) {
            galaxyStreamOffset = 0;
            galaxyU = idxInArm / 110;
            isPrimarySpine = true;
          } else if (idxInArm < 165) {
            galaxyStreamOffset = -1;
            galaxyU = (idxInArm - 110) / 55;
          } else {
            galaxyStreamOffset = 1;
            galaxyU = (idxInArm - 165) / 55;
          }
        } else if (i < 1480) {
          // Tier 4: 3 Concentric Galactic Resonance Rings (r = 58px, 94px, 136px)
          galaxyTier = 'resonance-ring';
          const ringIdx = i - 1200; // 0..279
          if (ringIdx < 80) {
            galaxyRingRadius = 58;
            galaxyU = ringIdx / 80;
          } else if (ringIdx < 176) {
            galaxyRingRadius = 94;
            galaxyU = (ringIdx - 80) / 96;
          } else {
            galaxyRingRadius = 136;
            galaxyU = (ringIdx - 176) / 104;
            isPrimarySpine = ringIdx % 2 === 0;
          }
        } else {
          // Tier 5: 8 Organized Star-Cluster Rosette Nodes along the 4 Spiral Arms
          galaxyTier = 'star-node';
          const nodeDotIdx = i - 1480; // 0..139
          const clusterIdx = nodeDotIdx % 8; // 8 clusters (2 per arm)
          galaxyArmIndex = clusterIdx % 4;
          galaxyU = clusterIdx < 4 ? 0.36 : 0.72;
          galaxyNodeIndex = Math.floor(nodeDotIdx / 8); // 0..17
          isPrimarySpine = galaxyNodeIndex === 0;
        }
      } else if (role === 'core') {
        isGalacticNucleus = i < Math.floor(coreCount * 0.28);
        galaxyU = i / Math.max(1, coreCount);
      }

      const isEquatorialBelt = isMainHeroShape && role === 'core' && i % 8 === 0;
      const sphereRadius = sunRadius * (0.45 + 0.55 * Math.pow(iNorm, 0.7));

      // =========================================================================
      // 2. PLANETARY ORBIT RINGS (Kept 100% the same!)
      // =========================================================================
      const numBands = isMainHeroShape ? 5 : 4;
      const band = i % numBands;
      const baseRx = isMainHeroShape
        ? band === 0
          ? 194
          : band === 1
          ? 218
          : band === 2
          ? 242
          : band === 3
          ? 266
          : 290
        : band === 0
        ? 154
        : band === 1
        ? 180
        : band === 2
        ? 206
        : 232;
      const baseRy = isMainHeroShape
        ? band === 0
          ? 64
          : band === 1
          ? 74
          : band === 2
          ? 84
          : band === 3
          ? 94
          : 104
        : band === 0
        ? 54
        : band === 1
        ? 64
        : band === 2
        ? 74
        : 84;

      const orbitAngle = (i / orbitCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.012;
      const isSatelliteCluster = isMainHeroShape && role === 'orbit' && i % 16 === 0;

      const spawnAngle = theta + (Math.random() - 0.5) * 0.25;
      const spawnDist = 340 + ((i * 53) % 300);
      const spawnX = cx + Math.cos(spawnAngle) * spawnDist;
      const spawnY = cy + Math.sin(spawnAngle) * spawnDist;

      const spreadDist = 260 + ((i * 67) % 340);
      const spreadAng = theta + (i % 2 === 0 ? 0.36 : -0.36);

      const lp = logoPoints[i] || { x: cx, y: cy, isEdge: false };
      const hp = handPoints[i] || { x: cx, y: cy, isEdge: false };

      const isEdgeDot =
        shapeMode === 'logo'
          ? lp.isEdge
          : shapeMode === 'hand'
          ? hp.isEdge
          : i % 3 === 0;

      const ringGroup = i % 5;
      const baseCircleR = isMainHeroShape ? 1.18 : 1.0;
      const circleR =
        (ringGroup === 0
          ? 48 + (i % 28)
          : ringGroup === 1
          ? 112 + (i % 16)
          : ringGroup === 2
          ? 148 + (i % 16)
          : ringGroup === 3
          ? 184 + (i % 16)
          : 220 + (i % 18)) * baseCircleR;

      // Organized Galactic Color Hierarchy:
      // - Nucleus & Ring: Incandescent white-gold (#ffffff, #fffbeb, #fef08a)
      // - Spiral Arm Central Spine: Bright solar gold to warm amber (#fef08a -> #facc15 -> #fb923c)
      // - Flanking Ribbons & Resonance Rings: Rich cosmic amber-orange (#fb923c, #f97316, #ea580c)
      let dotColor = STAR_DOT_PALETTE[i % STAR_DOT_PALETTE.length];
      if (isMainHeroShape && role === 'core') {
        if (galaxyTier === 'nucleus' || galaxyTier === 'nucleus-ring') {
          dotColor = STAR_DOT_PALETTE[i % 3];
        } else if (galaxyTier === 'spiral-arm') {
          if (isPrimarySpine) {
            const colorIdx = Math.min(5, 1 + Math.floor(galaxyU * 4.5));
            dotColor = STAR_DOT_PALETTE[colorIdx];
          } else {
            const colorIdx = Math.min(7, 3 + Math.floor(galaxyU * 4.5));
            dotColor = STAR_DOT_PALETTE[colorIdx];
          }
        } else if (galaxyTier === 'resonance-ring') {
          dotColor = galaxyRingRadius <= 60 ? '#fde047' : galaxyRingRadius <= 100 ? '#fb923c' : '#f97316';
        } else {
          dotColor = isPrimarySpine ? '#ffffff' : '#fef08a';
        }
      }

      return {
        x: spawnX,
        y: spawnY,
        z: 0,
        spawnX,
        spawnY,
        ox: 0,
        oy: 0,
        vx: 0,
        vy: 0,
        role,
        theta,
        phi: isEquatorialBelt ? Math.PI * 0.5 + ((i % 7) - 3) * 0.035 : phi,
        sphereRadius,
        isEquatorialBelt,
        galaxyTier,
        galaxyU,
        galaxyArmIndex,
        galaxyStreamOffset,
        galaxyRingRadius,
        galaxyNodeIndex,
        isGalacticNucleus,
        isPrimarySpine,
        orbitBand: band,
        orbitAngle,
        orbitSpeed:
          role === 'core'
            ? 0.0018 + (i % 7) * 0.00014
            : 0.0031 + (numBands - 1 - band) * 0.00055,
        orbitRx: baseRx + (Math.random() - 0.5) * 1.4,
        orbitRy: baseRy + (Math.random() - 0.5) * 1.1,
        orbitTilt:
          shapeMode === 'vortex-orbit'
            ? ((band === 0 ? -24 : band === 1 ? -11 : band === 2 ? 13 : 26) * Math.PI) / 180
            : ((band === 0 ? -22 : band === 1 ? -14 : band === 2 ? 18 : band === 3 ? -26 : 12) *
                Math.PI) /
              180,
        isSatelliteCluster,
        satOffsetAngle: (i * 1.1) % (Math.PI * 2),
        satOffsetR: 5 + (i % 6) * 1.8,
        circleRadius: circleR,
        circleAngle: spawnAngle,
        circleAngularSpeed:
          (0.0055 + (4 - ringGroup) * 0.0011) * (ringGroup % 2 === 0 ? 1 : -1),
        spiralRadius: isMainHeroShape ? 195 + Math.random() * 410 : 220 + Math.random() * 420,
        spiralAngle: spawnAngle,
        spiralAngularSpeed: 0.0072 + Math.random() * 0.0055,
        spiralInwardSpeed: 0.95 + Math.random() * 0.7,
        flowPhase: (i * 0.137) % (Math.PI * 2),
        flowFreq: 0.55 + (i % 9) * 0.08,
        spreadOffsetX: Math.cos(spreadAng) * spreadDist,
        spreadOffsetY: Math.sin(spreadAng) * spreadDist,
        spreadSwirlAngle: spreadAng,
        logoX: lp.x,
        logoY: lp.y,
        isLogoEdge: lp.isEdge,
        handX: hp.x,
        handY: hp.y,
        isHandEdge: hp.isEdge,
        dotSize:
          isMainHeroShape && role === 'core'
            ? isGalacticNucleus
              ? 1.05 + (i % 3) * 0.14
              : isPrimarySpine
              ? 1.12 + (1 - galaxyU * 0.35) * 0.24
              : 0.8 + (1 - galaxyU * 0.3) * 0.18
            : isEdgeDot
            ? 1.0 + Math.random() * 0.42
            : 0.72 + Math.random() * 0.36,
        color: dotColor,
        alpha:
          isMainHeroShape && role === 'core'
            ? isGalacticNucleus || isPrimarySpine
              ? 0.96
              : 0.84
            : 0.84 + Math.random() * 0.16,
        twinklePhase: (i * 0.37) % (Math.PI * 2),
        captured: false,
      };
    };

    for (let i = 0; i < coreCount; i++) {
      dots.push(createStarDot(i, 'core'));
    }
    for (let i = 0; i < orbitCount; i++) {
      dots.push(createStarDot(coreCount + i, 'orbit'));
    }
    for (let i = 0; i < surroundingCount; i++) {
      dots.push(createStarDot(coreCount + orbitCount + i, 'surrounding'));
    }

    let animId: number;
    let spinTime = 0;
    let lastFrameTime = performance.now();
    let smoothedSpread = spreadAmountRef.current;
    let smoothedRebirth = orbitRebirthRef.current;
    let smoothedHeroMorph = heroMorphRef.current + manualHeroOffsetRef.current;
    let smoothedRotRad = (scrollRotRef.current * Math.PI) / 180;

    const phaseTimer = setTimeout(() => {
      setFormationPhase('stabilized');
    }, 650);

    const render = (now: number) => {
      animId = requestAnimationFrame(render);

      if (!isVisibleRef.current) {
        lastFrameTime = now;
        return;
      }

      const rawDt = (now - lastFrameTime) / 16.6667;
      lastFrameTime = now;
      const dt = Math.min(2.0, Math.max(0.4, rawDt));

      if (scatterRequestRef.current) {
        scatterRequestRef.current = false;
        for (let i = 0; i < dots.length; i++) {
          const d = dots[i];
          d.x = d.spawnX;
          d.y = d.spawnY;
          d.captured = false;
        }
      }

      ctx.clearRect(0, 0, logicalSize, logicalSize);

      const speedMult =
        (speedRef.current === 'fast' ? 1.6 : speedRef.current === 'gentle' ? 0.55 : 1.0) * dt;
      spinTime += 0.0038 * speedMult;

      const lerpFactor = Math.min(1, 0.075 * dt);
      smoothedSpread += (spreadAmountRef.current - smoothedSpread) * lerpFactor;
      smoothedRebirth += (orbitRebirthRef.current - smoothedRebirth) * lerpFactor;
      const targetHeroMorph = heroMorphRef.current + manualHeroOffsetRef.current;
      smoothedHeroMorph += (targetHeroMorph - smoothedHeroMorph) * (0.065 * dt);

      const targetRotRad = (scrollRotRef.current * Math.PI) / 180;
      smoothedRotRad += (targetRotRad - smoothedRotRad) * (0.055 * dt);

      const spread = Math.min(1, Math.max(0, smoothedSpread));
      const rebirth = Math.min(1, Math.max(0, smoothedRebirth));
      const rotRad = smoothedRotRad;

      const mouse = mouseRef.current;
      const interactionRadius = 115;

      const cycleStage = ((smoothedHeroMorph % 2) + 2) % 2;
      const rawHeroT = cycleStage <= 1 ? cycleStage : 2 - cycleStage;
      const heroMorphT = rawHeroT * rawHeroT * (3 - 2 * rawHeroT);

      // Shared 3D Galactic Plane Orientation for the Main Page Orbit Center
      const galPatternRot = spinTime * 0.92 + rotRad * 0.24;
      const spiralTotalWind = 2.35 + heroMorphT * 0.95;
      const galTiltX = 0.44 - heroMorphT * 0.18;
      const galTiltZ = -0.22 + rotRad * 0.1;
      const cosGalX = Math.cos(galTiltX);
      const sinGalX = Math.sin(galTiltX);
      const cosGalZ = Math.cos(galTiltZ);
      const sinGalZ = Math.sin(galTiltZ);

      // Subtle, organized Spiral Galaxy Core Glow & Geometric Filament Underlay on the Main Page
      if (isMainHeroShape && spread < 0.85) {
        const coreVisibility = (1 - spread) * rebirth;
        ctx.save();

        // 1. Soft radial galactic nucleus luminance
        const nucGlow = ctx.createRadialGradient(cx, cy, 2, cx, cy, 142);
        nucGlow.addColorStop(0, `rgba(255, 251, 235, ${0.22 * coreVisibility})`);
        nucGlow.addColorStop(0.24, `rgba(254, 240, 138, ${0.14 * coreVisibility})`);
        nucGlow.addColorStop(0.55, `rgba(249, 115, 22, ${0.06 * coreVisibility})`);
        nucGlow.addColorStop(1, 'rgba(234, 88, 12, 0)');
        ctx.fillStyle = nucGlow;
        ctx.beginPath();
        ctx.arc(cx, cy, 142, 0, Math.PI * 2);
        ctx.fill();

        // 2. Crisp concentric galactic resonance rings in the 3D tilted galaxy plane
        const guideRings = [34, 58, 94, 136];
        for (let rIdx = 0; rIdx < guideRings.length; rIdx++) {
          const ringR = guideRings[rIdx];
          ctx.beginPath();
          const steps = 64;
          for (let s = 0; s <= steps; s++) {
            const ang = (s / steps) * Math.PI * 2;
            const gx = Math.cos(ang) * ringR;
            const gy = Math.sin(ang) * ringR;
            const rotY = gy * cosGalX;
            const px = cx + (gx * cosGalZ - rotY * sinGalZ);
            const py = cy + (gx * sinGalZ + rotY * cosGalZ);
            if (s === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.strokeStyle =
            rIdx === 0
              ? `rgba(254, 240, 138, ${0.18 * coreVisibility})`
              : `rgba(251, 146, 60, ${0.1 * coreVisibility})`;
          ctx.lineWidth = rIdx === 0 ? 1.1 : 0.85;
          ctx.stroke();
        }

        // 3. 4 Symmetric Logarithmic Spiral Galaxy Arm Filament Guides
        for (let arm = 0; arm < 4; arm++) {
          const armBase = (arm * Math.PI) / 2;
          ctx.beginPath();
          const steps = 44;
          for (let s = 0; s <= steps; s++) {
            const u = s / steps;
            const r = 34 + u * 102;
            const ang = armBase + galPatternRot + u * spiralTotalWind;
            const gx = Math.cos(ang) * r;
            const gy = Math.sin(ang) * r;
            const rotY = gy * cosGalX;
            const px = cx + (gx * cosGalZ - rotY * sinGalZ);
            const py = cy + (gx * sinGalZ + rotY * cosGalZ);
            if (s === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.strokeStyle = `rgba(253, 224, 71, ${0.15 * coreVisibility})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }

        ctx.restore();
      }

      if (shapeMode === 'logo' && spread < 0.75 && rebirth > 0.4) {
        ctx.save();
        ctx.globalAlpha = (1 - spread) * rebirth * 0.035;
        ctx.fillStyle = '#fb923c';
        ctx.strokeStyle = '#fb923c';
        drawTumaneenLogotypeGeometry(ctx, cx, cy, 0.76);
        ctx.restore();
      }

      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];

        const flowWaveX =
          Math.sin(spinTime * d.flowFreq + d.flowPhase) *
          Math.cos(spinTime * 0.65 + d.theta);
        const flowWaveY =
          Math.cos(spinTime * d.flowFreq - d.flowPhase) *
          Math.sin(spinTime * 0.6 + d.phi);

        let sunX = cx;
        let sunY = cy;
        let sunZ = 0;

        const isCoreInCurrentMode =
          shapeMode === 'vortex-orbit' ? i < 520 : d.role === 'core';

        if (isCoreInCurrentMode) {
          if (isMainHeroShape) {
            // =====================================================================
            // MAIN PAGE CENTERPIECE: ORGANIZED GRAND-DESIGN 4-ARM SPIRAL GALAXY
            // - Zero random scatter; every star dot belongs to a crisp architectural tier:
            //   1. Golden-Angle Fibonacci Galactic Nucleus (r = 0..29px)
            //   2. Inner Accretion Halo Ring (r = 34px)
            //   3. 4 Symmetric 3-Ribbon Logarithmic Spiral Arms (r = 35..136px)
            //   4. 3 Concentric Galactic Resonance Rings (r = 58, 94, 136px)
            //   5. 8 Star-Cluster Rosette Nodes along the spiral spines
            // =====================================================================
            let gx = 0;
            let gy = 0;
            let gz = 0;

            if (d.galaxyTier === 'nucleus') {
              // Precision Golden-Angle Phyllotaxis Galactic Core
              const nucR = 29 * Math.sqrt(d.galaxyU);
              const nucAngle = i * 2.399963229728653 + galPatternRot * 1.35;
              gx = Math.cos(nucAngle) * nucR;
              gy = Math.sin(nucAngle) * nucR;
              gz = Math.cos(d.galaxyU * Math.PI * 0.5) * 12 * (i % 2 === 0 ? 1 : -1);
            } else if (d.galaxyTier === 'nucleus-ring') {
              // Crisp Inner Galactic Accretion Collar
              const ringAng = d.galaxyU * Math.PI * 2 + galPatternRot * 1.15;
              gx = Math.cos(ringAng) * d.galaxyRingRadius;
              gy = Math.sin(ringAng) * d.galaxyRingRadius;
              gz = Math.sin(ringAng * 4 + spinTime * 2.0) * 2.2;
            } else if (d.galaxyTier === 'spiral-arm') {
              // Continuous organized star flow along the 4 logarithmic spiral arms
              const flowingU = (d.galaxyU + spinTime * 0.052) % 1;
              const armBase = (d.galaxyArmIndex * Math.PI) / 2;
              const armR = 35 + flowingU * 101;
              const ribbonOffset = d.galaxyStreamOffset * (0.11 * (1 - flowingU * 0.42));
              const armAngle =
                armBase + galPatternRot + flowingU * spiralTotalWind + ribbonOffset;

              gx = Math.cos(armAngle) * armR;
              gy = Math.sin(armAngle) * armR;
              gz = d.galaxyStreamOffset * 4.0 * (1 - flowingU * 0.45);
            } else if (d.galaxyTier === 'resonance-ring') {
              // Concentric Galactic Resonance Rings (r = 58, 94, 136px)
              const ringDir = d.galaxyRingRadius === 94 ? -0.6 : 0.72;
              const resAngle = d.galaxyU * Math.PI * 2 + galPatternRot * ringDir;
              gx = Math.cos(resAngle) * d.galaxyRingRadius;
              gy = Math.sin(resAngle) * d.galaxyRingRadius;
              gz = 0;
            } else {
              // 8 Star-Cluster Rosette Nodes seated on the 4 spiral arms
              const nodeArmBase = (d.galaxyArmIndex * Math.PI) / 2;
              const nodeCenterR = 35 + d.galaxyU * 101;
              const nodeCenterAngle =
                nodeArmBase + galPatternRot + d.galaxyU * spiralTotalWind;
              const ncx = Math.cos(nodeCenterAngle) * nodeCenterR;
              const ncy = Math.sin(nodeCenterAngle) * nodeCenterR;

              const localR =
                d.galaxyNodeIndex === 0 ? 0 : d.galaxyNodeIndex <= 6 ? 4.2 : 8.0;
              const localCount = d.galaxyNodeIndex <= 6 ? 6 : 11;
              const localAng =
                ((d.galaxyNodeIndex * Math.PI * 2) / localCount) - spinTime * 1.6;

              gx = ncx + Math.cos(localAng) * localR;
              gy = ncy + Math.sin(localAng) * localR;
              gz = d.galaxyNodeIndex === 0 ? 3.5 : 0;
            }

            // Project 3D Galactic Coordinates into the tilted 3D galaxy plane
            const galRotY = gy * cosGalX - gz * sinGalX;
            const galRotZ = gy * sinGalX + gz * cosGalX;

            sunX = cx + (gx * cosGalZ - galRotY * sinGalZ) + flowWaveX * 0.06;
            sunY = cy + (gx * sinGalZ + galRotY * cosGalZ) + flowWaveY * 0.06;
            sunZ = galRotZ;
          } else {
            // 3D Solar Core for 'vortex-orbit'
            const surfaceHarmonic =
              1 +
              0.018 *
                Math.sin(d.phi * 5 + spinTime * 1.5) *
                Math.cos(d.theta * 4 - spinTime * 1.2);
            const coreSphereR = d.sphereRadius * 0.85 * surfaceHarmonic;

            const currentTheta = d.theta + spinTime * 0.85 + rotRad * 0.15;
            const sinPhi = Math.sin(d.phi);
            const cosPhi = Math.cos(d.phi);
            const sinTheta = Math.sin(currentTheta);
            const cosTheta = Math.cos(currentTheta);

            const x3d = coreSphereR * sinPhi * cosTheta;
            const y3d = coreSphereR * cosPhi;
            const z3d = coreSphereR * sinPhi * sinTheta;

            const tiltX = 0.3;
            const rotY = y3d * Math.cos(tiltX) - z3d * Math.sin(tiltX);
            const rotZ = y3d * Math.sin(tiltX) + z3d * Math.cos(tiltX);

            const cosR = Math.cos(rotRad * 0.12);
            const sinR = Math.sin(rotRad * 0.12);

            sunX = cx + (x3d * cosR - rotY * sinR);
            sunY = cy + (x3d * sinR + rotY * cosR);
            sunZ = rotZ;
          }
        } else {
          // 3D Tilted Planetary Orbit Bands (Kept 100% the same!)
          d.orbitAngle += d.orbitSpeed * speedMult;
          const totalTilt = d.orbitTilt + rotRad * 0.12;
          const cosT = Math.cos(totalTilt);
          const sinT = Math.sin(totalTilt);
          let rawX = Math.cos(d.orbitAngle) * d.orbitRx;
          let rawY = Math.sin(d.orbitAngle) * d.orbitRy;

          if (d.isSatelliteCluster) {
            const satAng = d.satOffsetAngle + spinTime * 2.2;
            rawX += Math.cos(satAng) * d.satOffsetR;
            rawY += Math.sin(satAng) * d.satOffsetR;
          }

          sunX = cx + rawX * cosT - rawY * sinT;
          sunY = cy + rawX * sinT + rawY * cosT;
          sunZ = Math.sin(d.orbitAngle) * (isMainHeroShape ? 120 : 95);
        }

        let atomX = cx;
        let atomY = cy;
        let atomZ = 0;
        if (shapeMode === 'atom') {
          if (i < 380) {
            const nucRadius = 38 * (0.32 + (i % 8) * 0.085);
            const nucTheta = d.theta + spinTime * 1.4 * (i % 2 === 0 ? 1 : -1) + rotRad * 0.12;
            const nucPhi = d.phi + spinTime * 0.85;
            atomX = cx + nucRadius * Math.sin(nucPhi) * Math.cos(nucTheta);
            atomY = cy + nucRadius * Math.cos(nucPhi);
            atomZ = nucRadius * Math.sin(nucPhi) * Math.sin(nucTheta);
          } else {
            const shellIdx = i % 3;
            const shellTilt = (shellIdx * Math.PI) / 3 + rotRad * 0.1 + spinTime * 0.09;
            const dir = shellIdx === 1 ? -1 : 1;
            const ringAngle =
              (i / (totalCount - 380)) * Math.PI * 6 +
              spinTime * (1.15 + (i % 5) * 0.05) * dir;
            const spreadRx = 206 + ((i % 5) - 2) * 1.6;
            const spreadRy = 64 + ((i % 5) - 2) * 1.4;

            const rawAx = Math.cos(ringAngle) * spreadRx;
            const rawAy = Math.sin(ringAngle) * spreadRy;
            const cosS = Math.cos(shellTilt);
            const sinS = Math.sin(shellTilt);

            atomX = cx + rawAx * cosS - rawAy * sinS;
            atomY = cy + rawAx * sinS + rawAy * cosS;
            atomZ = Math.sin(ringAngle) * 90;
          }
        }

        let sculptedX = sunX;
        let sculptedY = sunY;
        let sculptedZ = sunZ;

        if (shapeMode === 'logo') {
          sculptedX = d.logoX + flowWaveX * 0.28;
          sculptedY = d.logoY + flowWaveY * 0.28;
          sculptedZ = d.isLogoEdge ? 24 : 8;
        } else if (shapeMode === 'hand') {
          sculptedX = d.handX + flowWaveX * 0.3;
          sculptedY = d.handY + flowWaveY * 0.3;
          sculptedZ = d.isHandEdge ? 24 : 8;
        } else if (shapeMode === 'atom') {
          sculptedX = atomX;
          sculptedY = atomY;
          sculptedZ = atomZ;
        }

        d.circleAngle += d.circleAngularSpeed * speedMult;
        const circX = cx + Math.cos(d.circleAngle + rotRad * 0.12) * d.circleRadius;
        const circY = cy + Math.sin(d.circleAngle + rotRad * 0.12) * d.circleRadius * 0.76;

        const orbitLock = shapeMode === 'vortex-orbit' ? 0.25 + 0.75 * rebirth : rebirth;
        const baseShapeX = circX * (1 - orbitLock) + sculptedX * orbitLock;
        const baseShapeY = circY * (1 - orbitLock) + sculptedY * orbitLock;
        const baseShapeZ = sculptedZ * orbitLock + Math.sin(d.circleAngle) * 40 * (1 - orbitLock);

        if (d.role === 'surrounding') {
          const radiusFactor = Math.max(0.45, 240 / Math.max(45, d.spiralRadius));
          d.spiralAngle += d.spiralAngularSpeed * speedMult * radiusFactor;
          d.spiralRadius -= d.spiralInwardSpeed * speedMult;

          const minSurroundingR = isMainHeroShape ? 188 : 18;
          if (d.spiralRadius < minSurroundingR) {
            d.spiralRadius = 340 + Math.random() * 310;
            d.spiralAngle = Math.random() * Math.PI * 2;
          }

          const pullRatio = Math.min(1, d.spiralRadius / 420);
          let sx =
            baseShapeX +
            Math.cos(d.spiralAngle) * d.spiralRadius * pullRatio +
            flowWaveX * 2.4 +
            d.spreadOffsetX * spread * 0.95;
          let sy =
            baseShapeY +
            Math.sin(d.spiralAngle) * d.spiralRadius * pullRatio +
            flowWaveY * 2.4 +
            d.spreadOffsetY * spread * 0.95;

          if (mouse.active) {
            const mdx = sx + d.ox - mouse.x;
            const mdy = sy + d.oy - mouse.y;
            const mDist = Math.hypot(mdx, mdy);
            if (mDist < interactionRadius && mDist > 1) {
              const force = (1 - mDist / interactionRadius) * 1.8 * dt;
              d.vx += (mdx / mDist) * force;
              d.vy += (mdy / mDist) * force;
            }
          }

          d.vx += -d.ox * 0.12 * dt;
          d.vy += -d.oy * 0.12 * dt;
          d.vx *= 0.85;
          d.vy *= 0.85;
          d.ox += d.vx;
          d.oy += d.vy;

          d.x = sx + d.ox;
          d.y = sy + d.oy;
          d.z = Math.sin(d.spiralAngle) * 45;
          continue;
        }

        const swirlSpreadAngle =
          d.spreadSwirlAngle + spread * 0.85 + Math.sin(spinTime + d.flowPhase) * 0.18;
        const spreadMag = Math.hypot(d.spreadOffsetX, d.spreadOffsetY) * spread;

        const targetX =
          baseShapeX +
          Math.cos(swirlSpreadAngle) * spreadMag +
          flowWaveX * (0.24 + spread * 5.0);
        const targetY =
          baseShapeY +
          Math.sin(swirlSpreadAngle) * spreadMag +
          flowWaveY * (0.24 + spread * 5.0);
        const targetZ = baseShapeZ;

        if (mouse.active) {
          const baseTx = targetX + d.ox;
          const baseTy = targetY + d.oy;
          const mdx = baseTx - mouse.x;
          const mdy = baseTy - mouse.y;
          const mDist = Math.hypot(mdx, mdy);

          if (mDist < interactionRadius && mDist > 0.5) {
            const factor = 1 - mDist / interactionRadius;
            const pushStrength = factor * factor * 2.6 * dt;
            const swirlStrength = factor * 1.05 * dt;
            const ux = mdx / mDist;
            const uy = mdy / mDist;

            d.vx += ux * pushStrength - uy * swirlStrength + mouse.vx * 0.05 * factor;
            d.vy += uy * pushStrength + ux * swirlStrength + mouse.vy * 0.05 * factor;
          }
        }

        d.vx += -d.ox * 0.12 * dt;
        d.vy += -d.oy * 0.12 * dt;
        d.vx *= 0.84;
        d.vy *= 0.84;
        d.ox += d.vx;
        d.oy += d.vy;

        const finalTargetX = targetX + d.ox;
        const finalTargetY = targetY + d.oy;

        const catchRate = Math.min(0.24, 0.11 * dt);
        const trackRate = Math.min(0.32, 0.16 * dt);

        if (!d.captured) {
          const dx = finalTargetX - d.x;
          const dy = finalTargetY - d.y;
          d.x += dx * catchRate;
          d.y += dy * catchRate;

          if (Math.hypot(dx, dy) < 4.5) {
            d.captured = true;
          }
        } else {
          d.x += (finalTargetX - d.x) * trackRate;
          d.y += (finalTargetY - d.y) * trackRate;
        }

        d.z = targetZ;
      }

      // Two-pass depth rendering (back hemisphere first, front hemisphere second)
      for (let pass = 0; pass < 2; pass++) {
        for (let i = 0; i < dots.length; i++) {
          const d = dots[i];
          if (pass === 0 && d.z >= 0) continue;
          if (pass === 1 && d.z < 0) continue;

          const distFromCenter = Math.hypot(d.x - cx, d.y - cy);
          if (distFromCenter >= 685) continue;
          const edgeFeather =
            distFromCenter > 510 ? Math.max(0, 1 - (distFromCenter - 510) / 175) : 1;

          const perspective = 340 / Math.max(140, 340 - d.z);
          const depthScale = Math.min(1.45, Math.max(0.65, perspective));
          const spreadFade = Math.max(0.14, 1 - spread * 0.72) * edgeFeather;
          const depthAlpha =
            (d.z < -20 ? d.alpha * 0.52 : Math.min(1, d.alpha + 0.18)) * spreadFade;

          if (depthAlpha <= 0.01) continue;

          const distToMouse = mouse.active
            ? Math.hypot(d.x - mouse.x, d.y - mouse.y)
            : 9999;
          const hoverRatio =
            distToMouse < interactionRadius ? 1 - distToMouse / interactionRadius : 0;

          const twinkle = 0.88 + 0.2 * Math.sin(spinTime * 2.4 + d.twinklePhase + i * 0.7);
          const r = Math.max(
            0.64,
            d.dotSize * twinkle * depthScale * (1 + hoverRatio * 0.85)
          );

          if (
            hoverRatio > 0.15 ||
            ((i % 12 === 0 ||
              (d.isGalacticNucleus && i % 4 === 0) ||
              (d.isPrimarySpine && i % 3 === 0)) &&
              pass === 1)
          ) {
            ctx.beginPath();
            ctx.arc(d.x, d.y, r * 1.85, 0, Math.PI * 2);
            ctx.fillStyle =
              hoverRatio > 0.15 || d.isGalacticNucleus || d.isPrimarySpine
                ? '#fde047'
                : '#f97316';
            ctx.globalAlpha =
              (hoverRatio * 0.34 + (d.isGalacticNucleus || d.isPrimarySpine ? 0.15 : 0.09)) *
              depthAlpha;
            ctx.fill();
          }

          ctx.beginPath();
          ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
          ctx.fillStyle =
            hoverRatio > 0.28
              ? '#ffffff'
              : (d.isGalacticNucleus ||
                  d.isPrimarySpine ||
                  d.isLogoEdge ||
                  d.isHandEdge ||
                  d.isSatelliteCluster) &&
                i % 2 === 0
              ? '#fff7ed'
              : d.color;
          ctx.globalAlpha = Math.min(1, depthAlpha + hoverRatio * 0.38);
          ctx.fill();
        }
      }

      if (mouse.active) {
        const cursorGlow = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          2,
          mouse.x,
          mouse.y,
          64
        );
        cursorGlow.addColorStop(0, 'rgba(254, 240, 138, 0.26)');
        cursorGlow.addColorStop(0.5, 'rgba(249, 115, 22, 0.1)');
        cursorGlow.addColorStop(1, 'rgba(249, 115, 22, 0)');
        ctx.globalAlpha = 1;
        ctx.fillStyle = cursorGlow;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 64, 0, Math.PI * 2);
        ctx.fill();
      }

      mouse.vx *= 0.85;
      mouse.vy *= 0.85;

      ctx.globalAlpha = 1;
    };

    animId = requestAnimationFrame(render);

    return () => {
      clearTimeout(phaseTimer);
      cancelAnimationFrame(animId);
    };
  }, [shapeMode]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = 1400 / rect.width;
    const scaleY = 1400 / rect.height;

    const nextX = (e.clientX - rect.left) * scaleX;
    const nextY = (e.clientY - rect.top) * scaleY;

    mouseRef.current.vx = nextX - mouseRef.current.x;
    mouseRef.current.vy = nextY - mouseRef.current.y;
    mouseRef.current.x = nextX;
    mouseRef.current.y = nextY;
    mouseRef.current.active = true;
    if (!cursorActive) setCursorActive(true);
  };

  const handlePointerLeave = () => {
    mouseRef.current.active = false;
    mouseRef.current.x = -9999;
    mouseRef.current.y = -9999;
    setCursorActive(false);
  };

  const sizeClasses =
    size === 'hero-xl'
      ? 'max-w-[260px] sm:max-w-[440px] md:max-w-[540px] lg:max-w-[640px] xl:max-w-[700px]'
      : size === 'compact'
      ? 'max-w-[220px] sm:max-w-[330px] md:max-w-[400px] lg:max-w-[460px]'
      : size === 'responsive'
      ? 'w-full'
      : 'max-w-[240px] sm:max-w-[350px] md:max-w-[420px] lg:max-w-[480px]';

  const currentHeroStageIdx = Math.round(heroMorphProgress + manualHeroShapeOffset) % 2;
  const heroMorphTitle =
    currentHeroStageIdx === 0
      ? 'BURNING SUN & GALAXY ORBIT'
      : 'SWIRLING SPIRAL GALAXY ORBIT';

  const shapeTitle =
    shapeMode === 'logo'
      ? 'TUMANEEN LOGOTYPE'
      : shapeMode === 'hand'
      ? 'SERVICES HAND & GEAR'
      : shapeMode === 'vortex-orbit'
      ? orbitRebirthProgress > 0.45
        ? 'CIRCULAR ORBITS SHAPE'
        : 'CIRCULAR STAR MOTION'
      : shapeMode === 'atom'
      ? 'CIRCULAR MOVING ATOM'
      : heroMorphTitle;

  return (
    <div
      ref={wrapperRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={triggerReignite}
      style={{ touchAction: 'pan-y' }}
      className={`relative w-full ${sizeClasses} aspect-square flex items-center justify-center select-none group cursor-crosshair touch-pan-y ${
        isCentered ? 'mx-auto' : ''
      } ${className}`}
      title="Point cursor to interact with the star dots, or click to morph / re-form"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-[-65%] sm:inset-[-85%] w-[230%] sm:w-[270%] h-[230%] sm:h-[270%] z-20 pointer-events-none"
      />

      <div className="absolute top-4 sm:top-6 left-1/4 -translate-x-1/2 pointer-events-none opacity-85 z-30 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_8px_#fde047]" />
        <span className="w-1 h-1 rounded-full bg-orange-400" />
      </div>

      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute right-0 sm:-right-2 bottom-0 sm:bottom-4 text-right pointer-events-auto z-30 flex flex-col items-end gap-1 sm:gap-1.5 scale-90 sm:scale-100 origin-bottom-right"
      >
        <div className="text-[9px] sm:text-[10px] font-mono tracking-[0.14em] sm:tracking-[0.2em] text-[#eedfd2]/85 uppercase leading-relaxed border-r-2 border-orange-500/70 pr-2 sm:pr-2.5 bg-[#0b0908]/85 backdrop-blur-md py-1 pl-2 rounded-l">
          <p className="text-amber-300 font-semibold">
            {cursorActive ? 'STAR FIELD ACTIVE' : shapeTitle}
          </p>
          <p className="text-orange-400">
            {shapeMode === 'sun' ? '2,600 GALAXY & SUN STAR DOTS' : '1,740 REFINED STAR DOTS'}
          </p>
        </div>

        <div className="flex items-center gap-1.5 pr-1">
          <button
            onClick={triggerReignite}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-black/60 hover:bg-orange-500/25 border border-stone-700/70 text-[9px] font-mono text-stone-300 hover:text-amber-300 uppercase tracking-wider transition-colors cursor-pointer"
            title={
              shapeMode === 'sun'
                ? 'Switch between Burning Sun & Swirling Spiral Galaxy Core'
                : 'Re-form shape from circular star motion'
            }
          >
            <Sparkles className="w-2.5 h-2.5" />
            <span>
              {shapeMode === 'sun'
                ? 'GALAXY PULSE'
                : formationPhase === 'converging'
                ? 'BUILDING'
                : 'RE-FORM'}
            </span>
          </button>

          <button
            onClick={() =>
              setSpeed((s) => (s === 'normal' ? 'fast' : s === 'fast' ? 'gentle' : 'normal'))
            }
            className="px-2 py-0.5 rounded bg-black/50 border border-stone-700/60 text-[9px] font-mono text-stone-300 hover:text-orange-400 transition-colors uppercase tracking-wider cursor-pointer"
            title="Adjust star dot velocity"
          >
            {speed}
          </button>
        </div>
      </div>
    </div>
  );
};
