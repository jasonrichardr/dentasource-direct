'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { TRACKS, PARTNERS, REELS, PHOTOS } from '@/data/growth';
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
        <a className="gp-brand" href="/"><img src="/images/brand/dsd-mark.png" alt="" /><span><b>DentaSource Direct</b><small>Training Center</small></span></a>
        <a className="gp-btn" href="#reserve">Reserve my seat</a>
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
            <span className="pill"><img src="/images/brand/denjoy-logo-final.png" alt="Denjoy" /></span>
            <span className="pill"><img src="/gp/logos/cred-orthostrategy.png" alt="Orthostrategy Study Group" /></span>
            <span className="pill"><img src="/gp/logos/cred-creststudy-round.png" alt="Crest Study Group" /></span>
          </div>
        </div>
      </section>

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

      <section className="gp-sec" id="partners">
        <p className="gp-kicker rv">Growth Partners teaching with us</p>
        <h2 className="gp-h2 rv">You do not learn from a brand. <span className="gp-gold">You learn from people.</span></h2>
        <div className="partners">
          {PARTNERS.map((p) => (
            <div key={p.name} className="partner rv"><img className={p.shape} src={p.logo} alt="" /><b>{p.name}</b><small>{p.sub}</small></div>
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

      <footer className="gp-foot">
        <div className="gp-doors"><a className="gp-btn ghost" href={MESSENGER}>Message us</a><a className="gp-btn ghost" href={FB}>Facebook</a><a className="gp-btn ghost" href="/dentalchairs">ROSON Dental Chairs</a></div>
        <p style={{ marginTop: 16 }}>DentaSource Direct · Pasig, Metro Manila · dentasourcedirect.com</p>
      </footer>
    </main>
  );
}
