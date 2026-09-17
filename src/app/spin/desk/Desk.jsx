'use client';

import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { PRIZES } from '@/lib/spin/prizes';
import { searchUrl } from '@/lib/spin/console';
import {
  deskTally, deskSearch, deskClaim, deskClaimByQr, deskClaimByCode, deskDeleteTests, deskDeleteReserved, deskLogout, deskRehearsal,
  deskSetPrize, deskResetPrizes, deskLinkSocial, deskNote,
} from '@/actions/spin';
import QrScanner from './QrScanner';
import { MARK } from '../brandMarks';

const ORDER = ['credits30k', 'off10', 'off5', 'ecobag', 'ballpen', 'fogfree', 'spinagain'];
const SOCIALS = [
  { id: 'google', label: 'Maps' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'tiktok', label: 'TikTok' },
];

function when(iso) {
  try {
    return new Intl.DateTimeFormat('en-PH', { timeZone: 'Asia/Manila', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(iso));
  } catch { return iso; }
}

function linkedOf(r, id) {
  const s = r.socials || {};
  if (id === 'google') return !!(s.placeId || s.mapsUrl);
  if (id === 'facebook') return !!s.fbUrl;
  if (id === 'instagram') return !!s.igUrl;
  if (id === 'tiktok') return !!s.tiktokUrl;
  return false;
}

/** One prize row with live controls. Saves on change, debounced for the number fields. */
function PrizeRow({ id, t, onSave, busy }) {
  const p = PRIZES.find((x) => x.id === id);
  const [weight, setWeight] = useState(String(t.weight));
  const [cap, setCap] = useState(t.cap == null ? '' : String(t.cap));
  const timer = useRef(null);
  useEffect(() => { setWeight(String(t.weight)); setCap(t.cap == null ? '' : String(t.cap)); }, [t.weight, t.cap]);
  const queue = (patch) => { window.clearTimeout(timer.current); timer.current = window.setTimeout(() => onSave(id, patch), 600); };
  const full = t.cap != null && t.count >= t.cap;
  const changed = t.weight !== t.defaultWeight || t.cap !== t.defaultCap || !t.active;
  return (
    <div className={`prow kind-${p.kind} ${!t.active ? 'off' : ''} ${full ? 'full' : ''}`}>
      <div className="prow-top">
        <button type="button" role="switch" aria-checked={t.active} className={`switch ${t.active ? 'on' : ''}`} onClick={() => onSave(id, { active: !t.active })} disabled={busy} aria-label={`${p.label} ${t.active ? 'on' : 'off'}`}>
          <span className="knob" />
        </button>
        <div className="prow-name">
          <b>{p.label}</b>
          <small>{t.active ? `${t.chance}% chance right now` : 'Switched off'}{full ? ' · cap reached' : ''}</small>
        </div>
        <div className="prow-count"><b>{t.claimed}</b><span>/ {t.count} won</span></div>
      </div>
      <div className="prow-ctl">
        <label><span>Chance weight</span><input inputMode="decimal" value={weight} onChange={(e) => { setWeight(e.target.value); queue({ weight: Number(e.target.value) }); }} disabled={!t.active} /></label>
        <label><span>Cap</span><input inputMode="numeric" value={cap} placeholder="none" onChange={(e) => { setCap(e.target.value); queue({ cap: e.target.value === '' ? null : Number(e.target.value) }); }} /></label>
        {changed ? <button type="button" className="ghost tiny" onClick={() => onSave(id, { active: true, weight: t.defaultWeight, cap: t.defaultCap })}>Reset</button> : null}
      </div>
    </div>
  );
}

function VisitorRow({ r, busy, onClaim, onLink, onNote, onRemove }) {
  const [open, setOpen] = useState(null);
  const [draft, setDraft] = useState('');
  const [note, setNote] = useState('');
  const [msg, setMsg] = useState('');
  const [more, setMore] = useState(false);
  const submitLink = async (e) => {
    e.preventDefault();
    const res = await onLink(r.leadId, open, draft);
    if (res?.error) { setMsg(res.error); return; }
    setMsg(res?.skipped ? 'Saved (test row, console untouched).' : res?.already ? `Already linked: ${res.url}` : 'Linked.'); setOpen(null); setDraft('');
  };
  const submitNote = async (e) => {
    e.preventDefault();
    const res = await onNote(r.leadId, note);
    if (res?.error) { setMsg(res.error); return; }
    setMsg(res?.skipped ? 'Saved (test row, console untouched).' : 'Note added to the console.'); setNote('');
  };
  return (
    <article className={`row ${r.claimed ? 'claimed' : ''} ${r.test ? 'test' : ''}`}>
      <div className="row-main">
        <span className="row-code">{r.code}</span>
        <span className="row-prize">{r.prizeLabel}</span>
        {r.test ? <span className="row-tag">TEST</span> : null}
      </div>
      <div className="row-sub">{r.name} · {r.clinic} · <a href={`tel:${r.phone}`}>{r.phone}</a> · {when(r.createdAt)}</div>
      <div className="row-socials" aria-label="Linked socials">
        {SOCIALS.map((s) => {
          const Mark = MARK[s.id]; const on = linkedOf(r, s.id);
          return (
            <button key={s.id} type="button" className={`soc ${on ? 'on' : ''}`} onClick={() => { if (on) return; setOpen(open === s.id ? null : s.id); setDraft(''); setMsg(''); }} title={on ? `${s.label} linked` : `Link ${s.label}`} aria-pressed={on}>
              <span className="soc-box" aria-hidden>{on ? '✓' : ''}</span>
              <Mark size={16} /><span>{s.label}</span>
            </button>
          );
        })}
        <button type="button" className="ghost tiny" onClick={() => setMore((v) => !v)}>{more ? 'Hide note' : 'Add note'}</button>
      </div>
      {open ? (
        <form className="typed-row" onSubmit={submitLink}>
          <a className="ghost tiny" href={searchUrl(open, r.clinic)} target="_blank" rel="noreferrer">Search</a>
          <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={open === 'google' ? 'Google Maps link' : 'Page link or @handle'} autoCapitalize="none" autoCorrect="off" />
          <button type="submit" className="cta small" disabled={busy || !draft.trim()}>Link</button>
        </form>
      ) : null}
      {more ? (
        <form className="typed-row" onSubmit={submitNote}>
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="What did you learn? Goes to the console note." />
          <button type="submit" className="cta small" disabled={busy || !note.trim()}>Save</button>
        </form>
      ) : null}
      {msg ? <p className="row-msg">{msg}</p> : null}
      <div className="row-act">
        {r.reserved ? <><span className="row-claimed">Reserved · not spun yet</span><button type="button" className="ghost tiny" onClick={() => onRemove(r.leadId, r.code)} disabled={busy}>Remove</button></> : r.claimed ? <span className="row-claimed">Claimed {r.claimed}</span> : (
          r.prizeId === 'spinagain'
            ? <span className="row-claimed">Still spinning</span>
            : <button className="cta small" onClick={() => onClaim(r.leadId)} disabled={busy}>Claimed</button>
        )}
      </div>
    </article>
  );
}

export default function Desk() {
  const router = useRouter();
  const [tally, setTally] = useState(null);
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState('');
  const [msg, setMsg] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [typed, setTyped] = useState('');
  const [tab, setTab] = useState('visitors');
  const [busy, start] = useTransition();

  const refresh = useCallback(async (query = q) => {
    const [t, r] = await Promise.all([deskTally(), deskSearch(query)]);
    setTally(t); setRows(r);
  }, [q]);

  useEffect(() => { refresh('').catch(() => router.refresh()); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const showClaim = (r) => {
    if (r?.ok) {
      setScanResult({ tone: 'ok', title: `${r.row.prizeLabel} · hand it over`, sub: `${r.row.name} · ${r.row.clinic} · ${r.row.code}` });
      try { navigator.vibrate?.(80); } catch { /* no haptics */ }
    } else if (r?.already) {
      setScanResult({ tone: 'warn', title: 'Already claimed', sub: `${r.row.name} · ${r.row.prizeLabel} · ${r.row.claimed}` });
    } else if (r?.reserved) {
      setScanResult({ tone: 'warn', title: 'Reserved spin, not spun yet', sub: `${r.row.name} · ${r.row.clinic} · ask them to open dentasourcedirect.com/spin` });
    } else {
      setScanResult({ tone: 'bad', title: r?.error || 'Could not read that QR', sub: r?.row ? `${r.row.name} · ${r.row.prizeLabel}` : '' });
    }
  };
  const onToken = (token) => start(async () => { showClaim(await deskClaimByQr(token)); await refresh(q); });
  const onTyped = (e) => { e.preventDefault(); const c = typed; start(async () => { showClaim(await deskClaimByCode(c)); setTyped(''); await refresh(q); }); };
  const search = (e) => { e.preventDefault(); start(() => refresh(q)); };
  const claim = (id) => start(async () => { const r = await deskClaim(id); if (r?.error) { setMsg(r.error); return; } setMsg(`Claimed ${r.row.code} for ${r.row.name}.`); await refresh(q); });
  const savePrize = (id, patch) => start(async () => { const r = await deskSetPrize(id, patch); if (r?.error) setMsg(r.error); await refresh(q); });
  const resetPrizes = () => start(async () => { await deskResetPrizes(); setMsg('Prize controls reset to the defaults.'); await refresh(q); });
  const link = (leadId, platform, value) => new Promise((resolve) => start(async () => { const r = await deskLinkSocial(leadId, platform, value); if (r?.ok) await refresh(q); resolve(r); }));
  const note = (leadId, line) => new Promise((resolve) => start(async () => { resolve(await deskNote(leadId, line)); }));
  const deleteTests = () => start(async () => {
    if (pendingDelete == null) { const r = await deskDeleteTests(false); setPendingDelete(r.count); return; }
    const r = await deskDeleteTests(true); setMsg(`Deleted ${r.deleted} test spins.`); setPendingDelete(null); await refresh(q);
  });
  const [pendingRemove, setPendingRemove] = useState(null);
  const removeReserved = (leadId, code) => start(async () => {
    if (pendingRemove !== leadId) { setPendingRemove(leadId); setMsg(`Remove reservation ${code}? Tap Remove again to confirm.`); return; }
    const r = await deskDeleteReserved(leadId); setPendingRemove(null);
    setMsg(r?.error || `Reservation ${code} removed.`); await refresh(q);
  });
  const rehearsal = (on) => start(async () => { await deskRehearsal(on); await refresh(q); });
  const logout = () => start(async () => { await deskLogout(); router.refresh(); });

  const active = tally ? ORDER.filter((id) => tally.byPrize[id]?.active).length : 0;

  return (
    <main className="spin-root desk-root">
      <header className="desk-bar">
        <div className="desk-brand">
          <img src="/images/brand/dsd-mark.png" alt="" />
          <div><b>DentaSource Direct</b><small>Booth desk · NADTI</small></div>
        </div>
        <div className="desk-head-actions">
          <button type="button" className={`cta small scan-btn ${scanning ? 'active' : ''}`} onClick={() => { setScanResult(null); setScanning((v) => !v); }}>
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M4 12h16" /></svg>
            {scanning ? 'Close' : 'Scan QR'}
          </button>
          <button className="ghost" onClick={logout} disabled={busy}>Lock</button>
        </div>
      </header>

      {scanning ? (
        <section className="scan-sheet">
          <QrScanner onToken={onToken} paused={busy} />
          {scanResult ? (
            <div className={`scan-result ${scanResult.tone}`}><strong>{scanResult.title}</strong>{scanResult.sub ? <span>{scanResult.sub}</span> : null}</div>
          ) : <p className="scanner-hint">Point the camera at the visitor's claim QR. A claim is recorded the moment it reads.</p>}
          <form className="typed-row" onSubmit={onTyped}>
            <input value={typed} onChange={(e) => setTyped(e.target.value.toUpperCase())} placeholder="No camera? Type the code under the QR" autoCapitalize="characters" autoCorrect="off" maxLength={8} />
            <button type="submit" className="cta small" disabled={busy || typed.trim().length < 4}>Claim</button>
          </form>
        </section>
      ) : null}

      {tally ? (
        <section className="desk-grid">
          <div className="stat"><span className="stat-n">{tally.today}</span><span className="stat-l">spins today</span></div>
          <div className="stat"><span className="stat-n">{tally.total}</span><span className="stat-l">spins total</span></div>
          <div className="stat stat-claimed"><span className="stat-n">{tally.claimedTotal}</span><span className="stat-l">prizes handed over</span></div>
          <div className="stat"><span className="stat-n">{tally.reserved}</span><span className="stat-l">pre-registered</span></div>
          <div className={`stat status-${tally.status}`}>
            <span className="stat-n"><i className="pulse" aria-hidden />{tally.status === 'open' ? 'OPEN' : 'CLOSED'}</span>
            <span className="stat-l">wheel · {tally.override}{tally.rehearsal ? ' · rehearsal' : ''}</span>
          </div>
        </section>
      ) : <p className="lede">Loading</p>}

      <nav className="desk-tabs" aria-label="Desk sections">
        <button type="button" className={tab === 'visitors' ? 'on' : ''} onClick={() => setTab('visitors')}>Visitors</button>
        <button type="button" className={tab === 'prizes' ? 'on' : ''} onClick={() => setTab('prizes')}>{tally ? `Prizes · ${active}/${ORDER.length} on` : 'Prizes'}</button>
      </nav>

      {msg ? <p className="desk-msg">{msg}</p> : null}

      {tab === 'prizes' && tally ? (
        <section className="prizes">
          <p className="fineprint">Switch a prize off when stock runs out, lower its chance weight, or set a cap. Changes apply to the very next spin. The chance shown is what a visitor faces right now, after caps and switches.</p>
          {ORDER.map((id) => <PrizeRow key={id} id={id} t={tally.byPrize[id]} onSave={savePrize} busy={busy} />)}
          <button type="button" className="ghost" onClick={resetPrizes} disabled={busy}>Reset all prizes to the defaults</button>
        </section>
      ) : null}

      {tab === 'visitors' ? (
        <>
          <form onSubmit={search} className="desk-search">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Claim code, mobile number, name, or clinic" inputMode="search" />
            <button className="cta small" type="submit" disabled={busy}>Find</button>
          </form>
          <section className="rows">
            {rows.length === 0 ? <p className="lede">No spins yet.</p> : null}
            {rows.map((r) => <VisitorRow key={r.leadId} r={r} busy={busy} onClaim={claim} onLink={link} onNote={note} onRemove={removeReserved} />)}
          </section>
          <section className="desk-tools">
            <h2 className="eyebrow">Tools</h2>
            <div className="tool-row">
              <button className="ghost" onClick={() => rehearsal(!tally?.rehearsal)} disabled={busy}>{tally?.rehearsal ? 'Leave rehearsal mode on this device' : 'Rehearsal mode on this device'}</button>
            </div>
            <div className="tool-row">
              <button className="ghost danger" onClick={deleteTests} disabled={busy || (tally && tally.testCount === 0)}>
                {pendingDelete == null ? `Delete test spins (${tally?.testCount ?? 0})` : `Really delete ${pendingDelete}? Tap again to confirm`}
              </button>
              {pendingDelete != null ? <button className="ghost" onClick={() => setPendingDelete(null)}>Cancel</button> : null}
            </div>
            <p className="fineprint">The wheel opens automatically on September 22 to 24. Rehearsal spins are tagged TEST and never count toward caps.</p>
          </section>
        </>
      ) : null}
    </main>
  );
}
