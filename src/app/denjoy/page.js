import DenjoyHero from '@/components/denjoy/DenjoyHero';
import MeetEndoPanel from '@/components/denjoy/MeetEndoPanel';
import ProductPanel from '@/components/denjoy/ProductPanel';
import DenjoyCTA from '@/components/denjoy/DenjoyCTA';
import MessengerButton from '@/components/denjoy/MessengerButton';
import { getCoStars } from '@/data/denjoy';
import styles from './page.module.css';

export const metadata = {
  title: 'Denjoy Endodontics — Exclusive Philippines Distribution | DentaSource Direct',
  description:
    'The Meet Endo All-in-One Endodontic System, FREE PEX, i-Pexo, AIKE, and imate3 — five world-class Denjoy endodontic instruments, distributed exclusively in the Philippines by DentaSource Direct.',
};

const COSTAR_ACCENTS = {
  'free-pex': '#2a4d7a',
  'i-pexo':   '#4a7aaf',
  'aike':     '#6a9acf',
  'imate3':   '#3a4855',
};

export default function DenjoyPage() {
  const coStars = getCoStars();

  return (
    <>
      <main className={styles.scrollContainer}>
        <DenjoyHero />
        <MeetEndoPanel />
        {coStars.map((product, i) => (
          <ProductPanel
            key={product.slug}
            product={product}
            imagePosition={i % 2 === 0 ? 'right' : 'left'}
            accentColor={COSTAR_ACCENTS[product.slug] || '#7a2a4d'}
          />
        ))}
        <DenjoyCTA />
      </main>
      <div className={styles.mobileStickyBar}>
        <MessengerButton
          prefillText="Hi DSD, I'd like to chat about the Denjoy launch."
          label="Chat about Denjoy"
        />
      </div>
    </>
  );
}
