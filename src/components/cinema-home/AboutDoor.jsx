'use client';

// Our people's "✦ About us" (Jarich, 2026-10-06: "write it like ffc when the button about us is
// pressed i want a popup like that then join our team i love that"). The sheet is FFC's own About
// sheet (GlassSheet, copied 1:1 from ffcdentalclinic.com) with DSD's story from src/data/community.js,
// the same story the growth partner page tells, and it ends on FFC's Join our team door, which goes
// to ffcdentalclinic.com/careers by Jarich's ruling. The labels come from home-beats.json.
//
// ☠️ THE BUTTON CARRIES .cinema-cta: only the live panel's .cinema-cta can be tapped.

import { useCallback, useState } from 'react';
import { GlassSheet } from '@/components/site/FfcSheets';
import { ABOUT } from '@/data/community';

export default function AboutDoor({ door }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  if (!door?.label) return null;
  return (
    <>
      <button type="button" className="cinema-cta lg lg-gold dsd-about-door" aria-haspopup="dialog" onClick={() => setOpen(true)}>
        {door.label}
      </button>
      <GlassSheet open={open} onClose={close} label="About DentaSource Direct">
        <img className="as-logo" src={ABOUT.logo} alt="" decoding="async" />
        <div className="as-kicker">{ABOUT.kicker}</div>
        <h3 className="as-head">{ABOUT.head}</h3>
        {ABOUT.paras.map((t) => <p key={t} className="as-p">{t}</p>)}
        <div className="as-kicker">{ABOUT.pillarsKicker}</div>
        {ABOUT.pillars.map((pl) => (pl.href
          ? <a key={pl.name} className="as-pillar as-pillar-link" href={pl.href} target="_blank" rel="noopener noreferrer"><img className="as-face" src={pl.logo} alt="" decoding="async" /><span><b>{pl.name}</b>{pl.text}</span></a>
          : <div key={pl.name} className="as-pillar"><img className="as-face" src={pl.logo} alt="" decoding="async" /><span><b>{pl.name}</b>{pl.text}</span></div>))}
        <div className="as-kicker">{ABOUT.peopleKicker}</div>
        {ABOUT.people.map((pp) => (
          <div key={pp.name} className="as-pillar"><img className="as-face as-face-person" src={pp.photo} alt={pp.name} decoding="async" /><span><b>{pp.name} · {pp.role}</b>{pp.bio}</span></div>
        ))}
        {door.join ? (
          <a className="lg lg-gold as-join" href={door.join.href} target="_blank" rel="noopener noreferrer">{door.join.label}</a>
        ) : null}
      </GlassSheet>
    </>
  );
}
