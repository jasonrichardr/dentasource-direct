'use client';

import { useState } from 'react';
import Link from 'next/link';
import { teamSignIn } from '@/actions/team';

export default function TeamLoginForm() {
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setPending(true);
    setError('');
    const result = await teamSignIn(new FormData(e.currentTarget));
    // On success the action redirects; we only get here on a returned error.
    if (result?.error) setError(result.error);
    setPending(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8F7F4] px-6">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 ring-1 ring-black/[0.06]">
        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">DentaSource team</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#1D1D1F]">Open the team console</h1>
          <p className="mt-2 text-[13px] text-[#86868B]">Enter your access code to open the team console.</p>
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <input
            name="code"
            aria-label="Access code"
            required
            autoComplete="off"
            placeholder="DSD-XXXX-XXXX"
            onChange={(e) => {
              e.target.value = e.target.value.toUpperCase();
            }}
            className="w-full rounded-xl border border-black/10 px-4 py-3 text-center text-sm tracking-[0.12em] outline-none transition focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
          />
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-xl bg-[#1a3c34] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#234e44] disabled:opacity-50"
          >
            {pending ? 'Working…' : 'Open the console'}
          </button>
        </form>

        {error && (
          <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-[12px] text-rose-600">{error}</p>
        )}

        <div className="mt-6 text-center">
          <Link href="/login" className="text-[12px] text-[#86868B] underline transition hover:text-[#1D1D1F]">
            Customer? Sign in here
          </Link>
        </div>
      </div>
    </main>
  );
}
