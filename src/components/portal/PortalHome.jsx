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

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' });
}

const LEAD_STATUS_LABEL = {
  NEW: 'Received',
  CONTACTED: 'In progress',
  DEMO_SCHEDULED: 'Demo scheduled',
  CLOSED_WON: 'Completed',
  CLOSED_LOST: 'Closed',
};

const INTEREST_LABEL = {
  'dental-chairs': 'Roson Dental Chairs',
  imaging: 'X-Rays & Imaging',
  endo: 'Endodontics',
  microscopes: 'Microscopes',
  'trade-in': 'Trade-In Program',
  general: 'Showroom Visit',
};

const STATUS_CHIP = {
  OPEN: { label: 'Sent — we reply within the day', cls: 'bg-amber-50 text-amber-700 ring-amber-600/20' },
  ANSWERED: { label: 'DentaSource replied', cls: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' },
  RESOLVED: { label: 'Resolved — message us anytime', cls: 'bg-gray-100 text-gray-600 ring-gray-400/20' },
};

export default function PortalHome({
  email,
  name,
  messages,
  status: initialStatus,
  inquiries = [],
  equipment = [],
  isAdmin,
}) {
  // Server messages (authoritative) kept apart from optimistic ones still in flight.
  const [serverMsgs, setServerMsgs] = useState(messages);
  const [pending, setPending] = useState([]);
  const [status, setStatus] = useState(initialStatus || (messages.length ? 'OPEN' : null));
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  // Captured once at mount so warranty day-counts stay pure during render.
  const [now] = useState(() => Date.now());
  const endRef = useRef(null);

  const msgs = [...serverMsgs, ...pending];

  // Drop optimistic bubbles once the server copy (same sender+body) lands.
  function reconcile(nextServer) {
    setServerMsgs(nextServer);
    setPending((prev) =>
      prev.filter((p) => !nextServer.some((s) => s.sender === p.sender && s.body === p.body))
    );
  }

  // Live updates: poll every 4s, only while the tab is visible.
  useEffect(() => {
    let timer = null;
    async function poll() {
      if (document.visibilityState !== 'visible') return;
      try {
        const res = await fetch('/api/portal/thread', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        reconcile(data.messages || []);
        if (data.status) setStatus(data.status);
      } catch {
        // transient; next tick retries
      }
    }
    function start() {
      if (timer) return;
      poll();
      timer = setInterval(poll, 4000);
    }
    function stop() {
      if (timer) { clearInterval(timer); timer = null; }
    }
    function onVisibility() {
      if (document.visibilityState === 'visible') start();
      else stop();
    }
    if (document.visibilityState === 'visible') start();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [serverMsgs.length, pending.length]);

  async function submit(e) {
    e.preventDefault();
    const body = text.trim();
    if (!body || sending) return;
    setSending(true);
    setError('');
    const tmpId = 'tmp-' + Date.now();
    setPending((p) => [...p, { id: tmpId, sender: 'CUSTOMER', body, createdAt: new Date().toISOString() }]);
    setText('');
    setStatus('OPEN');
    const fd = new FormData();
    fd.append('body', body);
    let result;
    try {
      result = await sendCustomerMessage(fd);
    } catch {
      result = { error: 'Could not send — please try again.' };
    }
    if (result?.error) {
      setPending((p) => p.filter((m) => m.id !== tmpId));
      setText(body);
      setError(result.error);
    }
    setSending(false);
  }

  const greeting = name ? name.split(' ')[0] : email.split('@')[0];
  const chip = status ? STATUS_CHIP[status] : null;

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
            {equipment.length === 0 ? (
              <p className="mt-2 text-[13px] leading-relaxed text-[#52525B]">
                Your registered chairs and units — with live warranty status — will appear here once our team links
                your account.
              </p>
            ) : (
              <ul className="mt-3 space-y-3">
                {equipment.map((w) => {
                  const daysLeft = Math.ceil(
                    (new Date(w.warrantyEnd).getTime() - now) / (1000 * 60 * 60 * 24)
                  );
                  const active = daysLeft >= 0;
                  return (
                    <li key={w.id} className="border-b border-black/[0.05] pb-3 last:border-0 last:pb-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-[13px] font-medium text-[#1D1D1F]">{w.productName}</p>
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ${
                            active
                              ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                              : 'bg-gray-100 text-gray-600 ring-gray-400/20'
                          }`}
                        >
                          {active ? `Active — ${daysLeft}d left` : 'Expired'}
                        </span>
                      </div>
                      {w.serialNumber && (
                        <p className="mt-0.5 text-[11px] text-[#86868B]">Serial {w.serialNumber}</p>
                      )}
                      <p className="mt-0.5 text-[11px] text-[#86868B]">
                        {fmtDate(w.warrantyStart)} – {fmtDate(w.warrantyEnd)}
                      </p>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          <div className="rounded-2xl bg-white p-5 ring-1 ring-black/[0.06]">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#86868B]">Your inquiries</p>
            {inquiries.length === 0 ? (
              <p className="mt-2 text-[13px] leading-relaxed text-[#52525B]">
                Inquiries you send us are tracked here — so nothing gets lost.
              </p>
            ) : (
              <ul className="mt-3 space-y-3">
                {inquiries.map((l) => (
                  <li key={l.id} className="flex items-start justify-between gap-2 border-b border-black/[0.05] pb-3 last:border-0 last:pb-0">
                    <div>
                      <p className="text-[13px] font-medium text-[#1D1D1F]">
                        {INTEREST_LABEL[l.interest] || l.interest}
                      </p>
                      <p className="mt-0.5 text-[11px] text-[#86868B]">{fmtDate(l.createdAt)}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-[#F8F7F4] px-2 py-0.5 text-[10px] font-medium text-[#52525B] ring-1 ring-black/[0.05]">
                      {LEAD_STATUS_LABEL[l.status] || l.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Message channel */}
        <div className="mt-6 overflow-hidden rounded-2xl bg-white ring-1 ring-black/[0.06]">
          <div className="border-b border-black/[0.06] px-5 py-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-[15px] font-semibold text-[#1D1D1F]">Message DentaSource</h2>
              {chip && (
                <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1 ${chip.cls}`}>
                  {chip.label}
                </span>
              )}
            </div>
            <p className="mt-0.5 text-[12px] text-[#86868B]">
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

          {error && (
            <p className="border-t border-black/[0.06] px-5 pt-3 text-[12px] text-red-600">{error}</p>
          )}

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
