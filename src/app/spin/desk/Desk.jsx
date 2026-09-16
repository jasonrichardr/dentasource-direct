'use client';

import { useCallback, useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { PRIZES } from '@/lib/spin/prizes';
import { deskTally, deskSearch, deskClaim, deskClaimByQr, deskClaimByCode, deskDeleteTests, deskLogout, deskRehearsal } from '@/actions/spin';
import QrScanner from './QrScanner';

const ORDER = ['credits30k', 'off10', 'off5', 'ecobag', 'ballpen', 'fogfree', 'spinagain'];

function when(iso) {
  try {
    return new Intl.DateTimeFormat('en-PH', { timeZone: 'Asia/Manila', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(iso));
  } catch { return iso; }
}

export default function Desk() {
  const router = useRouter();
  const [tally, setTally] = useState(null);
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState('');
  const [msg, setMsg] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null); // { tone: 'ok'|'warn'|'bad', title, sub }
  const [busy, start] = useTransition();

  const [typed, setTyped] = useState('');
  const showClaim = (r) => {
    if (r?.ok) {
      setScanResult({ tone: 'ok', title: `${r.row.prizeLabel} · hand it over`, sub: `${r.row.name} · ${r.row.clinic} · ${r.row.code}` });
      try { navigator.vibrate?.(80); } catch { /* no haptics */ }
    } else if (r?.already) {
      setScanResult({ tone: 'warn', title: 'Already claimed', sub: `${r.row.name} · ${r.row.prizeLabel} · ${r.row.claimed}` });
    } else {
      setScanResult({ tone: 'bad', title: r?.error || 'Could not read that QR', sub: r?.row ? `${r.row.name} · ${r.row.prizeLabel}` : '' });
    }
  };
  const onTyped = (e) => { e.preventDefault(); const c = typed; start(async () => { showClaim(await deskClaimByCode(c)); setTyped(''); await refresh(q); }); };

  const onToken = (token) => start(async () => {
    const r = await deskClaimByQr(token);
    if (r?.ok) {
      setScanResult({ tone: 'ok', title: `${r.row.prizeLabel} · hand it over`, sub: `${r.row.name} · ${r.row.clinic} · ${r.row.code}` });
      try { navigator.vibrate?.(80); } catch { /* no haptics */ }
    } else if (r?.already) {
      setScanResult({ tone: 'warn', title: 'Already claimed', sub: `${r.row.name} · ${r.row.prizeLabel} · ${r.row.claimed}` });
    } else {
      setScanResult({ tone: 'bad', title: r?.error || 'Could not read that QR', sub: r?.row ? `${r.row.name} · ${r.row.prizeLabel}` : '' });
    }
    await refresh(q);
  });

  const refresh = useCallback(async (query = q) => {
    const [t, r] = await Promise.all([deskTally(), deskSearch(query)]);
    setTally(t); setRows(r);
  }, [q]);

  useEffect(() => { refresh('').catch(() => router.refresh()); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const search = (e) => { e.preventDefault(); start(() => refresh(q)); };

  const claim = (id) => start(async () => {
    const r = await deskClaim(id);
    if (r?.error) { setMsg(r.error); return; }
    setMsg(`Claimed ${r.row.code} for ${r.row.name}.`);
    await refresh(q);
  });

  const deleteTests = () => start(async () => {
    if (pendingDelete == null) {
      const r = await deskDeleteTests(false);
      setPendingDelete(r.count);
      return;
    }
    const r = await deskDeleteTests(true);
    setMsg(`Deleted ${r.deleted} test spins.`);
    setPendingDelete(null);
    await refresh(q);
  });

  const rehearsal = (on) => start(async () => { await deskRehearsal(on); await refresh(q); });
  const logout = () => start(async () => { await deskLogout(); router.refresh(); });

  return (
    <main className="spin-root desk-root">
      <header className="desk-head">
        <div>
          <p className="eyebrow">DentaSource Direct · NADTI 2026</p>
          <h1 className="title">Booth desk</h1>
        </div>
        <div className="desk-head-actions">
          <button type="button" className="cta small scan-btn" onClick={() => { setScanResult(null); setScanning((v) => !v); }}>{scanning ? 'Close scanner' : 'Scan QR'}</button>
          <button className="ghost" onClick={logout} disabled={busy}>Lock</button>
        </div>
      </header>

      {scanning ? (
        <section className="scan-sheet">
          <QrScanner onToken={onToken} paused={busy} />
          {scanResult ? (
            <div className={`scan-result ${scanResult.tone}`}>
              <strong>{scanResult.title}</strong>
              {scanResult.sub ? <span>{scanResult.sub}</span> : null}
            </div>
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
          <div className={`stat status-${tally.status}`}>
            <span className="stat-n">{tally.status === 'open' ? 'OPEN' : 'CLOSED'}</span>
            <span className="stat-l">wheel · {tally.override}{tally.rehearsal ? ' · rehearsal' : ''}</span>
          </div>
        </section>
      ) : <p className="lede">Loading</p>}

      {tally ? (
        <section className="prize-tally">
          <div className="tally-head"><span>Prize</span><span>handed over / won · cap</span></div>
          {ORDER.map((id) => {
            const p = PRIZES.find((x) => x.id === id);
            const t = tally.byPrize[id];
            const full = t.cap != null && t.count >= t.cap;
            return (
              <div key={id} className={`tally-row kind-${p.kind} ${full ? 'full' : ''}`}>
                <span className="tally-label">{p.label}</span>
                <span className="tally-n"><b>{t.claimed}</b> / {t.count}{t.cap != null ? ` · cap ${t.cap}` : ''}</span>
              </div>
            );
          })}
        </section>
      ) : null}

      <form onSubmit={search} className="desk-search">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Claim code, mobile number, name, or clinic" inputMode="search" />
        <button className="cta small" type="submit" disabled={busy}>Find</button>
      </form>
      {msg ? <p className="desk-msg">{msg}</p> : null}

      <section className="rows">
        {rows.length === 0 ? <p className="lede">No spins yet.</p> : null}
        {rows.map((r) => (
          <article key={r.leadId} className={`row ${r.claimed ? 'claimed' : ''} ${r.test ? 'test' : ''}`}>
            <div className="row-main">
              <span className="row-code">{r.code}</span>
              <span className="row-prize">{r.prizeLabel}</span>
              {r.test ? <span className="row-tag">TEST</span> : null}
            </div>
            <div className="row-sub">{r.name} · {r.clinic} · {r.phone} · {when(r.createdAt)}</div>
            <div className="row-act">
              {r.claimed ? <span className="row-claimed">Claimed {r.claimed}</span> : (
                r.prizeId === 'spinagain'
                  ? <span className="row-claimed">Still spinning</span>
                  : <button className="cta small" onClick={() => claim(r.leadId)} disabled={busy}>Claimed</button>
              )}
            </div>
          </article>
        ))}
      </section>

      <section className="desk-tools">
        <h2 className="eyebrow">Tools</h2>
        <div className="tool-row">
          <button className="ghost" onClick={() => rehearsal(!tally?.rehearsal)} disabled={busy}>
            {tally?.rehearsal ? 'Leave rehearsal mode on this device' : 'Rehearsal mode on this device'}
          </button>
        </div>
        <div className="tool-row">
          <button className="ghost danger" onClick={deleteTests} disabled={busy || (tally && tally.testCount === 0)}>
            {pendingDelete == null ? `Delete test spins (${tally?.testCount ?? 0})` : `Really delete ${pendingDelete}? Tap again to confirm`}
          </button>
          {pendingDelete != null ? <button className="ghost" onClick={() => setPendingDelete(null)}>Cancel</button> : null}
        </div>
        <p className="fineprint">The wheel opens automatically on September 22 to 24. Rehearsal spins are tagged TEST and never count toward caps.</p>
      </section>
    </main>
  );
}
