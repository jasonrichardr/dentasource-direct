// The sections of the shared chair page, in page order. Server components: the only client
// pieces are PhotoSwitcher (the colorway and delivery choosers), ScrollFx (the reveal) and
// SpecGate (the sign-in wall that already guarded the spec table).
//
// Nothing in this file writes copy about a chair. Every word about the product arrives in the
// `chair` object from src/data/chairs/<model>.js; the words about our own service (the
// inspection, the stories heading) come from src/data/chairs/shared.js.

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Clock, ArrowRight, ArrowUpRight } from 'lucide-react';
import SpecGate from '@/components/SpecGate';
import PhotoSwitcher from './PhotoSwitcher';
import { Stars, SectionHead, Actions, IconItem, GlassLink } from './parts';
import { INSPECTION, STORIES, CTA } from '@/data/chairs/shared';

const matClass = (photo, extra = '') => `ch-mat${photo?.blend ? ' ch-multiply' : ''}${extra ? ` ${extra}` : ''}`;
const plxClass = (photo) => `ch-plx${photo?.fit === 'cover' ? ' ch-plx-cover' : ''}`;

/* ── 1. hero: the chair, its name, one line, the colorways, the doors ─────────────── */
export function ChairHero({ chair }) {
  const h = chair.hero;
  return (
    <section className="ch-hero" aria-labelledby="ch-title">
      <div className="ch-wrap ch-hero-grid">
        <div className="ch-hero-copy">
          <p className="ch-crumb ch-rise" style={{ '--d': 0 }}>
            <Link href="/dentalchairs" prefetch={false}>Dental chairs</Link>
            <span aria-hidden="true">/</span>
            <span>{chair.family}</span>
          </p>
          <p className="ch-kicker ch-rise" style={{ '--d': 0 }}>{h.kicker}</p>
          <h1 id="ch-title" className="ch-h1 ch-rise" style={{ '--d': 1 }}>{h.title}</h1>
          <p className="ch-line ch-lead ch-rise" style={{ '--d': 2 }}>{h.line}</p>
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
            blend={Boolean(h.colorways.blend)}
            preload
            float
          />
        </div>
        <div className="ch-hero-actions ch-rise" style={{ '--d': 3 }}>
          <Stars items={h.stars} />
          <Actions ctas={h.ctas} />
        </div>
      </div>
    </section>
  );
}

/* ── the local bar: where you are on the page, and the one door that matters ───────── */
export function LocalNav({ chair, links }) {
  return (
    <nav className="ch-localnav" aria-label={`${chair.model} page sections`}>
      <div className="ch-wrap ch-localnav-row">
        <p className="ch-localnav-name">{chair.model}<span>{chair.lineName}</span></p>
        <ul className="ch-localnav-links">
          {links.map((l) => <li key={l.href}><a href={l.href}>{l.label}</a></li>)}
        </ul>
        <GlassLink cta={{ ...CTA.inquire, primary: true }} small />
      </div>
    </nav>
  );
}

