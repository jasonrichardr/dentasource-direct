'use client';

// A pop-up sheet for the growth-partner page (round 4). Portaled to <body> so it escapes the page's stacking
// contexts (.gp > * sits at z-index 1 and the sticky header at 5). html.sheet-open hides the room's dock.
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function GpSheet({ open, onClose, kicker, title, children, wide }) {
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
  if (!mounted || !open) return null;
  return createPortal(
    <div className="gp-sheet" role="dialog" aria-modal="true" aria-label={title}>
      <div className="gp-sheet-scrim" onClick={onClose} />
      <div className={`gp-sheet-card ${wide ? 'wide' : ''}`}>
        <button type="button" className="gp-sheet-x" aria-label="Close" onClick={onClose}>✕</button>
        <div className="gp-sheet-scroll">
          {kicker ? <p className="gp-kicker">{kicker}</p> : null}
          {title ? <h3 className="gp-sheet-title">{title}</h3> : null}
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}

/** A module list, the shape used by every track and JDev sheet. */
export function ModuleList({ lead, modules, idPrefix }) {
  return (
    <>
      {lead ? <p className="gp-sheet-lead">{lead}</p> : null}
      <ol className="modlist">
        {modules.map((m, i) => <li key={m.title} id={idPrefix ? `${idPrefix}-m${i + 1}` : undefined}><b>{m.title}</b><ul>{m.points.map((pt) => <li key={pt}>{pt}</li>)}</ul></li>)}
      </ol>
    </>
  );
}
