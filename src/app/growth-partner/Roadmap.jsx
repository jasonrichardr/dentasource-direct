'use client';

// The Software & Agentic Engineering roadmap (2026-09-18). A spine of stages; tap a node and it opens with why it
// matters, what you will do, the tool, and a "did you know". Tapping "Add to my path" builds a personal path that is
// remembered on the phone (dsd:jdev-path) and shows as a progress ring. roadmap.sh grammar, written for dentists.
import { useEffect, useMemo, useState } from 'react';
import { ROADMAP, LEVELS } from '@/data/roadmap';

const KEY = 'dsd:jdev-path';
const ALL = ROADMAP.flatMap((s) => s.nodes.map((n) => n.id));

export default function Roadmap({ onModule }) {
  const [open, setOpen] = useState(null);
  const [path, setPath] = useState([]);
  const [seen, setSeen] = useState([]);
  const [burst, setBurst] = useState(null);
  // stops renamed between rounds live on in old phones' storage: keep only ids that still exist, so the ring never passes 100
  useEffect(() => { try { const v = JSON.parse(localStorage.getItem(KEY) || '{}'); const keep = (a) => (Array.isArray(a) ? a.filter((id) => ALL.includes(id)) : []); setPath(keep(v.path)); setSeen(keep(v.seen)); } catch { /* ignore */ } }, []);
  const save = (p, s) => { try { localStorage.setItem(KEY, JSON.stringify({ path: p, seen: s })); } catch { /* ignore */ } };
  const tap = (id) => {
    setOpen((cur) => (cur === id ? null : id));
    setSeen((s) => { const n = s.includes(id) ? s : [...s, id]; save(path, n); return n; });
    setBurst(id); setTimeout(() => setBurst((b) => (b === id ? null : b)), 700);
  };
  const toggle = (id) => setPath((p) => { const n = p.includes(id) ? p.filter((x) => x !== id) : [...p, id]; save(n, seen); return n; });
  const pct = Math.min(100, Math.round((seen.filter((id) => ALL.includes(id)).length / ALL.length) * 100));
  const cur = useMemo(() => { for (const s of ROADMAP) { const n = s.nodes.find((x) => x.id === open); if (n) return { s, n }; } return null; }, [open]);
  const must = ALL.length;
  return (
    <div className="viz rm">
      <div className="rm-head">
        <div className="rm-ring" style={{ '--p': pct }}><b>{pct}%</b><small>explored</small></div>
        <div>
          <p className="viz-t" style={{ margin: 0 }}>The roadmap. Tap anything.</p>
          <p className="rm-lead">Nine stages, {must} stops. Gold stops are the spine; the rest you add when you have the taste for them. Your path is remembered on this phone.</p>
          <div className="rm-legend">{Object.entries(LEVELS).map(([k, v]) => <span key={k}><i style={{ background: v.color }} />{v.label}</span>)}</div>
        </div>
      </div>
      <ol className="rm-spine">
        {ROADMAP.map((s) => (
          <li key={s.id} className="rm-stage" style={{ '--c': s.color }}>
            <div className="rm-stage-head"><span className="rm-num">{s.stage}</span><div><b>{s.title}</b><small>{s.line}</small></div></div>
            <div className="rm-nodes">
              {s.nodes.map((n) => (
                <button type="button" key={n.id} className={`rm-node lv-${n.level} ${open === n.id ? 'on' : ''} ${seen.includes(n.id) ? 'seen' : ''} ${path.includes(n.id) ? 'picked' : ''} ${burst === n.id ? 'burst' : ''}`} onClick={() => tap(n.id)} aria-expanded={open === n.id}>
                  <span>{n.title}</span>{path.includes(n.id) ? <i aria-hidden>★</i> : null}
                </button>
              ))}
            </div>
            {cur && cur.s.id === s.id ? (
              <div className="rm-card" style={{ borderColor: LEVELS[cur.n.level].color }}>
                <div className="rm-card-top"><small style={{ color: LEVELS[cur.n.level].color }}>{LEVELS[cur.n.level].label} · {cur.n.tool}</small><b>{cur.n.title}</b></div>
                <p>{cur.n.blurb}</p>
                <p className="rm-do"><b>You will do:</b> {cur.n.doIt}</p>
                <p className="rm-wow"><b>Did you know.</b> {cur.n.wow}</p>
                <div className="rm-card-actions">
                  <button type="button" className={`gp-btn small ${path.includes(cur.n.id) ? '' : 'ghost'}`} onClick={() => toggle(cur.n.id)}>{path.includes(cur.n.id) ? '★ On my path' : '☆ Add to my path'}</button>
                  {onModule ? <button type="button" className="gp-btn ghost small" onClick={() => onModule(stageToModule(cur.s.id))}>See the module</button> : null}
                </div>
              </div>
            ) : null}
          </li>
        ))}
      </ol>
      {path.length ? (
        <div className="rm-path">
          <p className="viz-t" style={{ marginTop: 0 }}>My path · {path.length} stops</p>
          <div className="rm-path-list">{ROADMAP.flatMap((s) => s.nodes.filter((n) => path.includes(n.id)).map((n) => <span key={n.id} style={{ borderColor: s.color }} onClick={() => tap(n.id)} role="button" tabIndex={0}>{s.stage} · {n.title}</span>))}</div>
          <p className="viz-cap">Bring this to your first session. We build the batch around what the room picked.</p>
        </div>
      ) : <p className="viz-cap">Tap a stop, read it, add it to your path. The batch is built around what the room picks.</p>}
    </div>
  );
}

function stageToModule(id) { return { think: 1, found: 2, agents: 3, apps: 2, agentic: 4, knowledge: 5, security: 6, operate: 9, capstone: 10 }[id] || 1; }
