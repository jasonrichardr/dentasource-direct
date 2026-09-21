'use client';

// Before the wheel opens: countdown, the wheel idling, what you can win, and pre-registration
// (a reserved spin with a backup QR). Rulings: brainstorms/2026-09-16-nadti-spin-preregister.md.

import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import { createPortal } from 'react-dom';
import { preRegister, lookupClinic } from '@/actions/spin';
import { PRIZES } from '@/lib/spin/prizes';
import { WINDOW_START_MS, countdownParts } from '@/lib/spin/format';
import { GoogleMapsMark } from './brandMarks';
import GoogleEmailButton from './GoogleEmailButton';
import Wheel from './Wheel';
import { track } from './track';

export const RESERVED_STORE = 'nadti-spin-2026-reserved';
export const BOOTH_LINE = 'Booth 034 and 035, Halls 1 to 3, SMX Convention Center Manila';
// The window is booth hours now, not calendar days, so the hours travel with the place.
export const HOURS_LINE = 'September 22 to 24, 9:00 AM to 5:00 PM';

export function loadReserved() {
  try { const r = JSON.parse(localStorage.getItem(RESERVED_STORE) || 'null'); return r && r.phone ? r : null; } catch { return null; }
}
export function saveReserved(r) { try { localStorage.setItem(RESERVED_STORE, JSON.stringify(r)); } catch { /* ignore */ } }
export function clearReserved() { try { localStorage.removeItem(RESERVED_STORE); } catch { /* ignore */ } }

const pad = (n) => String(n).padStart(2, '0');

