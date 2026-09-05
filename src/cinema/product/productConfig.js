// product/productConfig.js — turns one entry of src/data/cinema/products.json into the
// arc the cinema engine walks and the copy the DOM panels carry. Runs on the SERVER: the
// route imports it, resolves its product once, and hands the plain object to the client
// component. That is what keeps the 91 article bodies in `newsData` out of the browser
// bundle: only a related article's slug, title, date and thumbnail ever cross over.
//
// Every string here comes out of products.json unchanged. Nothing in this file writes
// copy; it only decides which formation each beat forms and where the panel sits.

import productsJson from '@/data/cinema/products.json';
import { newsData } from '@/data/news';

const NEWS_BY_SLUG = new Map(newsData.map((n) => [n.slug, n]));

// The eight beats, in order. `inRealClinics` drops out when a product has no install
// photographs, which is why some products run seven beats rather than eight.
export const BEAT_ORDER = [
  'forms',
  'whoItIsFor',
  'features',
  'colors',
  'inRealClinics',
  'inspectionAndInstallation',
  'relatedNews',
  'door',
];

// RULED 2026-09-05 (Jarich): NO product is ever rendered in particles. The cloud is
// reserved for the round DSD logo lockup and the red heart. Every beat here therefore
// forms a calm sphere, dimmed where a DOM panel owns the frame, and the product itself
// appears as a real PHOTOGRAPH in beat 1's panel.
//
// The engine's mode/threshold/crop sampler keys are consequently unused by this file.
// One warning worth keeping: the A1 Pro's pieces/chair-silhouette-*.png files are NOT
// silhouettes, whatever content-notes.md says. They are 3287 x 1375 marketing banners
// carrying a headline, body copy and a close crop of upholstery. Never feed them a sampler.

// The door's second call. Ten of the twelve are ROSON chairs; the Denjoy endodontic range
// and the RoRay handheld X-ray are not, and sending them to /dentalchairs offered a
// visitor the one thing the page they were on is not.
const NON_CHAIRS = new Set(['denjoy', 'roray-xray']);
const SECOND_CTA = {
  chairs: { label: 'See all chairs', href: '/dentalchairs' },
  equipment: { label: 'See all equipment', href: '/products' },
};

// The product's own hero photograph, the first entry of its forms media. Shown as a
// photograph in beat 1's panel, never sampled.
function heroPhoto(product) {
  const media = product.beats?.forms?.media || [];
  return media[0] || product.heroImage;
}

function relatedArticles(slugs = []) {
  return slugs
    .map((slug) => {
      const article = NEWS_BY_SLUG.get(slug);
      if (!article) return null;
      return {
        slug,
        title: article.title,
        date: article.date,
        image: article.image || null,
      };
    })
    .filter(Boolean);
}

export function getProductEntry(slug) {
  return productsJson.products.find((p) => p.slug === slug) || null;
}

/**
 * Build the serialisable config for one product page.
 * Returns { slug, name, photo, beats: [{ id, formation, copy }] } with the inRealClinics beat
 * omitted entirely when the product has no install photographs.
 */
export function productCinemaConfig(slug) {
  const product = getProductEntry(slug);
  if (!product) throw new Error(`productCinemaConfig: no product "${slug}" in products.json`);

  const b = product.beats;
  const photo = heroPhoto(product);

  const beats = [];

  // 1 — the product itself, as a photograph in the panel, over a dimmed calm cloud.
  beats.push({
    id: 'forms',
    formation: { key: 'forms', kind: 'sphere', radius: 3.6, ripple: 0.14, dim: true },
    copy: b.forms,
  });

  // 2 — who it is for. Beat 1 is now the model name and a one line caption, so the
  // FACTUAL description that used to sit under it is carried here as the opening
  // paragraph rather than dropped. Ruled: never drop factual copy.
  beats.push({
    id: 'whoItIsFor',
    formation: { key: 'who', kind: 'sphere', radius: 3.5, ripple: 0.16 },
    copy: { ...b.whoItIsFor, lead: b.forms.body },
  });

  // 3 — the feature list, wired as a constellation behind a two column panel.
  beats.push({
    id: 'features',
    formation: { key: 'features', kind: 'constellation' },
    copy: { ...b.features, bullets: (b.features.bullets || []).slice(0, 6) },
  });

  // 4 — colours and upholstery. Products that state neither still get the panel.
  beats.push({
    id: 'colors',
    formation: { key: 'colors', kind: 'sphere', radius: 3.1, ripple: 0.3 },
    copy: b.colors,
  });

  // 5 — installed, not rendered. Skipped whole when there is nothing installed to show.
  const installs = b.inRealClinics?.items || [];
  if (installs.length > 0) {
    beats.push({
      id: 'inRealClinics',
      formation: { key: 'installs', kind: 'sphere', radius: 3.4, ripple: 0.2, dim: true },
      copy: b.inRealClinics,
    });
  }

  // 6 — the eight point bench check and the install that follows it.
  beats.push({
    id: 'inspectionAndInstallation',
    formation: { key: 'inspection', kind: 'sphere', radius: 3.8, ripple: 0.06, dim: true },
    copy: b.inspectionAndInstallation,
  });

  // 7 — related news, resolved to real articles at build time.
  beats.push({
    id: 'relatedNews',
    formation: { key: 'related', kind: 'sphere', radius: 3.3, ripple: 0.2, dim: true },
    copy: { articles: relatedArticles(b.relatedNews) },
  });

  // 8 — the door. A calm closing cloud that deepens to rich green; no product in it.
  // The primary call comes from products.json; the second one points at the range this
  // product actually belongs to, so the endo bench and the handheld X-ray stop offering
  // "See all chairs".
  beats.push({
    id: 'door',
    formation: { key: 'door', kind: 'sphere', radius: 3.0, ripple: 0.12, accentPeak: true },
    copy: { ...b.door, secondaryCta: NON_CHAIRS.has(slug) ? SECOND_CTA.equipment : SECOND_CTA.chairs },
  });

  return { slug, name: product.name, photo, beats };
}
