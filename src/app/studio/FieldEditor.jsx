'use client';

// One recursive editor for every shape in these files.
//
// The data is deliberately heterogeneous: a home beat has cta objects and tile
// arrays, a product has a beats OBJECT keyed by name, a manifest is a flat list
// of {src, alt}. Hard-coding a form per shape would mean a new form every time
// another builder adds a field. So this walks the value and decides by type and
// by key name, which means a field nobody has invented yet still gets an input.

import { MEDIA_ARRAY_KEYS, MEDIA_KEYS, redLines } from '@/lib/studio/registry';
import MediaGrid from './MediaGrid';

/** Structural keys the renderer matches on. Editable would mean breakable. */
const LOCKED = new Set(['key', 'kind', 'slug', 'route', 'version', 'generated', 'isIndex']);
/** Keys whose copy runs long enough to want a textarea. */
const LONG = new Set(['body', 'notes', 'note', 'answer', 'question', 'caption', 'alt', 'heroImageNote', 'intro']);

const title = (k) =>
  String(k)
    .replace(/([A-Z])/g, ' $1')
    .replace(/[-_]/g, ' ')
    .replace(/^\w/, (c) => c.toUpperCase());

function TextField({ k, value, onChange }) {
  const flags = redLines(value);
  const long = LONG.has(k) || value.length > 90;
  const locked = LOCKED.has(k);
  return (
    <label className={`st-f${locked ? ' locked' : ''}`}>
      <span className="st-f-k">
        {title(k)}
        {locked ? <em> structural, read only</em> : null}
        <span className="st-f-n">{value.length}</span>
      </span>
      {long ? (
        <textarea
          value={value}
          readOnly={locked}
          rows={Math.min(10, Math.max(2, Math.ceil(value.length / 78)))}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input type="text" value={value} readOnly={locked} onChange={(e) => onChange(e.target.value)} />
      )}
      {flags.length ? (
        <span className="st-flags">
          {flags.map((f) => (
            <span key={f.id} className="st-flag" title={f.why}>
              {f.label}
            </span>
          ))}
        </span>
      ) : null}
    </label>
  );
}

function StringList({ k, value, onChange }) {
  const set = (i, v) => onChange(value.map((x, j) => (j === i ? v : x)));
  const del = (i) => onChange(value.filter((_, j) => j !== i));
  const move = (i, d) => {
    const j = i + d;
    if (j < 0 || j >= value.length) return;
    const next = value.slice();
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <div className="st-lines">
      <div className="st-f-k">
        {title(k)}
        <span className="st-f-n">{value.length} lines</span>
      </div>
      {value.map((line, i) => {
        const flags = redLines(line);
        return (
          <div className="st-line" key={i}>
            <textarea rows={Math.max(1, Math.ceil(line.length / 78))} value={line} onChange={(e) => set(i, e.target.value)} />
            <div className="st-line-tools">
              <button type="button" onClick={() => move(i, -1)} title="Up">↑</button>
              <button type="button" onClick={() => move(i, 1)} title="Down">↓</button>
              <button type="button" className="danger" onClick={() => del(i)} title="Remove">✕</button>
            </div>
            {flags.length ? (
              <span className="st-flags">
                {flags.map((f) => (
                  <span key={f.id} className="st-flag" title={f.why}>{f.label}</span>
                ))}
              </span>
            ) : null}
          </div>
        );
      })}
      <button type="button" className="st-btn ghost sm" onClick={() => onChange([...value, ''])}>
        Add line
      </button>
    </div>
  );
}

/** Does this array hold media rather than prose? */
function isMediaArray(k, arr) {
  if (MEDIA_ARRAY_KEYS.has(k)) return true;
  return arr.length > 0 && arr.every((x) => x && typeof x === 'object' && typeof x.src === 'string');
}

export default function FieldEditor({ value, path, onChange, heading, depth = 0 }) {
  if (value === null || value === undefined) return null;

  if (typeof value === 'string') {
    const k = path[path.length - 1];
    if (MEDIA_KEYS.has(k)) {
      return (
        <MediaGrid
          k={k}
          value={[value]}
          single
          onChange={(next) => onChange(path, next[0] ?? '')}
        />
      );
    }
    return <TextField k={k} value={value} onChange={(v) => onChange(path, v)} />;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    const k = path[path.length - 1];
    return (
      <label className="st-f inline">
        <span className="st-f-k">{title(k)}</span>
        {typeof value === 'boolean' ? (
          <input type="checkbox" checked={value} onChange={(e) => onChange(path, e.target.checked)} />
        ) : (
          <input type="number" value={value} onChange={(e) => onChange(path, Number(e.target.value))} />
        )}
      </label>
    );
  }

  if (Array.isArray(value)) {
    const k = path[path.length - 1];
    if (isMediaArray(k, value)) {
      return <MediaGrid k={k} value={value} onChange={(next) => onChange(path, next)} />;
    }
    if (value.every((x) => typeof x === 'string')) {
      return <StringList k={k} value={value} onChange={(next) => onChange(path, next)} />;
    }
    return (
      <div className="st-group">
        <div className="st-f-k">
          {title(k)}
          <span className="st-f-n">{value.length}</span>
        </div>
        {value.map((row, i) => (
          <div className="st-sub" key={i}>
            <div className="st-sub-h">{i + 1}</div>
            <FieldEditor value={row} path={[...path, i]} onChange={onChange} depth={depth + 1} />
          </div>
        ))}
      </div>
    );
  }

  // a plain object: every key, in the order the file has them
  return (
    <section className={`st-obj d${Math.min(depth, 3)}`}>
      {heading ? <h2 className="st-h">{heading}</h2> : null}
      {Object.keys(value).map((k) => {
        const v = value[k];
        if (v === null || v === undefined) return null;
        return (
          <div className="st-field" key={k}>
            {(typeof v === 'object' && !Array.isArray(v)) || (Array.isArray(v) && !isMediaArray(k, v) && !v.every((x) => typeof x === 'string')) ? (
              <div className="st-nest">
                <div className="st-nest-h">{title(k)}</div>
                <FieldEditor value={v} path={[...path, k]} onChange={onChange} depth={depth + 1} />
              </div>
            ) : (
              <FieldEditor value={v} path={[...path, k]} onChange={onChange} depth={depth + 1} />
            )}
          </div>
        );
      })}
    </section>
  );
}
