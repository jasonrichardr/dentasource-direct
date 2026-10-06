// Small shared pieces of the chair template: the section head, the ✦ stars, the glass
// buttons, the icon map. Server components; nothing here holds state.

import Link from 'next/link';
import {
  ShieldCheck, Gauge, Waves, Footprints, Armchair, Lightbulb, CircleDot, User, Sofa, Star,
  Pipette, Cable, BookOpen, ArrowRight,
} from 'lucide-react';

// Data files name an icon; this is the only place a name becomes a drawing. Every icon is a
// lucide-react glyph (no emoji in production UI).
export const ICONS = {
  shield: ShieldCheck,
  motor: Gauge,
  pipes: Waves,
  foot: Footprints,
  unit: Armchair,
  light: Lightbulb,
  bowl: CircleDot,
  headrest: User,
  seat: Sofa,
  stool: Star,
  syringe: Pipette,
  tube: Cable,
  docs: BookOpen,
};

export function Stars({ items, className = '' }) {
  if (!items?.length) return null;
  return (
    <ul className={`ch-stars ${className}`}>
      {items.map((s) => <li key={s}>{s}</li>)}
    </ul>
  );
}

export function SectionHead({ kicker, title, line, center = false, level = 2, className = '' }) {
  const H = level === 1 ? 'h1' : 'h2';
  return (
    <div className={`ch-head${center ? ' ch-head-center' : ''} ${className}`} data-reveal>
      {kicker ? <p className="ch-kicker">{kicker}</p> : null}
      <H className={level === 1 ? 'ch-h1' : 'ch-h2'}>{title}</H>
      {line ? <p className="ch-line">{line}</p> : null}
    </div>
  );
}

/**
 * The page's doors. Every button is the site's liquid glass (`lg`, src/styles/liquid-glass.css);
 * the main door adds lg-primary. Internal links do not prefetch: these sit at the bottom of a
 * long page and hover still prefetches, which is where intent shows.
 */
export function GlassLink({ cta, small = false, arrow = false }) {
  const cls = `lg${cta.primary ? ' lg-primary' : ''}${small ? ' lg-sm' : ''}`;
  const body = (
    <>
      {cta.label}
      {arrow ? <ArrowRight size={small ? 14 : 16} aria-hidden="true" /> : null}
    </>
  );
  if (cta.external) {
    return <a className={cls} href={cta.href} target="_blank" rel="noopener noreferrer">{body}</a>;
  }
  return <Link className={cls} href={cta.href} prefetch={false}>{body}</Link>;
}

export function Actions({ ctas, className = '' }) {
  if (!ctas?.length) return null;
  return (
    <div className={`ch-actions ${className}`}>
      {ctas.map((c) => <GlassLink key={c.href + c.label} cta={c} />)}
    </div>
  );
}

export function IconItem({ item }) {
  const Icon = ICONS[item.icon] || CircleDot;
  return (
    <li className="ch-iconitem">
      <span className="ch-icon"><Icon size={19} strokeWidth={1.8} aria-hidden="true" /></span>
      <div>
        <p className="ch-iconitem-title">
          {item.title}
          {item.tag ? <span className="ch-tag">{item.tag}</span> : null}
        </p>
        {item.line ? <p className="ch-iconitem-line">{item.line}</p> : null}
      </div>
    </li>
  );
}
