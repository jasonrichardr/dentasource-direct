import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isAdminEmail } from '@/lib/admin';
import LeadsTable from '@/components/admin/LeadsTable';

export const metadata = {
  title: 'Leads — Admin',
  // Never let an admin surface get indexed.
  robots: { index: false, follow: false },
};

// Leads change constantly — always render fresh, never cache.
export const dynamic = 'force-dynamic';

export default async function AdminLeadsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // The proxy already redirects unauthenticated users; guard here too.
  if (!user) redirect('/admin/login');

  const email = user.email;

  // Signed in with a real Google account that isn't an owner.
  if (!isAdminEmail(email)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8F7F4] px-6">
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center ring-1 ring-black/[0.06]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-600">
            Not authorized
          </p>
          <h1 className="mt-2 text-xl font-semibold text-[#1D1D1F]">This account can&apos;t view leads</h1>
          <p className="mt-2 break-all text-[13px] text-[#86868B]">{email}</p>
          <p className="mt-1 text-[13px] text-[#86868B]">
            isn&apos;t on the owner allow-list. Sign in with an authorized account.
          </p>
          <form action="/auth/signout" method="post">
            <button className="mt-6 w-full rounded-xl bg-[#1D1D1F] px-5 py-3 text-sm font-medium text-white hover:bg-black">
              Sign out
            </button>
          </form>
        </div>
      </main>
    );
  }

  const rows = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' } });

  // Serialise to plain objects (Date -> ISO string) for the client component.
  const leads = rows.map((l) => ({
    id: l.id,
    firstName: l.firstName,
    lastName: l.lastName,
    email: l.email,
    phone: l.phone,
    clinicName: l.clinicName,
    interest: l.interest,
    message: l.message,
    status: l.status,
    createdAt: l.createdAt.toISOString(),
  }));

  return <LeadsTable leads={leads} adminEmail={email} />;
}
