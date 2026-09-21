'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

/**
 * The constellation ground for every news route.
 *
 * The sky is decoration, so it must never be on the path to first paint. Two gates keep
 * it off that path: next/dynamic keeps the canvas and its baked bitmaps out of the
 * route's own chunk, and the idle gate below keeps even the fetch from competing with
 * the article's own text and hero image. An article's LCP is the headline, not a canvas.
 *
 * Everything else is already the engine's contract and is deliberately NOT re-implemented
 * here: NightSky itself starts only in dark and stops in light, pauses in place on
 * dsd:room so the room's veil still shows stars, and nightSky.js draws a single still
 * frame under prefers-reduced-motion.
 */
const NightSky = dynamic(() => import('@/cinema/NightSky'), { ssr: false });

export default function NewsSky() {
  const [lit, setLit] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let idle = 0;
    let timer = 0;
    const light = () => {
      if (!cancelled) setLit(true);
    };

    // requestIdleCallback does not exist in Safari, so the timeout is the floor there,
    // not a race with it.
    if (typeof window.requestIdleCallback === 'function') {
      idle = window.requestIdleCallback(light, { timeout: 2000 });
    } else {
      timer = window.setTimeout(light, 400);
    }

    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
      if (idle && typeof window.cancelIdleCallback === 'function') window.cancelIdleCallback(idle);
    };
  }, []);

  if (!lit) return null;
  return <NightSky />;
}
