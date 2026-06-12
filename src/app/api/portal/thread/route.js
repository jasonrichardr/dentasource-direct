// GET /api/portal/thread — the signed-in customer's own thread, for live polling.
// Identity comes ONLY from the Supabase session (never from params), so a user
// can only ever read their own conversation. Empty shape if they have no thread.
import prisma from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

const NO_STORE = { 'Cache-Control': 'no-store' };

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: 'unauthorized' }, { status: 401, headers: NO_STORE });
  }

  const email = user.email.toLowerCase();
  const thread = await prisma.thread.findFirst({
    where: { customerEmail: email },
    orderBy: { createdAt: 'desc' },
    include: { messages: { orderBy: { createdAt: 'asc' } } },
  });

  return Response.json(
    {
      status: thread?.status || null,
      messages: (thread?.messages || []).map((m) => ({
        id: m.id,
        sender: m.sender,
        body: m.body,
        createdAt: m.createdAt.toISOString(),
      })),
    },
    { headers: NO_STORE }
  );
}
