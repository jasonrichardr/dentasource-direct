'use client';

// The lockup dials, driven from the same store the cinema reads.
//
// builder-engine's lockupConfig.js publishes a contract: a PARTIAL dial set in
// localStorage['dsd:lockup-dials'] and a window event of the same name. This
// panel is only a nicer set of hands on that store; it imports the metadata so
// the ranges can never drift from the ones the engine validates against, and it
// writes nothing the engine does not already accept.
//
// ☠️ THIS IS A LOCAL PREVIEW SETTING, NOT A SAVED FILE. It lives in the browser
// that set it, so it does not ship and it does not travel to anybody else. When
// a dial is right it has to be moved into LOCKUP_DEFAULTS by hand. The panel
// says so on screen, because a tuning tool that looks like a save button is a
// tool that loses somebody's afternoon.

import { useCallback, useEffect, useState } from 'react';

import {
  DIALS_EVENT,
  DIALS_STORAGE_KEY,
  LOCKUP_DEFAULTS,
  LOCKUP_DIAL_META,
} from '@/cinema/formations/lockupConfig';

const groups = [...new Set(LOCKUP_DIAL_META.map((d) => d.group))];

export default function LogoDials() {
  const [dials, setDials] = useState(LOCKUP_DEFAULTS);
  const [stored, setStored] = useState({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DIALS_STORAGE_KEY);
      const partial = raw ? JSON.parse(raw) : {};
      setStored(partial && typeof partial === 'object' ? partial : {});
      setDials({ ...LOCKUP_DEFAULTS, ...(partial || {}) });
    } catch {
      /* blocked storage: the panel still works, it just starts at the defaults */
    }
  }, []);

  /** Write the PARTIAL set (only what differs) and tell the page. */
  const push = useCallback((next) => {
    const partial = {};
    for (const m of LOCKUP_DIAL_META) {
      if (next[m.key] !== LOCKUP_DEFAULTS[m.key]) partial[m.key] = next[m.key];
    }
    setDials(next);
    setStored(partial);
    try {
      if (Object.keys(partial).length) localStorage.setItem(DIALS_STORAGE_KEY, JSON.stringify(partial));
      else localStorage.removeItem(DIALS_STORAGE_KEY);
    } catch {
      /* nothing to do: the event below still moves the live page */
    }
    try {
      window.dispatchEvent(new CustomEvent(DIALS_EVENT, { detail: { dials: partial, source: 'studio' } }));
    } catch {
      /* no CustomEvent: a reload will pick the value up from storage */
    }
  }, []);

  const reset = () => push({ ...LOCKUP_DEFAULTS });
  const changed = Object.keys(stored).length;

  // ── EXPORT ────────────────────────────────────────────────────────────────
  // The dials only become real when their numbers reach LOCKUP_DEFAULTS, so the
  // export is shaped for THAT paste, not for a file nobody will open: the full
  // set, in the meta's own order, ready to drop into lockupConfig.js. Copy uses
  // the clipboard where it exists and falls back to selecting the block, which
  // is what a non-secure origin gets.
  const exportText = () => {
    const merged = { ...LOCKUP_DEFAULTS, ...stored };
    const lines = LOCKUP_DIAL_META.map((m) => {
      const v = merged[m.key];
      const moved = v !== LOCKUP_DEFAULTS[m.key];
      return `  ${m.key}: ${v},${moved ? '   // moved in the studio' : ''}`;
    });
    return `export const LOCKUP_DEFAULTS = {\n${lines.join('\n')}\n};`;
  };
  const [copied, setCopied] = useState('');
  const copy = async () => {
    const text = exportText();
    try {
      await navigator.clipboard.writeText(text);
      setCopied('copied');
    } catch {
      const el = document.getElementById('st-dial-export');
      if (el) {
        const r = document.createRange();
        r.selectNodeContents(el);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(r);
      }
      setCopied('selected, press copy');
    }
    setTimeout(() => setCopied(''), 2600);
  };

  return (
    <>
      <h2 className="st-h">Logo dials</h2>
      <p className="st-hint">
        These tune the particle lockup live. They are stored in <code>{DIALS_STORAGE_KEY}</code> in THIS browser only:
        they never reach the repo and nobody else sees them. When a setting looks right, the number has to be copied
        into <code>LOCKUP_DEFAULTS</code> in <code>src/cinema/formations/lockupConfig.js</code> to make it real.
        Open the home page in another tab to watch a dial move.
      </p>
      <div className="st-dials-top">
        <span className="st-f-n">{changed ? `${changed} dial${changed === 1 ? '' : 's'} away from the defaults` : 'at the defaults'}</span>
        <button type="button" className="st-btn ghost sm" onClick={reset} disabled={!changed}>
          Reset all
        </button>
        <button type="button" className="st-btn sm" onClick={copy}>
          {copied || 'Copy for lockupConfig.js'}
        </button>
      </div>
      <pre id="st-dial-export" className="st-export">{exportText()}</pre>

      {groups.map((g) => (
        <div className="st-dial-group" key={g}>
          <div className="st-nest-h">{g}</div>
          {LOCKUP_DIAL_META.filter((m) => m.group === g).map((m) => {
            const v = dials[m.key] ?? LOCKUP_DEFAULTS[m.key];
            const off = v !== LOCKUP_DEFAULTS[m.key];
            return (
              <label className={`st-dial${off ? ' off' : ''}`} key={m.key}>
                <span className="st-dial-k">
                  {m.label}
                  {m.invert ? <em> lower is sharper</em> : null}
                </span>
                <input
                  type="range"
                  min={m.min}
                  max={m.max}
                  step={m.step}
                  value={v}
                  onChange={(e) => push({ ...dials, [m.key]: Number(e.target.value) })}
                />
                <input
                  className="st-dial-n"
                  type="number"
                  min={m.min}
                  max={m.max}
                  step={m.step}
                  value={v}
                  onChange={(e) => {
                    const n = Math.min(m.max, Math.max(m.min, Number(e.target.value)));
                    if (Number.isFinite(n)) push({ ...dials, [m.key]: n });
                  }}
                />
                <span className="st-dial-d">{LOCKUP_DEFAULTS[m.key]}</span>
              </label>
            );
          })}
        </div>
      ))}
    </>
  );
}
