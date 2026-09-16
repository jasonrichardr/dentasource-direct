'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, animate, useReducedMotion } from 'framer-motion';
import { WEDGES, PRIZE_BY_ID } from '@/lib/spin/prizes';
import { tick, thud } from './audio';

const R = 100;                 // wheel radius in viewBox units
const WEDGE = 360 / WEDGES.length;
const LEDS = 36;
const FILLS = ['#065f46', '#F5F5F7', '#84cc16'];
const INK = ['#ffffff', '#065f46', '#0A1410'];

function polar(deg, r) {
  const a = ((deg - 90) * Math.PI) / 180;
  return [r * Math.cos(a), r * Math.sin(a)];
}

function wedgePath(i) {
  const a0 = i * WEDGE;
  const a1 = a0 + WEDGE;
  const [x0, y0] = polar(a0, R);
  const [x1, y1] = polar(a1, R);
  return `M0 0 L${x0.toFixed(3)} ${y0.toFixed(3)} A${R} ${R} 0 0 1 ${x1.toFixed(3)} ${y1.toFixed(3)} Z`;
}

function Label({ i, id }) {
  const p = PRIZE_BY_ID[id];
  const parts = p.short.split(' ');
  const two = parts.length > 1 && p.short.length > 7;
  const ink = INK[i % 3];
  const centre = i * WEDGE + WEDGE / 2;
  // Past 6 o'clock the outward reading direction points left, so read inward instead.
  const flip = centre > 180;
  return (
    <text
      transform={`rotate(${centre}) translate(0,-62) rotate(${flip ? 90 : -90})`}
      textAnchor="middle"
      fill={ink}
      fontSize={two ? 9 : 10.5}
      fontWeight="800"
      letterSpacing="0.6"
      style={{ fontFamily: 'var(--font-instrument), var(--font-inter), sans-serif' }}
    >
      {two ? (
        <>
          <tspan x="0" dy="-1.5">{parts[0]}</tspan>
          <tspan x="0" dy="10">{parts.slice(1).join(' ')}</tspan>
        </>
      ) : (
        <tspan x="0" dy="3.5">{p.short}</tspan>
      )}
    </text>
  );
}

/**
 * Props:
 *  wedgeIndex  – server-chosen wedge to land on (0..11)
 *  spinning    – flips true to start the spin
 *  onDone      – called once the wheel has stopped
 *  spinKey     – bump to allow another spin (spin again)
 */
export default function Wheel({ wedgeIndex, spinning, onDone, spinKey = 0 }) {
  const rotate = useMotionValue(0);
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState('idle'); // idle | spinning | landed
  const lastKey = useRef(-1);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    if (!spinning || lastKey.current === spinKey) return;
    lastKey.current = spinKey;
    setPhase('spinning');

    const current = rotate.get();
    const centre = wedgeIndex * WEDGE + WEDGE / 2;
    const jitter = (Math.random() * 2 - 1) * WEDGE * 0.38;
    const mod = ((current % 360) + 360) % 360;
    const delta = (((360 - centre) - mod) % 360 + 360) % 360;
    const target = current + 360 * 6 + delta + jitter;

    let lastSector = Math.floor(current / WEDGE);
    const controls = animate(rotate, target, {
      duration: reduced ? 0.6 : 5.6,
      ease: [0.12, 0.78, 0.16, 1],
      onUpdate: (v) => {
        const sector = Math.floor(v / WEDGE);
        if (sector !== lastSector) {
          const progress = (v - current) / (target - current);
          tick(0.5 + 0.5 * (1 - progress));
          lastSector = sector;
        }
      },
      onComplete: () => {
        setPhase('landed');
        thud();
        try { navigator.vibrate?.([60, 40, 90]); } catch { /* no haptics */ }
        doneRef.current?.();
      },
    });
    return () => controls.stop();
  }, [spinning, spinKey, wedgeIndex, rotate, reduced]);

  return (
    <div className={`wheel-wrap ${phase}`}>
      <div className="wheel-glow" aria-hidden />

      {/* LED rim, does not rotate */}
      <svg className="wheel-rim" viewBox="-120 -120 240 240" aria-hidden>
        <defs>
          <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff3b0" />
            <stop offset="0.35" stopColor="#d4af37" />
            <stop offset="0.7" stopColor="#8a6a12" />
            <stop offset="1" stopColor="#f6dd7a" />
          </linearGradient>
        </defs>
        <circle r="110" fill="none" stroke="url(#gold)" strokeWidth="9" />
        <circle r="104.5" fill="none" stroke="#0A1410" strokeWidth="1.2" opacity="0.6" />
        {Array.from({ length: LEDS }).map((_, i) => {
          const [x, y] = polar((i * 360) / LEDS, 110);
          return (
            <circle key={i} className="led" cx={x} cy={y} r="2.6" style={{ '--i': i }} />
          );
        })}
      </svg>

      {/* rotating disc */}
      <motion.div className="wheel-disc" style={{ rotate }}>
        <svg viewBox="-110 -110 220 220" className="wheel-svg">
          {WEDGES.map((id, i) => (
            <path key={i} d={wedgePath(i)} fill={FILLS[i % 3]} stroke="#d4af37" strokeWidth="0.9" />
          ))}
          {WEDGES.map((id, i) => <Label key={`l${i}`} i={i} id={id} />)}
          <circle r="16" fill="url(#gold)" stroke="#fff3b0" strokeWidth="1.2" />
          <circle r="10" fill="#0A1410" opacity="0.85" />
          <circle r="6.5" fill="#d4af37" />
        </svg>
      </motion.div>

      {/* pointer */}
      <svg className="wheel-pointer" viewBox="-12 -12 24 34" aria-hidden>
        <path d="M0 20 L-10 0 A10 10 0 1 1 10 0 Z" fill="url(#gold)" stroke="#fff3b0" strokeWidth="1" />
        <circle cy="-1" r="4" fill="#0A1410" />
      </svg>
    </div>
  );
}
