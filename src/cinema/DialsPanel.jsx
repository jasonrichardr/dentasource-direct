'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  LOCKUP_DIAL_META,
  getLockupDials,
  setLockupDials,
  resetLockupDials,
  exportLockupDials,
} from './formations/lockupConfig';

/**
 * The lockup dials, on the page, for tuning by eye.
 *
 * ☠️ NEVER IN PRODUCTION HTML. The caller decides whether to render this at all, and it
 * decides on the client only, so a production build has no panel in its markup and no
 * slider markup in its payload. Moving a slider writes the live dial set, which raises
 * 'dsd:lockup-dials', which the engine answers with a lockup rebuild.
 */
export default function DialsPanel() {
  const [dials, setDials] = useState(() => getLockupDials());
  const [open, setOpen] = useState(true);
  const [copied, setCopied] = useState(false);

  // Somebody else may move the same dials (the studio, or a reset elsewhere on the page).
  useEffect(() => {
    const onExternal = (e) => {
      if (e?.detail?.source === 'panel') return;      // our own echo
      setDials(getLockupDials());
    };
    window.addEventListener('dsd:lockup-dials', onExternal);
    return () => window.removeEventListener('dsd:lockup-dials', onExternal);
  }, []);

  const groups = useMemo(() => {
    const by = new Map();
    for (const m of LOCKUP_DIAL_META) {
      if (!by.has(m.group)) by.set(m.group, []);
      by.get(m.group).push(m);
    }
    return [...by.entries()];
  }, []);

  const move = (key, value) => {
    const next = setLockupDials({ [key]: value });
    setDials(next);
  };

  const copy = async () => {
    const text = exportLockupDials();
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      // Clipboard needs a secure context and a real gesture; the textarea fallback is
      // what makes this work over plain http on a phone on the LAN.
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (err) { /* the console line below still has it */ }
      ta.remove();
    }
    // eslint-disable-next-line no-console
    console.log('cinema: lockup dials\n' + text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div className="cinema-dials" data-open={open ? '1' : '0'}>
      <button type="button" className="cinema-dials-tab" onClick={() => setOpen((v) => !v)}>
        {open ? 'Hide dials' : 'Dials'}
      </button>
      {open && (
        <div className="cinema-dials-body">
          {groups.map(([group, items]) => (
            <div key={group} className="cinema-dials-group">
              <p className="cinema-dials-legend">{group}</p>
              {items.map((m) => (
                <label key={m.key} className="cinema-dials-row">
                  <span className="cinema-dials-name">
                    {m.label}
                    {m.invert ? ' (lower is sharper)' : ''}
                  </span>
                  <input
                    type="range"
                    min={m.min}
                    max={m.max}
                    step={m.step}
                    value={dials[m.key]}
                    onChange={(e) => move(m.key, parseFloat(e.target.value))}
                  />
                  <output>{Number(dials[m.key]).toFixed(m.step >= 1 ? 0 : 2)}</output>
                </label>
              ))}
            </div>
          ))}
          <div className="cinema-dials-actions">
            <button type="button" onClick={copy}>{copied ? 'Copied' : 'Copy settings'}</button>
            <button type="button" onClick={() => setDials(resetLockupDials())}>Reset</button>
          </div>
        </div>
      )}
    </div>
  );
}
