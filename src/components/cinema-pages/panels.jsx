'use client';

// The panels the About and Contact arcs need on top of the generic ones. Copy, Cta,
// LockupPanel and PhotoPanel already exist in cinema-home and are genuinely generic, so
// they are imported rather than copied; only what those two pages add lives here.
//
// House rule, enforced rather than trusted: every word a visitor reads comes from the
// beats JSON. No strings are authored in this file.

import Link from 'next/link';
import { Copy, Cta } from '@/components/cinema-home/panels';

// A beat with no photo: the copy alone, over a cloud that is left at full strength.
export function StatementPanel({ beat }) {
  return (
    <div className="dsd-panel dsd-copy-wide">
      <Copy beat={beat} className="dsd-copy-wide" />
      <Cta cta={beat.cta} />
    </div>
  );
}

// Contact beat 1. The map and the full address block are the real ShowroomInfo component
// mounted below the cinema, so this beat is the door into it: the three facts a visitor
// came for, and a link down to the rest.
export function DetailsPanel({ beat }) {
  return (
    <div className="dsd-panel">
      <Copy beat={beat} />
      {beat.facts ? (
        <dl className="dsd-facts">
          {beat.facts.map((fact) => (
            <div className="dsd-fact" key={fact.label}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      <Cta cta={beat.cta} />
    </div>
  );
}

// Contact beat 2. The real BookingForm is mounted below the cinema, untouched and still
// wired to its server action; a form cannot live inside a fixed, opacity gated overlay
// that only grants pointer events to its CTA. So this beat says what the form wants and
// opens it.
export function FormPanel({ beat }) {
  return (
    <div className="dsd-panel dsd-copy-wide">
      <Copy beat={beat} className="dsd-copy-wide" />
      <Cta cta={beat.cta} variant="solid" />
    </div>
  );
}

// The closing beat. Unlike the home door, which has one fixed pair of CTAs, these come
// from the JSON so About and Contact can each end on their own two doors.
export function PageDoorPanel({ beat }) {
  return (
    <div className="dsd-panel dsd-copy-wide">
      <Copy beat={beat} className="dsd-copy-wide" />
      {beat.ctas ? (
        <div className="dsd-cta-row">
          {beat.ctas.map((cta) => (
            <Link
              key={cta.href + cta.label}
              href={cta.href}
              className={`cinema-cta dsd-cta dsd-cta-${cta.variant || 'ghost'}`}
            >
              {cta.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
