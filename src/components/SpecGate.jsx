'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

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

/**
 * Wraps premium content (e.g. full spec tables). Logged-out visitors see a
 * blurred teaser + a sign-in card; signed-in visitors see everything.
 */
export default function SpecGate({ children }) {
  const [authed, setAuthed] = useState(null); // null = checking
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active) setAuthed(!!data.session);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (active) setAuthed(!!session);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function signInWithGoogle() {
    setBusy(true);
    const supabase = createClient();
    const next = typeof window !== 'undefined' ? window.location.pathname : '/';
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
    if (error) setBusy(false);
  }

  // Checking — light skeleton to avoid a locked/unlocked flash.
  if (authed === null) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-10">
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-6 rounded-lg bg-black/[0.05] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (authed) return children;

  // Locked — blurred teaser + sign-in card.
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none select-none blur-[6px] opacity-60 max-h-[420px] overflow-hidden [mask-image:linear-gradient(to_bottom,black,transparent)]"
      >
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center px-5">
        <div className="w-full max-w-md rounded-2xl bg-white border border-black/[0.08] shadow-xl shadow-black/[0.06] p-6 sm:p-7 text-center">
          <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <rect x="5" y="11" width="14" height="9" rx="2" />
              <path d="M8 11V7a4 4 0 1 1 8 0v4" />
            </svg>
          </div>
          <h3 className="mt-4 text-[18px] font-semibold tracking-tight text-[#1D1D1F]">
            See the full specifications
          </h3>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-[#86868B]">
            Create a free account to unlock complete specs, dimensions, and configuration details — plus
            warranty tracking and direct messaging with our team.
          </p>
          <button
            onClick={signInWithGoogle}
            disabled={busy}
            className="mt-5 inline-flex w-full items-center justify-center gap-3 rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-medium text-[#1D1D1F] transition hover:bg-[#F8F7F4] disabled:opacity-50"
          >
            <GoogleG />
            {busy ? 'Opening Google…' : 'Continue with Google'}
          </button>
          <a
            href={`/login?next=${typeof window !== 'undefined' ? encodeURIComponent(window.location.pathname) : '/'}`}
            className="mt-3 inline-block text-[12.5px] font-medium text-emerald-700 underline underline-offset-2 hover:text-emerald-600"
          >
            or sign in with email
          </a>
          <p className="mt-3 text-[11px] text-[#A1A1AA]">Free · no credit card · 10 seconds</p>
        </div>
      </div>
    </div>
  );
}