/* ── 2. at a glance: the four figures a buyer asks for first ───────────────────────── */
export function Glance({ glance }) {
  if (!glance?.length) return null;
  return (
    <section className="ch-glance-band" aria-label="At a glance">
      <dl className="ch-wrap ch-glance" data-reveal>
        {glance.map((g) => (
          <div key={g.label} className="ch-glance-item">
            <dd>{g.value}</dd>
            <dt>{g.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}

/* ── 3. proof: the one number that earns a band of its own ─────────────────────────── */
export function ProofBand({ proof }) {
  if (!proof) return null;
  return (
    <section className="ch-section" aria-label={proof.kicker}>
      <div className="ch-wrap">
        <div className="ch-proof" data-reveal>
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

/* ── 4. who it suits: the rooms and practices this chair was specified for ─────────── */
export function Fit({ fit }) {
  if (!fit) return null;
  return (
    <section className="ch-section" id="who-it-suits">
      <div className="ch-wrap ch-fit">
        <SectionHead kicker={fit.kicker} title={fit.title} line={fit.line} />
        {fit.segments?.length ? (
          <ul className="ch-fit-list" data-reveal style={{ '--i': 1 }}>
            {fit.segments.map((s, i) => (
              <li key={s}>
                <span className="ch-fit-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                {s}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}

/* ── 5. why it works: a bento of the real detail photographs ───────────────────────── */
function FeatureTile({ item, index }) {
  const p = item.photo;
  return (
    <article className={`ch-tile${p ? '' : ' ch-tile-text'}`} data-reveal style={{ '--i': index % 3 }}>
      {p ? (
        <div className={matClass(p)}>
          <div className={plxClass(p)}>
            <Image
              src={p.src}
              alt={p.alt}
              fill
              sizes="(max-width: 720px) calc(100vw - 52px), (max-width: 1200px) 58vw, 680px"
              quality={85}
            />
          </div>
        </div>
      ) : null}
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
    <section className="ch-section" id="features">
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
                blend={Boolean(d.blend)}
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

/* ── 6. comfort: the upholsteries, and the stool that comes with it ────────────────── */
export function Comfort({ comfort }) {
  if (!comfort) return null;
  const swatches = comfort.upholstery || [];
  return (
    <section className="ch-section ch-band" id="comfort">
      <div className="ch-wrap">
        <SectionHead kicker={comfort.kicker} title={comfort.title} line={comfort.line} />
        <div className={`ch-comfort${swatches.length ? '' : ' ch-comfort-solo'}`}>
          {swatches.length ? (
            <div className="ch-swatchrow" style={{ '--n': Math.min(swatches.length, 3) }}>
              {swatches.map((u, i) => (
                <figure key={u.name} className="ch-leather" data-reveal style={{ '--i': i }}>
                  <div className="ch-mat">
                    <div className="ch-plx ch-plx-cover">
                      <Image src={u.src} alt={u.alt} fill sizes="(max-width: 960px) 31vw, 280px" quality={75} />
                    </div>
                  </div>
                  <figcaption>{u.name}</figcaption>
                </figure>
              ))}
            </div>
          ) : null}
          {comfort.colors?.items?.length ? (
            <div className="ch-colors" data-reveal style={{ '--i': 1 }}>
              <h3 className="ch-extras-title">{comfort.colors.title}</h3>
              <ul className="ch-colorlist">
                {comfort.colors.items.map((c) => (
                  <li key={c.name}>
                    {c.swatch ? <span className="ch-colordot" style={{ '--c': c.swatch }} aria-hidden="true" /> : null}
                    {c.name}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
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

/* ── 7. specs: still behind SpecGate, readable in grouped cards ────────────────────── */
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

/* ── 8. in the box, and the warranty, side by side ─────────────────────────────────── */
export function BoxAndWarranty({ box, warranty }) {
  if (!box && !warranty) return null;
  return (
    <section className="ch-section ch-band" id="in-the-box">
      <div className={`ch-wrap ch-boxgrid${box && warranty ? '' : ' ch-boxgrid-solo'}`}>
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

/* ── 9. in real clinics: our own install photographs, each linked to its story ─────── */
const DATE_FMT = new Intl.DateTimeFormat('en-PH', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Manila' });
function storyDate(value) {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : DATE_FMT.format(d);
}

export function Stories({ stories }) {
  const items = stories?.items || [];
  if (!items.length) return null;
  const head = STORIES[stories.kind] || STORIES.news;
  return (
    <section className="ch-section" id="in-clinics">
      <div className="ch-wrap">
        <SectionHead kicker={head.kicker} title={head.title} line={head.line} />
        <ul className="ch-stories" style={{ '--n': Math.min(items.length, 3) }}>
          {items.slice(0, 3).map((it, i) => (
            <li key={it.slug} data-reveal style={{ '--i': i }}>
              <Link className="ch-story" href={`/news/${it.slug}`} prefetch={false}>
                <span className="ch-story-photo">
                  <Image src={it.image} alt={it.alt} fill sizes="(max-width: 760px) calc(100vw - 32px), 380px" quality={75} />
                </span>
                <span className="ch-story-copy">
                  {storyDate(it.date) ? <span className="ch-story-date">{storyDate(it.date)}</span> : null}
                  <span className="ch-story-title">{it.title}</span>
                  <span className="ch-story-go">Read the story <ArrowUpRight size={15} aria-hidden="true" /></span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ── 10. before it reaches you: the eight point check, then the install ────────────── */
export function Inspection({ inspection }) {
  const list = inspection?.checklist || [];
  if (!list.length) return null;
  const photos = inspection.photos || [];
  return (
    <section className="ch-section ch-band" id="inspection">
      <div className="ch-wrap ch-inspect">
        <div>
          <SectionHead kicker={INSPECTION.kicker} title={INSPECTION.title} line={INSPECTION.line} />
          <p className="ch-inspect-link" data-reveal>
            <Link href={INSPECTION.article.href} prefetch={false}>
              {INSPECTION.article.label} <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </p>
          {photos.length ? (
            <div className="ch-inspect-photos" data-reveal>
              {photos.map((src) => (
                <span key={src} className="ch-inspect-photo">
                  <Image src={src} alt="A ROSON chair on our bench during its pre-delivery inspection" fill sizes="(max-width: 900px) 46vw, 260px" quality={75} />
                </span>
              ))}
            </div>
          ) : null}
        </div>
        <div className="ch-checklist" data-reveal style={{ '--i': 1 }}>
          <h3 className="ch-extras-title">{INSPECTION.checklistTitle}</h3>
          <ol>
            {list.map((line, i) => (
              <li key={line}>
                <span className="ch-fit-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                {line}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ── 11. the door: the showroom ────────────────────────────────────────────────────── */
export function ShowroomDoor({ door }) {
  if (!door) return null;
  const photo = door.photo;
  return (
    <section className="ch-section" id="showroom" aria-labelledby="ch-door-title">
      <div className="ch-wrap">
        <div className={`ch-door ${photo ? 'ch-door-photo' : 'ch-door-solo'}`} data-reveal>
          {photo ? (
            <div className={matClass(photo)}>
              <div className={plxClass(photo)}>
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
