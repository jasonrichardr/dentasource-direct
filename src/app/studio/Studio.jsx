'use client';

// The studio shell: a rail of arcs and their beats on the left, one editor on
// the right, one Save button. No autosave, on purpose — a JSON file that ships
// should change when somebody decides it does, not when they click away.

import { useCallback, useEffect, useMemo, useState } from 'react';

import FieldEditor from './FieldEditor';
import MediaGrid from './MediaGrid';
import './studio.css';

/** Immutable set at a path like ['beats', 3, 'headline']. */
export function setIn(obj, keys, value) {
  if (!keys.length) return value;
  const [k, ...rest] = keys;
  if (Array.isArray(obj)) {
    const next = obj.slice();
    next[k] = setIn(obj[k], rest, value);
    return next;
  }
  return { ...obj, [k]: setIn(obj?.[k], rest, value) };
}

const label = (item, i) =>
  item?.headline || item?.name || item?.key || item?.slug || item?.caption || item?.alt || item?.src || `Item ${i + 1}`;

export default function Studio() {
  const [files, setFiles] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [doc, setDoc] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [sel, setSel] = useState(0);
  const [busy, setBusy] = useState('');
  const [note, setNote] = useState(null);
  const [dragFrom, setDragFrom] = useState(null);

  const active = useMemo(() => files.find((f) => f.id === activeId) || null, [files, activeId]);
  const items = useMemo(() => {
    const c = active && doc ? doc[active.collection] : null;
    return Array.isArray(c) ? c : [];
  }, [active, doc]);

  // ☠️ KEEP THE MUSIC OUT OF THE EDITOR. SiteShell mounts the music room on
  // every route, /studio included, and the room arms document-level gesture
  // listeners: without this, the first click on a headline field would start
  // the lounge playing under somebody who is trying to write.
  // `dsd:videoaudio` is the site's own "something else has the sound, stand
  // aside" contract, and the room honours it by refusing to start on an ambient
  // gesture. Using the public event is the only way to do this without reaching
  // into another builder's component. The proper fix is one line in SiteShell,
  // adding /studio to the room-free list; until that lands, this holds.
  useEffect(() => {
    const say = (on) => {
      try {
        window.dispatchEvent(new CustomEvent('dsd:videoaudio', { detail: { on } }));
      } catch {
        /* no CustomEvent: the worst case is the dock behaving normally */
      }
    };
    say(true);
    return () => say(false);
  }, []);

  useEffect(() => {
    fetch('/api/studio/files')
      .then((r) => r.json())
      .then((d) => {
        const live = (d.files || []).filter((f) => f.exists);
        setFiles(live);
        if (live.length) setActiveId(live[0].id);
      })
      .catch((e) => setNote({ bad: true, text: `Could not list files: ${e.message}` }));
  }, []);

  const open = useCallback(
    async (f) => {
      if (dirty && !window.confirm('You have unsaved changes. Discard them?')) return;
      setBusy('loading');
      setNote(null);
      try {
        const r = await fetch(`/api/studio/file?path=${encodeURIComponent(f.path)}`);
        const d = await r.json();
        if (!r.ok) throw new Error(d.error || 'read failed');
        setDoc(d.data);
        setActiveId(f.id);
        setSel(0);
        setDirty(false);
      } catch (e) {
        setNote({ bad: true, text: e.message });
      } finally {
        setBusy('');
      }
    },
    [dirty],
  );

  useEffect(() => {
    const f = files.find((x) => x.id === activeId);
    if (f && !doc) open(f);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files, activeId]);

  const save = useCallback(async () => {
    if (!active || !doc) return;
    setBusy('saving');
    try {
      const r = await fetch('/api/studio/file', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: active.path, data: doc, note: `${items.length} items` }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'write failed');
      setDirty(false);
      setNote({ text: `Saved ${active.path}. Previous version kept at ${d.backup}.` });
    } catch (e) {
      setNote({ bad: true, text: e.message });
    } finally {
      setBusy('');
    }
  }, [active, doc, items.length]);

  const change = useCallback((keys, value) => {
    setDoc((d) => setIn(d, keys, value));
    setDirty(true);
  }, []);

  /** Reorder writes the collection straight back: the array order IS the arc. */
  const move = useCallback(
    (from, to) => {
      if (from === to || from == null || to == null) return;
      const next = items.slice();
      const [row] = next.splice(from, 1);
      next.splice(to, 0, row);
      setDoc((d) => ({ ...d, [active.collection]: next }));
      setDirty(true);
      setSel(to);
    },
    [items, active],
  );

  const toggleHidden = useCallback(
    (i) => {
      const next = items.slice();
      next[i] = { ...next[i] };
      if (next[i].hidden) delete next[i].hidden;
      else next[i].hidden = true;
      setDoc((d) => ({ ...d, [active.collection]: next }));
      setDirty(true);
    },
    [items, active],
  );

  const removeItem = useCallback(
    (i) => {
      if (!window.confirm(`Delete "${label(items[i], i)}"? The .bak from the last save is the undo.`)) return;
      const next = items.slice();
      next.splice(i, 1);
      setDoc((d) => ({ ...d, [active.collection]: next }));
      setDirty(true);
      setSel(Math.max(0, Math.min(i, next.length - 1)));
    },
    [items, active],
  );

  const current = items[sel];
  // ☠️ A MANIFEST IS NOT AN ARC. When the collection IS the media array — the
  // installs strip, the reels, the 244 spare parts — the thing to edit is the
  // whole GRID, not one tile at a time. Editing tile 1 of 30 through a form was
  // the first version of this and it was useless: you cannot reorder pictures
  // you cannot see side by side.
  const collectionIsMedia = useMemo(
    () => items.length > 0 && items.every((x) => x && typeof x === 'object' && typeof x.src === 'string'),
    [items],
  );
  const arcs = useMemo(() => [...new Set(files.map((f) => f.arc))], [files]);
  const previewHref = active?.route
    ? current?.key
      ? `http://localhost:3000${active.route}#beat-${current.key}`
      : `http://localhost:3000${active.route}`
    : null;

  return (
    <div className="st">
      <header className="st-top">
        <span className="st-brand">DentaSource studio</span>
        <span className="st-where">{active ? active.path : 'no file'}</span>
        <span className="st-grow" />
        {note ? <span className={`st-note${note.bad ? ' bad' : ''}`}>{note.text}</span> : null}
        {previewHref ? (
          <a className="st-btn ghost" href={previewHref} target="_blank" rel="noreferrer">
            Open beat ↗
          </a>
        ) : null}
        <button className="st-btn" type="button" onClick={save} disabled={!dirty || busy === 'saving'}>
          {busy === 'saving' ? 'Saving…' : dirty ? 'Save changes' : 'Saved'}
        </button>
      </header>

      <div className="st-body">
        <aside className="st-rail">
          {arcs.map((arc) => (
            <div key={arc} className="st-arc">
              <div className="st-arc-h">{arc}</div>
              <div className="st-tabs">
                {files
                  .filter((f) => f.arc === arc)
                  .map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      className={`st-tab${f.id === activeId ? ' on' : ''}`}
                      onClick={() => open(f)}
                    >
                      <span>{f.label}</span>
                      <span className="st-count">{f.count}</span>
                    </button>
                  ))}
              </div>
            </div>
          ))}

          <div className="st-arc-h">
            {active ? `${active.label} — drag to reorder` : 'Beats'}
          </div>
          <ol className="st-list">
            {items.map((it, i) => (
              <li
                key={it?.key || it?.slug || it?.src || i}
                className={`st-row${i === sel ? ' on' : ''}${it?.hidden ? ' hidden' : ''}${dragFrom === i ? ' dragging' : ''}`}
                draggable
                onDragStart={() => setDragFrom(i)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  move(dragFrom, i);
                  setDragFrom(null);
                }}
                onDragEnd={() => setDragFrom(null)}
              >
                <span className="st-grip" aria-hidden="true">
                  ⠿
                </span>
                <button type="button" className="st-row-main" onClick={() => setSel(i)}>
                  <span className="st-row-n">{i + 1}</span>
                  <span className="st-row-t">{label(it, i)}</span>
                  {it?.kind ? <span className="st-kind">{it.kind}</span> : null}
                </button>
                <button
                  type="button"
                  className="st-mini"
                  title={it?.hidden ? 'Show this beat' : 'Hide this beat'}
                  onClick={() => toggleHidden(i)}
                >
                  {it?.hidden ? '◌' : '●'}
                </button>
                <button type="button" className="st-mini danger" title="Delete" onClick={() => removeItem(i)}>
                  ✕
                </button>
              </li>
            ))}
          </ol>
          {items.length ? (
            <p className="st-hint">
              A hidden beat keeps its place in the file and is marked <code>hidden: true</code>. The arc renderer has to
              honour that flag for it to disappear from the site.
            </p>
          ) : null}
        </aside>

        <main className="st-main">
          {busy === 'loading' ? (
            <p className="st-empty">Loading…</p>
          ) : collectionIsMedia ? (
            <>
              <h2 className="st-h">{active.label}</h2>
              {typeof doc?.notes === 'string' && doc.notes ? <p className="st-hint">{doc.notes}</p> : null}
              <MediaGrid
                k={active.collection}
                value={items}
                onChange={(next) => {
                  setDoc((d) => ({ ...d, [active.collection]: next }));
                  setDirty(true);
                }}
              />
            </>
          ) : !current ? (
            <p className="st-empty">Pick a beat on the left.</p>
          ) : (
            <FieldEditor
              value={current}
              path={[active.collection, sel]}
              onChange={change}
              heading={label(current, sel)}
            />
          )}
        </main>
      </div>
    </div>
  );
}
