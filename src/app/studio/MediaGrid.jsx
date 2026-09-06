'use client';

// Thumbnails for any media array in these files, whichever shape it is: a bare
// list of paths (a beat's `media`), or a list of objects (`tiles` with alt,
// `reels` with poster and caption). The mode is detected from the data rather
// than passed in, so the same grid serves all of them and a new manifest with
// the same shape works without being taught about.

import { useCallback, useRef, useState } from 'react';

import { COVER_MIN, READ_ONLY_FIELDS, isVideoPath, softnessReason } from '@/lib/studio/registry';
import AssetPicker from './AssetPicker';
import TransferPicker from './TransferPicker';

const srcOf = (row) => (typeof row === 'string' ? row : row?.src || '');
const withSrc = (row, src) => (typeof row === 'string' ? src : { ...row, src });

// ── 🏷 INFERRED NAMES ────────────────────────────────────────────────────────
// The parts manifest carries names worked out from the drawings rather than
// read off a label, so each records WHO decided (named_by) and how sure that
// was (confidence). A guess and a confirmed fact must not look the same in a
// grid of 244 tiles: the shaky ones are tinted, and one click promotes a name
// once a human has actually looked at it.
//
// ☠️ CONFIDENCE MAY BE A NUMBER OR A WORD. These fields are not written yet, so
// this reads both a 0..1 score and a 'low'/'high' label rather than betting on
// one and silently rendering nothing when the other arrives.
const LOW = 0.6;
function confidenceOf(row) {
  if (!row || typeof row !== 'object' || row.confidence == null) return null;
  const c = row.confidence;
  if (typeof c === 'number') return { low: c < LOW, text: `${Math.round(c * 100)}%` };
  const word = String(c).toLowerCase();
  return { low: word === 'low' || word === 'guess', text: word };
}
const isConfirmed = (row) => String(row?.named_by || '').toLowerCase() === 'confirmed';

function Thumb({ src }) {
  const [dur, setDur] = useState(null);
  if (!src) return <div className="st-thumb empty">no file</div>;
  if (isVideoPath(src)) {
    return (
      <div className="st-thumb">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          src={src}
          muted
          playsInline
          preload="metadata"
          onLoadedMetadata={(e) => setDur(e.currentTarget.duration)}
        />
        <span className="st-badge">
          video{dur ? ` · ${Math.floor(dur / 60)}:${String(Math.round(dur % 60)).padStart(2, '0')}` : ''}
        </span>
      </div>
    );
  }
  return (
    <div className="st-thumb">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" loading="lazy" />
    </div>
  );
}

