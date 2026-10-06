// The sections of the shared chair page, in page order. Server components: the only client
// pieces are PhotoSwitcher (the colorway and delivery choosers), ScrollFx (reveal, parallax,
// tilt) and SpecGate (the sign-in wall that already guarded the spec table).
//
// Nothing in this file writes copy. Every visible word arrives in the `chair` object from
// src/data/chairs/<model>.js.

import Image from 'next/image';
import { MapPin, Clock } from 'lucide-react';
import SpecGate from '@/components/SpecGate';
import PhotoSwitcher from './PhotoSwitcher';
import { Stars, SectionHead, Actions, IconItem } from './parts';

/* ── 1. hero: the chair, its name, one line, the colorways, the doors ─────────────── */
export function ChairHero({ chair }) {
  const h = chair.hero;
  return (
    <section className="ch-hero" aria-labelledby="ch-title">
      <div className="ch-wrap ch-hero-grid">
        <div className="ch-hero-copy">
          <p className="ch-kicker ch-rise" style={{ '--d': 0 }}>{h.kicker}</p>
          <h1 id="ch-title" className="ch-h1 ch-rise" style={{ '--d': 1 }}>{h.title}</h1>
          <p className="ch-line ch-rise" style={{ '--d': 2 }}>{h.line}</p>
        </div>
        <div className="ch-hero-stage ch-settle">
          <PhotoSwitcher
            options={h.colorways.options}
            initial={h.colorways.initial}
            mode="swatch"
            label={h.colorways.label}
            note={h.colorways.note}
            altPrefix={`${chair.name} in`}
            sizes="(max-width: 960px) calc(100vw - 32px), 680px"
            preload
            float
            sweep
          />
        </div>
        <div className="ch-hero-actions ch-rise" style={{ '--d': 3 }}>
          <Actions ctas={h.ctas} />
          <Stars items={h.stars} />
        </div>
      </div>
    </section>
  );
}

