'use client';

// SCENE 2-4 · the ice-mint mid-world:
//   Spotlight (editorial) → Instruments rail (drag rail + edge-peek)
//   → Chapter index wall (words ARE the nav) → FAQ (+ expanders).

import { useState } from 'react';
import Link from 'next/link';
import { m as motion } from 'framer-motion';
import { trackContact } from '@/lib/analytics';
import { allInstruments, chapters, faqs, messengerUrl } from './dnaContent';
import Pill from './Pill';
import styles from './v2.module.css';

const EASE = [0.4, 0, 0.2, 1];
const reveal = {
  initial: { opacity: 0, y: 18, filter: 'blur(12px)' },
  whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.55, ease: EASE },
};

export function Spotlight() {
  return (
    <section className={styles.spot} id="spotlight">
      {/* tilted collage card at the edge (CSS 3D, like the reference) */}
      <div className={styles.spotCollage} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/denjoy/meet-endo/meetendo-studio-alt.jpg" alt="" loading="lazy" />
      </div>

      <motion.p {...reveal} className={styles.lockup}>
        <span className={styles.lockupDark}>Denjoy</span>
        <span className={styles.lockupLight}>Exclusive</span>
      </motion.p>

      <motion.h2 {...reveal} className={`${styles.display} ${styles.spotHead}`}>
        The full endo line. Finally local.
      </motion.h2>

      <motion.div {...reveal} className={`${styles.body} ${styles.spotBody}`}>
        <p>
          Denjoy has built endodontic instruments since 2004 — motors, apex locators,
          obturation, microscopes. Until now, getting them in the Philippines meant
          importing blind: no demo, no training, no one to call.
        </p>
        <p>
          DentaSource Direct is the exclusive Philippine distributor. Every unit comes
          with white-glove installation, hands-on training, up to a 5-year motor
          warranty, and Philippine-based support — with live demos at the Pasig showroom.
        </p>
      </motion.div>

      <motion.div {...reveal} className={styles.spotPills}>
        <Pill href="/contact" label="Book a demo" />
        <Pill
          href={messengerUrl("Hi DSD, I'd like to chat about the Denjoy line.")}
          external
          onClick={() => trackContact({ channel: 'messenger', content_name: 'denjoy-spotlight' })}
          label="Go Messenger"
        />
      </motion.div>

      {/* gradient-border feature card — the flagship */}
      <motion.div {...reveal} className={styles.feature}>
        <div className={styles.featureInner}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/denjoy/meet-endo/meetendo-studio-ui-on.jpg"
            alt="Denjoy Meet Endo all-in-one endodontic system"
            className={styles.featureImg}
            loading="lazy"
          />
          <div className={styles.featureVeil} aria-hidden="true" />
          <div className={styles.featureContent}>
            <h3 className={`${styles.display} ${styles.featureTitle}`}>Meet Endo</h3>
            <p className={styles.mono}>
              Apex · motor · fill — one cart. Installed at the Pasig showroom.
            </p>
            <Pill href="/denjoy/meet-endo" label="See the flagship" />
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export function InstrumentsRail() {
  return (
    <section className={styles.railSection} id="instruments">
      <motion.div {...reveal} className={styles.railHead}>
        <h2 className={`${styles.display} ${styles.railTitle}`}>The instruments</h2>
        <span className={styles.monoLink} aria-hidden="true">
          12 units <span>▶</span>
        </span>
      </motion.div>
      <motion.div {...reveal} className={styles.rail} role="list" aria-label="All Denjoy instruments">
        {allInstruments.map((p) => (
          <Link key={p.slug} href={`/denjoy/${p.slug}`} className={styles.railCard} role="listitem">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.heroImage} alt={p.fullName} className={styles.railImg} loading="lazy" />
            <div className={styles.railVeil} aria-hidden="true" />
            <span className={`${styles.chipGlass} ${styles.chipInk} ${styles.railChip}`}>
              {p.chapterName}
            </span>
            {p.isNew && <span className={styles.railNew}>✦ New</span>}
            <span className={`${styles.display} ${styles.railName}`}>{p.name}</span>
            <span className={`${styles.mono} ${styles.railTag}`}>{p.tagline}</span>
          </Link>
        ))}
      </motion.div>
    </section>
  );
}

export function ChapterWall() {
  return (
    <section className={styles.wallSection} id="chapters">
      <motion.p {...reveal} className={styles.mono} style={{ color: '#4c6656', marginBottom: 14 }}>
        Five chapters, twelve instruments
      </motion.p>
      {chapters.map((c) => (
        <motion.a key={c.id} {...reveal} href="#instruments" className={styles.wallWord}>
          {c.name}
          <sup className={styles.wallCount}>{c.count}</sup>
        </motion.a>
      ))}
      <motion.a {...reveal} href="#instruments" className={styles.monoLink} style={{ marginTop: 30 }}>
        Browse all 12 <span aria-hidden="true">▶</span>
      </motion.a>
    </section>
  );
}

export function DnaFaq() {
  const [openIdx, setOpenIdx] = useState(-1);
  return (
    <section className={styles.faqSection} aria-label="Frequently asked questions">
      <motion.p {...reveal} className={styles.mono} style={{ color: '#4c6656', margin: '0 0 16px' }}>
        Straight answers
      </motion.p>
      {faqs.map((f, i) => {
        const open = openIdx === i;
        return (
          <motion.div key={f.q} {...reveal} className={`${styles.faqItem} ${open ? styles.faqOpen : ''}`}>
            <button
              type="button"
              className={styles.faqQ}
              aria-expanded={open}
              onClick={() => setOpenIdx(open ? -1 : i)}
            >
              <span className={`${styles.display} ${styles.faqQText}`}>{f.q}</span>
              <span className={styles.faqPlus} aria-hidden="true">+</span>
            </button>
            <div className={styles.faqA}>
              <p className={`${styles.body} ${styles.faqAInner}`}>{f.a}</p>
            </div>
          </motion.div>
        );
      })}
    </section>
  );
}
