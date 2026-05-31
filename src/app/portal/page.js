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

  const thread = await prisma.thread.findFirst({
    where: { customerEmail: email },
    orderBy: { createdAt: 'desc' },
    include: { messages: { orderBy: { createdAt: 'asc' } } },
  });

  const messages = (thread?.messages || []).map((m) => ({
    id: m.id,
    sender: m.sender,
    body: m.body,
    createdAt: m.createdAt.toISOString(),
  }));

  return (
    <PortalHome
      email={email}
      name={user.user_metadata?.full_name || user.user_metadata?.name || null}
      messages={messages}
      isAdmin={isAdminEmail(email)}
    />
  );
}