/* ── 2. proof: the one number that earns a band of its own ─────────────────────────── */
export function ProofBand({ proof }) {
  if (!proof) return null;
  return (
    <section className="ch-section" aria-label={proof.kicker}>
      <div className="ch-wrap">
        <div className="ch-proof lg-on-dark" data-reveal>
          <div className="ch-proof-grid">
            <div>
              <p className="ch-kicker">{proof.kicker}</p>
              <p className="ch-stat">
                <span className="ch-sr">{proof.stat}</span>
                {/* the figure arrives a character at a time; screen readers get it whole */}
                {Array.from(proof.stat).map((c, k) => (
                  <span key={`${c}-${k}`} className="ch-stat-ch" style={{ '--k': k }} aria-hidden="true">{c}</span>
                ))}
              </p>
              <p className="ch-stat-caption">{proof.statCaption}</p>
            </div>
            <div>
              <h2 className="ch-h2">{proof.title}</h2>
              <p className="ch-line">{proof.line}</p>
              <Stars items={proof.stars} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── 3. why it works: a bento of the real detail photographs ───────────────────────── */
function FeatureTile({ item, index }) {
  const p = item.photo;
  const cover = p.fit === 'cover';
  return (
    <article className="ch-tile" data-reveal style={{ '--i': index % 3 }}>
      <div className="ch-mat">
        <div className={`ch-plx${cover ? ' ch-plx-cover' : ''}`} data-parallax="0.05">
          <Image
            src={p.src}
            alt={p.alt}
            fill
            sizes="(max-width: 720px) calc(100vw - 52px), (max-width: 1200px) 58vw, 680px"
            quality={85}
          />
        </div>
      </div>
      <div className="ch-tile-copy">
        <span className="ch-tile-num" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
        <h3 className="ch-h3">{item.title}</h3>
        <p className="ch-line">{item.line}</p>
      </div>
    </article>
  );
}

export function FeatureStory({ chair }) {
  const f = chair.features;
  if (!f) return null;
  const d = f.delivery;
  return (
    <section className="ch-section" id="why-it-works">
      <div className="ch-wrap">
        <SectionHead kicker={f.kicker} title={f.title} line={f.line} />
        <div className="ch-bento">
          {f.items.map((item, i) => <FeatureTile key={item.key} item={item} index={i} />)}
        </div>

        {d ? (
          <div className="ch-split">
            <div data-reveal>
              <p className="ch-kicker">{d.kicker}</p>
              <h3 className="ch-h2">{d.title}</h3>
              <p className="ch-line">{d.line}</p>
            </div>
            <div data-reveal style={{ '--i': 1 }}>
              <PhotoSwitcher
                options={d.options}
                initial={d.initial}
                mode="segment"
                label={d.title}
                altPrefix={`${chair.name},`}
                sizes="(max-width: 900px) calc(100vw - 32px), 680px"
              />
            </div>
          </div>
        ) : null}

        {f.extras?.items?.length ? (
          <div className="ch-extras" data-reveal>
            <h3 className="ch-extras-title">{f.extras.title}</h3>
            <ul className="ch-iconlist ch-iconlist-4">
              {f.extras.items.map((it) => <IconItem key={it.title} item={it} />)}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}

/* ── 4. comfort: the three upholsteries, and the stool that comes with it ──────────── */
export function Comfort({ comfort }) {
  if (!comfort) return null;
  return (
    <section className="ch-section" id="comfort">
      <div className="ch-wrap">
        <SectionHead kicker={comfort.kicker} title={comfort.title} line={comfort.line} />
        <div className="ch-comfort">
          <div className="ch-swatchrow">
            {comfort.upholstery.map((u, i) => (
              <figure key={u.name} className="ch-leather" data-reveal style={{ '--i': i }}>
                <div className="ch-mat">
                  <div className="ch-plx ch-plx-cover" data-parallax="0.04">
                    <Image src={u.src} alt={u.alt} fill sizes="(max-width: 960px) 31vw, 280px" quality={75} />
                  </div>
                </div>
                <figcaption>{u.name}</figcaption>
              </figure>
            ))}
          </div>
          {comfort.stool ? (
            <div className="ch-stool" data-reveal style={{ '--i': 2 }}>
              <h3 className="ch-h3">{comfort.stool.title}</h3>
              <Stars items={comfort.stool.stars} className="ch-stars-sm" />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/* ── 5. specs: still behind SpecGate, now readable in grouped cards ────────────────── */
function SpecSheet({ specs }) {
  return (
    <div>
      <div className="ch-specgrid">
        {specs.groups.map((g) => (
          <div key={g.label} className="ch-specgroup">
            <h3>{g.label}</h3>
            <dl className="ch-dl">
              {g.rows.map(([k, v]) => (
                <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
              ))}
            </dl>
          </div>
        ))}
      </div>
      {specs.standards?.length ? (
        <ul className="ch-chips" aria-label="Compliance and standards">
          {specs.standards.map((s) => <li key={s} className="ch-chip">{s}</li>)}
        </ul>
      ) : null}
    </div>
  );
}

export function Specs({ specs }) {
  if (!specs) return null;
  return (
    <section className="ch-section ch-specs" id="specs">
      <div className="ch-wrap">
        <SectionHead kicker={specs.kicker} title={specs.title} line={specs.line} />
        <SpecGate><SpecSheet specs={specs} /></SpecGate>
      </div>
    </section>
  );
}

/* ── 6. in the box, and the warranty, side by side ─────────────────────────────────── */
export function BoxAndWarranty({ box, warranty }) {
  if (!box && !warranty) return null;
  return (
    <section className="ch-section" id="in-the-box">
      <div className="ch-wrap ch-boxgrid">
        {box ? (
          <div>
            <SectionHead kicker={box.kicker} title={box.title} line={box.line} />
            <ul className="ch-iconlist" data-reveal>
              {box.items.map((it) => <IconItem key={it.title} item={it} />)}
            </ul>
          </div>
        ) : null}
        {warranty ? (
          <div id="warranty">
            <SectionHead kicker={warranty.kicker} title={warranty.title} line={warranty.line} />
            <ul className="ch-warranty" data-reveal>
              {warranty.rows.map((r) => (
                <li key={r.part}>
                  <span className="ch-warranty-part">
                    {r.part}
                    {r.note ? <span className="ch-warranty-note">{r.note}</span> : null}
                  </span>
                  <span className="ch-warranty-term">{r.term}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}

/* ── 7. the door: the showroom, in glass ───────────────────────────────────────────── */
export function ShowroomDoor({ door }) {
  if (!door) return null;
  const photo = door.photo;
  return (
    <section className="ch-section" id="showroom" aria-labelledby="ch-door-title">
      <div className="ch-wrap">
        <div className={`ch-door ${photo ? 'ch-door-photo' : 'ch-door-solo'}`} data-reveal>
          {photo ? (
            <div className="ch-mat">
              <div className="ch-plx" data-parallax="0.04">
                <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 900px) calc(100vw - 72px), 620px" quality={85} />
              </div>
            </div>
          ) : null}
          <div className="ch-door-copy">
            <p className="ch-kicker">{door.kicker}</p>
            <h2 id="ch-door-title" className="ch-h2">{door.title}</h2>
            <p className="ch-line">{door.line}</p>
            <ul className="ch-visit">
              <li><MapPin size={17} aria-hidden="true" />{door.address}</li>
              <li><Clock size={17} aria-hidden="true" />{door.hours}</li>
            </ul>
            <Actions ctas={door.ctas} />
          </div>
        </div>
      </div>
    </section>
  );
}
