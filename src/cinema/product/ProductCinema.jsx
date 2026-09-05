/* eslint-disable @next/next/no-img-element */
'use client';

import CinemaPage from '@/cinema/CinemaPage';
import NightSky from '@/cinema/NightSky';
import './product.css';

// NO ThemeProvider and NO ThemeToggle here. SiteShell in the root layout mounts ONE
// provider for the whole site and the navbar carries the only toggle; nesting a second
// provider gave the page its own copy of the state, so tapping the navbar toggle turned
// the tokens but left this page's sky and particles on the old theme.

// One product page: the 8 beat arc over the shared engine, then the page's own spec and
// detail sections underneath. `config` comes from productConfig.js on the server, so every
// string below is products.json verbatim. `children` are the existing route components,
// passed through untouched so nothing a buyer relied on disappears.

function Kicker({ children }) {
  if (!children) return null;
  return <div className="cinema-kicker">{children}</div>;
}

// Beat 1 carries the page's h1; every later beat is an h2.
function Head({ children, lead = false }) {
  if (!children) return null;
  return lead ? <h1 className="cinema-head">{children}</h1> : <h2 className="cinema-head">{children}</h2>;
}

function Body({ children }) {
  if (!children) return null;
  return <p className="cinema-sub">{children}</p>;
}

// Beat 1. RULED: no product is ever drawn in particles, so the unit arrives as its real
// photograph over the dimmed calm cloud, the same treatment the install and bench beats
// use. Under it: the eyebrow, the full model name as the page's h1, and one line. The
// marketing tagline is that line rather than the headline.
function FormsPanel({ copy, name, photo }) {
  return (
    <div className="cinema-copy pc-wide">
      {photo && (
        <figure className="pc-hero">
          <img className="pc-hero-img" src={photo} alt={name} />
        </figure>
      )}
      <Kicker>{copy.eyebrow}</Kicker>
      <Head lead>{name}</Head>
      <Body>{copy.headline}</Body>
    </div>
  );
}

function WhoPanel({ copy }) {
  const segments = copy.segments || [];
  return (
    <div className="cinema-copy pc-wide">
      <Kicker>{copy.eyebrow}</Kicker>
      <Head>{copy.headline}</Head>
      {/* carried down from beat 1: the product's factual description, which beat 1 no
          longer has room for now that it is a name and a one line caption */}
      {copy.lead && <p className="cinema-sub pc-carry">{copy.lead}</p>}
      <Body>{copy.body}</Body>
      {segments.length > 0 && (
        <ul className="pc-chips">
          {segments.map((s) => <li key={s} className="pc-chip">{s}</li>)}
        </ul>
      )}
    </div>
  );
}

// The feature list, two columns on anything wider than a phone. Six bullets is the cap.
function FeaturesPanel({ copy }) {
  const bullets = copy.bullets || [];
  return (
    <div className="cinema-copy pc-wide">
      <Kicker>{copy.eyebrow}</Kicker>
      <Head>{copy.headline}</Head>
      {bullets.length > 0 && (
        <ul className="pc-features">
          {bullets.map((f) => <li key={f} className="pc-feature">{f}</li>)}
        </ul>
      )}
      {copy.body && <p className="pc-note">{copy.body}</p>}
    </div>
  );
}

// Colours and upholstery. Where products.json states neither, the panel renders without a
// swatch row rather than inventing one. The swatch labels are the names ROSON and each
// page use; no hex is asserted here, because two configurators disagree on one of them.
function ColorsPanel({ copy }) {
  const colors = copy.colors || [];
  const upholstery = copy.upholstery || [];
  return (
    <div className="cinema-copy pc-wide">
      <Kicker>{copy.eyebrow}</Kicker>
      <Head>{copy.headline}</Head>
      <Body>{copy.body}</Body>
      {colors.length > 0 && (
        <ul className="pc-swatches">
          {colors.map((c) => (
            <li key={c} className="pc-swatch"><span className="pc-swatch-dot" aria-hidden="true" />{c}</li>
          ))}
        </ul>
      )}
      {upholstery.length > 0 && (
        <ul className="pc-chips pc-chips-tight">
          {upholstery.map((u) => <li key={u} className="pc-chip">{u}</li>)}
        </ul>
      )}
    </div>
  );
}