export default function MediaGrid({ k, value, onChange, single = false, source = null, dirty = false, onTransferred = null, guard = null }) {
  const rows = Array.isArray(value) ? value : [];
  const objectMode = rows.some((r) => r && typeof r === 'object');
  const [picking, setPicking] = useState(null); // index being swapped, or 'add'
  const [drag, setDrag] = useState(null);
  const [pending, setPending] = useState(null); // {file, alt, busy, error, warnings}
  const [picked, setPicked] = useState(() => new Set()); // multi-select for transfer
  const [sending, setSending] = useState(false);
  const fileInput = useRef(null);
  const toggle = (i) =>
    setPicked((s2) => {
      const n = new Set(s2);
      if (n.has(i)) n.delete(i);
      else n.add(i);
      return n;
    });

  const set = useCallback((next) => onChange(next), [onChange]);
  const patch = (i, row) => set(rows.map((r, j) => (j === i ? row : r)));
  const del = (i) => set(rows.filter((_, j) => j !== i));
  const move = (from, to) => {
    if (from == null || to == null || from === to) return;
    const next = rows.slice();
    const [row] = next.splice(from, 1);
    next.splice(to, 0, row);
    set(next);
  };

  const chose = (asset) => {
    if (picking === 'add') {
      set([...rows, objectMode ? { src: asset.src, alt: '' } : asset.src]);
    } else if (typeof picking === 'number') {
      patch(picking, withSrc(rows[picking], asset.src));
    }
    setPicking(null);
  };

  const upload = async () => {
    if (!pending?.file || !pending.alt.trim()) return;
    setPending((p) => ({ ...p, busy: true, error: null }));
    try {
      const fd = new FormData();
      fd.append('file', pending.file);
      fd.append('alt', pending.alt);
      const r = await fetch('/api/studio/upload', { method: 'POST', body: fd });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'upload failed');
      // ☠️ THE THIRD DOOR. The picker and Send to… both judge a file against
      // this list's tile budget; an upload lands in the same list without
      // passing either. The file stays on disk — it is saved and can go
      // somewhere it fits — but it is not added here.
      const why = softnessReason(guard, d.dimensions, d.kind);
      if (why) throw new Error(`Saved to ${d.src}, but not added here. ${why}.`);
      set([...rows, objectMode ? { src: d.src, alt: pending.alt } : d.src]);
      setPending(d.warnings?.length ? { file: null, alt: '', warnings: d.warnings } : null);
      if (fileInput.current) fileInput.current.value = '';
    } catch (e) {
      setPending((p) => ({ ...p, busy: false, error: e.message }));
    }
  };

  return (
    <div className="st-media">
      <div className="st-f-k">
        {k}
        {/* ☠️ SAY WHAT THIS SET CAN HOLD, IN ITS OWN NUMBERS. The bar is
            arithmetic on two of them — the tile width the manifest declares and
            the pixel width of the file — so the header shows the first and the
            picker greys anything failing against it. A set with no declared
            tile size bars nothing, and says that rather than looking guarded. */}
        {guard ? (
          <span
            className={`st-guard${guard.tilePx ? '' : ' none'}`}
            title={
              !guard.tilePx
                ? 'No tile size declared, so nothing is barred from this set. Add "tilePx": <css px> to the manifest and every file is judged against it.'
                : guard.tileHeightPx
                  ? `Tiles here render ${guard.tilePx}x${guard.tileHeightPx} css px${guard.tileVideoPx ? `, and a clip ${guard.tileVideoPx}x${guard.tileVideoHeightPx || guard.tileVideoPx}` : ''}. A file must fill its tile at ${COVER_MIN}x or better or it is greyed in the picker, refused by Send to… and refused on upload, whether or not a manifest ever flagged it. ${guard.notedBarred} of the flagged files fail here.`
                  : `Tiles here render ${guard.tilePx} css px wide and declare no height, so the tile is judged square and the file's short side decides: it must cover at ${COVER_MIN}x. Declaring "tileHeightPx" makes this the exact cover test. ${guard.notedBarred} of the flagged files fail here.`
            }
          >
            {!guard.tilePx
              ? 'no tile size declared'
              : guard.tileHeightPx
                ? `tiles ${guard.tilePx}x${guard.tileHeightPx}${guard.tileVideoPx ? ` · clips ${guard.tileVideoPx}x${guard.tileVideoHeightPx || guard.tileVideoPx}` : ''}: ${guard.notedBarred} barred`
                : `tiles ${guard.tilePx} wide: ${guard.notedBarred} barred`}
          </span>
        ) : null}
        <span className="st-f-n">{rows.length} {rows.length === 1 ? 'file' : 'files'}</span>
      </div>

      <div className="st-grid">
        {rows.map((row, i) => {
          const src = srcOf(row);
          const needsAlt = objectMode && 'alt' in (row || {}) && !String(row.alt || '').trim();
          const conf = confidenceOf(row);
          const shaky = conf?.low && !isConfirmed(row);
          return (
            <div
              className={`st-cell${drag === i ? ' dragging' : ''}${needsAlt ? ' warn' : ''}${shaky ? ' shaky' : ''}`}
              key={`${src}-${i}`}
              draggable
              onDragStart={() => setDrag(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                move(drag, i);
                setDrag(null);
              }}
              onDragEnd={() => setDrag(null)}
            >
              <Thumb src={src} />
              <div className="st-cell-path" title={src}>{src.split('/').slice(-1)[0]}</div>
              {objectMode ? (
                <>
                  {'alt' in (row || {}) ? (
                    <input
                      className={needsAlt ? 'bad' : ''}
                      placeholder="alt text, required"
                      value={row.alt || ''}
                      onChange={(e) => patch(i, { ...row, alt: e.target.value })}
                    />
                  ) : null}
                  {'caption' in (row || {}) ? (
                    <input
                      placeholder="caption"
                      value={row.caption || ''}
                      onChange={(e) => patch(i, { ...row, caption: e.target.value })}
                    />
                  ) : null}
                  {'poster' in (row || {}) ? (
                    <input
                      placeholder="poster path"
                      value={row.poster || ''}
                      onChange={(e) => patch(i, { ...row, poster: e.target.value })}
                    />
                  ) : null}
                  {/* ☠️ meta_caption and the measurements are SHOWN, never typed
                      into: they are generated beside the reel, and an editor who
                      rewrites one has quietly desynced it from its source. */}
                  {Object.keys(row || {})
                    .filter((f) => READ_ONLY_FIELDS.has(f) && row[f] !== '' && row[f] != null)
                    .map((f) => (
                      <div className="st-ro" key={f} title="generated, read only">
                        <span>{f}</span>
                        <span>{String(row[f])}</span>
                      </div>
                    ))}
                </>
              ) : null}
              {conf || row?.named_by ? (
                <div className={`st-named${shaky ? ' low' : ''}`}>
                  <span className="st-named-by">
                    {isConfirmed(row) ? '✓ confirmed' : `named by ${row.named_by || 'unknown'}`}
                  </span>
                  {conf ? <span className="st-named-c">{conf.text}</span> : null}
                  {!isConfirmed(row) ? (
                    <button
                      type="button"
                      className="st-confirm"
                      title="The name looks right: mark it confirmed"
                      onClick={() => patch(i, { ...row, named_by: 'confirmed' })}
                    >
                      Confirm name
                    </button>
                  ) : null}
                </div>
              ) : null}
              <div className="st-cell-tools">
                {!single && source ? (
                  <label className="st-pickbox" title="Select for Send to…">
                    <input type="checkbox" checked={picked.has(i)} onChange={() => toggle(i)} />
                  </label>
                ) : null}
                <button type="button" onClick={() => setPicking(i)}>Swap</button>
                {!single ? (
                  <button type="button" onClick={() => set([...rows.slice(0, i + 1), rows[i], ...rows.slice(i + 1)])} title="Copy it into this same list">
                    Duplicate
                  </button>
                ) : null}
                {!single ? <button type="button" className="danger" onClick={() => del(i)}>Delete</button> : null}
              </div>
            </div>
          );
        })}
      </div>

      {!single && source ? (
        <div className="st-send">
          <span className="st-f-n">
            {picked.size ? `${picked.size} selected` : 'tick a picture to send it somewhere'}
          </span>
          <button
            type="button"
            className="st-btn sm"
            disabled={!picked.size || dirty}
            onClick={() => setSending(true)}
            title={dirty ? 'Save your changes first: a transfer reads what is on disk' : 'Move or copy these into another set'}
          >
            Send to…
          </button>
          {picked.size ? (
            <button type="button" className="st-btn ghost sm" onClick={() => setPicked(new Set())}>
              Clear
            </button>
          ) : null}
          {dirty ? <span className="st-warn">Save first. A transfer writes the version on disk.</span> : null}
        </div>
      ) : null}

      {!single ? (
        <div className="st-add">
          <button type="button" className="st-btn ghost sm" onClick={() => setPicking('add')}>
            Add from the site
          </button>
          <span className="st-or">or upload</span>
          <input
            ref={fileInput}
            type="file"
            accept="image/*,video/*"
            onChange={(e) => setPending({ file: e.target.files?.[0] || null, alt: '', busy: false })}
          />
          {pending?.file ? (
            <>
              <input
                placeholder="alt text, required before it can be added"
                value={pending.alt}
                onChange={(e) => setPending((p) => ({ ...p, alt: e.target.value }))}
              />
              <button
                type="button"
                className="st-btn sm"
                disabled={!pending.alt.trim() || pending.busy}
                onClick={upload}
              >
                {pending.busy ? 'Uploading…' : 'Upload'}
              </button>
            </>
          ) : null}
          {pending?.error ? <span className="st-err">{pending.error}</span> : null}
          {pending?.warnings?.length
            ? pending.warnings.map((w) => (
                <span key={w} className="st-warn">{w}</span>
              ))
            : null}
        </div>
      ) : (
        <div className="st-add">
          <button type="button" className="st-btn ghost sm" onClick={() => setPicking(0)}>Swap this file</button>
        </div>
      )}

      {picking !== null ? <AssetPicker onPick={chose} onClose={() => setPicking(null)} tile={guard} /> : null}
      {sending ? (
        <TransferPicker
          source={source}
          indexes={[...picked].sort((a, b) => a - b)}
          entries={[...picked].sort((a, b) => a - b).map((i) => rows[i])}
          onClose={() => setSending(false)}
          onDone={(res) => {
            setSending(false);
            setPicked(new Set());
            if (onTransferred) onTransferred(res);
          }}
        />
      ) : null}
    </div>
  );
}
