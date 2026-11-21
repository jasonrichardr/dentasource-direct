// Pieces the Denjoy hub and the Denjoy instrument page share. Server components. The classes
// are the chair design system's (src/components/chair/chair.css) plus the few in denjoy.css.

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Stars, SectionHead } from '@/components/chair/parts';

// A photograph on the mat. `blend` multiplies a white-ground shot onto it; `fit: 'cover'`
// lets a shot that carries its own ground fill it.
export function Mat({ photo, sizes, className = '', preload = false }) {
  const cover = photo.fit === 'cover';
  return (
    <div className={`ch-mat${photo.blend ? ' ch-multiply' : ''} ${className}`}>
      <div className={`ch-plx${cover ? ' ch-plx-cover' : ''}`}>
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes={sizes}
          quality={85}
          {...(preload ? { preload: true, fetchPriority: 'high' } : {})}
        />
      </div>
    </div>
  );
}

// One instrument as a card. The whole card is one link, carried by the name.
export function InstrumentCard({ item, index = 0, wide = false }) {
  const sizes = wide
    ? '(max-width: 760px) calc(100vw - 48px), (max-width: 1000px) 92vw, 560px'
    : '(max-width: 760px) calc(100vw - 48px), (max-width: 1000px) 46vw, 380px';
  return (
    <article className={`ch-card${wide ? ' ch-card-wide' : ''}`} data-reveal style={{ '--i': index % 3 }}>
      <Mat photo={item.hero.photo} sizes={sizes} className="ch-card-media" />
      <div className="ch-card-body">
        <p className="ch-card-kind">{item.kind}</p>
        <h3 className="ch-card-title">
          <Link href={item.route} prefetch={false} className="ch-card-link">{item.name}</Link>
        </h3>
        <p className="ch-line ch-card-line">{item.card.line}</p>
        <Stars items={item.card.stars} className="ch-stars-sm" />
        <p className="ch-card-go" aria-hidden="true">
          Explore the {item.name} <ArrowRight size={16} />
        </p>
      </div>
    </article>
  );
}

// Questions, each one a native disclosure: no script, and the answer is in the page source.
export function Faq({ faq, id = 'questions' }) {
  if (!faq?.items?.length) return null;
  return (
    <section className="ch-section ch-band" id={id}>
      <div className="ch-wrap dj-faq">
        <SectionHead kicker={faq.kicker} title={faq.title} line={faq.line} />
        <div className="dj-faq-list" data-reveal style={{ '--i': 1 }}>
          {faq.items.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
