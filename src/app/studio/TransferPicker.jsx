'use client';

// "Send to…": where these pictures should go, and whether they move or copy.
//
// The target list comes from the server, which walks every registry file and
// reports every media list it finds, including the ones INSIDE a beat. So a
// photo can go to another strip or straight into a beat's own media without
// this component knowing anything about the shape of either.

import { useEffect, useState } from 'react';

import { isVideoPath } from '@/lib/studio/registry';

export default function TransferPicker({ source, indexes, entries, onClose, onDone }) {
  const [targets, setTargets] = useState([]);
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('move');

  const hasVideo = entries.some((e) => isVideoPath(typeof e === 'string' ? e : e?.src));

  useEffect(() => {
    fetch('/api/studio/transfer')
      .then((r) => r.json())
      .then((d) => setTargets(d.targets || []))
      .catch((e) => setError(e.message))
      .finally(() => setBusy(false));
  }, []);

  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [onClose]);

  const send = async (t) => {
    setBusy(true);
    setError(null);
    try {
      const r = await fetch('/api/studio/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: { path: source.path, pointer: source.pointer, indexes },
          to: { path: t.path, pointer: t.pointer },
          mode,
        }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'transfer failed');
      onDone({ ...d, label: t.label, mode });
    } catch (e) {
      setError(e.message);
      setBusy(false);
    }
  };

  const here = (t) => t.path === source.path && JSON.stringify(t.pointer) === JSON.stringify(source.pointer);
  const shown = targets.filter((t) => {
    if (!q) return true;
    const s = `${t.label} ${t.sub} ${t.path}`.toLowerCase();
    return q
      .toLowerCase()
      .split(/\s+/)
      .every((w) => s.includes(w));
  });

  return (
    <div className="st-modal" role="dialog" aria-modal="true" aria-label="Send pictures to another set">
      <div className="st-modal-scrim" onClick={onClose} />
      <div className="st-modal-box">
        <div className="st-modal-top">
          <strong className="st-send-h">
            Send {indexes.length} {indexes.length === 1 ? 'picture' : 'pictures'} to…
          </strong>
          <label className="st-mode">
            <input type="radio" name="mode" checked={mode === 'move'} onChange={() => setMode('move')} /> Move
          </label>
          <label className="st-mode">
            <input type="radio" name="mode" checked={mode === 'copy'} onChange={() => setMode('copy')} /> Copy
          </label>
          <input className="st-search" placeholder="Filter the sets…" value={q} onChange={(e) => setQ(e.target.value)} />
          <button type="button" className="st-btn ghost sm" onClick={onClose}>Close</button>
        </div>

        {error ? <p className="st-err" style={{ padding: '0 14px' }}>{error}</p> : null}
        {hasVideo ? (
          <p className="st-hint" style={{ margin: '6px 14px' }}>
            The selection includes a video, so only sets that already carry video are offered.
          </p>
        ) : null}

        <div className="st-targets">
          {busy ? <p className="st-empty">Working…</p> : null}
          {!busy &&
            shown.map((t) => {
              const blocked = hasVideo && !t.acceptsVideo;
              const isHere = here(t);
              return (
                <button
                  type="button"
                  key={t.id}
                  className={`st-target${blocked ? ' blocked' : ''}${isHere ? ' here' : ''}`}
                  disabled={blocked || (isHere && mode === 'move')}
                  onClick={() => send(t)}
                  title={blocked ? 'This set carries no video' : `${t.path} → ${t.pointer.join('.')}`}
                >
                  <span className="st-target-l">
                    {t.label}
                    {isHere ? <em> this set</em> : null}
                  </span>
                  <span className="st-target-s">{t.sub}</span>
                  <span className="st-target-c">{t.count}</span>
                  {blocked ? <span className="st-target-x">images only</span> : null}
                </button>
              );
            })}
          {!busy && !shown.length ? <p className="st-empty">No set matches that.</p> : null}
        </div>
      </div>
    </div>
  );
}
