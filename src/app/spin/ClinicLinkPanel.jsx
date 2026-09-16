'use client';

import { useEffect, useState, useTransition } from 'react';
import { searchUrl } from '@/lib/spin/console';
import { MARK, AppleMark, AndroidMark, WindowsMark } from './brandMarks';

const PENDING = 'nadti-pending-link';

const OFFERS = [
  { t: 'Digital Dentistry courses', s: 'Scanners, CAD and CAM, guided workflows.' },
  { t: 'Dental Assistant training', s: 'Chairside skills your team can certify in.' },
  { t: 'Member promos', s: 'First dibs on chairs and consumables.' },
  { t: 'DentaDesk, free', s: 'Your own clinic app on every platform.', platforms: true },
];

const PLATFORMS = [
  { id: 'google', label: 'Google Maps', hint: 'Paste your Google Maps link' },
  { id: 'facebook', label: 'Facebook', hint: 'Page link or @handle' },
  { id: 'instagram', label: 'Instagram', hint: 'Profile link or @handle' },
  { id: 'tiktok', label: 'TikTok', hint: 'Profile link or @handle' },
];

/**
 * Props: clinic (string), linked ({ [platform]: url }), googleLinked (bool),
 * onLink(platform, value) -> Promise<{ ok, url } | { error }>.
 */
export default function ClinicLinkPanel({ clinic, linked = {}, googleLinked = false, onLink }) {
  const [open, setOpen] = useState(null);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');
  const [pending, start] = useTransition();

  const isLinked = (id) => !!linked[id] || (id === 'google' && googleLinked);

  // Coming back from the app (or the browser back button): reopen the paste box for the platform they left for.
  useEffect(() => {
    const restore = () => {
      try {
        const p = sessionStorage.getItem(PENDING);
        if (p) { sessionStorage.removeItem(PENDING); setOpen(p); setDraft(''); setError(''); }
      } catch { /* ignore */ }
    };
    restore();
    window.addEventListener('pageshow', restore);
    return () => window.removeEventListener('pageshow', restore);
  }, []);

  // Same tab on purpose: on a phone the universal link hands off to the installed app and this page
  // stays underneath; the visitor comes straight back to the paste box. No new tab to lose.
  const tap = (id) => {
    if (isLinked(id)) return;
    if (open === id) { setOpen(null); return; }
    const url = searchUrl(id, clinic);
    try { sessionStorage.setItem(PENDING, id); } catch { /* ignore */ }
    setOpen(id); setDraft(''); setError('');
    window.setTimeout(() => { window.location.href = url; }, 60);
  };

  const save = (e) => {
    e.preventDefault();
    const id = open;
    start(async () => {
      const r = await onLink(id, draft);
      if (r?.error) { setError(r.error); return; }
      setOpen(null); setDraft(''); setError('');
    });
  };

  return (
    <section className="link-panel" aria-label="Link your clinic">
      <p className="eyebrow">Link your clinic</p>
      <h3 className="link-title">Be first to hear about these</h3>
      <p className="link-lede">Link your clinic and the DentaSource Direct Training Center keeps you posted.</p>
      <ul className="offers">
        {OFFERS.map((o) => (
          <li key={o.t} className="offer">
            <span className="offer-t">{o.t}</span>
            <span className="offer-s">{o.s}</span>
            {o.platforms ? (
              <span className="platforms" aria-label="Mac, Windows, iOS, and Android">
                <AppleMark size={16} /><WindowsMark size={16} /><AndroidMark size={16} />
                <span className="platforms-t">Mac · Windows · iOS · Android</span>
              </span>
            ) : null}
          </li>
        ))}
      </ul>
      <div className="chips">
        {PLATFORMS.map((p) => {
          const Mark = MARK[p.id];
          const on = isLinked(p.id);
          return (
            <button
              key={p.id}
              type="button"
              className={`chip ${on ? 'linked' : ''} ${open === p.id ? 'open' : ''}`}
              onClick={() => tap(p.id)}
              aria-pressed={on}
            >
              <Mark size={22} />
              <span>{p.label}</span>
              {on ? <span className="chip-check" aria-label="linked">✓</span> : null}
            </button>
          );
        })}
      </div>
      {open ? (
        <form className="paste" onSubmit={save}>
          <p className="paste-hint">Find {clinic || 'your clinic'} on {PLATFORMS.find((p) => p.id === open)?.label}, copy your page link, then come back here and paste it.</p>
          <div className="paste-row">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={PLATFORMS.find((p) => p.id === open)?.hint}
              inputMode="url"
              autoCapitalize="none"
              autoCorrect="off"
              aria-label={`${PLATFORMS.find((p) => p.id === open)?.label} link`}
            />
            <button type="submit" className="cta small" disabled={pending || !draft.trim()}>{pending ? 'Saving' : 'Link'}</button>
          </div>
          {error ? <p className="field-error">{error}</p> : null}
          <button type="button" className="ghost" onClick={() => { setOpen(null); setError(''); }}>Skip for now</button>
        </form>
      ) : (
        <p className="fineprint">Optional. Tap a platform, find your clinic, paste the link.</p>
      )}
    </section>
  );
}
