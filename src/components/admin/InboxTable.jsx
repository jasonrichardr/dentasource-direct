'use client';

import { useState, useEffect } from 'react';
import { sendAdminReply, setThreadStatus } from '@/actions/message';

function fmt(iso) {
  return new Date(iso).toLocaleString('en-PH', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

const STATUS_STYLE = {
  OPEN: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  ANSWERED: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  RESOLVED: 'bg-gray-100 text-gray-600 ring-gray-400/20',
};

// OPEN threads first, then most-recently-active.
function sortThreads(list) {
  return [...list].sort((a, b) => {
    const ao = a.status === 'OPEN' ? 0 : 1;
    const bo = b.status === 'OPEN' ? 0 : 1;
    if (ao !== bo) return ao - bo;
    return new Date(b.lastMessageAt) - new Date(a.lastMessageAt);
  });
}

export default function InboxTable({ threads: initial }) {
  const [threads, setThreads] = useState(() => sortThreads(initial));
  const [openId, setOpenId] = useState(initial[0]?.id || null);
  const active = threads.find((t) => t.id === openId);

  // Live updates: poll every 4s while the tab is visible; keep the open thread.
  useEffect(() => {
    let timer = null;
    async function poll() {
      if (document.visibilityState !== 'visible') return;
      try {
        const res = await fetch('/api/admin/threads', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        setThreads(sortThreads(data.threads || []));
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

  return (
    <main className="min-h-screen bg-[#F8F7F4] px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
          DentaSource Direct · Admin
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#1D1D1F] sm:text-3xl">Inbox</h1>
        <p className="mt-1 text-[13px] text-[#86868B]">
          Customer messages from the portal. Reply here — they see it in their account instantly.
        </p>

        {threads.length === 0 ? (
          <div className="mt-6 rounded-2xl bg-white px-6 py-12 text-center text-[13px] text-[#86868B] ring-1 ring-black/[0.06]">
            No messages yet.
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-[280px_1fr]">
            <div className="space-y-2">
              {threads.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setOpenId(t.id)}
                  className={`w-full rounded-xl border p-3 text-left transition ${
                    openId === t.id ? 'border-[#1a3c34] bg-white' : 'border-black/[0.06] bg-white/60 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-[13px] font-medium text-[#1D1D1F]">
                      {t.customerName || t.customerEmail}
                    </span>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ${STATUS_STYLE[t.status] || ''}`}>
                      {t.status}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-[12px] text-[#86868B]">
                    {t.messages[t.messages.length - 1]?.body || ''}
                  </p>
                  <p className="mt-1 text-[10px] text-[#86868B]">{fmt(t.lastMessageAt)}</p>
                </button>
              ))}
            </div>

            <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-black/[0.06]">
              {active ? (
                <ThreadView key={active.id} thread={active} />
              ) : (
                <div className="p-8 text-center text-[13px] text-[#86868B]">Select a conversation.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function ThreadView({ thread }) {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [pending, setPending] = useState([]);
  const [statusBusy, setStatusBusy] = useState(false);

  // Live server messages + still-pending optimistic replies. Derive (not sync via
  // effect) which pending bubbles survive: drop any the server has echoed back.
  const serverMsgs = thread.messages;
  const stillPending = pending.filter(
    (p) => !serverMsgs.some((s) => s.sender === p.sender && s.body === p.body)
  );
  const msgs = [...serverMsgs, ...stillPending];

  async function reply(e) {
    e.preventDefault();
    const body = text.trim();
    if (!body || sending) return;
    setSending(true);
    setPending((m) => [...m, { id: 'tmp-' + Date.now(), sender: 'DSD', body, createdAt: new Date().toISOString() }]);
    setText('');
    const fd = new FormData();
    fd.append('threadId', thread.id);
    fd.append('body', body);
    await sendAdminReply(fd);
    setSending(false);
  }

  async function changeStatus(status) {
    if (statusBusy) return;
    setStatusBusy(true);
    await setThreadStatus(thread.id, status);
    setStatusBusy(false);
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/[0.06] px-5 py-3">
        <div>
          <p className="text-[14px] font-semibold text-[#1D1D1F]">{thread.customerName || thread.customerEmail}</p>
          <p className="text-[12px] text-[#86868B]">{thread.customerEmail}</p>
        </div>
        <div className="flex items-center gap-2">
          {thread.status !== 'RESOLVED' ? (
            <button
              onClick={() => changeStatus('RESOLVED')}
              disabled={statusBusy}
              className="rounded-lg border border-black/10 bg-white px-3 py-1.5 text-[12px] font-medium text-[#52525B] transition hover:bg-[#F8F7F4] disabled:opacity-40"
            >
              Mark resolved
            </button>
          ) : (
            <button
              onClick={() => changeStatus('OPEN')}
              disabled={statusBusy}
              className="rounded-lg border border-black/10 bg-white px-3 py-1.5 text-[12px] font-medium text-[#52525B] transition hover:bg-[#F8F7F4] disabled:opacity-40"
            >
              Reopen
            </button>
          )}
        </div>
      </div>
      <div className="max-h-[440px] flex-1 space-y-3 overflow-y-auto px-5 py-4">
        {msgs.map((m) => (
          <div key={m.id} className={`flex ${m.sender === 'DSD' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed ${
                m.sender === 'DSD' ? 'bg-[#1a3c34] text-white' : 'bg-[#F8F7F4] text-[#1D1D1F] ring-1 ring-black/[0.04]'
              }`}
            >
              <p className="whitespace-pre-wrap">{m.body}</p>
              <p className={`mt-1 text-[10px] ${m.sender === 'DSD' ? 'text-white/50' : 'text-[#86868B]'}`}>
                {fmt(m.createdAt)}
              </p>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={reply} className="flex items-end gap-2 border-t border-black/[0.06] p-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={1}
          placeholder="Reply…"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              reply(e);
            }
          }}
          className="flex-1 resize-none rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-600"
        />
        <button
          type="submit"
          disabled={sending || !text.trim()}
          className="rounded-xl bg-[#1a3c34] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#234e44] disabled:opacity-40"
        >
          Reply
        </button>
      </form>
    </div>
  );
}
