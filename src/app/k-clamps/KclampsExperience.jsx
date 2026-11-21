'use client';

// /k-clamps — the K-Clamp finder.
//
// ☠️ LIGHT ONLY, AND NOTHING DRAWN BEHIND THE PAGE (Jarich, 2026-11-22: "the K-Clamps as
// well"). The route is locked to the light register in src/cinema/theme/theme.js
// (LIGHT_ONLY_ROUTES). The dark "specimen lab" is gone: no grain, no glows, no grid lines, no
// floating tiles. What stays is the part that earns the page: an interactive dental arch (tap
// a tooth, see the clamps that fit it) and the explorer (tap a clamp, see the teeth it fits).
//
// Type and buttons come from the chair design system (src/components/chair/chair.css, loaded
// by page.js, which also wraps this in `.ch` and adds the showroom door). Everything specific
// to the finder is in kclamps.module.css.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { m as motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import { clamps, GROUPS, GROUP_ORDER, kits, features, faqs, clampsForTooth, ADULT_TEETH, PRIMARY_TEETH } from '@/data/kclamps';
import { trackContact } from '@/lib/analytics';
import ClientMarquee from '@/components/clients/ClientMarquee';
import RingWrite from '@/components/clients/RingWrite';
import { brandStrip, ownCount, showsIn } from '@/lib/clients/brandMedia';
import styles from './kclamps.module.css';

const STRIP = brandStrip('kclamp');
// a K-Clamp headline needs six of the strip's moments to show K-Clamps; seven words either way
const STRIP_OWN = ownCount(STRIP, 'kclamp') >= 6;
const STRIP_SHOWS = showsIn(STRIP);

const MESSENGER = 'dentasource';
const PICK_COLOR = '#0e7c5a';

function messengerUrl(text) {
  return `https://m.me/${MESSENGER}?ref=${encodeURIComponent(text)}`;
}

function toothType(fdi) {
  const d = fdi % 10;
  const primary = fdi >= 51;
  if (d <= 2) return 'incisor';
  if (d === 3) return 'canine';
  if (primary) return 'molar';
  if (d <= 5) return 'premolar';
  return 'molar';
}

function toothName(fdi) {
  const q = Math.floor(fdi / 10);
  const d = fdi % 10;
  const primary = q >= 5;
  const side = [1, 4, 5, 8].includes(q) ? 'right' : 'left';
  const arch = [1, 2, 5, 6].includes(q) ? 'upper' : 'lower';
  const names = primary
    ? ['', 'central incisor', 'lateral incisor', 'canine', 'first primary molar', 'second primary molar']
    : ['', 'central incisor', 'lateral incisor', 'canine', 'first premolar', 'second premolar', 'first molar', 'second molar', 'third molar'];
  return `${arch} ${side} ${names[d] || ''}`.trim();
}

function archLabel(c) {
  const g = c.group;
  const where = g === 'kids' ? 'primary molars' : g === 'tiger' ? 'molars' : g === 'anterior' ? 'anteriors' : g === 'premolar' ? 'premolars' : 'molars';
  const arch = c.arch === 'upper' ? 'Upper ' : c.arch === 'lower' ? 'Lower ' : '';
  return `${arch}${where}`.replace(/^./, (s) => s.toUpperCase());
}