export function Countdown({ target = WINDOW_START_MS, onDone }) {
  // Null until mounted: the server cannot know the phone's clock, and a seconds mismatch would break hydration.
  const [parts, setParts] = useState(null);
  useEffect(() => {
    const tick = () => setParts(countdownParts(target, Date.now()));
    const t = setInterval(tick, 1000);
    const first = setTimeout(tick, 0);
    return () => { clearInterval(t); clearTimeout(first); };
  }, [target]);
  useEffect(() => { if (parts?.done && onDone) onDone(); }, [parts?.done, onDone]);
  return (
    <div>
      <p className="cd-caption">The wheel opens Tuesday 9:00 AM</p>
      <div className="countdown" role="timer" aria-live="off">
        {[['days', parts?.days], ['hours', parts?.hours], ['min', parts?.minutes], ['sec', parts?.seconds]].map(([l, n]) => (
          <div className={`cd-cell cd-${l}`} key={l}><span className="cd-n">{n == null ? '--' : pad(n)}</span><span className="cd-l">{l}</span></div>
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

// The three headline prizes wear a badge (Jarich: "Grand Prize is 30,000 pesos training credit · 2nd prize 10% off on any · 3rd prize 5% off on any");
// the gifts show their picture.
const PODIUM = {
  credits30k: { badge: 'Grand Prize', title: '₱30,000 Training Credits', sub: 'DentaSource Direct Training Center · selected partner clinics', cls: 'p-grand' },
  off10: { badge: '2nd Prize', title: '10% off', sub: 'on any booth purchase or deposit', cls: 'p-second' },
  off5: { badge: '3rd Prize', title: '5% off', sub: 'on any booth purchase or deposit', cls: 'p-third' },
};
const GIFT_IMG = { fogfree: '/images/spin/fogfree.jpg', ballpen: '/images/spin/ballpen.jpg', ecobag: '/images/spin/ecobag.jpg' };

export function PrizeList({ onCredits }) {
  const podium = PRIZES.filter((p) => PODIUM[p.id]);
  const gifts = PRIZES.filter((p) => p.kind === 'gift');
  return (
    <div className="prizes" aria-label="What you can win">
      <ul className="podium">
        {podium.map((p) => { const d = PODIUM[p.id]; const tap = p.id === 'credits30k' && onCredits; return (
          <li key={p.id} className={`podium-row ${d.cls} ${tap ? 'tappable' : ''}`}>
            {tap ? (
              <button type="button" className="podium-btn" onClick={onCredits} aria-label="See what ₱30,000 Training Credits buys">
                <span className="badge">{d.badge}</span>
                <span className="p-body"><b className="p-title">{d.title}</b><small>{d.sub} · tap to see</small></span>
                <span className="p-go" aria-hidden>›</span>
              </button>
            ) : (
              <>
                <span className="badge">{d.badge}</span>
                <span className="p-body"><b className="p-title">{d.title}</b><small>{d.sub}</small></span>
              </>
            )}
            <span className="p-shine" aria-hidden />
          </li>
        ); })}
      </ul>
      <p className="gifts-label">Everyone else takes one of these home</p>
      <ul className="gifts">
        {gifts.map((p) => (
          <li key={p.id}><img src={GIFT_IMG[p.id]} alt="" loading="lazy" /><b>{p.label}</b></li>
        ))}
      </ul>
    </div>
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

export const SHARE_URL = 'https://dentasourcedirect.com/spin?src=share';
export const SHARE_TEXT = 'Every spin wins at the DentaSource Direct booth at NADTI 2026. Reserve yours:';

// navigator.share is the phone path; everything else gets the clipboard, and a
// textarea + execCommand behind that (older in-app browsers expose neither).
async function copyText(text) {
  try { await navigator.clipboard.writeText(text); return true; } catch { /* fall through */ }
  try {
    const ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', '');
    ta.style.position = 'fixed'; ta.style.top = '-1000px';
    document.body.appendChild(ta); ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch { return false; }
}

export function ReservedCard({ r, onReset }) {
  const qr = useQr(r.qr);
  const [shareMsg, setShareMsg] = useState('');
  const onShare = useCallback(async () => {
    track('spin-share');
    if (typeof navigator !== 'undefined' && navigator.share) {
      try { await navigator.share({ title: 'Spin to win at NADTI 2026', text: SHARE_TEXT, url: SHARE_URL }); }
      catch { /* the sheet was dismissed */ }
      return;
    }
    const ok = await copyText(`${SHARE_TEXT} ${SHARE_URL}`);
    setShareMsg(ok ? 'Link copied' : SHARE_URL);
  }, []);
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
      <div className="share-row">
        <button type="button" className="share-btn" onClick={onShare}>Share with your clinic</button>
        {shareMsg ? <p className="share-msg">{shareMsg}</p> : null}
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
      track('spin-reserved');
      onReserved?.(rec);
    });
  }, [onReserved, onOpen]);

  return (
    <form onSubmit={onSubmit} className="gate-form pre-form" noValidate>
      <h2 className="title">Reserve your spin</h2>
      <p className="lede">30 seconds now, no form at the booth. Every spin wins something.</p>
      <GoogleEmailButton onIdentity={({ email, name }) => { setEmailV(email); if (name && !nameV) setNameV(name); setFromGoogle(true); }} />
      <Field id="phone" label="Mobile number" type="tel" autoComplete="tel" inputMode="tel" placeholder="0917 123 4567" error={errors.phone} required />
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
      <label className={`consent ${errors.consent ? 'has-error' : ''}`}>
        <input type="checkbox" name="consent" />
        <span>I agree that DentaSource Direct may contact me about products and promos.</span>
      </label>
      {errors.consent ? <p className="field-error">{errors.consent}</p> : null}
      {errors.form ? <p className="field-error">{errors.form}</p> : null}
      <button type="submit" className="cta" disabled={pending}>{pending ? 'Reserving' : 'Reserve my spin'}</button>
      <p className="fineprint">Your spin is reserved to this number. At the booth, open this page and spin.</p>
    </form>
  );
}

export default function PreEvent({ onOpen, doors, onCredits }) {
  const [reserved, setReserved] = useState(null);
  const [mounted, setMounted] = useState(false);
  // Two sentinels drive the sticky bar: the hero CTA (has it scrolled away?) and
  // the form/reserved slot (is the destination already on screen?).
  const [heroSeen, setHeroSeen] = useState(true);
  const [slotSeen, setSlotSeen] = useState(false);
  const heroCtaRef = useRef(null);
  const slotRef = useRef(null);
  const barRef = useRef(null);

  useEffect(() => { setMounted(true); setReserved(loadReserved()); }, []);
  const reset = () => { clearReserved(); setReserved(null); };

  // Scroll the visitor to whichever card is theirs, and hand the keyboard to the
  // first field. preventScroll keeps the smooth scroll from being cut short.
  const goToSlot = useCallback((event) => {
    track(event);
    const slot = slotRef.current;
    if (!slot) return;
    slot.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const first = slot.querySelector('input:not([type="hidden"]):not([type="checkbox"])');
    if (first) { try { first.focus({ preventScroll: true }); } catch { first.focus(); } }
  }, []);

  useEffect(() => {
    if (!mounted || typeof IntersectionObserver === 'undefined') return;
    const hero = new IntersectionObserver(([e]) => setHeroSeen(e.isIntersecting), { threshold: 0 });
    // ☠️ THE SLOT SENTINEL NEEDS A SHRUNK ROOT. The form is ~700px tall on a
    // 390-wide phone, so a plain threshold:0 counts it as "on screen" the moment
    // its first pixel peeks over the bottom edge. Measured: that left the bar a
    // 165px band out of 1,667px of scroll, which is a bar nobody ever sees.
    // Clipping 35% off the bottom of the root means the slot only counts once it
    // is genuinely being read, and the bar covers the whole prize section.
    const slot = new IntersectionObserver(([e]) => setSlotSeen(e.isIntersecting), { threshold: 0, rootMargin: '0px 0px -35% 0px' });
    if (heroCtaRef.current) hero.observe(heroCtaRef.current);
    if (slotRef.current) slot.observe(slotRef.current);
    return () => { hero.disconnect(); slot.disconnect(); };
  }, [mounted, reserved]);

  const showBar = mounted && !reserved && !heroSeen && !slotSeen;

  // The room's music dock sits in the same corner. Publish the bar's real height
  // on <html> so /lounge/room.css's dock can step above it (rule in spin.css).
  useEffect(() => {
    const html = document.documentElement;
    if (showBar) {
      html.style.setProperty('--spin-bar-h', `${barRef.current?.offsetHeight || 72}px`);
      html.classList.add('has-spin-bar');
    } else {
      html.classList.remove('has-spin-bar');
    }
    return () => { html.classList.remove('has-spin-bar'); };
  }, [showBar]);

  return (
    <>
      <section className="card pre-card">
        <h1 className="title">Every spin wins at NADTI 2026</h1>
        <p className="lede hero-lede">₱30,000 Training Credits, 10% and 5% off, and a gift for everyone else. Reserve your spin now, skip the form at the booth.</p>
        <p className="booth-line">{BOOTH_LINE}</p>
        <p className="hours-line">{HOURS_LINE}</p>
        <Countdown onDone={onOpen} />
        <button type="button" ref={heroCtaRef} className="cta hero-cta" onClick={() => goToSlot('spin-hero-cta')}>
          {reserved ? 'See my reservation' : 'Reserve my spin'}
        </button>
        <p className="fineprint">30 seconds. One spin per mobile number.</p>
      </section>
      <IdleWheel />
      <section className="card pre-card">
        <p className="eyebrow">What you can win</p>
        <p className="lede" style={{ marginTop: 6 }}>Every spin wins something. Prizes are claimed at the booth.</p>
        <PrizeList onCredits={onCredits} />
        <div ref={slotRef}>
          {reserved ? <ReservedCard r={reserved} onReset={reset} /> : <PreRegisterForm onReserved={setReserved} onOpen={onOpen} />}
        </div>
      </section>
      <section className="card">{doors}</section>
      {showBar && mounted
        ? createPortal(
            <div className="spin-bar" ref={barRef}>
              <button type="button" className="cta" onClick={() => goToSlot('spin-bar-cta')}>Reserve my spin</button>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
