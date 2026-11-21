// One Denjoy instrument page. One entry of src/data/denjoyPages.js in, the whole page out; a
// section whose data is missing does not render, so a product with no specification table or
// no videos still gets a complete page.
//
// ☠️ LIGHT ONLY, AND NO SKY (Jarich, 2026-11-21: "now the Denjoy"). The Denjoy routes are
// locked to the light register in src/cinema/theme/theme.js (LIGHT_ONLY_ROUTES) and this page
// mounts no canvas. It reuses the chair design system (src/components/chair/) so the two
// product lines read as one site.

import Link from 'next/link';
import { ArrowUpRight, Play } from 'lucide-react';
import ScrollFx from '@/components/chair/ScrollFx';
import { Stars, SectionHead, Actions, IconItem } from '@/components/chair/parts';
import { LocalNav, Glance, Fit, BoxAndWarranty, ShowroomDoor } from '@/components/chair/sections';
import { DENJOY_CTA } from '@/data/denjoyPages';
import { Mat, InstrumentCard, Faq } from './parts';
import DenjoyTrack from './DenjoyTrack';
import '@/components/chair/chair.css';
import './denjoy.css';

function Hero({ item }) {
  const h = item.hero;
  return (
    <section className="ch-hero" aria-labelledby="ch-title">
      <div className="ch-wrap ch-hero-grid">
        <div className="ch-hero-copy">
          <nav aria-label="Breadcrumb" className="ch-crumb ch-rise" style={{ '--d': 0 }}>
            <Link href="/denjoy" prefetch={false}>Denjoy</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{item.family.short}</span>
          </nav>
          <p className="ch-kicker ch-rise" style={{ '--d': 0 }}>{h.kicker}</p>
          <h1 id="ch-title" className="ch-h1 ch-rise" style={{ '--d': 1 }}>{h.title}</h1>
          <p className="ch-line ch-lead ch-rise" style={{ '--d': 2 }}>{h.line}</p>
        </div>
        <div className="ch-hero-stage ch-settle">
          <Mat photo={h.photo} className="ch-switch-mat" sizes="(max-width: 960px) calc(100vw - 32px), 600px" preload />
        </div>
        <div className="ch-hero-actions ch-rise" style={{ '--d': 3 }}>
          <Stars items={h.stars} />
          <Actions ctas={[DENJOY_CTA.demo, DENJOY_CTA.message(item.messengerText)]} />
        </div>
      </div>
    </section>
  );
}

function Features({ item }) {
  const f = item.features;
  if (!f) return null;
  return (
    <section className="ch-section" id="features">
      <div className="ch-wrap">
        <SectionHead kicker="Features" title={f.title} line={f.line} />
        <ul className="dj-feats">
          {f.items.map((it, i) => (
            <li key={it.title} className="dj-feat" data-reveal style={{ '--i': i % 2 }}>
              <span className="ch-tile-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="ch-h3">{it.title}</h3>
              <p className="ch-line">{it.line}</p>
            </li>
          ))}
        </ul>
        {item.standards?.length ? (
          <ul className="ch-chips dj-chips" aria-label="Certifications" data-reveal>
            {item.standards.map((s) => <li key={s} className="ch-chip">{s}</li>)}
          </ul>
        ) : null}
      </div>
    </section>
  );
}

function Modules({ modules }) {
  if (!modules) return null;
  return (
    <section className="ch-section ch-band" id="modules">
      <div className="ch-wrap">
        <SectionHead kicker={modules.kicker} title={modules.title} line={modules.line} />
        <ul className="ch-iconlist ch-iconlist-4 dj-modules" data-reveal>
          {modules.items.map((it) => <IconItem key={it.title} item={it} />)}
        </ul>
      </div>
    </section>
  );
}

