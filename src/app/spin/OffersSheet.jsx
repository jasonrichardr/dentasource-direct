'use client';

import { useEffect } from 'react';
import { TRACKS, REELS } from '@/data/growth';

/** In-wheel pop-up for the Training Center offers. Lives at the main level (never inside a backdrop-filter card). */
export default function OffersSheet({ open, focus, onClose }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    document.documentElement.classList.add('sheet-open');
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; document.documentElement.classList.remove('sheet-open'); };
  }, [open, onClose]);
  if (!open) return null;
  const first = TRACKS.find((t) => t.id === focus);
  const rest = TRACKS.filter((t) => t.id !== focus);
  return (
    <div className="sheet-back" onClick={onClose} role="presentation">
      <section className="sheet" role="dialog" aria-modal="true" aria-label="Training Center offers" onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => { const el = e.currentTarget; el.dataset.y0 = String(e.touches[0].clientY); el.dataset.top = String(el.scrollTop); }}
        onTouchEnd={(e) => { const el = e.currentTarget; const dy = e.changedTouches[0].clientY - Number(el.dataset.y0 || 0); if (dy > 90 && Number(el.dataset.top || 0) <= 2) onClose(); }}>
        <div className="sheet-grab" aria-hidden />
        <button type="button" className="sheet-x" onClick={onClose} aria-label="Close">×</button>
        <p className="eyebrow">DentaSource Direct Training Center</p>
        <h3 className="sheet-title">Your growth partner in dentistry</h3>
        <p className="lede">Inside the largest dental showroom in the country. Every lecture is hands-on, every tool within reach.</p>
        <div className="sheet-reels">
          {REELS.slice(0, 3).map((r) => (
            <video key={r.src} src={r.src} poster={r.poster} muted loop autoPlay playsInline preload="metadata" aria-label={r.cap} />
          ))}
        </div>
        <ul className="sheet-tracks">
          {[first, ...rest].filter(Boolean).map((t) => (
            <li key={t.id} className={t.id === focus ? 'hot' : ''}>
              <span className={`t-ic ${t.plate ? 'plate' : ''}`}><img src={t.icon} alt="" /></span>
              <span className="t-body"><b>{t.label}</b><small>{t.promise}</small></span>
            </li>
          ))}
        </ul>
        <p className="fineprint">Batches open after NADTI 2026. Seats limited. Pricing on reply.</p>
        <a className="cta" href={`/growth-partner#reserve`}>Reserve my seat</a>
        <button type="button" className="ghost" onClick={onClose}>Back to my prize</button>
      </section>
    </div>
  );
}