function Head({ kicker, title, line, children }) {
  return (
    <div className="ch-head" data-reveal>
      <p className="ch-kicker">{kicker}</p>
      {children || <h2 className="ch-h2">{title}</h2>}
      {line ? <p className="ch-line">{line}</p> : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tooth map — an SVG arch, adult or primary, that lights a set of FDI */
/* ------------------------------------------------------------------ */
function ToothMap({ lit = [], picked = null, onPick, dentition = 'adult', compact = false, color = PICK_COLOR }) {
  const teeth = dentition === 'primary' ? PRIMARY_TEETH : ADULT_TEETH;
  const per = teeth.length / 2;
  const W = 400;
  const cx = 200;
  const upper = teeth.slice(0, per);
  const lower = teeth.slice(per);
  const litSet = useMemo(() => new Set(lit), [lit]);

  const place = (list, isUpper) => {
    const rx = dentition === 'primary' ? 132 : 158;
    const ry = dentition === 'primary' ? 104 : 126;
    const cy = isUpper ? 172 : 238;
    return list.map((fdi, i) => {
      const t = list.length === 1 ? 0.5 : i / (list.length - 1);
      const a = Math.PI + t * Math.PI;
      // Rounded: Node and the browser disagree in the last digits of sin and cos, and an
      // unrounded transform makes the server and client markup differ (a hydration mismatch).
      const r2 = (v) => Math.round(v * 100) / 100;
      const x = r2(cx + rx * Math.cos(a));
      const y = r2(isUpper ? cy + ry * Math.sin(a) : cy - ry * Math.sin(a));
      const rot = r2((a * 180) / Math.PI + (isUpper ? 90 : -90));
      const type = toothType(fdi);
      const w = type === 'molar' ? 24 : type === 'premolar' ? 19 : type === 'canine' ? 17 : 15;
      const h = type === 'molar' ? 30 : 28;
      return { fdi, x, y, rot, w, h, type };
    });
  };

  const nodes = [...place(upper, true), ...place(lower, false)];

  return (
    <svg
      viewBox={`0 0 ${W} 410`}
      className={`${styles.arch} ${compact ? styles.archCompact : ''}`}
      role="img"
      aria-label={`Dental arch, ${dentition} dentition${lit.length ? `, highlighting teeth ${lit.join(', ')}` : ''}`}
    >
      <text x={cx} y={30} className={styles.archTag} textAnchor="middle">UPPER</text>
      <text x={cx} y={398} className={styles.archTag} textAnchor="middle">LOWER</text>
      <text x={22} y={208} className={styles.archTag}>R</text>
      <text x={370} y={208} className={styles.archTag}>L</text>
      {nodes.map((n) => {
        const on = litSet.has(n.fdi);
        const isPicked = picked === n.fdi;
        return (
          <g
            key={n.fdi}
            transform={`translate(${n.x} ${n.y}) rotate(${n.rot})`}
            className={`${styles.tooth} ${on ? styles.toothOn : ''} ${isPicked ? styles.toothPicked : ''}`}
            style={on || isPicked ? { '--lit': color } : undefined}
            onClick={onPick ? () => onPick(n.fdi) : undefined}
            role={onPick ? 'button' : undefined}
            tabIndex={onPick ? 0 : undefined}
            onKeyDown={onPick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPick(n.fdi); } } : undefined}
            aria-label={onPick ? `Tooth ${n.fdi}, ${toothName(n.fdi)}` : undefined}
            aria-pressed={onPick ? isPicked : undefined}
          >
            <rect x={-n.w / 2} y={-n.h / 2} width={n.w} height={n.h} rx={n.type === 'molar' ? 7 : 6} className={styles.toothBody} />
            {n.type === 'molar' && <path d={`M${-n.w / 2 + 5} ${-4} h${n.w - 10} M${-n.w / 2 + 5} ${4} h${n.w - 10}`} className={styles.toothLine} />}
            {n.type === 'premolar' && <path d={`M${-n.w / 2 + 5} 0 h${n.w - 10}`} className={styles.toothLine} />}
            <text transform={`rotate(${-n.rot})`} y={4} textAnchor="middle" className={styles.toothNum}>{n.fdi}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Hero: the name, one line, the doors, and six clamps on a tray       */
/* ------------------------------------------------------------------ */
const HERO_PICKS = ['56', '14', '212', '2a', 'w8a', '54'];

function Hero({ onExplore }) {
  const picks = HERO_PICKS.map((id) => clamps.find((c) => c.id === id)).filter(Boolean);
  return (
    <section className={styles.hero} aria-labelledby="kc-title">
      <div className={`ch-wrap ${styles.heroGrid}`}>
        <div>
          <p className="ch-kicker ch-rise" style={{ '--d': 0 }}>Exclusive K-Clamp distributor in the Philippines</p>
          <h1 id="kc-title" className="ch-h1 ch-rise" style={{ '--d': 1 }}>K-Clamp rubber dam clamps</h1>
          <p className="ch-line ch-lead ch-rise" style={{ '--d': 2 }}>
            Forty-six sizes by Shinhung of Korea, in matte or glossy stainless steel. Tap a tooth and see which clamps fit it.
          </p>
          <div className={`ch-actions ch-rise ${styles.heroCtas}`} style={{ '--d': 3 }}>
            <a href="#tooth-map" className="lg lg-primary">Start from a tooth</a>
            <button type="button" className="lg" onClick={onExplore}>See all {clamps.length} sizes</button>
          </div>
        </div>
        <ul className={`${styles.tray} ch-settle`} aria-label="Six of the K-Clamp sizes">
          {picks.map((c) => (
            <li key={c.id}>
              <a href={`#clamp-${c.id}`} className={styles.trayItem} style={{ '--c': GROUPS[c.group].color }}>
                <span className={styles.trayPhoto}><img src={c.photo2x} alt={`K-Clamp ${c.label}`} loading="eager" draggable={false} /></span>
                <span className={styles.trayMeta}>
                  <b>{c.label}</b>
                  <small>{GROUPS[c.group].label}</small>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Glance() {
  const items = [
    { value: String(clamps.length), label: 'sizes, adult and pediatric' },
    { value: String(GROUP_ORDER.length), label: 'families, from molar to kids' },
    { value: '2', label: 'finishes: matte or glossy' },
    { value: '121°C', label: 'autoclavable stainless steel' },
  ];
  return (
    <section className="ch-glance-band" aria-label="At a glance">
      <dl className="ch-wrap ch-glance" data-reveal>
        {items.map((g) => (
          <div key={g.label} className="ch-glance-item">
            <dd>{g.value}</dd>
            <dt>{g.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Explorer                                                            */
/* ------------------------------------------------------------------ */
const FILTERS = [
  { id: 'all', label: 'All' },
  ...GROUP_ORDER.map((g) => ({ id: g, label: GROUPS[g].short })),
  { id: 'wingless', label: 'Wingless' },
];

function ClampCard({ c, onOpen, active }) {
  return (
    <button
      type="button"
      id={`clamp-${c.id}`}
      className={`${styles.card} ${active ? styles.cardActive : ''}`}
      style={{ '--c': GROUPS[c.group].color }}
      onClick={() => onOpen(c)}
      aria-label={`K-Clamp ${c.label}: ${archLabel(c)}`}
    >
      <span className={styles.cardPhoto}>
        <img src={c.photo} alt="" loading="lazy" />
      </span>
      <span className={styles.cardMeta}>
        <span className={styles.cardNum}>{c.label}</span>
        <span className={styles.cardWhere}>{archLabel(c)}</span>
      </span>
      <span className={styles.cardDot} aria-hidden="true" />
    </button>
  );
}

function Sheet({ c, list, onClose, onStep, onToothPick }) {
  const g = GROUPS[c.group];
  const dentition = c.group === 'kids' ? 'primary' : 'adult';
  const i = list.findIndex((x) => x.id === c.id);
  const sheetRef = useRef(null);
  // Focus moves into the sheet when it opens and back to the card that opened it on close.
  useEffect(() => {
    const opener = document.activeElement;
    sheetRef.current?.focus({ preventScroll: true });
    return () => { if (opener && document.contains(opener)) opener.focus({ preventScroll: true }); };
  }, []);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onStep(1);
      if (e.key === 'ArrowLeft') onStep(-1);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    document.documentElement.dataset.kcSheet = '1';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; delete document.documentElement.dataset.kcSheet; };
  }, [onClose, onStep]);
  const ask = messengerUrl(`Hi DSD, I'd like to ask about the K-Clamp ${c.label} (${archLabel(c).toLowerCase()}).`);
  return (
    <motion.div className={styles.sheetBackdrop} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.aside
        ref={sheetRef}
        tabIndex={-1}
        className={styles.sheet}
        style={{ '--c': g.color }}
        initial={{ y: 28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 28, opacity: 0 }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`K-Clamp ${c.label}`}
      >
        <div className={styles.sheetBar}>
          <span className={styles.sheetGroup}>{g.label}</span>
          <div className={styles.sheetNav}>
            <button type="button" onClick={() => onStep(-1)} aria-label="Previous clamp"><ChevronLeft size={18} aria-hidden="true" /></button>
            <span className={styles.count}>{i + 1} of {list.length}</span>
            <button type="button" onClick={() => onStep(1)} aria-label="Next clamp"><ChevronRight size={18} aria-hidden="true" /></button>
          </div>
          <button type="button" className={styles.sheetClose} onClick={onClose} aria-label="Close"><X size={17} aria-hidden="true" /></button>
        </div>
        <div className={styles.sheetBody}>
          <div className={styles.sheetPhoto}>
            <img src={c.photo2x} alt={`K-Clamp ${c.label}`} />
          </div>
          <div className={styles.sheetText}>
            <p className={styles.sheetWhere}>{archLabel(c)}</p>
            <h3 className={styles.sheetTitle}>K-Clamp {c.label}</h3>
            <p className={styles.sheetUse}>{c.use}</p>
            <dl className={styles.specs}>
              <div><dt>Wings</dt><dd>{c.winged ? 'Winged' : 'Wingless'}</dd></div>
              <div><dt>Jaws</dt><dd>{c.jaws}</dd></div>
              <div><dt>Finish</dt><dd>Matte or glossy</dd></div>
              <div><dt>Steel</dt><dd>Stainless, 121°C autoclave</dd></div>
            </dl>
            <p className={styles.fitsLabel}>Fits these teeth (FDI numbers). Tap one to see every clamp for it.</p>
            <div className={styles.fits}>
              {c.teeth.map((t) => (
                <button type="button" key={t} onClick={() => onToothPick(t)} title={toothName(t)}>{t}</button>
              ))}
            </div>
            <a href={ask} target="_blank" rel="noopener noreferrer" className="lg lg-primary" onClick={() => trackContact({ channel: 'messenger', content_name: `kclamp-${c.id}` })}>
              Ask about the {c.label}
            </a>
          </div>
          <div className={styles.sheetMap}>
            <ToothMap lit={c.teeth} dentition={dentition} compact color={g.color} />
          </div>
        </div>
      </motion.aside>
    </motion.div>
  );
}

function Explorer({ explorerRef, tooth, setTooth }) {
  const [filter, setFilter] = useState('all');
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(null);

  const list = useMemo(() => {
    let l = clamps;
    if (tooth) l = clampsForTooth(tooth);
    if (filter === 'wingless') l = l.filter((c) => !c.winged);
    else if (filter !== 'all') l = l.filter((c) => c.group === filter);
    if (q.trim()) {
      const n = q.trim().toLowerCase().replace(/^#/, '');
      l = l.filter((c) => c.label.toLowerCase().includes(n) || c.id.includes(n));
    }
    return l;
  }, [filter, q, tooth]);

  const step = useCallback((d) => {
    setOpen((cur) => {
      if (!cur) return cur;
      const i = list.findIndex((x) => x.id === cur.id);
      return list[(i + d + list.length) % list.length] || cur;
    });
  }, [list]);

  const close = useCallback(() => setOpen(null), []);

  const pickTooth = (t) => {
    setOpen(null);
    setFilter('all');
    setQ('');
    setTooth(t);
    explorerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="ch-section" ref={explorerRef} id="explorer">
      <div className="ch-wrap">
        <Head
          kicker="The full set"
          title="Tap a clamp. See the tooth."
          line="Every size we stock, photographed in our Pasig showroom. Open one for its jaws, its wings and the teeth it fits."
        />

        <div className={styles.controls}>
          <div className={styles.chips} role="group" aria-label="Filter clamps by family">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                aria-pressed={filter === f.id}
                className={`${styles.chip} ${filter === f.id ? styles.chipOn : ''}`}
                style={GROUPS[f.id] ? { '--c': GROUPS[f.id].color } : undefined}
                onClick={() => setFilter(f.id)}
              >
                {GROUPS[f.id] ? <span className={styles.chipDot} aria-hidden="true" /> : null}
                {f.label}
              </button>
            ))}
          </div>
          <label className={styles.search}>
            <Search size={16} aria-hidden="true" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Type a number: 14, 56T, D54" inputMode="search" aria-label="Search by clamp number" />
          </label>
        </div>

        {tooth && (
          <div className={styles.toothBanner} role="status">
            <span>Showing <b>{list.length}</b> clamp{list.length === 1 ? '' : 's'} for tooth <b>{tooth}</b>, the {toothName(tooth)}.</span>
            <button type="button" onClick={() => setTooth(null)}>Show all</button>
          </div>
        )}

        <div className={styles.grid}>
          {list.map((c) => (
            <ClampCard key={c.id} c={c} onOpen={setOpen} active={open?.id === c.id} />
          ))}
          {list.length === 0 && <p className={styles.empty}>No clamp matches that. Try a number like 14, or a family above.</p>}
        </div>
      </div>

      {/* The sheet is portalled to <body>: the page root is its own stacking context, and a
          dialog left inside it would open underneath the site's sticky navigation. */}
      {typeof document !== 'undefined' ? createPortal(
        <AnimatePresence>
          {open && <Sheet c={open} list={list} onClose={close} onStep={step} onToothPick={pickTooth} />}
        </AnimatePresence>,
        document.body,
      ) : null}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Tooth-first section                                                 */
/* ------------------------------------------------------------------ */
function ToothFirst({ tooth, setTooth, explorerRef }) {
  const [dentition, setDentition] = useState('adult');
  const fits = tooth ? clampsForTooth(tooth) : [];
  const go = () => explorerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return (
    <section className="ch-section ch-band" id="tooth-map">
      <div className="ch-wrap">
        <Head
          kicker="Start from the tooth"
          title="Which clamp for tooth 46?"
          line="Tap any tooth on the arch. The clamps made for it appear beside it, and the full set below filters to match."
        />
        <div className={styles.toothFirstBody}>
          <div className={styles.mapCard}>
            <div className={styles.segmented} role="group" aria-label="Dentition">
              <button type="button" aria-pressed={dentition === 'adult'} className={dentition === 'adult' ? styles.segOn : ''} onClick={() => setDentition('adult')}>Adult</button>
              <button type="button" aria-pressed={dentition === 'primary'} className={dentition === 'primary' ? styles.segOn : ''} onClick={() => setDentition('primary')}>Kids</button>
            </div>
            <ToothMap lit={tooth ? [tooth] : []} picked={tooth} onPick={setTooth} dentition={dentition} />
          </div>
          <div className={styles.toothResult} aria-live="polite">
            {!tooth && (
              <p className={styles.toothHint}>Nothing picked yet. Try a first molar: 16, 26, 36 or 46 on the adult arch, or 54 to 85 on the kids arch.</p>
            )}
            {tooth && (
              <>
                <p className={styles.toothTitle}><span>Tooth {tooth}</span>{toothName(tooth)}</p>
                {fits.length === 0 ? (
                  <p className={styles.toothHint}>There is no dedicated K-Clamp for this tooth in the set. For incisors and canines, the 210, 211, 212 and 44 are the anterior clamps. Message us if you need something specific.</p>
                ) : (
                  <ul className={styles.fitList}>
                    {fits.map((c) => (
                      <li key={c.id} style={{ '--c': GROUPS[c.group].color }}>
                        <img src={c.photo} alt="" loading="lazy" />
                        <span><b>{c.label}</b><small>{c.use}</small></span>
                      </li>
                    ))}
                  </ul>
                )}
                <div><button type="button" className="lg" onClick={go}>See these in the full set</button></div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Kits · Why · Story · FAQ                                            */
/* ------------------------------------------------------------------ */
function Kits() {
  return (
    <section className="ch-section ch-band" id="kits">
      <div className="ch-wrap">
        <Head
          kicker="How it is sold"
          title="Kits, sets and single clamps"
          line="Every kit and every single size is stocked at our Pasig showroom, where you can handle the sizes side by side. Message us for a quote."
        />
        <div className={styles.kitGrid}>
          {kits.map((k, i) => (
            <article key={k.id} className={styles.kit} data-reveal style={{ '--i': i % 2 }}>
              <p className={styles.kitCount}>{k.count}</p>
              <h3 className="ch-h3">{k.name}</h3>
              <p className={styles.kitBody}>{k.body}</p>
              {k.items.length > 0 && (
                <div className={styles.kitItems}>
                  {k.items.map((id) => {
                    const c = clamps.find((x) => x.id === id);
                    return c ? <a key={id} href={`#clamp-${id}`} title={c.use}><img src={c.photo} alt={`K-Clamp ${c.label}`} loading="lazy" /><span>{c.label}</span></a> : null;
                  })}
                </div>
              )}
              <a href={messengerUrl(`Hi DSD, I'd like to ask about the ${k.name}.`)} target="_blank" rel="noopener noreferrer" data-tracked="1" className={styles.kitCta} onClick={() => trackContact({ channel: 'messenger', content_name: `kclamp-${k.id}` })}>
                Ask about this <ArrowRight size={16} aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>
        <figure className={styles.chart} data-reveal>
          <img src="/images/kclamps/chart.jpg" alt="The whole K-Clamp family on one sheet, grouped molar, partially erupted, premolar, anterior and kids" loading="lazy" width="1080" height="1080" />
          <figcaption>The full family on one sheet, as it hangs in our showroom.</figcaption>
        </figure>
      </div>
    </section>
  );
}

function Why() {
  return (
    <section className="ch-section" id="why">
      <div className="ch-wrap">
        <Head
          kicker="Why this clamp"
          title="Steel that keeps its spring"
          line="K-Clamp is made by Shinhung, a Korean dental manufacturer with decades of instrument making behind it. Four things set it apart on the tray."
        />
        <div className={styles.featGrid}>
          {features.map((f, i) => (
            <article key={f.title} className={styles.feat} data-reveal style={{ '--i': i % 2 }}>
              <span className="ch-tile-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="ch-h3">{f.title}</h3>
              <p>{f.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Story() {
  return (
    <>
      <section className="ch-section ch-band" id="story">
        <div className={`ch-wrap ${styles.story}`}>
          <div data-reveal>
            <p className="ch-kicker">From a clinic</p>
            <h2 className="ch-h2">“K-Clamp user.”</h2>
            <p className="ch-line">Dr. Maureen Castillo, owner of Maureen Castillo Dentistry, picking up her set at the showroom. Thirty seconds, no script.</p>
            <div className="ch-actions"><Link href="/news" prefetch={false} className="lg">More stories on our news page</Link></div>
          </div>
          <div className={styles.phone} data-reveal style={{ '--i': 1 }}>
            <video controls playsInline preload="none" poster="/images/kclamps/reel-field-22-poster.jpg">
              <source src="/reels/field-22.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>
      {/* ☠️ ONE VIDEO WAS THE WHOLE STORY; NOW IT LEADS A MARQUEE (Jarich 2026-10-12: "the k clamp
          has one already but lets improve it add marquee as well"). Dr. Castillo's clip stays
          first; the strip under it is the K-Clamp counter at our booths. */}
      {STRIP.length ? (
        <section className="ch-section" aria-label={STRIP_OWN ? 'Doctors with K-Clamps at our booth' : 'Doctors at our booth'}>
          <div className="ch-wrap">
            <div className="ch-head ch-head-center" data-reveal>
              <p className="ch-kicker">From our booth</p>
              <RingWrite as="h2" className="ch-h2" text={STRIP_OWN ? 'Doctors at the K-Clamp counter, all smiles' : 'The doctors who stopped at our booth'} />
              <p className="ch-line">
                {STRIP_OWN ? 'The K-Clamp counter' : 'Our booth'}
                {STRIP_SHOWS ? ` at ${STRIP_SHOWS}` : ''}. Tap any photo.
              </p>
            </div>
          </div>
          <ClientMarquee items={STRIP} label={STRIP_OWN ? 'Doctors with K-Clamps at our booth' : 'Doctors at our booth'} />
        </section>
      ) : null}
    </>
  );
}

function Faq() {
  return (
    <section className="ch-section ch-band" id="questions">
      <div className={`ch-wrap ${styles.faq}`}>
        <Head kicker="Questions dentists ask" title="Before you pick a size" />
        <div className={styles.faqList} data-reveal style={{ '--i': 1 }}>
          {faqs.map((f, i) => (
            <details key={f.q} open={i === 0}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function KclampsExperience() {
  const explorerRef = useRef(null);
  const [tooth, setTooth] = useState(null);

  // Deep link: /k-clamps#clamp-14 scrolls to the card.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.location.hash.startsWith('#clamp-')) return;
    const el = document.getElementById(window.location.hash.slice(1));
    if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
  }, []);

  const ask = messengerUrl("Hi DSD, I'd like to ask about K-Clamp.");

  return (
    <div className={styles.root} id="top">
      <Hero onExplore={() => explorerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })} />
      <Glance />
      <ToothFirst tooth={tooth} setTooth={setTooth} explorerRef={explorerRef} />
      <Explorer explorerRef={explorerRef} tooth={tooth} setTooth={setTooth} />
      <Kits />
      <Why />
      <Story />
      <Faq />
      <div className={styles.stickyCta}>
        <a href={ask} target="_blank" rel="noopener noreferrer" data-tracked="1" onClick={() => trackContact({ channel: 'messenger', content_name: 'kclamp-sticky' })}>Ask about K-Clamp</a>
      </div>
    </div>
  );
}
