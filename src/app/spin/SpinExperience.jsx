'use client';

import { useCallback, useEffect, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { PRIZE_BY_ID } from '@/lib/spin/prizes';
import { submitSpin, respin, enterRehearsal } from '@/actions/spin';
import Wheel from './Wheel';
import Stage from './Stage';
import { unlockAudio, winChord } from './audio';

const STORE = 'nadti-spin-2026';
const FB = 'https://facebook.com/dentasource';
const MESSENGER = 'https://m.me/dentasource';

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
      <a className="door" href="/products">Browse the pricelist</a>
      <a className="door door-fb" href={FB} target="_blank" rel="noopener">Like us on Facebook</a>
      <a className="door door-msg" href={MESSENGER} target="_blank" rel="noopener">Message us</a>
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
  const [phase, setPhase] = useState(status === 'closed' ? 'closed' : 'gate');
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});
  const [pending, start] = useTransition();
  const [spinKey, setSpinKey] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [burst, setBurst] = useState(0);
  const [already, setAlready] = useState(false);

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
    setPhase((ph) => {
      if (status === 'open' && ph === 'closed') return 'gate';
      if (status === 'closed' && ph === 'gate') return 'closed';
      return ph;
    });
  }, [status]);

  // Soft guard: this phone already has a prize saved.
  useEffect(() => {
    if (status === 'closed') return;
    try {
      const saved = JSON.parse(localStorage.getItem(STORE) || 'null');
      if (saved?.code && saved?.prizeId) { setResult(saved); setAlready(true); setPhase('result'); }
    } catch { /* ignore */ }
  }, [status]);

  const onSubmit = useCallback((e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    unlockAudio();
    start(async () => {
      const r = await submitSpin(fd);
      if (r?.fields) { setErrors(r.fields); return; }
      if (r?.closed) { setPhase('closed'); return; }
      if (r?.error) { setErrors({ form: r.error }); return; }
      setErrors({});
      setResult(r);
      if (r.already) {
        setAlready(true);
        try { localStorage.setItem(STORE, JSON.stringify(r)); } catch { /* ignore */ }
        setPhase('result');
        return;
      }
      setPhase('wheel');
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
      try { localStorage.setItem(STORE, JSON.stringify(result)); } catch { /* ignore */ }
    }
    setTimeout(() => setPhase('result'), 650);
  }, [result]);

  const onRespin = useCallback(() => {
    start(async () => {
      const r = await respin(result.leadId, result.code);
      if (r?.error) { setErrors({ form: r.error }); return; }
      setResult(r);
      setPhase('wheel');
    });
  }, [result]);

  const reset = () => {
    try { localStorage.removeItem(STORE); } catch { /* ignore */ }
    setResult(null); setAlready(false); setPhase('gate');
  };

  const prize = result ? PRIZE_BY_ID[result.prizeId] : null;
  const showWheel = phase === 'wheel' || phase === 'spinning' || phase === 'result';

  return (
    <main className={`spin-root phase-${phase}`}>
      <Stage burst={burst} big={prize?.kind === 'credits' || prize?.kind === 'discount'} />
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
          <motion.section key="closed" className="card" {...fade}>
            <h1 className="title">The wheel opens at NADTI</h1>
            <p className="lede">Visit the DentaSource Direct booth on September 22 to 24, 2026 to sign up and spin.</p>
            <Doors />
          </motion.section>
        )}

        {phase === 'gate' && !askPin && (
          <motion.section key="gate" className="card" {...fade}>
            <h1 className="title">Sign up to spin</h1>
            <p className="lede">Four quick details, then the wheel is yours. Every spin wins something.</p>
            <form onSubmit={onSubmit} className="gate-form" noValidate>
              <Field id="name" label="Full name" autoComplete="name" error={errors.name} required />
              <Field id="clinic" label="Dental clinic" autoComplete="organization" error={errors.clinic} required />
              <Field id="email" label="Email" type="email" autoComplete="email" inputMode="email" error={errors.email} required />
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
                      <span className="code-label">Claim code</span>
                      <span className="code">{result.code}</span>
                      <span className="code-hint">Show this screen at the DentaSource Direct booth to claim.</span>
                    </div>
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
  );
}
