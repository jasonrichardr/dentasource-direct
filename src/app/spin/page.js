import { Suspense } from 'react';
import { cookies } from 'next/headers';
import { eventStatus } from '@/lib/spin/format';
import { isRehearsalCookie } from '@/lib/spin/tokens';
import SpinExperience from './SpinExperience';
import './spin.css';

export const metadata = {
  title: 'Spin to Win at NADTI 2026 | DentaSource Direct',
  description: 'Sign up at the DentaSource Direct booth, spin the wheel, and win discounts, training credits, and giveaways. September 22 to 24, 9:00 AM to 5:00 PM.',
  openGraph: {
    title: 'Spin to Win at NADTI 2026 · DentaSource Direct',
    description: 'Booth 034 and 035, Halls 1 to 3, SMX Convention Center Manila, September 22 to 24, 9:00 AM to 5:00 PM. Pre-register and reserve your spin.',
    url: 'https://dentasourcedirect.com/spin',
    images: [{ url: 'https://dentasourcedirect.com/images/og/spin-nadti-2026-b.png', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', images: ['https://dentasourcedirect.com/images/og/spin-nadti-2026-b.png'] },
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
