// GET /api/admin/threads — all threads with messages, for the shared inbox live poll.
// Staff-gated: owner (isAdminEmail on the Supabase session) OR a signed-in team
// member (dsd_team cookie session) so the /team dashboard's 4s polling works.
// Same serialization the /admin/inbox page uses so the client can replace state in place.
import prisma from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { isAdminEmail } from '@/lib/admin';
import { getTeamMember } from '@/lib/team';

const NO_STORE = { 'Cache-Control': 'no-store' };

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isStaff = isAdminEmail(user?.email) || (await getTeamMember()) !== null;
  if (!isStaff) {
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
