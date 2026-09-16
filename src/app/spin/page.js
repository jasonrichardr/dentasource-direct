import { Suspense } from 'react';
import { cookies } from 'next/headers';
import { eventStatus } from '@/lib/spin/format';
import { isRehearsalCookie } from '@/lib/spin/tokens';
import SpinExperience from './SpinExperience';
import './spin.css';

export const metadata = {
  title: 'Spin to Win at NADTI 2026 | DentaSource Direct',
  description: 'Sign up at the DentaSource Direct booth, spin the wheel, and win discounts, training credits, and giveaways.',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function SpinPage() {
  const c = await cookies();
  const rehearsal = isRehearsalCookie(c.get('spin_rehearsal')?.value);
  const status = eventStatus({ override: process.env.SPIN_STATUS || 'auto', rehearsal });
  return (
    <Suspense fallback={null}>
      <SpinExperience status={status} rehearsal={rehearsal} />
    </Suspense>
  );
}
