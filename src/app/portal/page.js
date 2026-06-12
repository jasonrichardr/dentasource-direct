import prisma from '@/lib/prisma';
import { requireUser } from '@/lib/portal';
import { isAdminEmail } from '@/lib/admin';
import PortalHome from '@/components/portal/PortalHome';

export const metadata = {
  title: 'Your Account — DentaSource Direct',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function PortalPage() {
  const user = await requireUser('/portal');
  const email = user.email.toLowerCase();

  const [thread, leads, warranties] = await Promise.all([
    prisma.thread.findFirst({
      where: { customerEmail: email },
      orderBy: { createdAt: 'desc' },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    }),
    prisma.lead.findMany({ where: { email }, orderBy: { createdAt: 'desc' }, take: 10 }),
    prisma.warranty.findMany({ where: { customerEmail: email }, orderBy: { warrantyEnd: 'desc' } }),
  ]);

  const messages = (thread?.messages || []).map((m) => ({
    id: m.id,
    sender: m.sender,
    body: m.body,
    createdAt: m.createdAt.toISOString(),
  }));

  const inquiries = leads.map((l) => ({
    id: l.id,
    interest: l.interest,
    status: l.status,
    createdAt: l.createdAt.toISOString(),
  }));

  const equipment = warranties.map((w) => ({
    id: w.id,
    productName: w.productName,
    serialNumber: w.serialNumber,
    warrantyStart: w.warrantyStart.toISOString(),
    warrantyEnd: w.warrantyEnd.toISOString(),
  }));

  return (
    <PortalHome
      email={email}
      name={user.user_metadata?.full_name || user.user_metadata?.name || null}
      messages={messages}
      status={thread?.status || null}
      inquiries={inquiries}
      equipment={equipment}
      isAdmin={isAdminEmail(email)}
    />
  );
}
