'use client';

// The studio shell: a rail of arcs and their beats on the left, one editor on
// the right, one Save button. No autosave, on purpose — a JSON file that ships
// should change when somebody decides it does, not when they click away.

import { useCallback, useEffect, useMemo, useState } from 'react';

import { stripUnsafeOf } from '@/lib/studio/registry';

import FieldEditor from './FieldEditor';
import LogoDials from './LogoDials';
import MarqueeSpeed from './MarqueeSpeed';
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

  useEffect(() => {
    fetch('/api/studio/files')
      .then((r) => r.json())
      .then((d) => {
        // ☠️ ABSENT MANIFESTS STAY IN THE LIST. Filtering them out made a file
        // that is being reshaped upstream look like something the studio cannot
        // open. They are shown greyed with the reason instead, and only a file
        // that EXISTS can be selected.
        const all = d.files || [];
        setFiles(all);
        const first = all.find((f) => f.exists);
        if (first) setActiveId(first.id);
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

  /** A transfer is written by the server, in both files, before we hear about
   *  it. So the only correct thing to do afterwards is throw away what is in
   *  memory and re-read from disk. */
  const afterTransfer = useCallback(
    async (res) => {
      const verb = res.mode === 'move' ? 'Moved' : 'Copied';
      const n = res.moved || res.copied;
      try {
        const r = await fetch(`/api/studio/file?path=${encodeURIComponent(active.path)}`);
        const d = await r.json();
        if (r.ok) {
          setDoc(d.data);
          setDirty(false);
          setSel(0);
        }
      } catch {
        /* the write already happened; a manual reload will show it */
      }
      setNote({ text: `${verb} ${n} into ${res.label}. Both files were written, each with a .bak.` });
      fetch('/api/studio/files')
        .then((r) => r.json())
        .then((d) => setFiles(d.files || []))
        .catch(() => {});
    },
    [active],
  );

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

  const showDials = activeId === '__dials';
  const showMarquee = activeId === '__marquee';
  const showTool = showDials || showMarquee;
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
                      className={`st-tab${f.id === activeId ? ' on' : ''}${f.exists ? '' : ' gone'}`}
                      onClick={() => f.exists && open(f)}
                      disabled={!f.exists}
                      title={f.exists ? f.path : `${f.path} — ${f.why || 'not present'}`}
                    >
                      <span>{f.label}</span>
                      <span className="st-count">{f.exists ? f.count : f.why || 'not present'}</span>
                    </button>
                  ))}
              </div>
            </div>
          ))}

          <div className="st-arc">
            <div className="st-arc-h">Tools</div>
            <div className="st-tabs">
              <button
                type="button"
                className={`st-tab${showDials ? ' on' : ''}`}
                onClick={() => setActiveId('__dials')}
                title="Tune the particle lockup live. Browser only, never saved to the repo."
              >
                <span>Logo dials</span>
                <span className="st-count">live</span>
              </button>
              <button
                type="button"
                className={`st-tab${showMarquee ? ' on' : ''}`}
                onClick={() => setActiveId('__marquee')}
                title="FFC's measured marquee speeds. Read only: they live in code, not content."
              >
                <span>Marquee speed</span>
                <span className="st-count">read only</span>
              </button>
            </div>
          </div>

          {!showTool ? (
            <div className="st-arc-h">
              {active ? `${active.label} — drag to reorder` : 'Beats'}
            </div>
          ) : null}
          <ol className="st-list" hidden={showTool}>
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
          {items.length && !showTool ? (
            <p className="st-hint">
              A hidden beat keeps its place in the file, marked <code>hidden: true</code>, and is gone from the site on
              the next reload. Press ● again to bring it back. Nothing is deleted.
            </p>
          ) : null}
        </aside>

        <main className="st-main">
          {showDials ? (
            <LogoDials />
          ) : showMarquee ? (
            <MarqueeSpeed />
          ) : busy === 'loading' ? (
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
                source={{ path: active.path, pointer: [active.collection] }}
                dirty={dirty}
                onTransferred={afterTransfer}
                blocked={stripUnsafeOf(doc)}
              />
              {/* ☠️ WHY SOMETHING IS MISSING IS EDITORIAL INFORMATION. The growth
                  partner set carries an `excluded` map of id range to reason,
                  most of them privacy calls. Showing it read-only under the grid
                  answers "where is that clip" before it is asked, and keeps the
                  reasons from being quietly edited away. */}
              {doc?.excluded && typeof doc.excluded === 'object' ? (
                <div className="st-excluded">
                  <div className="st-nest-h">
                    Left out on purpose ({Object.keys(doc.excluded).length}) — read only
                  </div>
                  {Object.entries(doc.excluded).map(([id, why]) => (
                    <div className="st-ex" key={id}>
                      <span className="st-ex-id">{id}</span>
                      <span className="st-ex-why">{String(why)}</span>
                    </div>
                  ))}
                </div>
              ) : null}
            </>
          ) : !current ? (
            <p className="st-empty">Pick a beat on the left.</p>
          ) : (
            <FieldEditor
              value={current}
              path={[active.collection, sel]}
              onChange={change}
              heading={label(current, sel)}
              filePath={active.path}
              dirty={dirty}
              onTransferred={afterTransfer}
              blocked={stripUnsafeOf(doc)}
            />
          )}
        </main>
      </div>
    </div>
  );
}