function Shots({ item }) {
  const shots = item.gallery || [];
  if (!shots.length) return null;
  return (
    <section className="ch-section" id="photos">
      <div className="ch-wrap">
        <SectionHead kicker="Photos" title="A closer look" line={`The ${item.name}, from the maker's studio and our own showroom counter.`} />
        <div className="dj-shots" style={{ '--n': Math.min(shots.length, 3) }}>
          {shots.map((p, i) => (
            <figure key={p.src} data-reveal style={{ '--i': i }}>
              <Mat photo={{ ...p, fit: 'cover' }} sizes="(max-width: 760px) calc(100vw - 32px), 400px" />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

// Ungated, as these tables always were on the Denjoy pages.
function SpecSheet({ specs }) {
  if (!specs) return null;
  return (
    <section className="ch-section ch-specs" id="specs">
      <div className="ch-wrap">
        <SectionHead kicker={specs.kicker} title={specs.title} line={specs.line} />
        <div className="ch-specgrid dj-specgrid" data-reveal>
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
          <ul className="ch-chips" aria-label="Certifications">
            {specs.standards.map((s) => <li key={s} className="ch-chip">{s}</li>)}
          </ul>
        ) : null}
      </div>
    </section>
  );
}

function Videos({ item }) {
  const videos = item.videos || [];
  if (!videos.length) return null;
  return (
    <section className="ch-section" id="videos">
      <div className="ch-wrap">
        <SectionHead kicker="Videos" title="Watch it at work" line="Demonstrations from Denjoy's own YouTube channel. Each one opens in a new tab." />
        <ul className="dj-videos" style={{ '--n': Math.min(videos.length, 3) }}>
          {videos.map((v, i) => (
            <li key={v.id} data-reveal style={{ '--i': i % 3 }}>
              <a className="dj-video" href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank" rel="noopener noreferrer">
                <span className="dj-video-thumb">
                  {/* a YouTube still: remote, already sized, and not worth an optimizer round trip */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`} alt="" loading="lazy" width="480" height="360" />
                  <span className="dj-video-play" aria-hidden="true"><Play size={20} fill="currentColor" /></span>
                  <span className="dj-video-time">{v.duration}</span>
                </span>
                <span className="dj-video-copy">
                  <span className="dj-video-title">{v.title}</span>
                  <span className="ch-story-go">Watch on YouTube <ArrowUpRight size={15} aria-hidden="true" /></span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Related({ item, related }) {
  if (!related?.length) return null;
  return (
    <section className="ch-section" id="related">
      <div className="ch-wrap">
        <SectionHead kicker="More from Denjoy" title="Pairs well with" line={`Other instruments that sit beside the ${item.name} in a root canal setup.`} />
        <div className="ch-gallery" style={{ '--cols': Math.min(related.length, 3) }}>
          {related.map((r, i) => <InstrumentCard key={r.slug} item={r} index={i} />)}
        </div>
      </div>
    </section>
  );
}

export default function DenjoyProductPage({ item, related = [] }) {
  const rootId = `denjoy-${item.slug}`;
  const faq = item.faqs?.length
    ? { kicker: 'Questions', title: 'Asked before buying', items: item.faqs }
    : null;

  // The local bar lists only the sections this instrument actually has.
  const links = [
    item.features && { label: 'Features', href: '#features' },
    item.modules && { label: 'Modules', href: '#modules' },
    item.specs && { label: 'Specifications', href: '#specs' },
    item.box && { label: 'In the box', href: '#in-the-box' },
    item.warranty && { label: 'Warranty', href: '#warranty' },
    item.videos?.length && { label: 'Videos', href: '#videos' },
    faq && { label: 'Questions', href: '#questions' },
    { label: 'Showroom', href: '#showroom' },
  ].filter(Boolean);

  return (
    <div id={rootId} className="ch ch-page dj">
      <Hero item={item} />
      <LocalNav chair={{ model: item.name, lineName: item.kind }} links={links} />
      <Glance glance={item.glance} />
      <Features item={item} />
      <Modules modules={item.modules} />
      <Fit fit={item.fit} />
      <Shots item={item} />
      <SpecSheet specs={item.specs} />
      <BoxAndWarranty box={item.box} warranty={item.warranty} />
      <Videos item={item} />
      <Faq faq={faq} />
      <Related item={item} related={related} />
      <ShowroomDoor door={item.door} />
      <ScrollFx rootId={rootId} />
      <DenjoyTrack rootId={rootId} name={item.name} />
    </div>
  );
}
