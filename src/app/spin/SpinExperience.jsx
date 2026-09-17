'use client';

import { useCallback, useEffect, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { PRIZE_BY_ID } from '@/lib/spin/prizes';
import { submitSpin, respin, enterRehearsal, lookupClinic, linkClinicSocial, lookupReservation } from '@/actions/spin';
import ClinicLinkPanel from './ClinicLinkPanel';
import GoogleEmailButton from './GoogleEmailButton';
import OffersSheet from './OffersSheet';
import { GoogleMapsMark, FacebookMark, TikTokMark, MessengerMark } from './brandMarks';
import PreEvent, { loadReserved, saveReserved, clearReserved } from './PreEvent';
import LoungeRoom from './LoungeRoom';
import Wheel from './Wheel';
import Stage from './Stage';
import { unlockAudio, winChord } from './audio';

const STORE = 'nadti-spin-2026';
const FB = 'https://facebook.com/dentasource';
const MESSENGER = 'https://m.me/dentasource';
const TIKTOK = 'https://tiktok.com/@dentasourcedirect';
const GUIDE = '/news/nadti-2026-smx-manila-complete-guide';

const fade = {
  initial: { opacity: 0, y: 18, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -12, scale: 0.98 },
  transition: { duration: 0.35, ease: [0.2, 0.8, 0.2, 1] },
};

function Wordmark() {
  return (
    <div className="wordmark">
      <img src="/images/brand/dsd-mark.png" alt="" className="wordmark-mark" />
      <div className="wordmark-text">
        <span className="wm-line"><span className="wm-a">DENTA</span><span className="wm-b">SOURCE</span></span>
        <span className="wm-c">DIRECT</span>
      </div>
    </div>
  );
}

function Doors() {
  return (
    <div className="doors">
      <a className="door door-roson" href="/dentalchairs">
        <span className="roson-pill"><img src="/images/brand/roson-logo-final.png" alt="ROSON" /></span>
        <span>Browse our ROSON Dental Chairs</span>
      </a>
      <a className="door door-roson door-denjoy" href="/denjoy">
        <span className="roson-pill denjoy-pill"><img src="/images/brand/denjoy-logo-final.png" alt="Denjoy" /></span>
        <span>Explore our Denjoy Endo Line</span>
      </a>
      <a className="door door-news" href={GUIDE}>Read our NADTI 2026 guide</a>
      <div className="doors-social">
        <a className="door door-fb door-social" href={FB} target="_blank" rel="noopener"><span className="door-mark"><FacebookMark size={20} /></span>Facebook</a>
        <a className="door door-tt door-social" href={TIKTOK} target="_blank" rel="noopener"><span className="door-mark"><TikTokMark size={20} /></span>TikTok</a>
        <a className="door door-msg door-social" href={MESSENGER} target="_blank" rel="noopener"><span className="door-mark"><MessengerMark size={20} /></span>Message us</a>
      </div>
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

export default function SpinExperience({ status, rehearsal }) {
  const router = useRouter();
  const params = useSearchParams();
  // ?preview=closed on a rehearsal device shows the pre-event page even while the wheel is open.
  const forceClosed = rehearsal && params.get('preview') === 'closed';
  const [phase, setPhase] = useState(status === 'closed' || forceClosed ? 'closed' : 'gate');
  const [reserved, setReserved] = useState(null); // pre-registration record on this phone (or looked up by number)
  const [askNumber, setAskNumber] = useState(false);
  const [numberMsg, setNumberMsg] = useState('');
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});
  const [pending, start] = useTransition();
  const [spinKey, setSpinKey] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [burst, setBurst] = useState(0);
  const [already, setAlready] = useState(false);
  // Google clinic match under the clinic field
  const [clinicQ, setClinicQ] = useState('');
  const [matches, setMatches] = useState([]);
  const [place, setPlace] = useState(null);
  const [lookingUp, setLookingUp] = useState(false);
  const [noneOfThese, setNoneOfThese] = useState(false);
  const [nameV, setNameV] = useState('');
  const [emailV, setEmailV] = useState('');
  const [fromGoogle, setFromGoogle] = useState(false);
  const [qrUrl, setQrUrl] = useState('');
  const [offer, setOffer] = useState(null); // track id when the Training Center sheet is open

  // Prize QR: generated on the phone from the signed token the server returned.
  useEffect(() => {
    const token = result?.qr;
    if (!token) { setQrUrl(''); return; }
    let live = true;
    import('qrcode').then((m) => m.toDataURL(token, { errorCorrectionLevel: 'M', margin: 1, width: 440, color: { dark: '#06110c', light: '#ffffff' } }))
      .then((u) => { if (live) setQrUrl(u); })
      .catch(() => { if (live) setQrUrl(''); });
    return () => { live = false; };
  }, [result?.qr]);

  useEffect(() => {
    const q = clinicQ.trim();
    if (q.length < 3 || place || noneOfThese) { if (q.length < 3) setMatches([]); return; }
    const t = setTimeout(() => {
      setLookingUp(true);
      lookupClinic(q).then((rows) => { setMatches(rows || []); }).finally(() => setLookingUp(false));
    }, 600);
    return () => clearTimeout(t);
  }, [clinicQ, place, noneOfThese]);

  const saveResult = (r) => { try { localStorage.setItem(STORE, JSON.stringify(r)); } catch { /* ignore */ } };
  const onLink = useCallback(async (platform, value) => {
    const r = await linkClinicSocial(result.leadId, result.code, platform, value);
    if (r?.ok) {
      setResult((prev) => { const next = { ...prev, linked: { ...(prev?.linked || {}), [platform]: r.url } }; saveResult(next); return next; });
    }
    return r;
  }, [result]);

  // ?rehearsal=1 shows a PIN prompt; the PIN itself never travels in the URL.
  const [askPin, setAskPin] = useState(false);
  const [pinError, setPinError] = useState('');
  useEffect(() => { if (params.get('rehearsal')) setAskPin(true); }, [params]);
  const onPin = useCallback((e) => {
    e.preventDefault();
    const pin = new FormData(e.currentTarget).get('pin');
    start(async () => {
      const r = await enterRehearsal(pin);
      if (r?.error) { setPinError(r.error); return; }
      setAskPin(false);
      router.replace('/spin');
      router.refresh();
    });
  }, [router]);

  // Server status can flip after router.refresh() (rehearsal cookie, window opening).
  useEffect(() => {
    if (forceClosed) return;
    setPhase((ph) => {
      if (status === 'open' && ph === 'closed') return 'gate';
      if (status === 'closed' && ph === 'gate') return 'closed';
      return ph;
    });
  }, [status, forceClosed]);

  // Pre-registered on this phone: the gate becomes a welcome-back card.
  useEffect(() => { if (status === 'open') setReserved(loadReserved()); }, [status]);

  // Soft guard: this phone already has a prize saved.
  useEffect(() => {
    if (status === 'closed') return;
    try {
      const saved = JSON.parse(localStorage.getItem(STORE) || 'null');
      // A record from before the QR rollout has no signed token: drop it, the server returns a fresh one on re-sign-up.
      if (saved?.code && saved?.prizeId && saved?.qr) { setResult(saved); setAlready(true); setPhase('result'); }
      else if (saved) localStorage.removeItem(STORE);
    } catch { /* ignore */ }
  }, [status]);

  const submitFd = useCallback((fd) => {
    unlockAudio();
    start(async () => {
      const r = await submitSpin(fd);
      if (r?.fields) { setErrors(r.fields); return; }
      if (r?.closed) { setPhase('closed'); return; }
      if (r?.error) { setErrors({ form: r.error }); return; }
      setErrors({});
      const merged = { ...r, clinic: String(fd.get('clinic') || '').trim() || r.clinic || '', placeId: r.placeId || (place?.placeId ?? null), linked: {} };
      setResult(merged);
      if (r.reserved) clearReserved();
      if (r.already) {
        setAlready(true);
        saveResult(merged);
        setPhase('result');
        return;
      }
      setPhase('wheel');
    });
  }, [place]);

  const onSubmit = useCallback((e) => {
    e.preventDefault();
    submitFd(new FormData(e.currentTarget));
  }, [submitFd]);

  // Welcome-back: the reserved record (or the number they typed) is all the server needs.
  const onReservedSpin = useCallback(() => {
    if (!reserved) return;
    const fd = new FormData();
    fd.set('phone', reserved.phone);
    if (reserved.name) fd.set('name', reserved.name);
    if (reserved.clinic) fd.set('clinic', reserved.clinic);
    if (reserved.email) fd.set('email', reserved.email);
    submitFd(fd);
  }, [reserved, submitFd]);

  const onLookup = useCallback((e) => {
    e.preventDefault();
    const phone = new FormData(e.currentTarget).get('phone');
    start(async () => {
      const r = await lookupReservation(phone);
      if (r?.error) { setNumberMsg(r.error); return; }
      if (r?.spun) { setNumberMsg('This number already spun. Sign up below only if that was not you.'); return; }
      if (!r?.found) { setNumberMsg('No reservation for that number. Sign up below, it takes a minute.'); return; }
      const rec = { firstName: r.firstName, phone: r.phone };
      saveReserved(rec); setReserved(rec); setAskNumber(false); setNumberMsg('');
    });
  }, []);

  const onSpin = useCallback(() => {
    unlockAudio();
    setSpinning(true);
    setSpinKey((k) => k + 1);
    setPhase('spinning');
  }, []);

  const onDone = useCallback(() => {
    setSpinning(false);
    const prize = PRIZE_BY_ID[result?.prizeId];
    if (prize && prize.kind !== 'respin') {
      setBurst((b) => b + 1);
      winChord(prize.kind === 'credits' || prize.kind === 'discount');
      saveResult(result);
    }
    setTimeout(() => setPhase('result'), 650);
  }, [result]);

  const onRespin = useCallback(() => {
    start(async () => {
      const r = await respin(result.leadId, result.code);
      if (r?.error) { setErrors({ form: r.error }); return; }
      setResult((prev) => ({ ...prev, ...r }));
      setPhase('wheel');
    });
  }, [result]);

  const reset = () => {
    try { localStorage.removeItem(STORE); } catch { /* ignore */ }
    setResult(null); setAlready(false); setPhase('gate');
    setClinicQ(''); setMatches([]); setPlace(null); setNoneOfThese(false);
    setNameV(''); setEmailV(''); setFromGoogle(false);
  };

  const prize = result ? PRIZE_BY_ID[result.prizeId] : null;
  const showWheel = phase === 'wheel' || phase === 'spinning' || phase === 'result';

  return (
    <>
    <main className={`spin-root phase-${phase}`}>
      <Stage burst={burst} big={prize?.kind === 'credits' || prize?.kind === 'discount'} />
      <OffersSheet open={!!offer} focus={offer} onClose={() => setOffer(null)} />
      {rehearsal ? <div className="rehearsal-badge">Rehearsal mode. Spins are tagged TEST.</div> : null}

      <header className="spin-head">
        <Wordmark />
        <p className="event-line">NADTI 2026 · September 22 to 24</p>
      </header>

      {askPin ? (
        <section className="card">
          <p className="eyebrow">Staff only</p>
          <h1 className="title">Rehearsal mode</h1>
          <form onSubmit={onPin} className="gate-form">
            <label className="field" htmlFor="pin">
              <span className="field-label">Booth PIN</span>
              <input id="pin" name="pin" type="password" inputMode="numeric" autoComplete="one-time-code" />
            </label>
            {pinError ? <p className="field-error">{pinError}</p> : null}
            <button type="submit" className="cta" disabled={pending}>{pending ? 'Checking' : 'Enter rehearsal'}</button>
            <button type="button" className="ghost" onClick={() => { setAskPin(false); router.replace('/spin'); }}>Cancel</button>
          </form>
        </section>
      ) : null}

      <AnimatePresence mode="wait">
        {phase === 'closed' && !askPin && (
          <motion.div key="closed" className="pre-stack" {...fade}>
            <PreEvent onOpen={() => { if (!forceClosed) router.refresh(); }} doors={<Doors />} />
          </motion.div>
        )}

        {phase === 'gate' && !askPin && reserved && (
          <motion.section key="welcome" className="card welcome-back" {...fade}>
            <p className="eyebrow">Spin reserved</p>
            <h1 className="title">Welcome back, Dr {reserved.firstName || reserved.name}.</h1>
            <p className="lede">{reserved.clinic ? `${reserved.clinic} · ` : ''}Your reserved spin is ready. No re-typing.</p>
            {errors.form ? <p className="field-error">{errors.form}</p> : null}
            {errors.phone || errors.name || errors.email || errors.clinic ? <p className="field-error">We could not find your reservation. Please sign up below.</p> : null}
            <button type="button" className="cta spin-cta" onClick={onReservedSpin} disabled={pending}>{pending ? 'Getting the wheel ready' : 'Spin'}</button>
            <button type="button" className="ghost" onClick={() => { clearReserved(); setReserved(null); setErrors({}); }}>Not you? Sign up with your own number</button>
          </motion.section>
        )}

        {phase === 'gate' && !askPin && !reserved && (
          <motion.section key="gate" className="card" {...fade}>
            <h1 className="title">Sign up to spin</h1>
            <p className="lede">Four quick details, then the wheel is yours. Every spin wins something.</p>
            <form onSubmit={onSubmit} className="gate-form" noValidate>
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
              <button type="submit" className="cta" disabled={pending}>
                {pending ? 'Getting the wheel ready' : 'Let me spin'}
              </button>
              <p className="fineprint">One spin per mobile number. Prizes are claimed at the booth.</p>
            </form>
            {askNumber ? (
              <form className="phone-row" onSubmit={onLookup}>
                <Field id="lookup-phone" label="Mobile number you registered with" type="tel" inputMode="tel" placeholder="0917 123 4567" name="phone" required />
                <button type="submit" className="cta" disabled={pending}>Find</button>
              </form>
            ) : null}
            {numberMsg ? <p className="field-error">{numberMsg}</p> : null}
            <div className="pre-link"><button type="button" className="ghost" onClick={() => { setAskNumber((v) => !v); setNumberMsg(''); }}>{askNumber ? 'Never mind' : 'Pre-registered? Enter your mobile number'}</button></div>
          </motion.section>
        )}
      </AnimatePresence>

      {showWheel && result && (
        <motion.section
          key="wheel"
          className="wheel-stage"
          initial={{ opacity: 0, scale: 0.6, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 140, damping: 18 }}
        >
          <Wheel wedgeIndex={result.wedgeIndex} spinning={spinning} spinKey={spinKey} onDone={onDone} />

          <AnimatePresence mode="wait">
            {phase === 'wheel' && (
              <motion.div key="spinbtn" className="spin-cta-wrap" {...fade}>
                <button type="button" className="cta spin-cta" onClick={onSpin}>SPIN</button>
                <p className="fineprint">Tap once. The wheel decides.</p>
              </motion.div>
            )}
            {phase === 'spinning' && (
              <motion.p key="spinning" className="spinning-line" {...fade}>Good luck, doc.</motion.p>
            )}
            {phase === 'result' && prize && (
              <motion.div key="result" className="card result-card" {...fade}>
                {already ? <p className="already-line">You already spun. Here is your prize.</p> : null}
                {prize.kind === 'respin' ? (
                  <>
                    <h2 className="prize-title">Spin again!</h2>
                    <p className="lede">The wheel wants a second look at you.</p>
                    <button type="button" className="cta" onClick={onRespin} disabled={pending}>
                      {pending ? 'Loading' : 'Spin again'}
                    </button>
                    {errors.form ? <p className="field-error">{errors.form}</p> : null}
                  </>
                ) : (
                  <>
                    <p className="eyebrow">You won</p>
                    <h2 className={`prize-title kind-${prize.kind}`}>{prize.label}</h2>
                    {prize.kind === 'discount' ? (
                      <p className="lede">Valid on any purchase or deposit made at the booth, September 22 to 24, 2026.</p>
                    ) : null}
                    {prize.kind === 'credits' ? (
                      <p className="lede">₱30,000 in training credits at the DentaSource Direct Training Center. Selected partner clinics only, subject to DentaSource Direct approval.</p>
                    ) : null}
                    {prize.kind === 'gift' ? (
                      <p className="lede">Pick it up at the booth. Show this screen to our team.</p>
                    ) : null}
                    <div className="code-box">
                      <span className="code-label">Your claim QR</span>
                      {qrUrl ? <img src={qrUrl} alt="Claim QR code" className="qr" /> : <span className="qr qr-pending" aria-hidden />}
                      <span className="code-hint">Show this QR at the DentaSource Direct booth. Our team scans it to hand over your prize.</span>
                      <span className="code-subtle">{result.code}</span>
                    </div>
                    <ClinicLinkPanel clinic={result.clinic || ''} linked={result.linked || {}} googleLinked={!!result.placeId} onLink={onLink} onOffer={(f) => setOffer(f || 'digital')} />
                    <Doors />
                    <button type="button" className="ghost" onClick={reset}>Not you? Sign up with your own number</button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      )}
    </main>
    <LoungeRoom />
    </>
  );
}
