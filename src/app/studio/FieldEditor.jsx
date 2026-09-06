'use client';

// One recursive editor for every shape in these files.
//
// The data is deliberately heterogeneous: a home beat has cta objects and tile
// arrays, a product has a beats OBJECT keyed by name, a manifest is a flat list
// of {src, alt}. Hard-coding a form per shape would mean a new form every time
// another builder adds a field. So this walks the value and decides by type and
// by key name, which means a field nobody has invented yet still gets an input.

import { MEDIA_ARRAY_KEYS, MEDIA_KEYS, READ_ONLY_FIELDS, redLines } from '@/lib/studio/registry';
import MediaGrid from './MediaGrid';

/** Structural keys the renderer matches on, plus the generated fields nobody
 *  should retype (meta_caption, the measurements, the ids). Editable would mean
 *  breakable in the first case and wrong in the second. */
const LOCKED = new Set([
  'key', 'kind', 'slug', 'route', 'version', 'generated', 'isIndex',
  // ☠️ THE RESOLUTION GUARD IS NOT COPY. `tilePx` and `stripUnsafe` decide
  // which photographs a list may hold. Typed casually they fail silently in
  // both directions: 126 -> 1260 bans every picture from a row where they are
  // fine, 288 -> 20 admits the soft ones nobody will notice until print. They
  // are shown here so the rule is visible, and changed in the JSON on purpose.
  'tilePx', 'stripUnsafe',
  ...READ_ONLY_FIELDS,
]);
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

/** A locked map shown whole rather than recursed into: `stripUnsafe` is a
 *  filename -> reason map, and recursing would offer the reasons as free text
 *  under labels that are filenames. Reading it is the point; editing it is not. */
function LockedMap({ k, value }) {
  const rows = Object.entries(value);
  return (
    <div className="st-f locked">
      <span className="st-f-k">
        {title(k)}
        <em> guard, read only</em>
        <span className="st-f-n">{rows.length}</span>
      </span>
      {rows.length ? (
        rows.map(([name, why]) => (
          <div className="st-locked-row" key={name}>
            <code>{name}</code> {String(why)}
          </div>
        ))
      ) : (
        <div className="st-locked-row">declared, and nothing is barred from this set</div>
      )}
    </div>
  );
}

/** Does this array hold media rather than prose? */
function isMediaArray(k, arr) {
  if (MEDIA_ARRAY_KEYS.has(k)) return true;
  return arr.length > 0 && arr.every((x) => x && typeof x === 'object' && typeof x.src === 'string');
}

export default function FieldEditor({ value, path, onChange, heading, depth = 0, filePath = null, dirty = false, onTransferred = null, blocked = null }) {
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
    // ☠️ LOCKED APPLIED HERE TOO. This branch used to ignore it, so every
    // read-only field that happens to be a NUMBER — width, height, duration,
    // and now tilePx — was declared structural and editable anyway. A lock that
    // only covers the string case is not a lock.
    const locked = LOCKED.has(k);
    return (
      <label className={`st-f inline${locked ? ' locked' : ''}`}>
        <span className="st-f-k">
          {title(k)}
          {locked ? <em> structural, read only</em> : null}
        </span>
        {typeof value === 'boolean' ? (
          <input
            type="checkbox"
            checked={value}
            disabled={locked}
            onChange={(e) => !locked && onChange(path, e.target.checked)}
          />
        ) : (
          <input
            type="number"
            value={value}
            readOnly={locked}
            onChange={(e) => !locked && onChange(path, Number(e.target.value))}
          />
        )}
      </label>
    );
  }

  if (Array.isArray(value)) {
    const k = path[path.length - 1];
    if (isMediaArray(k, value)) {
      return (
        <MediaGrid
          k={k}
          value={value}
          onChange={(next) => onChange(path, next)}
          source={filePath ? { path: filePath, pointer: path } : null}
          dirty={dirty}
          onTransferred={onTransferred}
          blocked={blocked}
        />
      );
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
            <FieldEditor value={row} path={[...path, i]} onChange={onChange} depth={depth + 1} filePath={filePath} dirty={dirty} onTransferred={onTransferred} blocked={blocked} />
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
            {LOCKED.has(k) && typeof v === 'object' && !Array.isArray(v) ? (
              <LockedMap k={k} value={v} />
            ) : (typeof v === 'object' && !Array.isArray(v)) || (Array.isArray(v) && !isMediaArray(k, v) && !v.every((x) => typeof x === 'string')) ? (
              <div className="st-nest">
                <div className="st-nest-h">{title(k)}</div>
                <FieldEditor value={v} path={[...path, k]} onChange={onChange} depth={depth + 1} filePath={filePath} dirty={dirty} onTransferred={onTransferred} blocked={blocked} />
              </div>
            ) : (
              <FieldEditor value={v} path={[...path, k]} onChange={onChange} depth={depth + 1} filePath={filePath} dirty={dirty} onTransferred={onTransferred} blocked={blocked} />
            )}
          </div>
        );
      })}
    </section>
  );
}
