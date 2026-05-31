'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { sendCustomerMessage } from '@/actions/message';

function fmtTime(iso) {
  return new Date(iso).toLocaleString('en-PH', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function PortalHome({ email, name, messages, isAdmin }) {
  const [msgs, setMsgs] = useState(messages);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs]);

  async function submit(e) {
    e.preventDefault();
    const body = text.trim();
    if (!body || sending) return;
    setSending(true);
    setMsgs((m) => [...m, { id: 'tmp-' + Date.now(), sender: 'CUSTOMER', body, createdAt: new Date().toISOString() }]);
    setText('');
    const fd = new FormData();
    fd.append('body', body);
    await sendCustomerMessage(fd);
    setSending(false);
  }

  const greeting = name ? name.split(' ')[0] : email.split('@')[0];

  return (
    <main className="min-h-screen bg-[#F8F7F4] px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Your DentaSource account
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#1D1D1F] sm:text-3xl">
              Welcome, {greeting}
            </h1>
            <p className="mt-1 text-[13px] text-[#86868B]">{email}</p>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <>
                <Link
                  href="/admin/leads"
                  className="rounded-lg border border-black/10 bg-white px-4 py-2 text-sm font-medium text-[#52525B] transition hover:bg-[#F8F7F4]"
                >
                  Leads
                </Link>
                <Link
                  href="/admin/inbox"
                  className="rounded-lg border border-black/10 bg-white px-4 py-2 text-sm font-medium text-[#52525B] transition hover:bg-[#F8F7F4]"
                >
                  Inbox
                </Link>
              </>
            )}
            <form action="/auth/signout" method="post">
              <button className="rounded-lg border border-black/10 bg-white px-4 py-2 text-sm font-medium text-[#52525B] transition hover:bg-[#F8F7F4]">
                Sign out
              </button>
            </form>
          </div>
        </div>

        {/* Cards */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-white p-5 ring-1 ring-black/[0.06]">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#86868B]">Your equipment</p>
            <p className="mt-2 text-[13px] leading-relaxed text-[#52525B]">
              Your registered chairs and units — with live warranty status — will appear here once our team links
              your account.
            </p>
          </div>
          <div className="rounded-2xl bg-white p-5 ring-1 ring-black/[0.06]">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#86868B]">After-sales</p>
            <p className="mt-2 text-[13px] leading-relaxed text-[#52525B]">
              Service requests, warranty reminders, and your full history — all tracked, all in one place.
            </p>
          </div>
        </div>

        {/* Message channel */}
        <div className="mt-6 overflow-hidden rounded-2xl bg-white ring-1 ring-black/[0.06]">
          <div className="border-b border-black/[0.06] px-5 py-4">
            <h2 className="text-[15px] font-semibold text-[#1D1D1F]">Message DentaSource</h2>
            <p className="text-[12px] text-[#86868B]">
              Ask about your equipment, service, or a new purchase — we reply the same day.
            </p>
          </div>

          <div className="max-h-[420px] space-y-3 overflow-y-auto px-5 py-5">
            {msgs.length === 0 ? (
              <p className="py-8 text-center text-[13px] text-[#86868B]">
                No messages yet. Start the conversation below — we&apos;re here for you.
              </p>
            ) : (
              msgs.map((m) => (
                <div key={m.id} className={`flex ${m.sender === 'CUSTOMER' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed ${
                      m.sender === 'CUSTOMER'
                        ? 'bg-[#1a3c34] text-white'
                        : 'bg-[#F8F7F4] text-[#1D1D1F] ring-1 ring-black/[0.04]'
                    }`}
                  >
                    {m.sender === 'DSD' && (
                      <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                        DentaSource
                      </p>
                    )}
                    <p className="whitespace-pre-wrap">{m.body}</p>
                    <p className={`mt-1 text-[10px] ${m.sender === 'CUSTOMER' ? 'text-white/50' : 'text-[#86868B]'}`}>
                      {fmtTime(m.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={endRef} />
          </div>

          <form onSubmit={submit} className="flex items-end gap-2 border-t border-black/[0.06] p-3">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={1}
              placeholder="Type your message…"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  submit(e);
                }
              }}
              className="flex-1 resize-none rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-600"
            />
            <button
              type="submit"
              disabled={sending || !text.trim()}
              className="rounded-xl bg-[#1a3c34] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#234e44] disabled:opacity-40"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
