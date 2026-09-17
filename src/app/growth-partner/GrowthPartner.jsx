'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { TRACKS, PARTNERS, REELS, PHOTOS, LIVE, CHAPTERS } from '@/data/growth';
import { JDEV, JDEV_MODULES } from '@/data/jdev';
import { SAE, DA, PRIVACY } from '@/data/ffcmodules';
import { KB, MANIFESTO, SAMPLE_BOARD } from '@/data/community';
import { applySpeaker } from '@/actions/speaker';
import GpSky, { ThemeSwitch } from './GpSky';
import { reserveSeat } from '@/actions/growth';
import GoogleEmailButton from '../spin/GoogleEmailButton';
import { AppleMark, AndroidMark, WindowsMark } from '../spin/brandMarks';

const MESSENGER = 'https://m.me/dentasource';
const FB = 'https://facebook.com/dentasource';

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.rv');
    if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('in')); return; }
    const io = new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -8% 0px' });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);
}

function Reel({ r, wide }) {
  const v = useRef(null);
  const [sound, setSound] = useState(false);
  useEffect(() => {
    const el = v.current; if (!el) return;
    const io = new IntersectionObserver(([en]) => {
      if (en.isIntersecting) el.play().catch(() => {}); else { el.pause(); if (sound) { el.muted = true; setSound(false); } }
    }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, [sound]);
  return (
    <div className={`tile ${wide ? 'wide' : ''} ${sound ? 'live' : ''}`}>
      <video ref={v} src={r.src} poster={r.poster} muted={!sound} loop playsInline preload="metadata" />
      <button type="button" className="snd" aria-label={sound ? 'Mute' : 'Play with sound'} onClick={() => { const el = v.current; if (!el) return; el.muted = sound; setSound(!sound); el.play().catch(() => {}); }}>{sound ? '🔊' : '🔈'}</button>
      <div className="cap">{r.cap}</div>
    </div>
  );
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
  // interleave: reel, reel, photo(wide), photo, reel, photo ...
  const order = ['r', 'p', 'p', 'r', 'p', 'p', 'r', 'p', 'p', 'r', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'];
  for (const k of order) { const it = k === 'r' ? rs.shift() : ps.shift(); if (it) wall.push({ kind: k, it }); }

  return (
    <main className="gp">
      <header className="gp-top">
        <a className="gp-brand" href="/" aria-label="DentaSource Direct Training Center">
          <img className="lockup" src="/images/brand/dsd-lockup.png" alt="DentaSource Direct" />
          <span className="wm-tc">Training Center</span>
        </a>
        <div className="gp-top-actions"><ThemeSwitch /><a className="gp-btn" href="#reserve">Reserve my seat</a></div>
      </header>

      <section className="gp-hero">
        <video src="/gp/reels/reel-07.mp4" poster="/gp/reels/reel-07.jpg" autoPlay muted loop playsInline preload="metadata" aria-hidden />
        <div className="gp-hero-inner">
          <p className="gp-kicker rv">DentaSource Direct Training Center · Pasig</p>
          <h1 className="gp-h1 rv">Your growth partner <span className="gp-gold">in dentistry.</span></h1>
          <p className="gp-lead rv">We sell the chairs, the scanners, and the x-rays. We would rather teach you to make the most of them. The Training Center sits inside the largest dental showroom in the country, so every lecture is a hands-on session and every tool is within reach.</p>
          <div className="gp-hero-cta rv">
            <a className="gp-btn" href="#reserve">Reserve my seat</a>
            <a className="gp-btn ghost" href="#teach">See how we teach</a>
          </div>
          <div className="gp-logos rv" aria-label="With our partners">
            <span className="pill"><img src="/images/brand/roson-logo-final.png" alt="ROSON" /></span>
            <img className="logo-bare denjoy" src="/images/brand/denjoy-logo-final.png" alt="Denjoy" />
            <img className="logo-bare ortho" src="/gp/logos/orthostrategy-clear.png" alt="Orthostrategy Study Group" />
            <img className="logo-bare crest" src="/gp/logos/crest-clear.png" alt="Crest Study Group" />
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
          <p className="credit-line rv">Filmed at the DentaSource Direct Training Center and FFC Dental Clinic, with consent. Sound is off until you tap it.</p>
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
        <h2 className="gp-h2 rv">Eight tracks. <span className="gp-gold">One promise.</span></h2>
        <p className="gp-lead rv">You leave able to do the thing, not just describe it.</p>
        <div className="tracks">
          {TRACKS.map((t) => (
            <article key={t.id} className="track rv">
              <div className={`track-ic ${t.plate ? 'plate' : ''}`}><img src={t.icon} alt="" /></div>
              <div>
                <h3>{t.label}</h3>
                <p>{t.promise}</p>
                <p><em>{t.leave}</em></p>
                {t.with ? <div className="with"><span>with</span><img src={t.with.logo} alt={t.with.name} /><span>{t.with.name}</span></div> : null}
                {t.platforms ? <div className="plat"><span><AppleMark size={14} />Mac</span><span><WindowsMark size={14} />Windows</span><span><AppleMark size={14} />iOS</span><span><AndroidMark size={14} />Android</span></div> : null}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="gp-sec" id="modules">
        <p className="gp-kicker rv">Module by module</p>
        <h2 className="gp-h2 rv">What a batch <span className="gp-gold">actually covers.</span></h2>
        <p className="gp-lead rv">Two of the tracks, opened up. The rest are written the same way and shared when you reserve.</p>
        {[DA, SAE].map((t) => (
          <details key={t.title} className="modset rv">
            <summary><span>{t.title}</span><small>{t.modules.length} modules</small></summary>
            <p className="modset-lead">{t.lead}</p>
            <ol className="modlist">
              {t.modules.map((m) => <li key={m.title}><b>{m.title}</b><ul>{m.points.map((pt) => <li key={pt}>{pt}</li>)}</ul></li>)}
            </ol>
          </details>
        ))}
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
          <article key={c.id} className="chapter rv" id={`partner-${c.id}`}>
            <div className="chapter-head"><img className={c.shape || ''} src={c.logo} alt="" /><div><h3>{c.name}</h3><small>{c.sub}</small></div></div>
            <p className="chapter-body">{c.body}</p>
            <ul className="offers">{c.offers.map((o) => <li key={o}>{o}</li>)}</ul>
            {c.videos?.length ? (
              <div className="marquee" aria-label={`${c.name} videos`}><div className="marquee-track">
                {[...c.videos, ...c.videos].map((v, i) => <figure key={`${v.src}-${i}`} className="mq-item"><video src={v.src} poster={v.poster} muted loop autoPlay playsInline preload={i < 4 ? 'metadata' : 'none'} aria-label={v.cap || ''} /></figure>)}
              </div></div>
            ) : null}
            {c.photos?.length ? (
              <div className="marquee reverse" aria-label={`${c.name} photos`}><div className="marquee-track">
                {[...c.photos, ...c.photos].map((ph, i) => <figure key={`${ph.src}-${i}`} className="mq-item"><img src={ph.src} alt={ph.cap || ''} loading={i < 8 ? 'eager' : 'lazy'} decoding="async" /></figure>)}
              </div></div>
            ) : null}
            <p className="courtesy">Photos and video courtesy of <a href={c.fb} target="_blank" rel="noopener">{c.name}</a>.</p>
          </article>
        ))}
      </section>

      <section className="gp-sec" id="jdev">
        <p className="gp-kicker rv">Beyond the chair</p>
        <h2 className="gp-h2 rv">With <span className="gp-gold">JDev Studio.</span></h2>
        <div className="jdev-head rv"><img className="jdev-logo-white" src="/images/brand/jdev-logo-white.png" alt="JDev Studio" /><img className="jdev-logo-coral" src="/images/brand/jdev-logo-coral.png" alt="JDev Studio" /></div>
        <p className="gp-lead rv">{JDEV.line}</p>
        <div className="jdev-mods">
          {JDEV_MODULES.map((m) => (
            <article key={m.id} className="jdev-mod rv">
              <h3>{m.label}</h3>
              <p className="promise">{m.promise}</p>
              <ul>{m.topics.map((t) => <li key={t}>{t}</li>)}</ul>
              <p className="leave">{m.leave}</p>
              {m.note ? <p className="note">{m.note}</p> : null}
            </article>
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
      </section>

      <section className="gp-sec" id="teach-with-us">
        <p className="gp-kicker rv">Teach with us</p>
        <h2 className="gp-h2 rv">A community of learners. <span className="gp-gold">Not an audience.</span></h2>
        <ul className="creed rv">{MANIFESTO.map((l) => <li key={l}>{l}</li>)}</ul>
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
            <label className="consent"><input type="checkbox" name="rules" /><span>I have read the community rules and I agree: education first, no politics, no praise-seeking, we all keep learning.</span></label>
            {sErr.rules ? <p className="gp-err">{sErr.rules}</p> : null}
            <label className="consent"><input type="checkbox" name="consent" /><span>DentaSource Direct may contact me about teaching at the Training Center.</span></label>
            {sErr.consent ? <p className="gp-err">{sErr.consent}</p> : null}
            {sErr.form ? <p className="gp-err">{sErr.form}</p> : null}
            <button type="submit" className="gp-btn" disabled={pending}>{pending ? 'Sending' : 'Ask to teach with us'}</button>
          </form>
        )}
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
            <div className="gp-field"><span>Tracks you want</span>
              <div className="chk-grid">
                {TRACKS.map((t) => <label key={t.id} className="chk"><input type="checkbox" name={`track_${t.id}`} /><span>{t.label}</span></label>)}
                {JDEV_MODULES.map((m) => <label key={m.id} className="chk"><input type="checkbox" name={`jdev_${m.id}`} /><span>JDev · {m.label}</span></label>)}
              </div>
              {errors.tracks ? <p className="gp-err">{errors.tracks}</p> : null}
            </div>
            <label className="consent"><input type="checkbox" name="consent" /><span>I agree that DentaSource Direct may contact me about the Training Center, products, and promos.</span></label>
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

      <section className="gp-sec" id="privacy">
        <p className="gp-kicker rv">How we handle your details</p>
        <p className="gp-lead rv">{PRIVACY.lead}</p>
        <div className="privacy rv">
          {PRIVACY.items.map((it) => <div key={it.title}><h4>{it.title}</h4><p>{it.text}</p></div>)}
        </div>
      </section>

      <footer className="gp-foot">
        <div className="gp-doors"><a className="gp-btn ghost" href={MESSENGER}>Message us</a><a className="gp-btn ghost" href={FB}>Facebook</a><a className="gp-btn ghost" href="/dentalchairs">ROSON Dental Chairs</a></div>
        <p style={{ marginTop: 16 }}>DentaSource Direct · Pasig, Metro Manila · dentasourcedirect.com</p>
      </footer>
      <GpSky />
    </main>
  );
}
