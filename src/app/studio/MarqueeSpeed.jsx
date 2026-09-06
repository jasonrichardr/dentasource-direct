'use client';

// Set the marquee speed by FEEL, not by number.
//
// Jarich: "make me able set the speed in localhost let me see marquee there so
// i can see and sense the speed that i want." So the panel leads with a strip
// of real thumbnails moving at the speed under the slider. The numbers are the
// readout; the strip is the control.
//
// ☠️ THE PREVIEW IS THE SHIPPING CODE, NOT A COPY OF IT. Every change calls
// setMarqueeSettings() and dispatches the site's own event, so the module's
// live settings ARE what this panel is showing; the preview strip is then timed
// by calling applyMarqueeSpeed() on it, the same function the site calls on
// every real track, reading the same live values and the same data-marquee
// override. There is no second implementation of the arithmetic here to drift.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  MARQUEE_DEFAULTS,
  NARROW_MAX_PX,
  SETTINGS_EVENT,
  SETTINGS_STORAGE_KEY,
  applyMarqueeSpeed,
  marqueePxPerSecond,
  setMarqueeSettings,
} from '@/lib/cinema/marquee';

const SETTINGS_PATH = 'src/data/cinema/settings.json';

const FAMILIES = [
  { key: 'media', label: 'Photographs and video', what: 'The picture strips: our people, installs, see us in action, the training wall, the parts rows.' },
  { key: 'text', label: 'A line of running text', what: 'The trust line under the header, and the news rows.' },
];
const BANDS = [
  { key: 'wide', label: 'Desktop', hint: `over ${NARROW_MAX_PX}px` },
  { key: 'narrow', label: 'Phone', hint: `${NARROW_MAX_PX}px and under` },
];
const WORDS = ['Nationwide delivery', 'Free ocular visit', 'After sales support', 'Trade in available', 'ISO 13485 certified'];

/** A doubled row timed by the SITE's own function, so it cannot drift from it. */
function PreviewStrip({ srcs, kind, id, tick, text = false }) {
  const track = useRef(null);
  const [seconds, setSeconds] = useState(0);

  // ☠️ RE-TIME WHEN THE TRACK CHANGES WIDTH, NOT ONLY ON MOUNT. Measured here:
  // the first pass ran before the lazy thumbnails had loaded, so a track that
  // ends up 492px wide was timed at a fraction of that and the strip opened at
  // 321 px/s while the panel said 131.8. That is the same trap marquee.js
  // documents for the real tracks, and it has the same answer: watch the width.
  useEffect(() => {
    const el = track.current;
    if (!el) return undefined;
    const retime = () => {
      applyMarqueeSpeed(el, kind); // ← the shipping path, reading the live settings
      setSeconds(parseFloat(el.style.animationDuration || '0'));
    };
    retime();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(retime);
    ro.observe(el);
    return () => ro.disconnect();
  }, [kind, srcs, tick, id]);

  const row = [...srcs, ...srcs];
  return (
    <div className="st-mq">
      <div className={`st-mq-track${text ? ' text' : ''}`} ref={track} data-marquee={id || undefined}>
        {text
          ? row.map((t, i) => (
              <span className="st-mq-word" key={i}>
                <i />
                {t}
              </span>
            ))
          : row.map((s, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={s} alt="" key={i} loading="lazy" />
            ))}
      </div>
      <div className="st-mq-meta">
        {marqueePxPerSecond(kind, id).toFixed(1)} px per second · one loop {seconds ? seconds.toFixed(1) : '—'}s
        {id ? ` · ${id}` : ''}
      </div>
    </div>
  );
}

