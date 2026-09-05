'use client';

import { useEffect, useRef } from 'react';
import { createNightSky } from './sky/nightSky';
import { useTheme } from './ThemeProvider';

// The sky canvas behind everything. It only ever runs in dark: a light-mode visitor
// never pays for a star.
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

  return <canvas ref={canvasRef} className="cinema-sky" aria-hidden="true" />;
}
