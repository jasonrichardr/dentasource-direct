import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isAdminEmail } from '@/lib/admin';
import { createWarranty } from '@/actions/warranty';

export const metadata = {
  title: 'Warranties — Admin',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

function fmt(d) {
  return d ? new Date(d).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';
}

function Field({ name, label, type = 'text', required = false, placeholder = '' }) {
  return (
    <div>
      <label className="text-[12px] font-medium text-[#52525B]">
        {label}
        {required ? ' *' : ''}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none transition focus:border-emerald-600"
      />
    </div>
  );
}

export default async function AdminWarrantiesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  if (!isAdminEmail(user.email)) redirect('/admin/leads');

  const warranties = await prisma.warranty.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <main className="min-h-screen bg-[#F8F7F4] px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
          DentaSource Direct · Admin
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#1D1D1F] sm:text-3xl">Warranty Cards</h1>
        <p className="mt-1 text-[13px] text-[#86868B]">
          Create a card, then send the customer their private link via Viber/Messenger:
          dentasourcedirect.com/warranty/&lt;code&gt;
        </p>

        <form
          action={createWarranty}
          className="mt-6 grid grid-cols-1 gap-4 rounded-2xl bg-white p-6 ring-1 ring-black/[0.06] sm:grid-cols-2"
        >
          <Field name="clinicName" label="Clinic name" required placeholder="Sunrise Dental Clinic" />
          <Field name="contactName" label="Contact name" placeholder="Dr. Reyes" />
          <Field name="productName" label="Product" required placeholder="Roson A3 Dental Chair" />
          <Field name="serialNumber" label="Serial number" placeholder="RA3-2026-0001" />
          <Field name="warrantyStart" label="Warranty start" type="date" required />
          <Field name="warrantyEnd" label="Warranty end" type="date" required />
          <Field name="purchaseDate" label="Purchase date" type="date" />
          <Field name="code" label="Custom link code (optional)" placeholder="auto-generated if blank" />
          <div className="sm:col-span-2">
            <label className="text-[12px] font-medium text-[#52525B]">Coverage</label>
            <textarea
              name="coverage"
              rows={2}
              placeholder="2-year warranty: parts + labor year 1, labor year 2. Excludes consumables."
              className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none transition focus:border-emerald-600"
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="rounded-lg bg-[#1D1D1F] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-black"
            >
              Create warranty card
            </button>
          </div>
        </form>

        <div className="mt-8 overflow-hidden rounded-2xl bg-white ring-1 ring-black/[0.06]">
          {warranties.length === 0 ? (
            <div className="px-6 py-12 text-center text-[13px] text-[#86868B]">
              No warranty cards yet — create one above.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead>
                  <tr className="border-b border-black/[0.06] text-[11px] uppercase tracking-wide text-[#86868B]">
                    <th className="px-4 py-3 font-medium">Clinic</th>
                    <th className="px-4 py-3 font-medium">Product</th>
                    <th className="px-4 py-3 font-medium">Until</th>
                    <th className="px-4 py-3 font-medium">Customer link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.05]">
                  {warranties.map((w) => (
                    <tr key={w.id} className="hover:bg-[#F8F7F4]/60">
                      <td className="px-4 py-3 font-medium text-[#1D1D1F]">{w.clinicName}</td>
                      <td className="px-4 py-3 text-[#52525B]">{w.productName}</td>
                      <td className="px-4 py-3 text-[#86868B]">{fmt(w.warrantyEnd)}</td>
                      <td className="px-4 py-3">
                        <a
                          href={`/warranty/${w.code}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-700 hover:underline"
                        >
                          /warranty/{w.code}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
