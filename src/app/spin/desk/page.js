import { cookies } from 'next/headers';
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
  const unlocked = c.get('spin_desk')?.value === '1';
  return unlocked ? <Desk /> : <PinForm />;
}
