'use client';

// The swap picker: everything already in public/images/news, public/cinema and
// public/videos, with a preview and a search box. Read only — it hands back a
// path and the caller decides what to do with it.

import { useEffect, useRef, useState } from 'react';

import { isVideoPath } from '@/lib/studio/registry';

export default function AssetPicker({ onPick, onClose, needPx = null, tilePx = null }) {
  const [q, setQ] = useState('');
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [busy, setBusy] = useState(true);
  const box = useRef(null);

  useEffect(() => {
    let live = true;
    setBusy(true);
    // A short debounce: the walk is cheap but the search fires on every key.
    const t = setTimeout(() => {
      fetch(`/api/studio/assets?q=${encodeURIComponent(q)}`)
        .then((r) => r.json())
        .then((d) => {
          if (!live) return;
          setItems(d.items || []);
          setTotal(d.total || 0);
        })
        .finally(() => live && setBusy(false));
    }, 180);
    return () => {
      live = false;
      clearTimeout(t);
    };
  }, [q]);

  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', esc);
    box.current?.focus();
    return () => window.removeEventListener('keydown', esc);
  }, [onClose]);

  return (
    <div className="st-modal" role="dialog" aria-modal="true" aria-label="Pick a file">
      <div className="st-modal-scrim" onClick={onClose} />
      <div className="st-modal-box">
        <div className="st-modal-top">
          <input
            ref={box}
            className="st-search"
            placeholder="Search by path: installs, roson, showroom, .mp4 …"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <span className="st-f-n">
            {busy ? 'looking…' : `${items.length} of ${total}`}
          </span>
          <button type="button" className="st-btn ghost sm" onClick={onClose}>Close</button>
        </div>
        <div className="st-picker">
          {items.map((it) => {
            // ☠️ A FILE THIS LIST CANNOT SHOW IS GREYED AND REFUSED, NOT
            // HIDDEN. Hiding it would leave somebody hunting for a photograph
            // they can see in the articles, with no way to learn why it is not
            // offered. Greyed, with its own width in the reason, teaches.
            //
            // The bar is the target list's budget against this file's width, so
            // it covers every file in the library rather than the handful a
            // manifest happened to flag. A video has no width here and is never
            // barred by it.
            const why =
              needPx && it.kind !== 'video' && it.width != null && it.width < needPx
                ? `${it.width}px wide. ${tilePx}px tiles need ${needPx}px at DPR 2.`
                : null;
            return (
            <button
              type="button"
              className={`st-pick${why ? ' barred' : ''}`}
              key={it.src}
              disabled={!!why}
              onClick={() => !why && onPick(it)}
              title={why ? `Too small for this set: ${why}` : it.src}
            >
              {isVideoPath(it.src) ? (
                // eslint-disable-next-line jsx-a11y/media-has-caption
                <video src={it.src} muted playsInline preload="metadata" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={it.src} alt="" loading="lazy" />
              )}
              <span className="st-pick-n">{it.name}</span>
              {why ? (
                <span className="st-pick-x">too small here</span>
              ) : it.bytes ? (
                <span className="st-pick-b">{Math.round(it.bytes / 1024)} KB</span>
              ) : null}
            </button>
            );
          })}
          {!busy && !items.length ? <p className="st-empty">Nothing matches that.</p> : null}
        </div>
      </div>
    </div>
  );
}
