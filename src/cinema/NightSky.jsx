'use client';

import { useEffect, useRef } from 'react';
import { createNightSky } from './sky/nightSky';
import { useTheme } from './ThemeProvider';

// The sky canvas behind everything. It only ever runs in dark: a light-mode visitor
// never pays for a star.
//
// The id is part of the contract the room was ported against: while the room is open it
// hides the cinema but restores #sky, so the stars stay lit behind it. One cinema per
// page, so one #sky.
export default function NightSky() {
  const canvasRef = useRef(null);
  const skyRef = useRef(null);
  const { dark } = useTheme();

  useEffect(() => {
    if (!canvasRef.current) return undefined;
    const sky = createNightSky(canvasRef.current);
    skyRef.current = sky;
    return () => {
      skyRef.current = null;
      sky.destroy();
    };
  }, []);

  useEffect(() => {
    const sky = skyRef.current;
    if (!sky) return;
    if (dark) sky.start();
    else sky.stop();
  }, [dark]);

  return <canvas id="sky" ref={canvasRef} className="cinema-sky" aria-hidden="true" />;
}
