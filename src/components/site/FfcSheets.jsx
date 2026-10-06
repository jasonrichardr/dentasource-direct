'use client';

// Round 5 (2026-09-17): two sheets copied 1:1 from ffcdentalclinic.com. GlassSheet = the About sheet grammar
// (bs-card / as-*), PrivacySheet = the /careers privacy pop-up grammar (pv-*). Both portaled to <body> so the
// page's `.gp > *` stacking contexts cannot trap them; html.sheet-open hides the room's dock.
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

function useSheet(open, onClose) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (!open) return undefined;
    const html = document.documentElement;
    html.classList.add('sheet-open');
    const prev = html.style.overflow; html.style.overflow = 'hidden';
    const key = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', key);
    return () => { html.classList.remove('sheet-open'); html.style.overflow = prev; window.removeEventListener('keydown', key); };
  }, [open, onClose]);
  return mounted;
}

/** The FFC about-sheet: dark glass card, ✕ that rides the corner, logo, kicker, serif head, paragraphs, pillars. */
export function GlassSheet({ open, onClose, label, children }) {
  const mounted = useSheet(open, onClose);
  if (!mounted || !open) return null;
  return createPortal(
    <div className="ffc-as open" role="dialog" aria-modal="true" aria-label={label}>
      <div className="as-scrim" onClick={onClose} aria-hidden />
      <div className="bs-card as-card">
        <button type="button" className="as-x" aria-label="Close" onClick={onClose}>✕</button>
        <div className="as-scroll">{children}</div>
      </div>
    </div>,
    document.body,
  );
}

/** The FFC /careers privacy pop-up, with the DentaSource crest. */
export function PrivacySheet({ open, onClose, privacy, crest, title, foot }) {
  const mounted = useSheet(open, onClose);
  if (!mounted || !open) return null;
  return createPortal(
    <div className="ffc-pv" role="dialog" aria-modal="true" aria-labelledby="gp-pv-title">
      <div className="pv-scrim" onClick={onClose} aria-hidden />
      <div className="pv-card">
        <button type="button" className="pv-x" aria-label="Close" onClick={onClose}>✕</button>
        <div className="pv-scroll">
          <img className="pv-crest" src={crest} alt="" decoding="async" />
          <div className="pv-kicker">Your privacy</div>
          <h2 id="gp-pv-title" className="pv-title">{title}</h2>
          <p className="pv-lead">{privacy.lead}</p>
          {privacy.items.map((it) => <section key={it.title} className="pv-sec"><h3>{it.title}</h3><p>{it.text}</p></section>)}
          <p className="pv-foot">{foot}</p>
          <button type="button" className="ffc-btn pv-ok" onClick={onClose}>I understand</button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
