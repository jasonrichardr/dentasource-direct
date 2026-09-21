'use client';

import { useEffect } from 'react';
import { CREDITS_VIDEOS, CREDITS_PHOTOS } from '@/data/credits';

/** Grand Prize pop-up: what ₱30,000 of training credits buys, as a two-row marquee of our own videos and photos. Lives at the main level (never inside a backdrop-filter card). */
export default function CreditsSheet({ open, onClose }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    document.documentElement.classList.add('sheet-open');
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; document.documentElement.classList.remove('sheet-open'); };
  }, [open, onClose]);
  if (!open) return null;
  const vids = [...CREDITS_VIDEOS, ...CREDITS_VIDEOS];
  const pics = [...CREDITS_PHOTOS, ...CREDITS_PHOTOS];
  return (
    <div className="sheet-back" onClick={onClose} role="presentation">
      <section className="sheet credits-sheet" role="dialog" aria-modal="true" aria-label="₱30,000 Training Credits" onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => { const el = e.currentTarget; el.dataset.y0 = String(e.touches[0].clientY); el.dataset.top = String(el.scrollTop); }}
        onTouchEnd={(e) => { const el = e.currentTarget; const dy = e.changedTouches[0].clientY - Number(el.dataset.y0 || 0); if (dy > 90 && Number(el.dataset.top || 0) <= 2) onClose(); }}>
        <div className="sheet-grab" aria-hidden />
        <button type="button" className="sheet-x" onClick={onClose} aria-label="Close">×</button>
        <p className="eyebrow">Grand Prize</p>
        <h3 className="sheet-title credits-title">₱30,000 Training Credits</h3>
        <p className="lede">Spend them on any course at the DentaSource Direct Training Center in Pasig: digital dentistry, orthodontics, endodontics, prosthodontics, chairside skills. Mentors at your shoulder, the tools in your hands.</p>
        <div className="marquee" aria-label="Training Center videos">
          <div className="marquee-track">
            {vids.map((v, i) => (
              <figure key={`${v.src}-${i}`} className="mq-item mq-video">
                <video src={v.src} poster={v.poster} muted loop autoPlay playsInline preload="metadata" aria-label={v.cap} />
              </figure>
            ))}
          </div>
        </div>
        <div className="marquee reverse" aria-label="Training Center photos">
          <div className="marquee-track">
            {pics.map((p, i) => (
              <figure key={`${p.src}-${i}`} className="mq-item"><img src={p.src} alt={p.cap} loading="lazy" /></figure>
            ))}
          </div>
        </div>
        <ul className="credits-facts">
          <li><b>Where</b><span>DentaSource Direct Training Center, inside the largest dental showroom in the country, Pasig</span></li>
          <li><b>What</b><span>Lectures and hands-on batches, small groups, real equipment</span></li>
          <li><b>Who</b><span>Selected partner clinics, subject to DentaSource Direct approval</span></li>
        </ul>
        <a className="cta" href="/growth-partner">See the Training Center</a>
        <button type="button" className="ghost" onClick={onClose}>Back</button>
      </section>
    </div>
  );
}
