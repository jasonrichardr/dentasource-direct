'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

function GoogleG() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  );
}

function LoginCard() {
  const params = useSearchParams();
  const errored = params.get('error');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const next = params.get('next') || '/portal';

  async function signInWithGoogle() {
    setStatus('sending');
    setErrorMsg('');
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
    if (error) {
      setStatus('error');
      setErrorMsg('Google sign-in is being set up — please use your email below for now.');
    }
  }

  async function sendLink(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('sending');
    setErrorMsg('');
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
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
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">DentaSource Direct</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#1D1D1F]">Sign in to your account</h1>
          <p className="mt-2 text-[13px] text-[#86868B]">
            Track your orders &amp; warranties and message our team — no password, no codes.
          </p>
        </div>

        {status === 'sent' ? (
          <div className="mt-6 rounded-xl bg-emerald-50 px-4 py-5 text-center">
            <p className="text-[15px] font-semibold text-emerald-800">Check your email</p>
            <p className="mt-1 text-[13px] leading-relaxed text-emerald-700">
              A login link is on its way to <span className="font-medium break-all">{email}</span>. Open it on this
              device. (Peek in spam/Promotions if it&apos;s slow.)
            </p>
            <button onClick={() => setStatus('idle')} className="mt-4 text-[12px] text-emerald-700 underline">
              Use a different email
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={signInWithGoogle}
              disabled={status === 'sending'}
              className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-medium text-[#1D1D1F] transition hover:bg-[#F8F7F4] disabled:opacity-50"
            >
              <GoogleG />
              Continue with Google
            </button>

            <div className="my-5 flex items-center gap-3">
              <span className="h-px flex-1 bg-black/10" />
              <span className="text-[11px] uppercase tracking-wide text-[#86868B]">or</span>
              <span className="h-px flex-1 bg-black/10" />
            </div>

            <form onSubmit={sendLink} className="space-y-3">
              <input
                type="email"
                aria-label="Email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@clinic.com"
                className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full rounded-xl bg-[#1a3c34] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#234e44] disabled:opacity-50"
              >
                {status === 'sending' ? 'Working…' : 'Email me a login link'}
              </button>
            </form>

            {(errored || status === 'error') && (
              <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-[12px] text-rose-600">
                {errorMsg || "Sign-in didn't complete. Please try again."}
              </p>
            )}

            <div className="my-5 flex items-center gap-3">
              <span className="h-px flex-1 bg-black/10" />
              <span className="text-[11px] uppercase tracking-wide text-[#86868B]">or</span>
              <span className="h-px flex-1 bg-black/10" />
            </div>

            <a
              href="/team/login"
              className="block text-center text-[12px] text-[#86868B] underline transition hover:text-[#1D1D1F]"
            >
              DentaSource team? Sign in with your access code
            </a>
          </>
        )}
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginCard />
    </Suspense>
  );
}
