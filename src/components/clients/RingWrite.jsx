'use client';

// RingWrite: a heading that writes itself in fire, the way the inscription rises on the One
// Ring (Jarich, 2026-10-12: "make like an animation of writing the header so it looks magical
// and cool like the ring in the lord of the rings").
//
// Each letter is born as a white-gold spark, burns orange, then cools into the page's own
// heading colour, left to right, about 55 ms apart. When the last letter lands the whole line
// keeps an ember glow that pulses twice and settles. It starts when half the heading is on
// screen, once. Reduced motion shows the cooled line straight away (the CSS owns that).
//
// The heading is read whole: the letters are aria-hidden and the element carries the text as
// its aria-label, so a screen reader hears "Delivered, installed and smiling ..." and not
// forty separate characters.
//
// It takes the PAGE's font, size and colour: it is used inside three different design
// languages (chairs, Denjoy DNA, the K-Clamp lab) and must look native in each.

import { useEffect, useRef, useState } from 'react';
import styles from './ringWrite.module.css';

const STEP_MS = 55;
const BURN_MS = 1600;

export default function RingWrite({ text, as: Tag = 'h2', className = '' }) {
  const ref = useRef(null);
  const [phase, setPhase] = useState('idle'); // idle → writing → done

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      setPhase('writing');
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const letters = text.replace(/\s/g, '').length;
  useEffect(() => {
    if (phase !== 'writing') return undefined;
    const t = setTimeout(() => setPhase('done'), letters * STEP_MS + BURN_MS);
    return () => clearTimeout(t);
  }, [phase, letters]);

  const words = text.split(' ');
  let n = 0;
  return (
    <Tag ref={ref} className={`${className} ${styles.ring}`} data-ring={phase} aria-label={text}>
      {words.map((w, wi) => (
        <span key={`${wi}-${w}`}>
          <span className={styles.word} aria-hidden="true">
            {[...w].map((ch, ci) => {
              const i = n;
              n += 1;
              return <span key={ci} className={styles.ch} style={{ '--i': i }}>{ch}</span>;
            })}
          </span>
          {wi < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </Tag>
  );
}
