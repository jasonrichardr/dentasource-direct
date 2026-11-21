// /denjoy: the Denjoy line, grouped by type. Each instrument is a real photograph on the
// studio mat, its name, one line, three facts and a link to its page. Server component.
//
// ☠️ LIGHT ONLY, AND NO SKY (Jarich, 2026-11-21). See DenjoyProductPage.jsx.

import ScrollFx from '@/components/chair/ScrollFx';
import { Actions, IconItem } from '@/components/chair/parts';
import { ShowroomDoor } from '@/components/chair/sections';
import { InstrumentCard, Faq } from './parts';
import DenjoyTrack from './DenjoyTrack';
import '@/components/chair/chair.css';
import './denjoy.css';

function Family({ family, items }) {
  const wide = items.filter((p) => p.featured || items.length === 1);
  const rest = items.filter((p) => !wide.includes(p));
  return (
    <section className="ch-family" id={family.id} aria-labelledby={`${family.id}-title`}>
      <div className="ch-wrap">
        <div className="ch-family-head" data-reveal>
          <div>
            <h2 id={`${family.id}-title`} className="ch-h2">{family.title}</h2>
            <p className="ch-line">{family.line}</p>
          </div>
          <p className="ch-family-count">{items.length === 1 ? '1 instrument' : `${items.length} instruments`}</p>
        </div>
        {wide.map((p, i) => <InstrumentCard key={p.slug} item={p} index={i} wide />)}
        {rest.length ? (
          <div className="ch-gallery" style={{ '--cols': Math.min(rest.length, 3) }}>
            {rest.map((p, i) => <InstrumentCard key={p.slug} item={p} index={i} />)}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default function DenjoyHub({ pages, families, copy }) {
  const rootId = 'denjoy-index';
  const h = copy.hero;
  const groups = families
    .map((f) => ({ family: f, items: pages.filter((p) => p.family.id === f.id) }))
    .filter((g) => g.items.length);

  return (
    <div id={rootId} className="ch ch-index dj">
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

        <nav className="ch-wrap ch-jump ch-rise" style={{ '--d': 4 }} aria-label="Denjoy instrument types">
          <span className="ch-jump-label">{copy.jumpLabel}</span>
          <ul>
            {groups.map(({ family, items }) => (
              <li key={family.id}>
                <a href={`#${family.id}`}>{family.short}<span>{items.length}</span></a>
              </li>
            ))}
          </ul>
        </nav>
      </section>

      {groups.map(({ family, items }) => <Family key={family.id} family={family} items={items} />)}

      <Faq faq={copy.faq} />
      <ShowroomDoor door={copy.door} />
      <ScrollFx rootId={rootId} />
      <DenjoyTrack rootId={rootId} />
    </div>
  );
}
