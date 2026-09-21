'use client';

// /k-clamps — the K-Clamp specimen lab.
// A dark, instrument-tray page: a floating specimen field in the hero, an interactive
// dental arch (tap a tooth → the clamps that fit it), an explorer grid (tap a clamp → the
// arch lights the teeth it fits), kits, a user-story reel and a FAQ. Chrome-free route: it
// sits under the site's global Navbar like every other page (chrome-free list = /spin only).

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { m as motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { clamps, GROUPS, GROUP_ORDER, kits, features, faqs, clampsForTooth, ADULT_TEETH, PRIMARY_TEETH } from '@/data/kclamps';
import { trackContact } from '@/lib/analytics';
import styles from './kclamps.module.css';

const MESSENGER = 'dentasource';

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

/* ------------------------------------------------------------------ */
/* Tooth map — an SVG arch, adult or primary, that lights a set of FDI */
/* ------------------------------------------------------------------ */
function ToothMap({ lit = [], picked = null, onPick, dentition = 'adult', compact = false, color = '#6ee7ff' }) {
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
      const x = cx + rx * Math.cos(a);
      const y = isUpper ? cy + ry * Math.sin(a) : cy - ry * Math.sin(a);
      const rot = (a * 180) / Math.PI + (isUpper ? 90 : -90);
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
      <defs>
        <filter id="kc-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
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
          >
            <rect x={-n.w / 2} y={-n.h / 2} width={n.w} height={n.h} rx={n.type === 'molar' ? 7 : 6} className={styles.toothBody} filter={on || isPicked ? 'url(#kc-glow)' : undefined} />
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
/* Hero specimen field                                                 */
/* ------------------------------------------------------------------ */
const HERO_PICKS = ['56', '14', '212', '2a', 'w8a', '54', '201', '0'];

function Hero({ onExplore }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    my.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  };
  const picks = HERO_PICKS.map((id) => clamps.find((c) => c.id === id)).filter(Boolean);
  // Tiles live in the top band and the right column so they never sit on the copy (left/bottom).
  const layout = [
    { x: '5%', y: '7%', s: 1.0, d: 1.2 },
    { x: '66%', y: '5%', s: 0.9, d: 0.8 },
    { x: '84%', y: '34%', s: 1.15, d: 1.5 },
    { x: '60%', y: '30%', s: 0.75, d: 0.6 },
    { x: '70%', y: '64%', s: 0.95, d: 1.0 },
    { x: '88%', y: '82%', s: 0.8, d: 0.5 },
    { x: '32%', y: '9%', s: 0.7, d: 0.9 },
    { x: '52%', y: '88%', s: 0.8, d: 1.3 },
  ];
  return (
    <section className={styles.hero} onMouseMove={onMove} data-scene-zone="hero">
      <div className={styles.heroField} aria-hidden="true">
        {picks.map((c, i) => (
          <Specimen key={c.id} clamp={c} pos={layout[i]} sx={sx} sy={sy} idx={i} />
        ))}
      </div>
      <div className={styles.heroCopy}>
        <p className={styles.kicker}>Rubber dam clamps · Shinhung, Korea · Exclusive in the Philippines</p>
        <h1 className={styles.heroTitle}>
          <span className={styles.heroK}>K</span>-Clamp
        </h1>
        <p className={styles.heroSub}>
          Forty-six sizes of spring steel, matte or glossy, one for every tooth in the mouth. Tap a clamp and the arch lights up where it belongs.
        </p>
        <div className={styles.stats}>
          <span><b>{clamps.length}</b> sizes</span>
          <span><b>5</b> families</span>
          <span><b>2</b> finishes</span>
          <span><b>121°C</b> autoclavable</span>
        </div>
        <div className={styles.heroCtas}>
          <button type="button" className={styles.btnPrimary} onClick={onExplore}>Explore the set</button>
          <a href="#tooth-map" className={styles.btnGhost}>Start from a tooth</a>
        </div>
      </div>
    </section>
  );
}

function Specimen({ clamp, pos, sx, sy, idx }) {
  const depth = pos.d;
  const tx = useTransform(sx, (v) => v * 14 * depth);
  const ty = useTransform(sy, (v) => v * 10 * depth);
  return (
    <motion.div
      className={styles.specimen}
      style={{ left: pos.x, top: pos.y, x: tx, y: ty, '--s': pos.s, '--c': GROUPS[clamp.group].color }}
      animate={{ y: [0, -10 - idx * 1.5, 0], rotate: [0, idx % 2 ? 2 : -2, 0] }}
      transition={{ duration: 6 + idx * 0.7, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.4 }}
    >
      <img src={clamp.photo} alt="" loading="eager" draggable={false} />
      <span className={styles.specimenTag}>{clamp.label}</span>
    </motion.div>
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
    <motion.button
      type="button"
      id={`clamp-${c.id}`}
      className={`${styles.card} ${active ? styles.cardActive : ''}`}
      style={{ '--c': GROUPS[c.group].color }}
      onClick={() => onOpen(c)}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      layout
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
    </motion.button>
  );
}

function Sheet({ c, list, onClose, onStep, onToothPick }) {
  const g = GROUPS[c.group];
  const dentition = c.group === 'kids' ? 'primary' : 'adult';
  const i = list.findIndex((x) => x.id === c.id);
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
        className={styles.sheet}
        style={{ '--c': g.color }}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`K-Clamp ${c.label}`}
      >
        <div className={styles.sheetBar}>
          <span className={styles.sheetGroup}>{g.label}</span>
          <div className={styles.sheetNav}>
            <button type="button" onClick={() => onStep(-1)} aria-label="Previous clamp">‹</button>
            <span className={styles.mono}>{i + 1} / {list.length}</span>
            <button type="button" onClick={() => onStep(1)} aria-label="Next clamp">›</button>
          </div>
          <button type="button" className={styles.sheetClose} onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className={styles.sheetBody}>
          <div className={styles.sheetPhoto}>
            <img src={c.photo2x} alt={`K-Clamp ${c.label}`} />
            <span className={styles.sheetNum}>{c.label}</span>
          </div>
          <div className={styles.sheetText}>
            <h3 className={styles.sheetTitle}>K-Clamp {c.label}</h3>
            <p className={styles.sheetWhere}>{archLabel(c)}</p>
            <p className={styles.sheetUse}>{c.use}</p>
            <dl className={styles.specs}>
              <div><dt>Wings</dt><dd>{c.winged ? 'Winged' : 'Wingless'}</dd></div>
              <div><dt>Jaws</dt><dd>{c.jaws}</dd></div>
              <div><dt>Finish</dt><dd>Matte or glossy</dd></div>
              <div><dt>Steel</dt><dd>Stainless, 121°C autoclave</dd></div>
            </dl>
            <p className={styles.fitsLabel}>Fits these teeth (FDI). Tap one to see every clamp for it.</p>
            <div className={styles.fits}>
              {c.teeth.map((t) => (
                <button type="button" key={t} onClick={() => onToothPick(t)} title={toothName(t)}>{t}</button>
              ))}
            </div>
            <a href={ask} target="_blank" rel="noopener noreferrer" className={styles.btnPrimary} onClick={() => trackContact({ channel: 'messenger', content_name: `kclamp-${c.id}` })}>
              Ask about the {c.label} on Messenger
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
    <section className={styles.explorer} ref={explorerRef} id="explorer" data-scene-zone="explorer">
      <div className={styles.sectionHead}>
        <p className={styles.kicker}>The set</p>
        <h2 className={styles.h2}>Tap a clamp. See the tooth.</h2>
        <p className={styles.lead}>Every size DentaSource Direct stocks, photographed in our Pasig showroom. Open one for its jaws, its wings and the arch lit where it fits.</p>
      </div>

      <div className={styles.controls}>
        <div className={styles.chips} role="tablist" aria-label="Filter clamps">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={filter === f.id}
              className={`${styles.chip} ${filter === f.id ? styles.chipOn : ''}`}
              style={GROUPS[f.id] ? { '--c': GROUPS[f.id].color } : undefined}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <label className={styles.search}>
          <span className={styles.mono}>#</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Type a number, 14, 56T, D54…" inputMode="search" aria-label="Search clamp number" />
        </label>
      </div>

      {tooth && (
        <div className={styles.toothBanner} style={{ '--c': '#6ee7ff' }}>
          <span>Showing <b>{list.length}</b> clamp{list.length === 1 ? '' : 's'} for tooth <b>{tooth}</b>, the {toothName(tooth)}.</span>
          <button type="button" onClick={() => setTooth(null)}>Clear</button>
        </div>
      )}

      <motion.div className={styles.grid} layout>
        <AnimatePresence initial={false}>
          {list.map((c) => (
            <ClampCard key={c.id} c={c} onOpen={setOpen} active={open?.id === c.id} />
          ))}
        </AnimatePresence>
        {list.length === 0 && <p className={styles.empty}>No clamp matches that. Try a number like 14 or a family chip above.</p>}
      </motion.div>

      <AnimatePresence>
        {open && <Sheet c={open} list={list} onClose={close} onStep={step} onToothPick={pickTooth} />}
      </AnimatePresence>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Tooth-first section                                                 */
/* ------------------------------------------------------------------ */
function ToothFirst({ tooth, setTooth, explorerRef }) {
  const [dentition, setDentition] = useState('adult');
  const fits = tooth ? clampsForTooth(tooth) : [];
  const pick = (t) => {
    setTooth(t);
  };
  const go = () => explorerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return (
    <section className={styles.toothFirst} id="tooth-map" data-scene-zone="map">
      <div className={styles.sectionHead}>
        <p className={styles.kicker}>Start from the tooth</p>
        <h2 className={styles.h2}>Which clamp for tooth 46?</h2>
        <p className={styles.lead}>Tap any tooth on the arch. The clamps made for it line up below, and the explorer filters to them.</p>
      </div>
      <div className={styles.toothFirstBody}>
        <div className={styles.mapCard}>
          <div className={styles.segmented} role="tablist" aria-label="Dentition">
            <button type="button" role="tab" aria-selected={dentition === 'adult'} className={dentition === 'adult' ? styles.segOn : ''} onClick={() => setDentition('adult')}>Adult</button>
            <button type="button" role="tab" aria-selected={dentition === 'primary'} className={dentition === 'primary' ? styles.segOn : ''} onClick={() => setDentition('primary')}>Kids</button>
          </div>
          <ToothMap lit={tooth ? [tooth] : []} picked={tooth} onPick={pick} dentition={dentition} color="#6ee7ff" />
        </div>
        <div className={styles.toothResult}>
          {!tooth && (
            <p className={styles.toothHint}>Nothing picked yet. Try a first molar: 16, 26, 36 or 46 on the adult arch, or 54 to 85 on the kids arch.</p>
          )}
          {tooth && (
            <>
              <p className={styles.toothTitle}><span className={styles.mono}>TOOTH {tooth}</span> · {toothName(tooth)}</p>
              {fits.length === 0 ? (
                <p className={styles.toothHint}>No dedicated K-Clamp for this tooth in the set. For incisors and canines the 210, 211, 212 and 44 are the anterior clamps; message us if you need something specific.</p>
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
              <button type="button" className={styles.btnGhost} onClick={go}>Open these in the explorer</button>
            </>
          )}
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
    <section className={styles.kits} data-scene-zone="kits">
      <div className={styles.sectionHead}>
        <p className={styles.kicker}>How it is sold</p>
        <h2 className={styles.h2}>Kits, sets and single clamps.</h2>
        <p className={styles.lead}>Pricing on reply. Every kit and every single size is stocked at the Pasig showroom, where you can handle the sizes side by side before you choose.</p>
      </div>
      <div className={styles.kitGrid}>
        {kits.map((k) => (
          <article key={k.id} className={styles.kit}>
            <p className={styles.kitCount}>{k.count}</p>
            <h3 className={styles.kitName}>{k.name}</h3>
            <p className={styles.kitBody}>{k.body}</p>
            {k.items.length > 0 && (
              <div className={styles.kitItems}>
                {k.items.map((id) => {
                  const c = clamps.find((x) => x.id === id);
                  return c ? <a key={id} href={`#clamp-${id}`} title={c.use}><img src={c.photo} alt={`K-Clamp ${c.label}`} loading="lazy" /><span>{c.label}</span></a> : null;
                })}
              </div>
            )}
            <a href={messengerUrl(`Hi DSD, I'd like to ask about the ${k.name}.`)} target="_blank" rel="noopener noreferrer" className={styles.kitCta} onClick={() => trackContact({ channel: 'messenger', content_name: `kclamp-${k.id}` })}>Ask about this →</a>
          </article>
        ))}
      </div>
      <figure className={styles.chart}>
        <img src="/images/kclamps/chart.jpg" alt="The whole K-Clamp family on one sheet, grouped molar, partially erupted, premolar, anterior and kids" loading="lazy" />
        <figcaption>The full family on one sheet, as it hangs in our showroom.</figcaption>
      </figure>
    </section>
  );
}

function Why() {
  return (
    <section className={styles.why} data-scene-zone="why">
      <div className={styles.sectionHead}>
        <p className={styles.kicker}>Why this clamp</p>
        <h2 className={styles.h2}>Spring steel that keeps its word.</h2>
        <p className={styles.lead}>K-Clamp is made by Shinhung, a Korean dental manufacturer with decades of instrument making behind it. Four things set it apart on the tray.</p>
      </div>
      <div className={styles.featGrid}>
        {features.map((f, i) => (
          <motion.article key={f.title} className={styles.feat} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ delay: i * 0.08 }}>
            <span className={styles.featIdx}>0{i + 1}</span>
            <h3>{f.title}</h3>
            <p>{f.body}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function Story() {
  return (
    <section className={styles.story} data-scene-zone="story">
      <div className={styles.storyText}>
        <p className={styles.kicker}>From a clinic</p>
        <h2 className={styles.h2}>“K-Clamp user.”</h2>
        <p className={styles.lead}>Dr. Maureen Castillo, owner of Maureen Castillo Dentistry, picking up her set at the showroom. Thirty seconds, no script.</p>
        <Link href="/news" className={styles.btnGhost}>More stories on our news page</Link>
      </div>
      <div className={styles.phone}>
        <video controls playsInline preload="none" poster="/images/kclamps/reel-field-22-poster.jpg">
          <source src="/reels/field-22.mp4" type="video/mp4" />
        </video>
      </div>
    </section>
  );
}

function Faq() {
  const [openIdx, setOpenIdx] = useState(0);
  return (
    <section className={styles.faq} data-scene-zone="faq">
      <div className={styles.sectionHead}>
        <p className={styles.kicker}>Questions dentists ask</p>
        <h2 className={styles.h2}>Before you pick a size.</h2>
      </div>
      <div className={styles.faqList}>
        {faqs.map((f, i) => (
          <div key={f.q} className={`${styles.faqItem} ${openIdx === i ? styles.faqOpen : ''}`}>
            <button type="button" onClick={() => setOpenIdx(openIdx === i ? -1 : i)} aria-expanded={openIdx === i}>
              <span>{f.q}</span><span className={styles.faqPlus} aria-hidden="true">{openIdx === i ? '−' : '+'}</span>
            </button>
            <AnimatePresence initial={false}>
              {openIdx === i && (
                <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                  {f.a}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function KclampsExperience() {
  const explorerRef = useRef(null);
  const [tooth, setTooth] = useState(null);
  const [scene, setScene] = useState('hero');

  useEffect(() => {
    const zones = document.querySelectorAll('[data-scene-zone]');
    if (!zones.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setScene(e.target.getAttribute('data-scene-zone')); });
    }, { rootMargin: '-45% 0px -45% 0px' });
    zones.forEach((z) => io.observe(z));
    return () => io.disconnect();
  }, []);

  // Deep link: /k-clamps#clamp-14 scrolls to the card.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.location.hash.startsWith('#clamp-')) return;
    const el = document.getElementById(window.location.hash.slice(1));
    if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
  }, []);

  return (
    <div className={styles.root} id="top" data-scene={scene}>
      <div className={styles.atmos} aria-hidden="true">
        <div className={styles.grain} />
        <div className={styles.glowA} />
        <div className={styles.glowB} />
        <div className={styles.gridLines} />
      </div>
      <Hero onExplore={() => explorerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })} />
      <ToothFirst tooth={tooth} setTooth={setTooth} explorerRef={explorerRef} />
      <Explorer explorerRef={explorerRef} tooth={tooth} setTooth={setTooth} />
      <Kits />
      <Why />
      <Story />
      <Faq />
      <footer className={styles.foot}>
        <div>
          <p className={styles.kicker}>DentaSource Direct</p>
          <p className={styles.footLine}>Exclusive Philippine distributor for ROSON dental chairs, K-Clamp and Denjoy. Showroom at 610 C. Maybunga Rd, Pasig City, open Monday to Sunday.</p>
          <div className={styles.footLinks}>
            <Link href="/dentalchairs">Dental Chairs</Link>
            <Link href="/denjoy">Denjoy</Link>
            <Link href="/products">Equipment</Link>
            <Link href="/contact">Showroom</Link>
            <Link href="/news">News</Link>
          </div>
        </div>
        <a href={messengerUrl("Hi DSD, I'd like to ask about K-Clamp.")} target="_blank" rel="noopener noreferrer" className={styles.btnPrimary} onClick={() => trackContact({ channel: 'messenger', content_name: 'kclamp-footer' })}>Ask about K-Clamp on Messenger</a>
      </footer>
      <div className={styles.stickyCta}>
        <a href={messengerUrl("Hi DSD, I'd like to ask about K-Clamp.")} target="_blank" rel="noopener noreferrer" onClick={() => trackContact({ channel: 'messenger', content_name: 'kclamp-sticky' })}>Ask about K-Clamp</a>
      </div>
    </div>
  );
}
