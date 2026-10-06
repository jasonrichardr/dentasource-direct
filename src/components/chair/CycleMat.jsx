'use client';

// The featured card's photograph: the A3 turns slowly through its colorways while the card is
// on screen. It stops when the card scrolls away or the tab is hidden, and under
// prefers-reduced-motion it never starts (the first color stays). Opacity and transform only,
// the same crossfade as the page's own switcher.

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const EVERY_MS = 3200;

export default function CycleMat({ frames, alt, sizes }) {
  const [i, setI] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || frames.length < 2) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let timer = 0;
    let onScreen = false;
    const run = () => {
      clearInterval(timer);
      timer = 0;
      if (onScreen && document.visibilityState === 'visible') {
        timer = setInterval(() => setI((n) => (n + 1) % frames.length), EVERY_MS);
      }
    };
    const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; run(); }, { threshold: 0.35 });
    io.observe(el);
    document.addEventListener('visibilitychange', run);
    return () => {
      clearInterval(timer);
      io.disconnect();
      document.removeEventListener('visibilitychange', run);
    };
  }, [frames.length]);

  return (
    <div ref={ref} className="ch-plx" data-parallax="0.04">
      {frames.map((f, k) => (
        <div key={f.key} className={`ch-layer${k === i ? ' is-on' : ''}`} aria-hidden={k === i ? undefined : 'true'}>
          <Image src={f.src} alt={k === i ? `${alt} in ${f.name}` : ''} fill sizes={sizes} quality={85} />
        </div>
      ))}
      <span className="ch-card-cycle-name" aria-hidden="true">{frames[i].name}</span>
    </div>
  );
}
