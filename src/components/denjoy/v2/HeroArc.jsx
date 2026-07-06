'use client';

// SCENE 1 · HERO SHOWCASE — the 3D cylinder carousel (Rail A build: CSS 3D,
// no WebGL). Six arc-cards on a ring; drag to spin, gentle auto-rotate,
// and the caption (eyebrow chip · display headline · mono tagline · pill CTA)
// is BOUND to whichever card faces you — "dynamic showcase binding".

import { useEffect, useRef, useState } from 'react';
import { m as motion, AnimatePresence } from 'framer-motion';
import { trackContact } from '@/lib/analytics';
import { arcStars, messengerUrl } from './dnaContent';
import Pill from './Pill';
import styles from './v2.module.css';

const N = arcStars.length;          // 6 cards
const STEP = 360 / N;               // 60° apart
const RADIUS = 236;                 // ring radius (px) — spacing = 2R·sin(30°) = R
const EASE = [0.4, 0, 0.2, 1];      // the house easing

export default function HeroArc() {
  const ringRef = useRef(null);
  const stageRef = useRef(null);
  const theta = useRef(0);          // current ring rotation (deg)
  const vel = useRef(0);            // drag inertia (deg/frame)
  const dragging = useRef(false);
  const autoOn = useRef(true);
  const resumeTimer = useRef(null);
  const lastX = useRef(0);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf;
    const tick = () => {
      if (!dragging.current) {
        if (Math.abs(vel.current) > 0.02) {
          theta.current += vel.current;
          vel.current *= 0.94;                       // momentum decay
        } else if (autoOn.current && !reduced) {
          theta.current -= 0.09;                     // gentle auto-rotate
        }
      }
      if (ringRef.current) {
        ringRef.current.style.transform =
          `translateZ(-${RADIUS}px) rotateY(${theta.current}deg)`;
      }
      const idx = ((Math.round(-theta.current / STEP) % N) + N) % N;
      if (idx !== activeRef.current) {
        activeRef.current = idx;
        setActive(idx);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const pauseAuto = () => {
    autoOn.current = false;
    clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => { autoOn.current = true; }, 3500);
  };

  const onPointerDown = (e) => {
    dragging.current = true;
    lastX.current = e.clientX;
    vel.current = 0;
    pauseAuto();
    stageRef.current?.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastX.current;
    lastX.current = e.clientX;
    theta.current += dx * 0.35;                      // drag sensitivity
    vel.current = dx * 0.35;                         // feeds the flick
  };
  const endDrag = () => {
    dragging.current = false;
    pauseAuto();
  };

  const star = arcStars[active];
  const inquire = () => trackContact({ channel: 'messenger', content_name: star.slug });

  return (
    <section id="top" className={styles.hero} data-scene-zone="hero">
      {/* the cylinder */}
      <div
        ref={stageRef}
        className={styles.stage}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
        role="group"
        aria-label="Denjoy product showcase — drag to rotate"
      >
        <div ref={ringRef} className={styles.ring}>
          {arcStars.map((p, i) => (
            <div
              key={p.slug}
              className={styles.arcCard}
              style={{ transform: `rotateY(${i * STEP}deg) translateZ(${RADIUS}px)` }}
            >
              <div className={styles.arcImgWrap}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.heroImage}
                  alt={p.fullName}
                  className={styles.arcImg}
                  draggable={false}
                  loading={i < 3 ? 'eager' : 'lazy'}
                />
              </div>
              <span className={`${styles.chipGlass} ${styles.chipInk} ${styles.arcChip}`}>
                {p.chapterName}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* dynamic showcase caption — bound to the facing card */}
      <div className={styles.heroCaption}>
        <AnimatePresence mode="wait">
          <motion.div
            key={star.slug}
            initial={{ opacity: 0, y: 16, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
            transition={{ duration: 0.32, ease: EASE }}
            className={styles.heroCaption}
          >
            <p className={styles.eyebrowRow}>
              <span className={styles.eyebrowHot} aria-hidden="true">🔥 {star.isFlagship ? 'Flagship' : star.isNew ? 'New' : 'Hot'}</span>
              <span className={styles.chipGlass}>{star.chapterName}</span>
            </p>
            <h1 className={`${styles.display} ${styles.heroTitle}`}>{star.name}</h1>
            <p className={`${styles.mono} ${styles.heroTagline}`}>{star.tagline}</p>
            <div className={styles.heroCtaRow}>
              <Pill
                href={messengerUrl(star.messengerText)}
                external
                onClick={inquire}
                label="Inquire"
              />
              <a href="#instruments" className={styles.monoLink}>
                See all 12 instruments <span aria-hidden="true">▶</span>
              </a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
