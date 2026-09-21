'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deskLogin } from '@/actions/spin';

export default function PinForm() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [pending, start] = useTransition();
  const router = useRouter();

  const submit = (e) => {
    e.preventDefault();
    start(async () => {
      const r = await deskLogin(pin);
      if (r?.error) { setError(r.error); return; }
      router.refresh();
    });
  };

  return (
    <main className="spin-root desk-root">
      <section className="card desk-card">
        <div className="desk-brand pin-brand"><img src="/images/brand/dsd-mark.png" alt="" /><div><b>DentaSource Direct</b><small>NADTI 2026</small></div></div>
        <h1 className="title">Booth desk</h1>
        <p className="lede">Enter the booth PIN to see spins and claim prizes.</p>
        <form onSubmit={submit} className="gate-form">
          <label className="field" htmlFor="pin">
            <span className="field-label">Booth PIN</span>
            <input id="pin" type="password" inputMode="numeric" autoComplete="one-time-code" value={pin} onChange={(e) => setPin(e.target.value)} />
          </label>
          {error ? <p className="field-error">{error}</p> : null}
          <button className="cta" type="submit" disabled={pending || !pin}>{pending ? 'Checking' : 'Open desk'}</button>
        </form>
      </section>
    </main>
  );
}
