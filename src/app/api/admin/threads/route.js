// GET /api/admin/threads — all threads with messages, for the admin inbox live poll.
// Owner-only: identity from the Supabase session, gated by isAdminEmail. Same
// serialization the /admin/inbox page uses so the client can replace state in place.
import prisma from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { isAdminEmail } from '@/lib/admin';

const NO_STORE = { 'Cache-Control': 'no-store' };

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isAdminEmail(user.email)) {
    return Response.json({ error: 'forbidden' }, { status: 403, headers: NO_STORE });
  }

  const threads = await prisma.thread.findMany({
    orderBy: { lastMessageAt: 'desc' },
    include: { messages: { orderBy: { createdAt: 'asc' } } },
  });

  return Response.json(
    {
      threads: threads.map((t) => ({
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
      })),
    },
    { headers: NO_STORE }
  );
}
