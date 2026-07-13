'use client';

// SCENE 5 · MEGA-FOOTER — atmosphere goes royal emerald. Marquee (trust
// ticker) → link columns (display sub-heads + mono links, ≤5 per group)
// → giant baseline wordmark → legal row → decorative card strip peeking.

import Link from 'next/link';
import { m as motion } from 'framer-motion';
import { trackContact } from '@/lib/analytics';
import { arcStars, marqueeItems, messengerUrl } from './dnaContent';
import styles from './v2.module.css';

const EASE = [0.4, 0, 0.2, 1];
const reveal = {
  initial: { opacity: 0, y: 18, filter: 'blur(12px)' },
  whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.55, ease: EASE },
};

const COLUMNS = [
  {
    title: 'The line',
    links: [
      { label: 'Meet Endo flagship', href: '/denjoy/meet-endo' },
      { label: 'All 12 instruments', href: '#instruments' },
      { label: 'Five chapters', href: '#chapters' },
      { label: 'All DSD equipment', href: '/products' },
    ],
  },
  {
    title: 'Visit',
    links: [
      { label: '610 C. Raymundo Ave, Pasig', href: '/contact' },
      { label: 'Open daily 9am – 8pm', href: '/contact' },
      { label: 'Trade-in program', href: '/trade-in' },
    ],
  },
  {
    title: 'Talk',
    links: [
      { label: 'Messenger', href: messengerUrl("Hi DSD, I'd like to chat about the Denjoy line."), external: true, track: 'denjoy-footer' },
      { label: 'Call +63 962 579 3024', href: 'tel:+639625793024' },
      { label: 'Book a free consultation', href: '/contact' },
    ],
  },
];

function Ticker() {
  const row = (key) => (
    <div key={key} className={styles.marqueeTrack} aria-hidden={key === 'b'}>
      {marqueeItems.map((t) => (
        <span key={t} className={styles.marqueeItem}>
          {t} <span className={styles.marqueeDot} aria-hidden="true">◆</span>
        </span>
      ))}
    </div>
  );
  return <div className={styles.marquee}>{[row('a'), row('b')]}</div>;
}

export default function DnaFooter() {
  return (
    <footer className={styles.footer} data-scene-zone="footer">
      <Ticker />

      <div className={styles.footCols}>
        {COLUMNS.map((col) => (
          <motion.div key={col.title} {...reveal}>
            <h4 className={`${styles.display} ${styles.footColTitle}`}>{col.title}</h4>
            <ul className={styles.footList}>
              {col.links.map((l) => (
                <li key={l.label}>
                  {l.external ? (
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.footLink}
                      onClick={l.track ? () => trackContact({ channel: 'messenger', content_name: l.track }) : undefined}
                    >
                      {l.label}
                    </a>
                  ) : l.href.startsWith('#') || l.href.startsWith('tel:') ? (
                    <a href={l.href} className={styles.footLink}>{l.label}</a>
                  ) : (
                    <Link href={l.href} className={styles.footLink}>{l.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <span className={styles.baseline} aria-hidden="true">Denjoy</span>

      <div className={styles.legalRow}>
        <span className={styles.footNote}>Exclusive Philippine Distributor</span>
        <span className={styles.footNote} aria-hidden="true">|</span>
        <span className={styles.footNote}>© 2026 DentaSource Direct</span>
      </div>

      {/* decorative card strip peeking at the bottom edge */}
      <div className={styles.cardStrip} aria-hidden="true">
        {arcStars.map((p) => (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img key={p.slug} src={p.heroImage} alt="" loading="lazy" />
        ))}
      </div>
    </footer>
  );
}
