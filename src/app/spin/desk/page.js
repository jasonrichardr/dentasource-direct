import { cookies } from 'next/headers';
import { isDeskCookie } from '@/lib/spin/tokens';
import PinForm from './PinForm';
import Desk from './Desk';
import '../spin.css';
import './desk.css';

export const metadata = {
  title: 'Booth Desk | DentaSource Direct',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function DeskPage() {
  const c = await cookies();
  const unlocked = isDeskCookie(c.get('spin_desk')?.value);
  return unlocked ? <Desk /> : <PinForm />;
}
