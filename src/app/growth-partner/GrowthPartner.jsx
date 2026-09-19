'use client';

import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import { TRACKS, PARTNERS, REELS, PHOTOS, LIVE, CHAPTERS } from '@/data/growth';
import { JDEV, JDEV_MODULES } from '@/data/jdev';
import { PRIVACY } from '@/data/ffcmodules';
import { TRACK_MODULES } from '@/data/trackmodules';
import { KB, GUIDELINES, SAMPLE_BOARD, ABOUT, WHERE } from '@/data/community';
import { applySpeaker } from '@/actions/speaker';
import GpSky, { ThemeSwitch } from './GpSky';
import GpSheet, { ModuleList } from './GpSheet';
import { GlassSheet, PrivacySheet } from './FfcSheets';
import { TokenRow, NetworkMap, MarketCapChart, TradingCharts, EcosystemGraph, TimeframeLadder } from './JdevVisuals';
import Roadmap from './Roadmap';
import { reserveSeat } from '@/actions/growth';
import GoogleEmailButton from '../spin/GoogleEmailButton';
import { AppleMark, AndroidMark, WindowsMark, FacebookMark, MessengerMark } from '../spin/brandMarks';

const MESSENGER = 'https://m.me/dentasource';
const FB = 'https://facebook.com/dentasource';

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.rv');
    if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('in')); return; }
    const io = new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -8% 0px' });
    els.forEach((e) => io.observe(e));
    // iOS Low Power Mode blocks autoplay until a gesture: the first touch kicks every on-screen video (round 7).
    const kick = () => { document.querySelectorAll('video').forEach((v) => { const r = v.getBoundingClientRect(); if (r.bottom > 0 && r.top < innerHeight) v.play().catch(() => {}); }); };
    window.addEventListener('touchstart', kick, { once: true, passive: true });
    return () => { io.disconnect(); window.removeEventListener('touchstart', kick); };
  }, []);
}

// Muted, autoplaying while in view. Round 4: no sound button on any video (Jarich: "remove all speaker icon from videos").
function Reel({ r, wide }) {
  const v = useRef(null);
  useEffect(() => {
    const el = v.current; if (!el) return;
    const io = new IntersectionObserver(([en]) => { if (en.isIntersecting) el.play().catch(() => {}); else el.pause(); }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div className={`tile ${wide ? 'wide' : ''}`}>
      <video ref={v} src={r.src} poster={r.poster} muted loop playsInline preload="metadata" />
      <div className="cap">{r.cap}</div>
    </div>
  );
}

// One face at a time, big, crossfading (round 9: "play their avatar as marquee so they see one at a time").
function FaceLoop({ people, every = 2600 }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (people.length < 2) return undefined;
    const id = setInterval(() => setI((k) => (k + 1) % people.length), every);
    return () => clearInterval(id);
  }, [people.length, every]);
  const d = people[i];
  return (
    <div className="faceloop" aria-label={people.map((x) => x.name).join(', ')}>
      <div className="faceloop-stack">{people.map((x, k) => <img key={x.name} src={x.photo} alt={x.name} decoding="async" className={k === i ? 'on' : ''} />)}</div>
      <span key={d.name} className="faceloop-name"><b>{d.name}</b><small>{d.title}</small></span>
    </div>
  );
}

function PrivacyButton({ onOpen }) {
  return <button type="button" className="pv-i" aria-label="How we handle your details" aria-haspopup="dialog" onClick={onOpen}>i</button>;
}

