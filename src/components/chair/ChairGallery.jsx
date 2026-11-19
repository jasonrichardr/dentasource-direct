// /dentalchairs: the ROSON range, grouped by family. Each chair is a real photograph on the
// studio mat, its name, one line, three facts and a link to its page. Server component; the
// only motion is ScrollFx's reveal and the lead card's CycleMat.
//
// ☠️ LIGHT ONLY, AND NO SKY (Jarich, 2026-11-19). See ChairPage.jsx.

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import ScrollFx from './ScrollFx';
import CycleMat from './CycleMat';
import { Stars, Actions, IconItem } from './parts';
import { ShowroomDoor } from './sections';
import './chair.css';

function CardPhoto({ chair, wide }) {
  const p = chair.photo;
  const cover = p.fit === 'cover';
  const sizes = wide
    ? '(max-width: 760px) calc(100vw - 48px), (max-width: 1000px) 92vw, 660px'
    : '(max-width: 760px) calc(100vw - 48px), (max-width: 1000px) 46vw, 380px';
  // A white-ground photo is multiplied onto the mat; a baked one already carries it.
  return (
    <div className={`ch-card-media ch-mat${p.blend ? ' ch-multiply' : ''}`}>
      {chair.cycle?.length ? (
        <CycleMat frames={chair.cycle} alt={`ROSON ${chair.lineName} ${chair.model}`} sizes={sizes} />
      ) : (
        <div className={`ch-plx${cover ? ' ch-plx-cover' : ''}`}>
          <Image src={p.src} alt={p.alt} fill sizes={sizes} quality={85} />
        </div>
      )}
    </div>
  );
}

// The whole card is one link: the model name carries it, and its ::after covers the card.
function ChairCard({ chair, index, wide }) {
  return (
    <article className={`ch-card${wide ? ' ch-card-wide' : ''}`} data-reveal style={{ '--i': index % 3 }}>
      <CardPhoto chair={chair} wide={wide} />
      <div className="ch-card-body">
        <p className="ch-card-kind">{chair.lineName}</p>
        <h3 className="ch-card-title">
          <Link href={chair.route} prefetch={false} className="ch-card-link">{chair.model}</Link>
        </h3>
        <p className="ch-line ch-card-line">{chair.line}</p>
        <Stars items={chair.stars} className="ch-stars-sm" />
        <p className="ch-card-go" aria-hidden="true">
          Explore the {chair.model} <ArrowRight size={16} />
        </p>
      </div>
    </article>
  );
}

function Family({ family, chairs }) {
  // The lead chair of a family, or a family of one, takes the full width.
  const wideOnes = chairs.filter((c) => c.featured || chairs.length === 1);
  const rest = chairs.filter((c) => !wideOnes.includes(c));
  return (
    <section className="ch-family" id={family.id} aria-labelledby={`${family.id}-title`}>
      <div className="ch-wrap">
        <div className="ch-family-head" data-reveal>
          <div>
            <h2 id={`${family.id}-title`} className="ch-h2">{family.title}</h2>
            <p className="ch-line">{family.line}</p>
          </div>
          <p className="ch-family-count">{chairs.length === 1 ? '1 chair' : `${chairs.length} chairs`}</p>
        </div>
        {wideOnes.map((c, i) => <ChairCard key={c.slug} chair={c} index={i} wide />)}
        {rest.length ? (
          <div className="ch-gallery" style={{ '--cols': Math.min(rest.length, 3) }}>
            {rest.map((c, i) => <ChairCard key={c.slug} chair={c} index={i} />)}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default function ChairGallery({ chairs, copy, clients = null }) {
  const rootId = 'chairs-index';
  const h = copy.hero;
  // Only the families that still have a visible chair (a chair can be hidden in the studio).
  const families = copy.families
    .map((f) => ({ family: f, chairs: chairs.filter((c) => c.family === f.key) }))
    .filter((g) => g.chairs.length);

  return (
    <div id={rootId} className="ch ch-index">
      <section className="ch-index-hero" aria-labelledby="ch-index-title">
        <div className="ch-wrap ch-index-grid">
          <div className="ch-index-copy">
            <p className="ch-kicker ch-rise" style={{ '--d': 0 }}>{h.kicker}</p>
            <h1 id="ch-index-title" className="ch-h1 ch-h1-xl ch-rise" style={{ '--d': 1 }}>{h.title}</h1>
            <p className="ch-line ch-lead ch-rise" style={{ '--d': 2 }}>{h.line}</p>
            <div className="ch-rise" style={{ '--d': 3 }}>
              <Actions ctas={h.ctas} />
            </div>
          </div>
          <aside className="ch-assure ch-rise" style={{ '--d': 3 }} aria-labelledby="ch-assure-title">
            <h2 id="ch-assure-title" className="ch-extras-title">{copy.assurance.title}</h2>
            <ul className="ch-assure-list">
              {copy.assurance.items.map((it) => <IconItem key={it.title} item={it} />)}
            </ul>
          </aside>
        </div>

        <nav className="ch-wrap ch-jump ch-rise" style={{ '--d': 4 }} aria-label="Chair families">
          <span className="ch-jump-label">{copy.jumpLabel}</span>
          <ul>
            {families.map(({ family, chairs: list }) => (
              <li key={family.id}>
                <a href={`#${family.id}`}>{family.short}<span>{list.length}</span></a>
              </li>
            ))}
          </ul>
        </nav>
      </section>

      {families.map(({ family, chairs: list }) => <Family key={family.id} family={family} chairs={list} />)}

      {/* doctors at our booth and in their clinics (ClientMarquee, Jarich 2026-10-12) */}
      {clients}

      <ShowroomDoor door={copy.door} />
      <ScrollFx rootId={rootId} />
    </div>
  );
}
