'use client';

// ClientMarquee: doctors at our booth and at their own clinics, as a moving strip.
//
// Jarich, 2026-10-12: "add a part for Roson, Denjoy. the k clamp has one already but lets
// improve it add marquee as well and get all the videos of our clients who bought from
// conventions". One strip, three pages (/dentalchairs, /denjoy, /k-clamps). The strip is
// ONLY the strip and its viewer: each page writes its own heading in its own type, because
// the three pages speak three design languages and a shared heading would match none.
//
// The items come from src/data/clients/booth-clients.json through lib/clients/boothClients.js.
// Every frame in that file was looked at before it went in; the manifest's `excluded` list
// says what was left out and why (prices on screen, competitor banners, patients).
//
// ☠️ THE TRACK CARRIES .dsd-strip-track SO THE SITE'S ONE MarqueeSpeed (SiteShell) TIMES IT.
// Speed is derived from the track's own width there (lib/cinema/marquee.js), the same
// measured px/s as every other photo strip on the site. A fixed duration here would drift
// the moment a clip is added.

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { mediaUrl } from '@/lib/cinema/media';
import styles from './clientMarquee.module.css';

/** A strip this short reads as one row; longer ones split into two that run opposite ways. */
const TWO_ROWS_FROM = 14;

function Tile({ item, onOpen, live, copy }) {
  return (
    <button type="button" className={styles.tile} onClick={onOpen} tabIndex={copy ? -1 : undefined} aria-label={`${item.alt}. ${item.tag}. Open`}>
      {item.kind === 'video' && live ? (
        <video
          className={styles.media}
          src={mediaUrl(item.src)}
          poster={item.poster}
          muted
          loop
          playsInline
          autoPlay
          preload="none"
          aria-hidden="true"
        />
      ) : (
        <Image
          className={styles.media}
          src={item.kind === 'video' ? item.poster : item.src}
          alt=""
          width={360}
          height={640}
          sizes="(max-width: 700px) 150px, 190px"
          quality={78}
          loading="lazy"
        />
      )}
      {item.kind === 'video' ? <span className={styles.play} aria-hidden="true">▶</span> : null}
      <span className={styles.chip}>{item.tag}</span>
    </button>
  );
}

function Viewer({ items, index, onClose, onStep }) {
  const item = items[index];
  const closeRef = useRef(null);

  // A clip in the viewer plays WITH sound: the site's music steps aside for it on the same
  // dsd:videoaudio contract the news theater and the home reels use, and comes back after.
  useEffect(() => {
    if (item.kind !== 'video') return undefined;
    window.dispatchEvent(new CustomEvent('dsd:videoaudio', { detail: { on: true } }));
    return () => window.dispatchEvent(new CustomEvent('dsd:videoaudio', { detail: { on: false } }));
  }, [item]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') onStep(1);
      else if (e.key === 'ArrowLeft') onStep(-1);
    };
    document.addEventListener('keydown', onKey);
    const html = document.documentElement;
    const before = html.style.overflow;
    html.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      html.style.overflow = before;
    };
  }, [onClose, onStep]);

  return (
    <div className={styles.viewer} role="dialog" aria-modal="true" aria-label={item.alt} onClick={onClose}>
      <figure className={styles.viewerFig} onClick={(e) => e.stopPropagation()}>
        {item.kind === 'video' ? (
          <video
            key={item.id}
            className={styles.viewerMedia}
            src={mediaUrl(item.src)}
            poster={item.poster}
            controls
            autoPlay
            playsInline
          />
        ) : (
          <Image
            key={item.id}
            className={styles.viewerMedia}
            src={item.src}
            alt={item.alt}
            width={item.w || 720}
            height={item.h || 1280}
            sizes="(max-width: 700px) 92vw, 480px"
            quality={85}
          />
        )}
        <figcaption className={styles.viewerCap}>
          <span className={styles.viewerTag}>{item.tag}</span>
          <span>{item.alt}</span>
          {item.source?.url ? (
            <a href={item.source.url} target="_blank" rel="noopener noreferrer" className={styles.viewerLink}>
              See the {item.source.platform === 'tiktok' ? 'TikTok' : 'Facebook'} post
            </a>
          ) : null}
        </figcaption>
      </figure>
      <button type="button" className={`${styles.nav} ${styles.prev}`} onClick={(e) => { e.stopPropagation(); onStep(-1); }} aria-label="Previous">‹</button>
      <button type="button" className={`${styles.nav} ${styles.next}`} onClick={(e) => { e.stopPropagation(); onStep(1); }} aria-label="Next">›</button>
      <button type="button" ref={closeRef} className={styles.close} onClick={onClose} aria-label="Close">✕</button>
    </div>
  );
}

export default function ClientMarquee({ items = [], label = 'Doctors at our booth and in their clinics' }) {
  const rootRef = useRef(null);
  // near: mount the full doubled tracks and their media once the strip is close.
  // inView: run the animation and the muted clips only while it is on screen.
  const [near, setNear] = useState(false);
  const [inView, setInView] = useState(false);
  const [open, setOpen] = useState(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined; // every supported browser has it
    const nearIo = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setNear(true); nearIo.disconnect(); } }, { rootMargin: '600px 0px' });
    const viewIo = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: '80px 0px' });
    nearIo.observe(el);
    viewIo.observe(el);
    return () => { nearIo.disconnect(); viewIo.disconnect(); };
  }, []);

  // pause the muted tile clips while the strip is off screen
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    for (const v of el.querySelectorAll('video')) {
      if (inView) v.play().catch(() => {});
      else v.pause();
    }
  }, [inView, near]);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback((d) => setOpen((i) => (i === null ? i : (i + d + items.length) % items.length)), [items.length]);

  if (!items.length) return null;

  const half = Math.ceil(items.length / 2);
  const rows = items.length >= TWO_ROWS_FROM
    ? [items.slice(0, half).map((it, i) => [it, i]), items.slice(half).map((it, i) => [it, i + half])]
    : [items.map((it, i) => [it, i])];

  return (
    <div ref={rootRef} className={styles.root} data-live={inView ? '1' : '0'} role="region" aria-label={label}>
      {rows.map((row, r) => (
        <div className={styles.row} key={r}>
          <div className={`${styles.track} dsd-strip-track${r === 1 ? ` ${styles.reverse}` : ''}`} data-marquee={`clients-${r + 1}`}>
            {(near ? [...row, ...row] : row.slice(0, 4)).map(([item, idx], i) => (
              <div key={`${r}-${i}-${item.id}`} className={styles.cell} aria-hidden={i >= row.length ? 'true' : undefined}>
                <Tile item={item} live={near} copy={i >= row.length} onOpen={() => setOpen(idx)} />
              </div>
            ))}
          </div>
        </div>
      ))}
      {open !== null && typeof document !== 'undefined'
        ? createPortal(<Viewer items={items} index={open} onClose={close} onStep={step} />, document.body)
        : null}
    </div>
  );
}
