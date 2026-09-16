'use client';

// Before the wheel opens: countdown, the wheel idling, what you can win, and pre-registration
// (a reserved spin with a backup QR). Rulings: brainstorms/2026-09-16-nadti-spin-preregister.md.

import { useCallback, useEffect, useState, useTransition } from 'react';
import { preRegister, lookupClinic } from '@/actions/spin';
import { PRIZES } from '@/lib/spin/prizes';
import { WINDOW_START_MS, countdownParts } from '@/lib/spin/format';
import { GoogleMapsMark } from './brandMarks';
import GoogleEmailButton from './GoogleEmailButton';
import Wheel from './Wheel';

export const RESERVED_STORE = 'nadti-spin-2026-reserved';
export const BOOTH_LINE = 'Booth 034 and 035 · Halls 1 to 3';

export function loadReserved() {
  try { const r = JSON.parse(localStorage.getItem(RESERVED_STORE) || 'null'); return r && r.phone ? r : null; } catch { return null; }
}
export function saveReserved(r) { try { localStorage.setItem(RESERVED_STORE, JSON.stringify(r)); } catch { /* ignore */ } }
export function clearReserved() { try { localStorage.removeItem(RESERVED_STORE); } catch { /* ignore */ } }

const pad = (n) => String(n).padStart(2, '0');

export function Countdown({ target = WINDOW_START_MS, onDone }) {
  const [parts, setParts] = useState(() => countdownParts(target, Date.now()));
  useEffect(() => {
    const t = setInterval(() => setParts(countdownParts(target, Date.now())), 1000);
    return () => clearInterval(t);
  }, [target]);
  useEffect(() => { if (parts.done && onDone) onDone(); }, [parts.done, onDone]);
  return (
    <div>
      <p className="cd-caption">The wheel opens in</p>
      <div className="countdown" role="timer" aria-live="off">
        {[['days', parts.days], ['hours', parts.hours], ['min', parts.minutes], ['sec', parts.seconds]].map(([l, n]) => (
          <div className="cd-cell" key={l}><span className="cd-n">{pad(n)}</span><span className="cd-l">{l}</span></div>
        ))}
      </div>
    </div>
  );
}

export function IdleWheel() {
  return (
    <div className="pre-wheel" aria-hidden>
      <Wheel wedgeIndex={0} spinning={false} spinKey={0} onDone={() => {}} />
    </div>
  );
}

export function PrizeList() {
  const rows = PRIZES.filter((p) => p.kind !== 'respin');
  const note = { credits: 'Selected partner clinics', discount: 'Any booth purchase or deposit', gift: 'While stocks last' };
  return (
    <ul className="prize-list" aria-label="What you can win">
      {rows.map((p) => (
        <li key={p.id} className={p.kind === 'credits' ? 'hi' : p.kind === 'discount' ? 'disc' : ''}>
          <span className="prize-dot" aria-hidden /><b>{p.label}</b><small>{note[p.kind]}</small>
        </li>
      ))}
    </ul>
  );
}

function Field({ id, label, type = 'text', error, ...rest }) {
  return (
    <label className={`field ${error ? 'has-error' : ''}`} htmlFor={id}>
      <span className="field-label">{label}</span>
      <input id={id} name={id} type={type} {...rest} />
      {error ? <span className="field-error">{error}</span> : null}
    </label>
  );
}

function useQr(token) {
  const [url, setUrl] = useState('');
  useEffect(() => {
    if (!token) { setUrl(''); return; }
    let live = true;
    import('qrcode').then((m) => m.toDataURL(token, { errorCorrectionLevel: 'M', margin: 1, width: 440, color: { dark: '#06110c', light: '#ffffff' } }))
      .then((u) => { if (live) setUrl(u); })
      .catch(() => { if (live) setUrl(''); });
    return () => { live = false; };
  }, [token]);
  return url;
}

export function ReservedCard({ r, onReset }) {
  const qr = useQr(r.qr);
  return (
    <div className="pre-form" style={{ textAlign: 'center' }}>
      <p className="eyebrow">Spin reserved</p>
      <p className="reserved-name">See you at the booth, Dr {r.firstName}.</p>
      <p className="lede">Open this page on your phone at {BOOTH_LINE} and your spin is ready. No re-typing.</p>
      <div className="code-box">
        <span className="code-label">Your reservation QR</span>
        {qr ? <img src={qr} alt="Reservation QR code" className="qr" /> : <span className="qr qr-pending" aria-hidden />}
        <span className="code-hint">Backup only. If you change phones, our desk finds you with this.</span>
        <span className="code-subtle">{r.code}</span>
      </div>
      <button type="button" className="ghost" onClick={onReset}>Not you? Register with your own number</button>
    </div>
  );
}