function InstallsPanel({ copy }) {
  const items = copy.items || [];
  return (
    <div className="cinema-copy pc-wide">
      <Kicker>{copy.eyebrow}</Kicker>
      <Head>{copy.headline}</Head>
      <Body>{copy.body}</Body>
      <ul className="pc-shots">
        {items.map((it) => (
          <li key={it.slug} className="pc-shot">
            <a className="cinema-cta pc-shot-link" href={`/news/${it.slug}`}>
              <img src={it.image} alt={it.alt} loading="lazy" />
              <span className="pc-shot-cap">{it.alt}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function InspectionPanel({ copy }) {
  const checklist = copy.checklist || [];
  const media = copy.media || [];
  return (
    <div className="cinema-copy pc-wide">
      <Kicker>{copy.eyebrow}</Kicker>
      <Head>{copy.headline}</Head>
      <Body>{copy.body}</Body>
      <div className="pc-inspect">
        {checklist.length > 0 && (
          <ol className="pc-checklist">
            {checklist.map((c) => <li key={c}>{c}</li>)}
          </ol>
        )}
        {media.length > 0 && (
          <div className="pc-bench">
            {media.map((m) => <img key={m} src={m} alt="" loading="lazy" />)}
          </div>
        )}
      </div>
      {copy.sourceArticle && (
        <a className="cinema-cta pc-link" href={`/news/${copy.sourceArticle}`}>
          Read the inspection article
        </a>
      )}
    </div>
  );
}

function RelatedPanel({ copy }) {
  const articles = copy.articles || [];
  return (
    <div className="cinema-copy pc-wide">
      <Kicker>Related news</Kicker>
      <ul className="pc-cards">
        {articles.map((a) => (
          <li key={a.slug} className="pc-card">
            <a className="cinema-cta pc-card-link" href={`/news/${a.slug}`}>
              {a.image && <img src={a.image} alt="" loading="lazy" />}
              <span className="pc-card-title">{a.title}</span>
              <span className="pc-card-date">{a.date}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DoorPanel({ copy }) {
  const cta = copy.cta || { label: 'Send an inquiry', href: '/contact' };
  const second = copy.secondaryCta;
  return (
    <div className="cinema-copy">
      <Kicker>{copy.eyebrow}</Kicker>
      <Head>{copy.headline}</Head>
      <Body>{copy.body}</Body>
      <div className="pc-doors">
        <a className="cinema-cta pc-door pc-door-primary" href={cta.href}>{cta.label}</a>
        {second && <a className="cinema-cta pc-door" href={second.href}>{second.label}</a>}
      </div>
    </div>
  );
}

const PANEL_BY_ID = {
  forms: FormsPanel,
  whoItIsFor: WhoPanel,
  features: FeaturesPanel,
  colors: ColorsPanel,
  inRealClinics: InstallsPanel,
  inspectionAndInstallation: InspectionPanel,
  relatedNews: RelatedPanel,
  door: DoorPanel,
};

export default function ProductCinema({ config, children, detailsLabel = 'Full details' }) {
  // ☠️ A NULL CONFIG MEANS THE PRODUCT IS HIDDEN, NOT THAT SOMETHING BROKE. productConfig
  // returns null when the studio has hidden this product. The page keeps its route and its
  // full detail sections; only the cinema arc stands down. Rendering nothing at all would
  // turn a hidden arc into a blank page, which is a worse answer than a plain one.
  if (!config) {
    return (
      <div className="pc-shell">
        <section className="pc-details" id="full-details" aria-label={detailsLabel}>
          <div className="pc-details-body">{children}</div>
        </section>
      </div>
    );
  }
  const beats = config.beats.map((b) => b.formation);
  const panels = config.beats.map((b) => {
    const Panel = PANEL_BY_ID[b.id];
    return <Panel key={b.id} copy={b.copy} name={config.name} photo={config.photo} />;
  });

  return (
    <div className="pc-shell">
      <NightSky />
      <CinemaPage beats={beats} panels={panels} />
      {/* The specs and detail sections the current page already carries. This section
          sits ABOVE the cinema's fixed canvases in the stacking order and paints its
          own paper, so scrolling past the last beat hands the screen to it cleanly. */}
      <section className="pc-details" id="full-details" aria-label={detailsLabel}>
        <div className="pc-details-head">
          <span className="pc-details-kicker">{detailsLabel}</span>
          <h2 className="pc-details-title">{config.name}</h2>
        </div>
        <div className="pc-details-body">{children}</div>
      </section>
    </div>
  );
}
