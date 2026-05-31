'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

function LoginCard() {
  const params = useSearchParams();
  const errored = params.get('error');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState('');

  async function sendLink(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('sending');
    setErrorMsg('');
    const supabase = createClient();
    const next = params.get('next') || '/admin/leads';
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (error) {
      setStatus('error');
      setErrorMsg(error.message);
    } else {
      setStatus('sent');
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8F7F4] px-6">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 ring-1 ring-black/[0.06]">
        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
            DentaSource Direct
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#1D1D1F]">Admin sign in</h1>
          <p className="mt-2 text-[13px] text-[#86868B]">
            Owner access only. We&apos;ll email you a one-click login link — no password, no codes.
          </p>
        </div>

        {status === 'sent' ? (
          <div className="mt-6 rounded-xl bg-emerald-50 px-4 py-5 text-center">
            <p className="text-[15px] font-semibold text-emerald-800">Check your email</p>
            <p className="mt-1 text-[13px] leading-relaxed text-emerald-700">
              A login link is on its way to <span className="font-medium break-all">{email}</span>. Open it on
              this device and you&apos;re in. (Check spam/Promotions if it&apos;s slow.)
            </p>
            <button onClick={() => setStatus('idle')} className="mt-4 text-[12px] text-emerald-700 underline">
              Use a different email
            </button>
          </div>
        ) : (
          <form onSubmit={sendLink} className="mt-6 space-y-3">
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm text-[#1D1D1F] outline-none transition focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full rounded-xl bg-[#1D1D1F] px-5 py-3 text-sm font-medium text-white transition hover:bg-black disabled:opacity-50"
            >
              {status === 'sending' ? 'Sending…' : 'Email me a login link'}
            </button>
            {(errored || status === 'error') && (
              <p className="rounded-lg bg-rose-50 px-3 py-2 text-[12px] text-rose-600">
                {errorMsg || "Sign-in didn't complete. Please try again."}
              </p>
            )}
          </form>
        )}
      </div>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginCard />
    </Suspense>
  );
}
