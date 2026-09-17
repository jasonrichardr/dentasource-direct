'use client';

// Sky + theme + the room on /growth-partner (2026-09-17, Jarich: "background the constellation like from
// ffcdentalclinic.com/growth-partner the dark and day mode and mp3 thank you brother 1:1").
// Dark by default, day mode remembered per phone (key dsd:lounge-theme, shared with the room's moon switch).
import { useEffect, useState } from 'react';
import LoungeRoom from '../spin/LoungeRoom';

export function useTheme() {
  const [theme, setTheme] = useState('dark');
  useEffect(() => {
    const html = document.documentElement;
    let saved = null;
    try { saved = localStorage.getItem('dsd:lounge-theme'); } catch { /* ignore */ }
    const t = saved === 'light' ? 'light' : 'dark';
    html.setAttribute('data-theme', t); setTheme(t);
    const obs = new MutationObserver(() => setTheme(html.getAttribute('data-theme') === 'light' ? 'light' : 'dark'));
    obs.observe(html, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);
  const flip = () => {
    const html = document.documentElement;
    const next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', next);
    try { localStorage.setItem('dsd:lounge-theme', next); } catch { /* ignore */ }
  };
  return { theme, flip };
}

export function ThemeSwitch() {
  const { theme, flip } = useTheme();
  return (
    <button type="button" className="gp-theme" onClick={flip} aria-label={theme === 'dark' ? 'Switch to day mode' : 'Switch to night mode'} title={theme === 'dark' ? 'Day mode' : 'Night mode'}>
      {theme === 'dark' ? '☀' : '☾'}
    </button>
  );
}

/** Mounts the room (dock + sky + music). The room's own sky.js paints stars while html[data-theme=dark]. */
export default function GpSky() {
  return <LoungeRoom />;
}