export default function MarqueeSpeed() {
  const [marquee, setMarquee] = useState(MARQUEE_DEFAULTS);
  const [samples, setSamples] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [showOverrides, setShowOverrides] = useState(false);
  const [saving, setSaving] = useState('');
  const [note, setNote] = useState(null);
  const [tick, setTick] = useState(0); // forces the previews to re-time

  useEffect(() => {
    fetch('/api/studio/file?path=src/data/cinema/installs.json')
      .then((r) => r.json())
      .then((d) => {
        const list = d?.data?.tiles || d?.data?.items || [];
        setSamples(list.slice(0, 10).map((t) => (typeof t === 'string' ? t : t.src)).filter(Boolean));
      })
      .catch(() => {});
    fetch('/api/studio/marquees')
      .then((r) => r.json())
      .then((d) => setTracks(d.tracks || []))
      .catch(() => {});
    try {
      const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
      const p = raw ? JSON.parse(raw) : null;
      if (p?.marquee) setMarquee(setMarqueeSettings(p));
    } catch {
      /* blocked storage: start from the shipped defaults */
    }
  }, []);

  /** One path for every change: tell the module, tell the page, remember it. */
  const push = useCallback((next) => {
    const partial = { marquee: next };
    setMarquee(setMarqueeSettings(partial));
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(partial));
    } catch {
      /* the event still moves an open tab */
    }
    try {
      window.dispatchEvent(new CustomEvent(SETTINGS_EVENT, { detail: { settings: partial, source: 'studio' } }));
    } catch {
      /* no CustomEvent: a reload picks it up from storage */
    }
    setTick((t) => t + 1);
  }, []);

  const reset = () => {
    try {
      localStorage.removeItem(SETTINGS_STORAGE_KEY);
    } catch {
      /* nothing to clear */
    }
    push(JSON.parse(JSON.stringify(MARQUEE_DEFAULTS)));
  };

  const changed = useMemo(
    () =>
      FAMILIES.some((f) => BANDS.some((b) => marquee[f.key][b.key] !== MARQUEE_DEFAULTS[f.key][b.key])) ||
      Object.keys(marquee.overrides || {}).length > 0,
    [marquee],
  );

  const save = async () => {
    setSaving('saving');
    setNote(null);
    try {
      const r0 = await fetch(`/api/studio/file?path=${encodeURIComponent(SETTINGS_PATH)}`);
      const existing = r0.ok ? (await r0.json()).data : {};
      // merged, never replaced: this panel owns the marquee key and nothing else
      const merged = { ...existing, marquee: { ...(existing.marquee || {}), ...marquee } };
      const r = await fetch('/api/studio/file', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: SETTINGS_PATH, data: merged, note: 'marquee speeds' }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'write failed');
      setNote({ text: `Saved. These are the shipped speeds now. Previous version kept at ${d.backup}.` });
    } catch (e) {
      setNote({ bad: true, text: e.message });
    } finally {
      setSaving('');
    }
  };

  const setOverride = (id, band, v) => {
    const overrides = { ...(marquee.overrides || {}) };
    const cur = { ...(overrides[id] || {}) };
    if (v == null) delete cur[band];
    else cur[band] = v;
    if (!Object.keys(cur).length) delete overrides[id];
    else overrides[id] = cur;
    push({ ...marquee, overrides });
  };

  return (
    <>
      <h2 className="st-h">Marquee speed</h2>
      <p className="st-hint">
        Drag a slider and watch the strip under it. Any site tab you have open re-times as you drag, with no reload. The
        starting numbers are FFC&rsquo;s own, measured on the live site. Nothing here changes what ships until you press
        Save.
      </p>

      <div className="st-dials-top">
        <span className="st-f-n">{changed ? 'changed from the shipped speeds' : 'at the shipped speeds'}</span>
        <button type="button" className="st-btn ghost sm" onClick={reset} disabled={!changed}>
          Reset to FFC
        </button>
        <button type="button" className="st-btn sm" onClick={save} disabled={saving === 'saving' || !changed}>
          {saving === 'saving' ? 'Saving…' : 'Save to settings.json'}
        </button>
        {note ? <span className={`st-note${note.bad ? ' bad' : ''}`}>{note.text}</span> : null}
      </div>

      {FAMILIES.map((f) => (
        <div className="st-dial-group" key={f.key}>
          <div className="st-nest-h">{f.label}</div>
          <p className="st-hint" style={{ margin: '0 0 10px' }}>{f.what}</p>
          {BANDS.map((b) => (
            <label className={`st-dial${marquee[f.key][b.key] !== MARQUEE_DEFAULTS[f.key][b.key] ? ' off' : ''}`} key={b.key}>
              <span className="st-dial-k">
                {b.label} <em>{b.hint}</em>
              </span>
              <input
                type="range"
                min={20}
                max={300}
                step={0.1}
                value={marquee[f.key][b.key]}
                onChange={(e) => push({ ...marquee, [f.key]: { ...marquee[f.key], [b.key]: Number(e.target.value) } })}
              />
              <input
                className="st-dial-n"
                type="number"
                min={20}
                max={300}
                step={0.1}
                value={marquee[f.key][b.key]}
                onChange={(e) => {
                  const n = Math.min(300, Math.max(20, Number(e.target.value)));
                  if (Number.isFinite(n)) push({ ...marquee, [f.key]: { ...marquee[f.key], [b.key]: n } });
                }}
              />
              <span className="st-dial-d">{MARQUEE_DEFAULTS[f.key][b.key]}</span>
            </label>
          ))}
          {f.key === 'media' && samples.length ? <PreviewStrip srcs={samples} kind="media" tick={tick} /> : null}
          {f.key === 'text' ? <PreviewStrip srcs={WORDS} kind="text" tick={tick} text /> : null}
        </div>
      ))}

      <div className="st-dial-group">
        <button type="button" className="st-btn ghost sm" onClick={() => setShowOverrides((v) => !v)}>
          {showOverrides ? 'Hide' : 'Show'} per marquee overrides ({Object.keys(marquee.overrides || {}).length} set)
        </button>
        {showOverrides ? (
          <>
            <p className="st-hint" style={{ marginTop: 10 }}>
              One track at a time, when a single strip needs to differ from its family. Leave a box empty to let it
              follow the family speed. Track names are read out of the components, so this list is whatever the site
              actually has.
            </p>
            {tracks.map((t) => {
              const o = marquee.overrides?.[t.id] || {};
              return (
                <div className="st-ovr" key={t.id}>
                  <span className="st-ovr-id" title={t.file}>
                    {t.id}
                    {t.pattern ? <em> one per row</em> : null}
                  </span>
                  {BANDS.map((b) => (
                    <label className="st-ovr-b" key={b.key}>
                      <span>{b.label}</span>
                      <input
                        type="number"
                        min={20}
                        max={300}
                        step={0.1}
                        placeholder={String(marquee[/parts|news|trust/.test(t.id) ? 'text' : 'media'][b.key])}
                        value={o[b.key] ?? ''}
                        onChange={(e) => {
                          const raw = e.target.value;
                          if (raw === '') return setOverride(t.id, b.key, null);
                          const n = Math.min(300, Math.max(20, Number(raw)));
                          if (Number.isFinite(n)) setOverride(t.id, b.key, n);
                        }}
                      />
                    </label>
                  ))}
                  {samples.length && !t.pattern ? (
                    <PreviewStrip srcs={samples.slice(0, 6)} kind={/parts|news|trust/.test(t.id) ? 'text' : 'media'} id={t.id} tick={tick} />
                  ) : null}
                </div>
              );
            })}
            {!tracks.length ? <p className="st-empty">No tracks found in the components.</p> : null}
          </>
        ) : null}
      </div>

      <p className="st-hint">
        Saved speeds live in <code>{SETTINGS_PATH}</code>, which ships with the site. While you are only dragging, the
        change is remembered in this browser and announced on the <code>{SETTINGS_EVENT}</code> event, so an open site
        tab follows along without a reload.
      </p>
    </>
  );
}