export default function GrowthPartner({ news = [] }) {
  useReveal();
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(null);
  const [pending, start] = useTransition();
  const [nameV, setNameV] = useState('');
  const [emailV, setEmailV] = useState('');
  const [spoke, setSpoke] = useState(null);
  const [sErr, setSErr] = useState({});
  // one sheet at a time: { kind: 'track'|'jdev'|'about'|'privacy', id }
  const [sheet, setSheet] = useState(null);
  const sheetRef = useRef(null); sheetRef.current = sheet;
  // App-like sheets (round 6): opening pushes a history entry so the phone's back gesture closes the sheet instead
  // of leaving the page; closing pops it. Any return to the page (bfcache, app switch) clears a stuck sheet-open state
  // so the room's dock can never be left unpressable.
  const openSheet = useCallback((next) => { try { history.pushState({ ...(history.state || {}), gpSheet: true }, ''); } catch { /* ignore */ } setSheet(next); }, []);
  const closeSheet = useCallback(() => {
    if (typeof history !== 'undefined' && history.state && history.state.gpSheet) { history.back(); return; }
    setSheet(null);
  }, []);
  useEffect(() => {
    const onPop = () => { if (sheetRef.current) setSheet(null); };
    const heal = () => { if (!sheetRef.current) { const html = document.documentElement; html.classList.remove('sheet-open'); if (html.style.overflow === 'hidden' && !document.getElementById('tx-room')?.classList.contains('on')) html.style.overflow = ''; } };
    const onShow = () => { if (sheetRef.current && !(history.state && history.state.gpSheet)) setSheet(null); heal(); };
    window.addEventListener('popstate', onPop);
    window.addEventListener('pageshow', onShow);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) heal(); });
    return () => { window.removeEventListener('popstate', onPop); window.removeEventListener('pageshow', onShow); };
  }, []);
  const goAfterClose = (id) => (e) => { e.preventDefault(); closeSheet(); setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80); };

  const submitSpeaker = (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    start(async () => {
      const r = await applySpeaker(fd);
      if (r?.fields) { setSErr(r.fields); return; }
      if (r?.error) { setSErr({ form: r.error }); return; }
      setSErr({}); setSpoke(r);
    });
  };

  const submit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    start(async () => {
      const r = await reserveSeat(fd);
      if (r?.fields) { setErrors(r.fields); return; }
      if (r?.error) { setErrors({ form: r.error }); return; }
      setErrors({}); setDone(r);
    });
  };

  const wall = [];
  const rs = [...REELS]; const ps = [...PHOTOS];
  const order = ['r', 'p', 'p', 'r', 'p', 'p', 'r', 'p', 'p', 'r', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'];
  for (const k of order) { const it = k === 'r' ? rs.shift() : ps.shift(); if (it) wall.push({ kind: k, it }); }

  const track = sheet?.kind === 'track' ? TRACKS.find((t) => t.id === sheet.id) : null;
  const trackMods = track ? TRACK_MODULES[track.id] : null;
  const jd = sheet?.kind === 'jdev' ? JDEV_MODULES.find((m) => m.id === sheet.id) : null;
  const jumpModule = (n) => { const el = document.getElementById(`jdev-${jd.id}-m${n}`); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); };

  return (
    <>
    <main className="gp">
      <header className="gp-top">
        <a className="gp-brand" href="/" aria-label="DentaSource Direct Training Center">
          <img className="lockup lockup-light" src="/images/brand/logo-banner.png" alt="DentaSource Direct" />
        </a>
        <div className="gp-top-actions"><ThemeSwitch /><a className="gp-btn gold" href="#reserve">Reserve my seat</a></div>
      </header>

      <section className="gp-hero">
        <video src="/gp/reels/reel-07.mp4" poster="/gp/reels/reel-07.jpg" autoPlay muted loop playsInline preload="metadata" aria-hidden />
        <div className="gp-hero-inner">
          <p className="gp-kicker rv">Training Center · Pasig</p>
          <h1 className="gp-h1 rv">Your growth partner <span className="gp-gold">in dentistry.</span></h1>
          <p className="gp-lead rv">We sell the chairs, the scanners, and the x-rays. We would rather teach you to make the most of them. The Training Center sits inside the largest dental showroom in the Philippines, so every lecture is a hands-on session and every tool is within reach.</p>
          <div className="gp-hero-cta rv">
            <a className="gp-btn" href="#reserve">Reserve my seat</a>
          </div>
          <div className="gp-logos rv" aria-label="With our partners">
            <img className="logo-bare ortho" src="/gp/logos/orthostrategy-clear.png" alt="Orthostrategy Study Group" />
            <img className="logo-bare crest" src="/gp/logos/cred-creststudy-round.png" alt="Crest Study Group" />
            <img className="logo-bare round" src="/gp/logos/ffc-ring-clean.png" alt="FFC Dental Clinic" />
            <img className="logo-bare round" src="/gp/logos/cred-jdev-round.png" alt="JDev Studio" />
          </div>
        </div>
      </section>

      {LIVE.length ? (
        <section className="gp-sec" id="live">
          <p className="gp-kicker rv">Live at the chair</p>
          <h2 className="gp-h2 rv">Real hands. <span className="gp-gold">Real mouths.</span></h2>
          <p className="gp-lead rv">Not a slide deck. This is a hands-on workshop the way we run it, scan to manufacture in a day, with the mentor beside you.</p>
          <div className="live-grid">
            {LIVE.map((v) => <Reel key={v.src} r={v} wide={false} />)}
          </div>
          <p className="credit-line rv">Filmed at the DentaSource Direct Training Center and FFC Dental Clinic, with consent. Videos play without sound.</p>
        </section>
      ) : null}

      <section className="gp-sec" id="teach">
        <p className="gp-kicker rv">See how we teach</p>
        <h2 className="gp-h2 rv">Not a room we rent. <span className="gp-gold">A lab we built.</span></h2>
        <p className="gp-lead rv">Every station has a simulator, a scanner, and a screen. The mentor stands at your shoulder, not at a podium. This is what a session looks like.</p>
        <div className="wall">
          {wall.map(({ kind, it }, i) => kind === 'r'
            ? <Reel key={`r${i}`} r={it} wide={false} />
            : <div key={`p${i}`} className={`tile ${it.wide ? 'wide' : ''}`}><img src={it.src} alt={it.cap} loading="lazy" /><div className="cap">{it.cap}</div></div>)}
        </div>
      </section>

      <section className="gp-sec" id="tracks">
        <p className="gp-kicker rv">What you can learn</p>
        <h2 className="gp-h2 rv">Eight courses. <span className="gp-gold">One promise.</span></h2>
        <p className="gp-lead rv">You leave able to do the thing, not just describe it. Tap a course for its modules.</p>
        <div className="tracks">
          {TRACKS.map((t) => (
            <article key={t.id} className="track rv" role="button" tabIndex={0} aria-haspopup="dialog" onClick={() => openSheet({ kind: 'track', id: t.id })} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openSheet({ kind: 'track', id: t.id }); } }}>
              <div className={`track-ic ${t.plate ? 'plate' : ''}`}><img src={t.icon} alt="" /></div>
              <div>
                <h3>{t.label}</h3>
                <p>{t.promise}</p>
                {t.with ? <div className="with"><span>with</span><img src={t.with.logo} alt={t.with.name} /><span>{t.with.name}</span></div> : null}
                {t.people?.length ? <FaceLoop people={t.people} /> : null}
                {t.platforms ? <div className="plat"><span><AppleMark size={14} />Mac</span><span><WindowsMark size={14} />Windows</span><span><AppleMark size={14} />iOS</span><span><AndroidMark size={14} />Android</span></div> : null}
                <span className="open">{TRACK_MODULES[t.id]?.modules.length || 0} modules</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="gp-sec" id="board">
        <p className="gp-kicker rv">After the course</p>
        <h2 className="gp-h2 rv">You leave with <span className="gp-gold">your own application.</span></h2>
        <p className="gp-lead rv">{SAMPLE_BOARD.lead}</p>
        <div className="marquee kb rv"><div className="marquee-track">
          {[...KB, ...KB].map((k, i) => <figure key={`${k.src}-${i}`} className="mq-item kb-item"><img src={k.src} alt={k.cap} loading={i < 6 ? 'eager' : 'lazy'} decoding="async" /></figure>)}
        </div></div>
        <div className="gp-hero-cta rv"><a className="gp-btn" href={SAMPLE_BOARD.href} target="_blank" rel="noopener">Roam the sample board</a><a className="gp-btn ghost" href="#reserve">Reserve my seat</a></div>
        <p className="credit-line rv">{SAMPLE_BOARD.note}</p>
      </section>

      <section className="gp-sec" id="partners">
        <p className="gp-kicker rv">Growth Partners teaching with us</p>
        <h2 className="gp-h2 rv">You do not learn from a brand. <span className="gp-gold">You learn from people.</span></h2>
        <div className="partners">
          {PARTNERS.map((p) => (
            <div key={p.name} className="partner rv"><img className={p.shape} src={p.logo} alt="" /><b>{p.name}</b><small>{p.sub}</small></div>
          ))}
        </div>
        {CHAPTERS.map((c) => (
          <article key={c.id} className="chapter chapter-compact rv" id={`partner-${c.id}`} role="button" tabIndex={0} aria-haspopup="dialog" onClick={() => openSheet({ kind: 'chapter', id: c.id })} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openSheet({ kind: 'chapter', id: c.id }); } }}>
            <div className="chapter-head"><img className={c.shape || ''} src={c.logo} alt="" /><div><h3>{c.name}</h3><small>{c.sub}</small></div></div>
            {c.people?.length ? <div className="faces-row">{c.people.map((d) => <img key={d.name} src={d.photo} alt={d.name} title={`${d.name} · ${d.title}`} decoding="async" />)}<span>{c.people.length === 1 ? c.people[0].name : `${c.people[0].name} and ${c.people.length - 1} more`}</span></div> : null}
            <p className="chapter-body clamp">{c.body}</p>
            <span className="open">{c.offers.length} offers{c.videos?.length || c.photos?.length ? ` · ${(c.videos?.length || 0) + (c.photos?.length || 0)} photos and videos` : ''}</span>
          </article>
        ))}
      </section>

      <section className="gp-sec" id="jdev">
        <p className="gp-kicker rv">Beyond the chair</p>
        <h2 className="gp-h2 rv">With <span className="gp-gold">JDev Studio.</span></h2>
        <div className="jdev-head rv"><img className="jdev-logo-white" src="/images/brand/jdev-logo-white.png" alt="JDev Studio" /><img className="jdev-logo-coral" src="/images/brand/jdev-logo-coral.png" alt="JDev Studio" /></div>
        <div className="people-row rv"><div className="person-chip"><img src={JDEV.person.photo} alt={JDEV.person.name} decoding="async" /><span><b>{JDEV.person.name}</b><small>{JDEV.person.title}</small></span></div></div>
        <p className="gp-lead rv">{JDEV.line} Tap a course to open it.</p>
        <div className="jdev-grid">
          {JDEV_MODULES.map((m) => (
            <button key={m.id} type="button" className="jdev-card rv" aria-haspopup="dialog" onClick={() => openSheet({ kind: 'jdev', id: m.id })}>
              <small>{m.modules.length} modules</small>
              <h3>{m.label}</h3>
              <p>{m.promise}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="gp-sec" id="how">
        <p className="gp-kicker rv">The honest part</p>
        <h2 className="gp-h2 rv">When, where, <span className="gp-gold">how much.</span></h2>
        <ul className="honest rv">
          <li>Where: the DentaSource Direct Training Center, inside our showroom in Pasig.</li>
          <li>When: batches open after NADTI 2026. The people who reserve hear the dates first.</li>
          <li>Seats: limited on purpose. Hands-on means a station per person.</li>
          <li>Pricing: shared on reply, per track. No surprises on the day.</li>
        </ul>
        <div className="where rv">
          <div className="where-info">
            <h3>{WHERE.name}</h3>
            <p>{WHERE.lines[0]}<br />{WHERE.lines[1]}</p>
            <small>{WHERE.hours} · <a href={`tel:${WHERE.phone.replace(/\s+/g, '')}`} style={{ color: 'inherit' }}>{WHERE.phone}</a></small>
            <div className="gp-doors" style={{ justifyContent: 'flex-start' }}><a className="gp-btn ghost" href={WHERE.share} target="_blank" rel="noopener">Open in Google Maps</a><a className="gp-btn ghost" href="/contact">Contact page</a></div>
          </div>
          <div className="where-map"><iframe src={WHERE.embed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen title={`Map showing ${WHERE.lines[0]}, ${WHERE.lines[1]}`} /></div>
        </div>
      </section>

      <section className="gp-sec" id="teach-with-us">
        <p className="gp-kicker rv">Teach with us</p>
        <h2 className="gp-h2 rv">A community of learners. <span className="gp-gold">Not entertainers.</span></h2>
        <p className="gp-lead rv">Speakers, partners and members learn side by side. Education first, evidence always, no politics. Read the guidelines before you ask to teach.</p>
        <button type="button" className="about-door rv" aria-haspopup="dialog" onClick={() => openSheet({ kind: 'rules' })}>✦ Community guidelines</button>
        {spoke ? (
          <div className="thanks rv in">
            <p className="gp-kicker">Received</p>
            <h3 className="gp-h2" style={{ fontSize: 28 }}>Thank you. We read every one.</h3>
            <p className="gp-lead" style={{ margin: '10px auto 0' }}>We will write back from the Training Center. Ref {spoke.ref}</p>
          </div>
        ) : (
          <form className="gp-form rv" onSubmit={submitSpeaker} noValidate>
            <label className="gp-field"><span>Full name</span><input name="name" autoComplete="name" required />{sErr.name ? <p className="gp-err">{sErr.name}</p> : null}</label>
            <label className="gp-field"><span>Study group, clinic or school</span><input name="group" autoComplete="organization" required />{sErr.group ? <p className="gp-err">{sErr.group}</p> : null}</label>
            <label className="gp-field"><span>Email</span><input name="email" type="email" inputMode="email" autoComplete="email" required />{sErr.email ? <p className="gp-err">{sErr.email}</p> : null}</label>
            <label className="gp-field"><span>Mobile number</span><input name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="0917 123 4567" required />{sErr.phone ? <p className="gp-err">{sErr.phone}</p> : null}</label>
            <label className="gp-field"><span>What you want to teach, and to whom</span><input name="topic" required />{sErr.topic ? <p className="gp-err">{sErr.topic}</p> : null}</label>
            <label className="gp-field"><span>One link to your work</span><input name="link" inputMode="url" placeholder="facebook.com/… or your page" /></label>
            <label className="consent"><input type="checkbox" name="rules" /><span>I have read the community rules and I agree: education first, no politics, we all keep learning.</span></label>
            {sErr.rules ? <p className="gp-err">{sErr.rules}</p> : null}
            <div className="consent-row">
              <label className="consent"><input type="checkbox" name="consent" /><span>DentaSource Direct may contact me about teaching at the Training Center.</span></label>
              <PrivacyButton onOpen={() => openSheet({ kind: 'privacy' })} />
            </div>
            {sErr.consent ? <p className="gp-err">{sErr.consent}</p> : null}
            {sErr.form ? <p className="gp-err">{sErr.form}</p> : null}
            <button type="submit" className="gp-btn" disabled={pending}>{pending ? 'Sending' : 'Ask to teach with us'}</button>
          </form>
        )}
      </section>

      <section className="gp-sec" id="about" style={{ paddingTop: 0, textAlign: 'center' }}>
        <button type="button" className="about-door rv" aria-haspopup="dialog" onClick={() => openSheet({ kind: 'about' })}>✦ About us</button>
      </section>

      <section className="gp-sec" id="reserve">
        <p className="gp-kicker rv">Reserve my seat</p>
        <h2 className="gp-h2 rv">Tell us what you want <span className="gp-gold">to learn.</span></h2>
        {done ? (
          <div className="thanks rv in">
            <p className="gp-kicker">Reserved</p>
            <h3 className="gp-h2" style={{ fontSize: 28 }}>Thank you. We will reach you first.</h3>
            <p className="gp-lead" style={{ margin: '10px auto 0' }}>{done.tracks.join(', ')}</p>
            <p className="ref" style={{ marginTop: 10 }}>Ref {done.ref}</p>
            <div className="gp-doors"><a className="gp-btn ghost" href={MESSENGER}>Message us now</a><a className="gp-btn ghost" href="/news">Read our news</a></div>
          </div>
        ) : (
          <form className="gp-form rv" onSubmit={submit} noValidate>
            <GoogleEmailButton onIdentity={({ email, name }) => { setEmailV(email); if (name && !nameV) setNameV(name); }} />
            <label className="gp-field"><span>Full name</span><input name="name" autoComplete="name" value={nameV} onChange={(e) => setNameV(e.target.value)} required />{errors.name ? <p className="gp-err">{errors.name}</p> : null}</label>
            <label className="gp-field"><span>Dental clinic</span><input name="clinic" autoComplete="organization" required />{errors.clinic ? <p className="gp-err">{errors.clinic}</p> : null}</label>
            <label className="gp-field"><span>Email</span><input name="email" type="email" inputMode="email" autoComplete="email" value={emailV} onChange={(e) => setEmailV(e.target.value)} required />{errors.email ? <p className="gp-err">{errors.email}</p> : null}</label>
            <label className="gp-field"><span>Mobile number</span><input name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="0917 123 4567" required />{errors.phone ? <p className="gp-err">{errors.phone}</p> : null}</label>
            <div className="gp-field"><span>Courses you want</span>
              <div className="course-pick">
                {TRACKS.map((t) => <label key={t.id} className="cp"><input type="checkbox" name={`track_${t.id}`} /><img src={t.people?.[0]?.photo || t.icon} alt="" className={t.people?.length ? 'face' : t.plate ? 'plate' : ''} /><span>{t.label}</span><i aria-hidden>✓</i></label>)}
                {JDEV_MODULES.map((m) => <label key={m.id} className="cp jd"><input type="checkbox" name={`jdev_${m.id}`} /><img src="/gp/logos/cred-jdev-round.png" alt="" /><span>{m.short || m.label}</span><i aria-hidden>✓</i></label>)}
              </div>
              {errors.tracks ? <p className="gp-err">{errors.tracks}</p> : null}
            </div>
            <div className="consent-row">
              <label className="consent"><input type="checkbox" name="consent" /><span>I agree that DentaSource Direct may contact me about the Training Center, products, and promos.</span></label>
              <PrivacyButton onOpen={() => openSheet({ kind: 'privacy' })} />
            </div>
            {errors.consent ? <p className="gp-err">{errors.consent}</p> : null}
            {errors.form ? <p className="gp-err">{errors.form}</p> : null}
            <button type="submit" className="gp-btn" disabled={pending}>{pending ? 'Reserving' : 'Reserve my seat'}</button>
          </form>
        )}
      </section>

      {news.length ? (
        <section className="gp-sec" id="news">
          <p className="gp-kicker rv">From our news</p>
          <h2 className="gp-h2 rv">What we have been <span className="gp-gold">up to.</span></h2>
          <div className="news">
            {news.map((a) => (
              <a key={a.slug} href={`/news/${a.slug}`} className="rv">
                {a.image ? <img src={a.image} alt="" loading="lazy" /> : <div />}
                <div className="nb"><div className="nd">{a.date}</div><h4>{a.title}</h4><p>{a.abstract}</p></div>
              </a>
            ))}
          </div>
          <div className="gp-doors rv"><a className="gp-btn ghost" href="/news">All news</a></div>
        </section>
      ) : null}

      <footer className="gp-foot">
        <div className="gp-doors">
          <a className="brand-pill messenger" href={MESSENGER} target="_blank" rel="noopener"><MessengerMark size={22} />Message us</a>
          <a className="brand-pill facebook" href={FB} target="_blank" rel="noopener"><FacebookMark size={22} />Facebook</a>
          <a className="brand-pill roson" href="/dentalchairs"><img src="/images/brand/roson-logo-final.png" alt="" />ROSON Dental Chairs</a>
        </div>
        <p style={{ marginTop: 16 }}>DentaSource Direct · Pasig, Metro Manila · dentasourcedirect.com</p>
      </footer>
    </main>

    {/* the room (dock + sky + music) lives OUTSIDE main, like /spin: .gp > * is a z-index 1 stacking context that trapped it */}
    <GpSky />

    <GpSheet open={!!track} onClose={closeSheet} kicker="Course" title={track?.label}>
      {track && trackMods ? (
        <>
          {track.with ? <p className="gp-sheet-lead with-logo" style={{ marginTop: 6 }}>with <img src={track.with.logo} alt="" /> {track.with.name}</p> : null}
          {track.people?.length ? <div className="people-row" style={{ marginTop: 12 }}>{track.people.map((d) => <div key={d.name} className="person-chip"><img src={d.photo} alt={d.name} decoding="async" /><span><b>{d.name}</b><small>{d.title}</small></span></div>)}</div> : null}
          <ModuleList lead={trackMods.lead} modules={trackMods.modules} />
          <p className="leave">{track.leave}</p>
          <div className="gp-doors" style={{ justifyContent: 'flex-start', marginTop: 18 }}><a className="gp-btn" href="#reserve" onClick={goAfterClose('reserve')}>Reserve my seat</a></div>
        </>
      ) : null}
    </GpSheet>

    <GpSheet open={!!jd} onClose={closeSheet} kicker="JDev Studio" title={jd?.label} wide>
      {jd ? (
        <>
          <p className="gp-sheet-lead">{jd.lead}</p>
          {jd.note ? <p className="note">{jd.note}</p> : null}
          {jd.id === 'crypto' ? <><TokenRow /><NetworkMap /><MarketCapChart /><EcosystemGraph onModule={jumpModule} /></> : null}
          {jd.id === 'trading' ? <><TradingCharts /><TimeframeLadder /></> : null}
          {jd.id === 'agentic' ? <Roadmap onModule={jumpModule} /> : null}
          <ModuleList modules={jd.modules} idPrefix={`jdev-${jd.id}`} />
          <p className="leave">{jd.leave}</p>
          <div className="gp-doors" style={{ justifyContent: 'flex-start', marginTop: 18 }}><a className="gp-btn" href="#reserve" onClick={goAfterClose('reserve')}>Reserve my seat</a></div>
        </>
      ) : null}
    </GpSheet>

    <GpSheet open={sheet?.kind === 'chapter'} onClose={closeSheet} kicker="Growth Partner" title={CHAPTERS.find((c) => c.id === sheet?.id)?.name} wide>
      {sheet?.kind === 'chapter' ? (() => { const c = CHAPTERS.find((x) => x.id === sheet.id); if (!c) return null; return (
        <>
          <p className="gp-sheet-lead">{c.sub}</p>
          {c.people?.length ? <div className="people-row" style={{ marginTop: 12 }}>{c.people.map((d) => <div key={d.name} className="person-chip"><img src={d.photo} alt={d.name} decoding="async" /><span><b>{d.name}</b><small>{d.title}</small></span></div>)}</div> : null}
          <p className="chapter-body">{c.body}</p>
          <ul className="offers">{c.offers.map((o) => <li key={o}>{o}</li>)}</ul>
          {c.videos?.length ? (
            <div className="marquee sheet-mq" aria-label={`${c.name} videos`}><div className="marquee-track">
              {[...c.videos, ...c.videos].map((v, i) => <figure key={`${v.src}-${i}`} className="mq-item"><video src={v.src} poster={v.poster} muted loop autoPlay playsInline preload={i < 4 ? 'metadata' : 'none'} aria-label={v.cap || ''} /></figure>)}
            </div></div>
          ) : null}
          {c.photos?.length ? (
            <div className="marquee reverse sheet-mq" aria-label={`${c.name} photos`}><div className="marquee-track">
              {[...c.photos, ...c.photos].map((ph, i) => <figure key={`${ph.src}-${i}`} className="mq-item"><img src={ph.src} alt={ph.cap || ''} loading={i < 8 ? 'eager' : 'lazy'} decoding="async" /></figure>)}
            </div></div>
          ) : null}
          <p className="courtesy">{c.videos?.length || c.photos?.length ? 'Photos and video courtesy of ' : ''}<a href={c.fb} target="_blank" rel="noopener">{c.name}</a>.</p>
          <div className="gp-doors" style={{ justifyContent: 'flex-start', marginTop: 18 }}><a className="gp-btn" href="#reserve" onClick={goAfterClose('reserve')}>Reserve my seat</a></div>
        </>); })() : null}
    </GpSheet>

    <GlassSheet open={sheet?.kind === 'about'} onClose={closeSheet} label="About DentaSource Direct">
      <img className="as-logo" src={ABOUT.logo} alt="" decoding="async" />
      <div className="as-kicker">{ABOUT.kicker}</div>
      <h3 className="as-head">{ABOUT.head}</h3>
      {ABOUT.paras.map((t) => <p key={t} className="as-p">{t}</p>)}
      <div className="as-kicker">{ABOUT.pillarsKicker}</div>
      {ABOUT.pillars.map((pl) => pl.href
        ? <a key={pl.name} className="as-pillar as-pillar-link" href={pl.href} target="_blank" rel="noopener"><img className="as-face" src={pl.logo} alt="" decoding="async" /><span><b>{pl.name}</b>{pl.text}</span></a>
        : <div key={pl.name} className="as-pillar"><img className="as-face" src={pl.logo} alt="" decoding="async" /><span><b>{pl.name}</b>{pl.text}</span></div>)}
      <div className="as-kicker">{ABOUT.peopleKicker}</div>
      {ABOUT.people.map((pp) => <div key={pp.name} className="as-pillar"><img className="as-face as-face-person" src={pp.photo} alt={pp.name} decoding="async" /><span><b>{pp.name} · {pp.role}</b>{pp.bio}</span></div>)}
      <a className="about-door as-join" href="#reserve" onClick={goAfterClose('reserve')}>✦ Reserve my seat</a>
    </GlassSheet>

    <GlassSheet open={sheet?.kind === 'rules'} onClose={closeSheet} label="Community guidelines">
      <img className="as-logo" src={ABOUT.logo} alt="" decoding="async" />
      <div className="as-kicker">{GUIDELINES.kicker}</div>
      <h3 className="as-head">{GUIDELINES.head}</h3>
      <p className="as-p">{GUIDELINES.lead}</p>
      {GUIDELINES.items.map((g) => <div key={g.title} className="as-rule"><b>{g.title}</b><p>{g.text}</p></div>)}
      <p className="as-foot">{GUIDELINES.foot}</p>
      <a className="about-door as-join" href="#teach-with-us" onClick={goAfterClose('teach-with-us')}>✦ Ask to teach with us</a>
    </GlassSheet>

    <PrivacySheet open={sheet?.kind === 'privacy'} onClose={closeSheet} privacy={PRIVACY} crest={ABOUT.logo} title="How we handle your details" foot="DentaSource Direct · Data Privacy Notice · version 1 · September 2026" />
    </>
  );
}
