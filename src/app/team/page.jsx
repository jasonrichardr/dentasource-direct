import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { getTeamMember } from '@/lib/team';
import { teamSignOut } from '@/actions/team';
import InboxTable from '@/components/admin/InboxTable';

export const metadata = {
  title: 'Team Console — DentaSource Direct',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function TeamConsolePage() {
  const member = await getTeamMember();
  if (!member) redirect('/team/login');

  const threads = await prisma.thread.findMany({
    orderBy: { lastMessageAt: 'desc' },
    include: { messages: { orderBy: { createdAt: 'asc' } } },
  });

  const data = threads.map((t) => ({
    id: t.id,
    customerEmail: t.customerEmail,
    customerName: t.customerName,
    status: t.status,
    lastMessageAt: t.lastMessageAt.toISOString(),
    messages: t.messages.map((m) => ({
      id: m.id,
      sender: m.sender,
      body: m.body,
      createdAt: m.createdAt.toISOString(),
    })),
  }));

  return (
    <div>
      <header className="flex items-center justify-between border-b border-black/[0.06] bg-white px-6 py-3">
        <p className="text-[13px] font-medium text-[#1D1D1F]">
          Team Console — signed in as {member.name}
        </p>
        <form action={teamSignOut}>
          <button
            type="submit"
            className="rounded-lg border border-black/10 px-3 py-1.5 text-[12px] font-medium text-[#1D1D1F] transition hover:bg-[#F8F7F4]"
          >
            Sign out
          </button>
        </form>
      </header>
      <InboxTable threads={data} />
    </div>
  );
}
