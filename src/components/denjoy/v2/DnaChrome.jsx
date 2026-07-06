'use client';

// LAYER 2 · UI CHROME — fixed app bar (hamburger + boxed wordmark) and the
// full-screen nav takeover (off-canvas drawer, slides in from the left).
// Anatomy names per the apechain-mobile blueprint.

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { menuLinks } from './dnaContent';
import styles from './v2.module.css';

export default function DnaChrome() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <header className={styles.bar}>
        <div className={styles.barScrim} aria-hidden="true" />
        <button
          type="button"
          className={styles.burger}
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <span /><span /><span />
        </button>
        <a href="#top" className={styles.wordmarkBox} aria-label="Denjoy — back to top">
          Denjoy
        </a>
      </header>

      <nav className={`${styles.menu} ${open ? styles.menuOpen : ''}`} aria-hidden={!open}>
        <div className={styles.menuBar}>
          <button type="button" className={styles.menuClose} onClick={close} aria-label="Close menu">
            <span className={styles.mono} style={{ fontSize: 16, letterSpacing: '0.08em' }}>✕</span>
            <span className={styles.mono}>Close</span>
          </button>
          <span className={styles.wordmarkBox}>Denjoy</span>
        </div>
        {menuLinks.map((l) =>
          l.href.startsWith('#') ? (
            <a key={l.label} href={l.href} className={styles.menuItem} onClick={close}>
              <span className={styles.menuWord}>{l.label}</span>
              <span className={styles.menuPlus} aria-hidden="true">+</span>
            </a>
          ) : (
            <Link key={l.label} href={l.href} className={styles.menuItem} onClick={close}>
              <span className={styles.menuWord}>{l.label}</span>
              <span className={styles.menuPlus} aria-hidden="true">+</span>
            </Link>
          )
        )}
        <p className={styles.mono} style={{ marginTop: 'auto', paddingTop: 40, color: 'rgba(255,255,255,.7)' }}>
          Exclusive Philippine Distributor · DentaSource Direct
        </p>
      </nav>
    </>
  );
}
