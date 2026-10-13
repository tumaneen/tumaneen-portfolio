import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  color: string;
  alpha: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

export const CosmicStarfield: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    };

    window.addEventListener('resize', handleResize);

    const starCount = Math.min(140, Math.floor((width * height) / 12000));
    let stars: Star[] = [];

    const starColors = [
      '#ffffff',
      '#ffedd5', // warm cream
      '#fed7aa', // warm amber
      '#fb923c', // orange
      '#ea580c', // terracotta
    ];

    const initStars = () => {
      stars = [];
      for (let i = 0; i < starCount; i++) {
        const color = starColors[Math.floor(Math.random() * starColors.length)];
        const baseAlpha = 0.2 + Math.random() * 0.7;
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() < 0.85 ? Math.random() * 1.4 + 0.5 : Math.random() * 2.2 + 1.2,
          color,
          alpha: baseAlpha,
          baseAlpha,
          twinkleSpeed: 0.008 + Math.random() * 0.02,
          twinklePhase: Math.random() * Math.PI * 2,
        });
      }
    };

    initStars();

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = width / 2;
    let targetMouseY = height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let step = 0;

    const render = () => {
      step += 1;
      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      const offsetX = (mouseX - width / 2) * 0.015;
      const offsetY = (mouseY - height / 2) * 0.015;

      ctx.clearRect(0, 0, width, height);

      // Render stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.twinklePhase += star.twinkleSpeed;
        const currentAlpha = star.baseAlpha + Math.sin(star.twinklePhase) * 0.3;
        const clampedAlpha = Math.max(0.1, Math.min(1, currentAlpha));

        ctx.fillStyle = star.color;
        ctx.globalAlpha = clampedAlpha;

        const posX = star.x - offsetX * (star.size * 0.8);
        const posY = star.y - offsetY * (star.size * 0.8);

        ctx.beginPath();
        ctx.arc(posX, posY, star.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-70"
      aria-hidden="true"
    />
  );
};
