'use client';

// The pill CTA — double-label slide-swap hover (blueprint: "label-swap hover").
// Renders the label twice inside a 12px clip; hover slides the deck up.

import Link from 'next/link';
import styles from './v2.module.css';

export default function Pill({ href, label, external = false, onClick, variant = '' }) {
  const cls = `${styles.pill} ${variant}`;
  const deck = (
    <span className={styles.pillLabel}>
      <span className={styles.pillMover}>
        <span>{label}</span>
        <span aria-hidden="true">{label}</span>
      </span>
    </span>
  );
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls} onClick={onClick}>
        {deck}
      </a>
    );
  }
  if (href.startsWith('#')) {
    return <a href={href} className={cls} onClick={onClick}>{deck}</a>;
  }
  return <Link href={href} className={cls} onClick={onClick}>{deck}</Link>;
}
