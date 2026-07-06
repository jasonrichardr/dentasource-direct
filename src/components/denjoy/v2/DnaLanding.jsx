'use client';

// DENJOY LANDING — apechain-mobile design DNA, rebuilt as DSD.
// Layer model: LAYER 0 atmosphere (fixed, scene-graded canvas) →
// LAYER 1 content (scenes) → LAYER 2 chrome (fixed bar + takeover menu).
// Scroll doesn't move the background — it RE-LIGHTS it (scene grading).
// Blueprint: ~/second-brain/Mnemosyne Designs/assets/blueprints/apechain-mobile/

import { useEffect, useRef, useState } from 'react';
import { Anton, DM_Mono, DM_Sans } from 'next/font/google';
import DnaChrome from './DnaChrome';
import HeroArc from './HeroArc';
import { Spotlight, InstrumentsRail, ChapterWall, DnaFaq } from './DnaSections';
import DnaFooter from './DnaFooter';
import styles from './v2.module.css';

// The three type voices (blueprint law: jump scale, no middle sizes).
const display = Anton({ weight: '400', subsets: ['latin'], variable: '--dna-display', display: 'swap' });
const mono = DM_Mono({ weight: ['400', '500'], subsets: ['latin'], variable: '--dna-mono', display: 'swap' });
const sans = DM_Sans({ weight: ['400', '500', '700'], subsets: ['latin'], variable: '--dna-sans', display: 'swap' });

// Topographic contour pattern — the SVG stand-in for the reference's shader.
function Contours() {
  const rings = [90, 150, 215, 285, 360, 440, 525, 615];
  return (
    <svg
      className={styles.contours}
      viewBox="0 0 800 1400"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.3">
        {rings.map((r, i) => (
          <ellipse key={`t${r}`} cx="400" cy="380" rx={r * 1.18} ry={r * 0.82} transform={`rotate(${i % 2 ? -4 : 3} 400 380)`} />
        ))}
        {rings.map((r, i) => (
          <ellipse key={`b${r}`} cx="180" cy="1180" rx={r * 1.3} ry={r * 0.7} transform={`rotate(${i % 2 ? 6 : -5} 180 1180)`} />
        ))}
      </g>
    </svg>
  );
}

export default function DnaLanding() {
  const rootRef = useRef(null);
  const [scene, setScene] = useState('hero');
  const [scrolled, setScrolled] = useState(false);

  // Scene grading — whichever zone crosses the viewport's middle band
  // becomes the active scene; the atmosphere cross-fades to match.
  useEffect(() => {
    const zones = rootRef.current?.querySelectorAll('[data-scene-zone]');
    if (!zones?.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setScene(e.target.getAttribute('data-scene-zone'));
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );
    zones.forEach((z) => io.observe(z));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      ref={rootRef}
      className={`${styles.root} ${display.variable} ${mono.variable} ${sans.variable}`}
      data-scene={scene}
      data-scrolled={scrolled ? '1' : '0'}
    >
      {/* LAYER 0 · atmosphere */}
      <div className={styles.atmosphere} aria-hidden="true">
        <div className={`${styles.scene} ${styles.sceneHero}`} />
        <div className={`${styles.scene} ${styles.sceneMid}`} />
        <div className={`${styles.scene} ${styles.sceneFooter}`} />
        <Contours />
      </div>

      {/* LAYER 2 · chrome (fixed bar + menu takeover) */}
      <DnaChrome />

      {/* LAYER 1 · content scenes */}
      <div className={styles.zoneMain}>
        <HeroArc />
        <div data-scene-zone="mid">
          <Spotlight />
          <InstrumentsRail />
          <ChapterWall />
          <DnaFaq />
        </div>
        <DnaFooter />
      </div>
    </div>
  );
}
