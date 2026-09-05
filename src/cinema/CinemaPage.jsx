'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from './ThemeProvider';
import { dialsEnabled } from './formations/lockupConfig';
import './cinema.css';

// The lockup dials are a development tool. next/dynamic with ssr false keeps the panel out
// of the server render, and the gate below is evaluated on the client after mount, so a
// production page contains neither the panel nor its markup unless somebody asks for it
// with ?dials=1.
const DialsPanel = dynamic(() => import('./DialsPanel'), { ssr: false });

// ☠️ NOTHING THREE.JS IS IMPORTED HERE, AND THAT IS THE POINT. A static import at the top
// of this file puts a 3D engine in the route's chunk, so the browser downloads and
// evaluates it before it can hydrate a page whose visible content is server rendered
// text. Measured on the mobile Lighthouse run before this change: 2,092ms of scripting in
// the cinema chunk, Total Blocking Time 1,610ms, performance 44. The engine now arrives
// through an await inside the effect, which by definition runs after paint, so the copy
// is on screen and readable while three.js is still on its way.

/**
 * The scroll cinema: one WebGL canvas, one particle cloud, one formation per beat, and a
 * DOM panel per beat that carries the copy (crawlable, and the only thing a screen reader
 * is offered). `beats` is the arc config; `panels` are the React nodes, one per beat.
 */
export default function CinemaPage({ beats, panels = [], classicHref = '/classic' }) {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const beatsRef = useRef(beats);
  const engineRef = useRef(null);
  const { dark } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    const root = rootRef.current;
    if (!canvas || !root) return undefined;

    // ---- WebGL floor ----
    // A visitor must always be able to reach the site. If WebGL cannot create a context
    // the cinema would render BLANK, so bail to the plain page instead. We probe on a
    // throwaway canvas so the renderer gets a clean context of its own. This fires ONLY on
    // a true context-creation failure, never on reduced motion or a slow GPU. It runs
    // BEFORE the engine is imported, so a browser that cannot draw never downloads three.
    let probeGl = null;
    try {
      const probe = document.createElement('canvas');
      probeGl = probe.getContext('webgl2') || probe.getContext('webgl');
    } catch (e) {
      probeGl = null;
    }
    if (!probeGl) {
      window.location.assign(classicHref);
      return undefined;
    }

    let disposed = false;
    import('./engine/cinemaEngine')
      .then(({ startCinema }) => {
        if (disposed) return null;
        return startCinema({
          canvas,
          root,
          beats: beatsRef.current,
          isDark: document.documentElement.getAttribute('data-theme') === 'dark',
        });
      })
      .then((engine) => {
        if (!engine) return;
        if (disposed) engine.destroy();
        else engineRef.current = engine;
      })
      .catch(() => {});

    return () => {
      disposed = true;
      engineRef.current?.destroy();
      engineRef.current = null;
    };
    // The arc is fixed for the life of the route, so the engine boots once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classicHref]);

  // a theme tap repaints the cloud in place; it never rebuilds the scene
  useEffect(() => {
    engineRef.current?.paint(dark);
  }, [dark]);

  // Evaluated after mount, never during render: reading location during the first render
  // would disagree with the server's HTML and throw a hydration mismatch.
  const [showDials, setShowDials] = useState(false);
  useEffect(() => { setShowDials(dialsEnabled()); }, []);

  return (
    <div className="cinema-root" ref={rootRef}>
      {showDials && <DialsPanel />}
      {/* the id is the room's contract: it hides #gl while it holds the screen */}
      <canvas id="gl" ref={canvasRef} className="cinema-gl" />
      <div className="cinema-vignette" />
      <nav className="cinema-rail" aria-hidden="true">
        {beats.map((b, i) => <span key={b.key || i} className="cinema-tick" />)}
      </nav>
      <div className="cinema-scroll">
        {beats.map((b, i) => <section key={b.key || i} className="cinema-beat" />)}
      </div>
      {beats.map((b, i) => (
        <div
          key={b.key || i}
          className={`cinema-panel${(b.copyLow ?? b.kind === 'lockup') ? ' copy-low' : ''}`}
          aria-hidden={i !== 0}
        >
          {panels[i]}
        </div>
      ))}
    </div>
  );
}
