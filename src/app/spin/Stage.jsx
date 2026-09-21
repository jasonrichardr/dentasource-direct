'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

// Drifting particle field behind the stage + a confetti burst layer.
// `burst` is a number; every change fires a new burst.
export default function Stage({ burst = 0, big = false }) {
  const bgRef = useRef(null);
  const fxRef = useRef(null);
  const reduced = useReducedMotion();

  // particles
  useEffect(() => {
    const canvas = bgRef.current;
    if (!canvas || reduced) return;
    const ctx = canvas.getContext('2d');
    let raf = 0;
    let w = 0; let h = 0;
    const dots = Array.from({ length: 70 }, () => ({
      x: Math.random(), y: Math.random(), r: 0.6 + Math.random() * 1.8,
      vx: (Math.random() - 0.5) * 0.00025, vy: -0.00012 - Math.random() * 0.0002,
      a: 0.25 + Math.random() * 0.5, gold: Math.random() < 0.25,
    }));
    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);
    let last = performance.now();
    const loop = (now) => {
      const dt = Math.min(50, now - last); last = now;
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        d.x += d.vx * dt; d.y += d.vy * dt;
        if (d.y < -0.02) { d.y = 1.02; d.x = Math.random(); }
        if (d.x < -0.02) d.x = 1.02; if (d.x > 1.02) d.x = -0.02;
        ctx.beginPath();
        ctx.fillStyle = d.gold ? `rgba(212,175,55,${d.a})` : `rgba(52,211,153,${d.a})`;
        ctx.shadowBlur = 8; ctx.shadowColor = d.gold ? '#d4af37' : '#34d399';
        ctx.arc(d.x * w, d.y * h, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, [reduced]);

  // confetti
  useEffect(() => {
    if (!burst) return;
    const canvas = fxRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = canvas.clientWidth; const h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const colors = ['#d4af37', '#fff3b0', '#10b981', '#34d399', '#ffffff', '#84cc16'];
    const n = reduced ? 40 : (big ? 220 : 140);
    const pieces = Array.from({ length: n }, () => {
      const ang = -Math.PI / 2 + (Math.random() - 0.5) * 1.6;
      const sp = 6 + Math.random() * 9;
      return {
        x: w / 2, y: h * 0.45, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 4,
        rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.3,
        sw: 4 + Math.random() * 6, sh: 6 + Math.random() * 8,
        c: colors[Math.floor(Math.random() * colors.length)], life: 1,
      };
    });
    let raf = 0; const t0 = performance.now();
    const loop = (now) => {
      const t = (now - t0) / 1000;
      ctx.clearRect(0, 0, w, h);
      for (const p of pieces) {
        p.vy += 0.22; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        p.life = Math.max(0, 1 - t / 2.8);
        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.sw / 2, -p.sh / 2, p.sw, p.sh);
        ctx.restore();
      }
      if (t < 3) raf = requestAnimationFrame(loop); else ctx.clearRect(0, 0, w, h);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [burst, big, reduced]);

  return (
    <>
      <canvas ref={bgRef} className="stage-bg" aria-hidden />
      <canvas ref={fxRef} className="stage-fx" aria-hidden />
    </>
  );
}
