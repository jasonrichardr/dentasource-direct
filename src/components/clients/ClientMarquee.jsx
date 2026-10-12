'use client';

// ClientMarquee: the brand strip on /dentalchairs, /denjoy and /k-clamps.
//
// Jarich, 2026-10-12: "add a part for Roson, Denjoy. the k clamp has one already but lets
// improve it add marquee as well", then the same day: "add videos and images ... so the
// videos autoplay every 3 images". The strip is ONLY the strip and its viewer: each page
// writes its own heading in its own type, because the three pages speak three design
// languages and a shared heading would match none.
//
// The items come from lib/clients/brandMedia.js (three photographs, then a clip). Every
// photo and clip in that manifest was looked at before it went in.
//
// ☠️ THE TRACK CARRIES .dsd-strip-track SO THE SITE'S ONE MarqueeSpeed (SiteShell) TIMES IT.
// Speed is derived from the track's own width there (lib/cinema/marquee.js), the same
// measured px/s as every other photo strip on the site. A fixed duration here would drift
// the moment a clip is added.
//
// ☠️ A CLIP TILE MOUNTS ITS <video> ONLY WHILE IT IS ON SCREEN. The ROSON strip carries 33
// clips, 66 with the loop's echo; 66 live <video> elements (each one fetching its poster on
// mount, since a poster is never lazy) would be a page nobody's phone can hold. Off screen a
// clip tile is its poster as a lazy <Image>; on screen it becomes a muted looping clip.
//
// ☠️ endAt: MANY REELS CLOSE ON A WHITE DSD CARD WITH A QR CODE AND A PHONE NUMBER. A tile
// loops back before it; the viewer stops there. The times were measured per clip.

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { mediaUrl } from '@/lib/cinema/media';
import styles from './clientMarquee.module.css';

/** A strip this short reads as one row; longer ones split into two that run opposite ways. */
const TWO_ROWS_FROM = 14;

const SOURCE_LABEL = { news: 'Read the story', facebook: 'See the Facebook post', tiktok: 'See the TikTok post' };

/** True while the element is (nearly) on screen. Clipping by the strip's overflow counts. */
function useOnScreen(ref, enabled) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { rootMargin: '0px 160px', threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, enabled]);
  return on;
}

function Tile({ item, onOpen, live, copy }) {
  const ref = useRef(null);
  const isVideo = item.kind === 'video';
  const onScreen = useOnScreen(ref, live && isVideo);
  const loopBeforeCard = (e) => {
    const v = e.currentTarget;
    if (item.endAt && v.currentTime >= item.endAt) v.currentTime = 0;
  };
  return (
    <button
      ref={ref}
      type="button"
      className={styles.tile}
      onClick={onOpen}
      tabIndex={copy ? -1 : undefined}
      aria-label={`${item.tag}. Open`}
    >
      {isVideo && onScreen ? (
        <video
          className={styles.media}
          src={mediaUrl(item.src)}
          poster={item.poster}
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          onTimeUpdate={item.endAt ? loopBeforeCard : undefined}
          aria-hidden="true"
        />
      ) : (
        <Image
          className={styles.media}
          src={isVideo ? item.poster : item.src}
          alt=""
          width={360}
          height={640}
          sizes="(max-width: 700px) 150px, 190px"
          quality={78}
          loading="lazy"
        />
      )}
      {isVideo ? <span className={styles.play} aria-hidden="true">▶</span> : null}
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

  const stopBeforeCard = (e) => {
    const v = e.currentTarget;
    if (item.endAt && v.currentTime >= item.endAt) v.pause();
  };

  // ☠️ ONLY THE HEADER UNDER THE PICTURE (Jarich, 2026-10-12: "remove these brother its
  // awkward but leave the header"). The describing sentence read like a caption written for a
  // screen reader; it stays on the tile's aria-label path, never on screen.
  return (
    <div className={styles.viewer} role="dialog" aria-modal="true" aria-label={item.tag} onClick={onClose}>
      <figure className={styles.viewerFig} onClick={(e) => e.stopPropagation()}>
        {item.kind === 'video' ? (
          <video
            key={item.id}
            className={styles.viewerMedia}
            src={mediaUrl(item.hd || item.src)}
            poster={item.poster}
            controls
            autoPlay
            playsInline
            onTimeUpdate={item.endAt ? stopBeforeCard : undefined}
          />
        ) : (
          <Image
            key={item.id}
            className={styles.viewerMedia}
            src={item.src}
            alt={item.alt || item.tag}
            width={item.w || 720}
            height={item.h || 1280}
            sizes="(max-width: 700px) 92vw, 480px"
            quality={85}
          />
        )}
        <figcaption className={styles.viewerCap}>
          <span className={styles.viewerTag}>{item.tag}</span>
          {item.source?.url ? (
            <a
              href={item.source.url}
              target={item.source.platform === 'news' ? undefined : '_blank'}
              rel={item.source.platform === 'news' ? undefined : 'noopener noreferrer'}
              className={styles.viewerLink}
            >
              {SOURCE_LABEL[item.source.platform] || 'See the post'}
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
  // near: mount the full doubled tracks once the strip is close.
  // inView: run the animation only while it is on screen.
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
                <Tile item={item} live={near && inView} copy={i >= row.length} onOpen={() => setOpen(idx)} />
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