/** The pre-registration form. onReserved(record) after a successful save; onOpen when the wheel is already open. */
export function PreRegisterForm({ onReserved, onOpen }) {
  const [errors, setErrors] = useState({});
  const [pending, start] = useTransition();
  const [clinicQ, setClinicQ] = useState('');
  const [matches, setMatches] = useState([]);
  const [place, setPlace] = useState(null);
  const [lookingUp, setLookingUp] = useState(false);
  const [noneOfThese, setNoneOfThese] = useState(false);
  const [nameV, setNameV] = useState('');
  const [emailV, setEmailV] = useState('');
  const [fromGoogle, setFromGoogle] = useState(false);

  useEffect(() => {
    const q = clinicQ.trim();
    if (q.length < 3 || place || noneOfThese) { if (q.length < 3) setMatches([]); return; }
    const t = setTimeout(() => {
      setLookingUp(true);
      lookupClinic(q).then((rows) => { setMatches(rows || []); }).finally(() => setLookingUp(false));
    }, 600);
    return () => clearTimeout(t);
  }, [clinicQ, place, noneOfThese]);

  const onSubmit = useCallback((e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    start(async () => {
      const r = await preRegister(fd);
      if (r?.fields) { setErrors(r.fields); return; }
      if (r?.open) { onOpen?.(); return; }
      if (r?.error) { setErrors({ form: r.error }); return; }
      setErrors({});
      const rec = { leadId: r.leadId, code: r.code, qr: r.qr, firstName: r.firstName, name: r.name, clinic: r.clinic, email: r.email, phone: r.phone, reservedAt: Date.now() };
      saveReserved(rec);
      onReserved?.(rec);
    });
  }, [onReserved, onOpen]);

  return (
    <form onSubmit={onSubmit} className="gate-form pre-form" noValidate>
      <h2 className="title">Reserve your spin</h2>
      <p className="lede">Register now, spin at the booth. One spin per mobile number, every spin wins something.</p>
      <GoogleEmailButton onIdentity={({ email, name }) => { setEmailV(email); if (name && !nameV) setNameV(name); setFromGoogle(true); }} />
      <Field id="name" label="Full name" autoComplete="name" error={errors.name} required value={nameV} onChange={(e) => setNameV(e.target.value)} />
      <Field id="clinic" label="Dental clinic" autoComplete="organization" error={errors.clinic} required value={clinicQ} onChange={(e) => { setClinicQ(e.target.value); setPlace(null); setNoneOfThese(false); }} />
      {place ? (
        <div className="match picked">
          <GoogleMapsMark size={20} />
          <div className="match-body"><span className="match-name">{place.name}</span><span className="match-addr">{place.address}</span></div>
          <button type="button" className="match-x" onClick={() => { setPlace(null); setMatches([]); }} aria-label="Change clinic">Change</button>
          <input type="hidden" name="placeId" value={place.placeId} />
          <input type="hidden" name="placeName" value={place.name} />
          <input type="hidden" name="placeAddress" value={place.address || ''} />
          <input type="hidden" name="placeLat" value={place.lat} />
          <input type="hidden" name="placeLng" value={place.lng} />
        </div>
      ) : matches.length > 0 && !noneOfThese ? (
        <div className="matches" role="group" aria-label="Is this your clinic?">
          <p className="match-q">Is this your clinic?</p>
          {matches.map((m) => (
            <button type="button" key={m.placeId} className="match" onClick={() => { setPlace(m); setMatches([]); }}>
              <GoogleMapsMark size={20} />
              <div className="match-body"><span className="match-name">{m.name}</span><span className="match-addr">{m.address}</span></div>
            </button>
          ))}
          <button type="button" className="ghost" onClick={() => setNoneOfThese(true)}>None of these</button>
        </div>
      ) : lookingUp ? <p className="match-q">Looking up your clinic on Google</p> : null}
      <Field id="email" label={fromGoogle ? 'Email (from Google)' : 'Email'} type="email" autoComplete="email" inputMode="email" error={errors.email} required value={emailV} onChange={(e) => { setEmailV(e.target.value); setFromGoogle(false); }} />
      <Field id="phone" label="Mobile number" type="tel" autoComplete="tel" inputMode="tel" placeholder="0917 123 4567" error={errors.phone} required />
      <label className={`consent ${errors.consent ? 'has-error' : ''}`}>
        <input type="checkbox" name="consent" />
        <span>I agree that DentaSource Direct may contact me about products and promos.</span>
      </label>
      {errors.consent ? <p className="field-error">{errors.consent}</p> : null}
      {errors.form ? <p className="field-error">{errors.form}</p> : null}
      <button type="submit" className="cta" disabled={pending}>{pending ? 'Reserving' : 'Reserve my spin'}</button>
      <p className="fineprint">Your spin is redeemed on your own phone at the booth.</p>
    </form>
  );
}

export default function PreEvent({ onOpen, doors }) {
  const [reserved, setReserved] = useState(null);
  useEffect(() => { setReserved(loadReserved()); }, []);
  const reset = () => { clearReserved(); setReserved(null); };
  return (
    <>
      <section className="card pre-card">
        <h1 className="title">The wheel opens at NADTI</h1>
        <p className="booth-line">{BOOTH_LINE}</p>
        <Countdown onDone={onOpen} />
      </section>
      <IdleWheel />
      <section className="card pre-card">
        <p className="eyebrow">What you can win</p>
        <p className="lede" style={{ marginTop: 6 }}>Every spin wins something. Prizes are claimed at the booth.</p>
        <PrizeList />
        {reserved ? <ReservedCard r={reserved} onReset={reset} /> : <PreRegisterForm onReserved={setReserved} onOpen={onOpen} />}
      </section>
      <section className="card">{doors}</section>
    </>
  );
}
