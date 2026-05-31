import prisma from '@/lib/prisma';

// Health check + DB keep-alive. A scheduled GitHub Action (.github/workflows/keepalive.yml)
// hits this every few days so the free-tier Supabase project never idles into a pause
// (which is what made the lead database "disappear" before).
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return Response.json({ ok: true, db: 'up' });
  } catch {
    return Response.json({ ok: false, db: 'down' }, { status: 503 });
  }
}
