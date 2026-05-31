'use client';

import { useMemo, useState } from 'react';

const STATUSES = ['NEW', 'CONTACTED', 'DEMO_SCHEDULED', 'CLOSED_WON', 'CLOSED_LOST'];

const STATUS_STYLES = {
  NEW: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  CONTACTED: 'bg-sky-50 text-sky-700 ring-sky-600/20',
  DEMO_SCHEDULED: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  CLOSED_WON: 'bg-green-100 text-green-800 ring-green-600/30',
  CLOSED_LOST: 'bg-rose-50 text-rose-600 ring-rose-600/20',
};

const STATUS_LABEL = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  DEMO_SCHEDULED: 'Demo scheduled',
  CLOSED_WON: 'Won',
  CLOSED_LOST: 'Lost',
};

function fmtDate(iso) {
  return new Date(iso).toLocaleString('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function toCsv(leads) {
  const headers = ['Received', 'First name', 'Last name', 'Email', 'Phone', 'Clinic', 'Interest', 'Status', 'Message'];
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const rows = leads.map((l) =>
    [l.createdAt, l.firstName, l.lastName, l.email, l.phone, l.clinicName, l.interest, l.status, l.message]
      .map(esc)
      .join(','),
  );
  return [headers.map(esc).join(','), ...rows].join('\n');
}

export default function LeadsTable({ leads, adminEmail }) {
  const [filter, setFilter] = useState('ALL');

  const counts = useMemo(() => {
    const c = { ALL: leads.length };
    for (const s of STATUSES) c[s] = 0;
    for (const l of leads) c[l.status] = (c[l.status] || 0) + 1;
    return c;
  }, [leads]);

  const visible = filter === 'ALL' ? leads : leads.filter((l) => l.status === filter);

  function exportCsv() {
    const blob = new Blob([toCsv(visible)], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dsd-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-[#F8F7F4] px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
              DentaSource Direct · Admin
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#1D1D1F] sm:text-3xl">Leads</h1>
            <p className="mt-1 text-[13px] text-[#86868B]">Signed in as {adminEmail}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportCsv}
              disabled={!visible.length}
              className="rounded-lg bg-[#1D1D1F] px-4 py-2 text-sm font-medium text-white transition hover:bg-black disabled:opacity-40"
            >
              Export CSV{visible.length ? ` (${visible.length})` : ''}
            </button>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="rounded-lg border border-black/10 bg-white px-4 py-2 text-sm font-medium text-[#52525B] transition hover:bg-[#F8F7F4]"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {['ALL', ...STATUSES].map((s) => {
            const active = filter === s;
            const label = s === 'ALL' ? 'All' : STATUS_LABEL[s];
            return (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium ring-1 transition ${
                  active
                    ? 'bg-[#1D1D1F] text-white ring-[#1D1D1F]'
                    : 'bg-white text-[#52525B] ring-black/[0.08] hover:ring-black/20'
                }`}
              >
                {label}{' '}
                <span className={active ? 'text-white/70' : 'text-[#86868B]'}>{counts[s] ?? 0}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl bg-white ring-1 ring-black/[0.06]">
          {visible.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="text-[15px] font-medium text-[#1D1D1F]">No leads here yet</p>
              <p className="mt-1 text-[13px] text-[#86868B]">
                When a dentist submits the contact form, they appear here instantly.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead>
                  <tr className="border-b border-black/[0.06] text-[11px] uppercase tracking-wide text-[#86868B]">
                    <th className="px-4 py-3 font-medium">Received</th>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Contact</th>
                    <th className="px-4 py-3 font-medium">Clinic</th>
                    <th className="px-4 py-3 font-medium">Interest</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.05]">
                  {visible.map((l) => (
                    <tr key={l.id} className="align-top hover:bg-[#F8F7F4]/60">
                      <td className="whitespace-nowrap px-4 py-3 text-[#86868B]">{fmtDate(l.createdAt)}</td>
                      <td className="px-4 py-3 font-medium text-[#1D1D1F]">
                        {l.firstName} {l.lastName}
                      </td>
                      <td className="px-4 py-3 text-[#52525B]">
                        <a href={`mailto:${l.email}`} className="text-emerald-700 hover:underline">
                          {l.email}
                        </a>
                        <div className="text-[#86868B]">
                          <a href={`tel:${l.phone}`} className="hover:underline">
                            {l.phone}
                          </a>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[#52525B]">{l.clinicName || '—'}</td>
                      <td className="px-4 py-3 capitalize text-[#52525B]">{l.interest}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ${
                            STATUS_STYLES[l.status] || 'bg-gray-50 text-gray-600 ring-gray-400/20'
                          }`}
                        >
                          {STATUS_LABEL[l.status] || l.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="mt-4 text-center text-[12px] text-[#86868B]">
          Read-only view · status editing &amp; search land in the next update
        </p>
      </div>
    </main>
  );
}
