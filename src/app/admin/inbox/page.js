import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isAdminEmail } from '@/lib/admin';
import InboxTable from '@/components/admin/InboxTable';

export const metadata = {
  title: 'Inbox — Admin',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function AdminInboxPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login?next=/admin/inbox');
  if (!isAdminEmail(user.email)) redirect('/portal');

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

  return <InboxTable threads={data} />;
}
