// /studio — the localhost editor for every beat's copy and media.
//
// ☠️ DEVELOPMENT ONLY. This page writes to the source tree, so in production it
// does not exist: notFound() runs before anything else is touched, and every
// /api/studio handler answers 404 on its own rather than trusting this gate.
// Two independent locks, because one of them will eventually be edited by
// somebody who does not know about the other.

import { notFound } from 'next/navigation';

import { studioDisabled } from '@/lib/studio/registry';
import Studio from './Studio';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Studio',
  robots: { index: false, follow: false, nocache: true },
};

export default function StudioPage() {
  if (studioDisabled()) notFound();
  return <Studio />;
}
