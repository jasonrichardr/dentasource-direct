// /dentalchairs: every chair as a real photograph on the studio mat, its name, one line,
// three ✦ facts and a glass door to its page. Server component; the motion comes from
// ScrollFx (reveal, parallax, tilt) and the featured card's CycleMat.

import Link from 'next/link';
import Image from 'next/image';
import ScrollFx from './ScrollFx';
import CycleMat from './CycleMat';
import { Stars, Actions, GlassLink } from './parts';
import { ShowroomDoor } from './sections';
import './chair.css';

function CardPhoto({ chair }) {
  const p = chair.photo;
  const cover = p.fit === 'cover';
  const sizes = chair.featured
    ? '(max-width: 760px) calc(100vw - 52px), (max-width: 1000px) 92vw, 680px'
    : '(max-width: 760px) calc(100vw - 52px), 560px';
  // An existing white-ground photo is multiplied onto the mat; a baked one already carries it.
  const matClass = `ch-mat${!cover && !p.baked ? ' ch-multiply' : ''}`;
  return (
    <Link
      href={chair.route}
      prefetch={false}
      className="ch-card-media ch-tilt"
      data-tilt
      tabIndex={-1}
      aria-hidden="true"
    >
      <div className={matClass}>
        {chair.cycle?.length ? (
          <CycleMat frames={chair.cycle} alt={`ROSON ${chair.lineName} ${chair.model}`} sizes={sizes} />
        ) : (
          <div className={`ch-plx${cover ? ' ch-plx-cover' : ''}`} data-parallax="0.04">
            <Image src={p.src} alt={p.alt} fill sizes={sizes} quality={85} />
          </div>
        )}
      </div>
    </Link>
  );
}

function ChairCard({ chair, index }) {
  return (
    <article className={`ch-card${chair.featured ? ' ch-card-featured' : ''}`} data-reveal style={{ '--i': index % 2 }}>
      <CardPhoto chair={chair} />
      <div className="ch-card-body">
        <p className="ch-card-family">{chair.family}</p>
        <h2 className="ch-card-title">
          {chair.model}
          <span className="ch-card-sub">{chair.lineName}</span>
        </h2>
        <p className="ch-line ch-card-line">{chair.line}</p>
        <Stars items={chair.stars} />
        <div className="ch-card-cta">
          <GlassLink cta={{ label: `See the ${chair.model}`, href: chair.route, primary: chair.featured }} small={!chair.featured} arrow />
        </div>
      </div>
    </article>
  );
}

export default function ChairGallery({ chairs, copy }) {
  const rootId = 'chairs-index';
  const h = copy.hero;
  return (
    <div id={rootId} className="ch">
      <section className="ch-index-hero" aria-labelledby="ch-index-title">
        <div className="ch-wrap ch-head ch-head-center">
          <p className="ch-kicker ch-rise" style={{ '--d': 0 }}>{h.kicker}</p>
          <h1 id="ch-index-title" className="ch-h1 ch-rise" style={{ '--d': 1 }}>{h.title}</h1>
          <p className="ch-line ch-rise" style={{ '--d': 2 }}>{h.line}</p>
          <div className="ch-rise" style={{ '--d': 3 }}>
            <Actions ctas={h.ctas} className="ch-actions-center" />
            <Stars items={h.stars} />
          </div>
        </div>
      </section>

      <section className="ch-section" style={{ paddingTop: 0 }} aria-label="The ROSON chairs">
        <div className="ch-wrap ch-gallery">
          {chairs.map((c, i) => <ChairCard key={c.slug} chair={c} index={i} />)}
        </div>
      </section>

      <ShowroomDoor door={copy.door} />
      <ScrollFx rootId={rootId} />
    </div>
  );
}

