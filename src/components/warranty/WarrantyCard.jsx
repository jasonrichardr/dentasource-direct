import Link from 'next/link';

const MESSENGER_URL = 'https://m.me/dentasource?ref=warranty';

function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' });
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4 py-2.5">
      <dt className="text-[13px] text-[#86868B]">{label}</dt>
      <dd className="text-right text-[13px] font-medium text-[#1D1D1F]">{value || '—'}</dd>
    </div>
  );
}

export default function WarrantyCard({ warranty }) {
  const end = new Date(warranty.warrantyEnd);
  const daysLeft = Math.ceil((end.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  let status, statusStyle;
  if (daysLeft < 0) {
    status = 'Expired';
    statusStyle = 'bg-rose-50 text-rose-600 ring-rose-600/20';
  } else if (daysLeft <= 60) {
    status = `Expiring in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`;
    statusStyle = 'bg-amber-50 text-amber-700 ring-amber-600/20';
  } else {
    status = 'Active';
    statusStyle = 'bg-emerald-50 text-emerald-700 ring-emerald-600/20';
  }

  return (
    <main className="min-h-screen bg-[#F8F7F4] px-5 py-12 sm:px-6">
      <div className="mx-auto max-w-md">
        <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-black/[0.06]">
          <div className="bg-[#1a3c34] px-6 py-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
              DentaSource Direct
            </p>
            <h1 className="mt-1 text-xl font-semibold text-white">Warranty Card</h1>
          </div>

          <div className="px-6 py-6">
            <span className={`inline-flex rounded-full px-3 py-1 text-[12px] font-medium ring-1 ${statusStyle}`}>
              {status}
            </span>

            <dl className="mt-5 divide-y divide-black/[0.06]">
              <Row label="Product" value={warranty.productName} />
              <Row label="Clinic" value={warranty.clinicName} />
              {warranty.contactName && <Row label="Contact" value={warranty.contactName} />}
              {warranty.serialNumber && <Row label="Serial no." value={warranty.serialNumber} />}
              <Row label="Purchased" value={fmtDate(warranty.purchaseDate)} />
              <Row label="Warranty start" value={fmtDate(warranty.warrantyStart)} />
              <Row label="Warranty until" value={fmtDate(warranty.warrantyEnd)} />
            </dl>

            {warranty.coverage && (
              <div className="mt-5 rounded-xl bg-[#F8F7F4] px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#86868B]">Coverage</p>
                <p className="mt-1 text-[13px] leading-relaxed text-[#52525B]">{warranty.coverage}</p>
              </div>
            )}

            <a
              href={MESSENGER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0084FF] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0073E0]"
            >
              Message us about this unit
            </a>
            <p className="mt-3 text-center text-[12px] text-[#86868B]">
              Need service or have a question? Tap above — we reply the same day.
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-[12px] text-[#86868B]">
          <Link href="/" className="hover:underline">DentaSource Direct</Link> · Pasig showroom, open daily 9 AM – 8 PM
        </p>
      </div>
    </main>
  );
}
