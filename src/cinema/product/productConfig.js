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

// WHERE THE THRESHOLDS COME FROM. The studio shots carry no alpha, so the sampler runs in
// `dark` mode: keep every pixel darker than `threshold`, drop the ground. The cut was set
// per source by measuring the DARKEST pixel in each image's border ring, which is the
// ground at its dirtiest, and sitting under it:
//   ring 1.000 (a true white ground, every chair shot)  -> 0.90, the fullest silhouette
//                                                          the ground can never reach
//   denjoy, ring 0.928 (flat pale blue, 231 238 244)    -> 0.85; at 0.94 the whole
//                                                          rectangle floods in at 99%
//   a1-pro hero, a chair on white in front of a PALE GREY  -> 0.86 (the panel measures
//   backdrop panel, over a dark shadow band                   0.889, so 0.90 would form
//                                                             the panel as a rectangle),
//                                                             plus a crop that ends above
//                                                             the shadow band, which runs
//                                                             48 to 66 percent dark from
//                                                             y 0.85 down
//   n2-plus, an indexed PNG that is 72% TRANSPARENT     -> `alpha` mode. The content note
//                                                          said no transparent PNG exists
//                                                          in public/; this one does, and
//                                                          alpha keeps the pale trim that
//                                                          a brightness cut would drop.
const DEFAULT_SAMPLER = { mode: 'dark', threshold: 0.9 };
const SAMPLER_BY_SLUG = {
  denjoy: { mode: 'dark', threshold: 0.85 },
  'a1-pro': { mode: 'dark', threshold: 0.86, crop: { x: 0.05, y: 0.02, w: 0.90, h: 0.82 } },
  'n2-plus': { mode: 'alpha' },
};

// THE PARTICLE WORDMARK IS THE MODEL CODE, NOTHING MORE. A full name like "ROSON
// Affordable Luxury Model S9" only fits by wrapping to two lines and shrinking, and two
// lines of particles land on top of the DOM panel underneath. Each value below is a
// verbatim fragment of that product's own `name` in products.json, never a new name; the
// full name still reads as the page's h1 in the panel.
const WORDMARK = {
  'a1-pro': 'A1 Pro',
  a3: 'A3',
  a3l: 'A3L',
  a3s: 'A3S',
  n1: 'N1',
  'n2-plus': 'N2 Plus',
  'n2-pro': 'N2 PRO',
  s3: 'S3',
  s6: 'S6',
  s9: 'S9',
  denjoy: 'Denjoy',
  'roray-xray': 'RoRay',
  dentalchairs: 'Chairs',
  products: 'Equipment',
};

// The particle source: always the product's own hero, the first entry of its forms media.
//
// NOT the A1 Pro's "chair-silhouette-*.png". content-notes.md calls those "real silhouette
// art" and "the best particle source in the repo"; they are not. Opened, the file is a
// 3287 x 1375 marketing banner: a headline, three paragraphs of body copy, a colour swatch
// and a close CROP of the upholstery, no whole chair anywhere. Sampled, it formed a block
// of unreadable particle text on the page, including a superlative the editorial red-lines
// ban. The note is wrong and should be corrected.
function particleSource(product) {
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
 * Returns { slug, name, beats: [{ id, formation, copy }] } with the inRealClinics beat
 * omitted entirely when the product has no install photographs.
 */
export function productCinemaConfig(slug) {
  const product = getProductEntry(slug);
  if (!product) throw new Error(`productCinemaConfig: no product "${slug}" in products.json`);

  const b = product.beats;
  const src = particleSource(product);
  const sampler = SAMPLER_BY_SLUG[slug] ?? DEFAULT_SAMPLER;
  const wordmark = WORDMARK[slug] || product.name;

  const beats = [];

  // 1 — the product forms from particles, its name seated underneath as canvas type.
  beats.push({
    id: 'forms',
    formation: {
      key: 'forms',
      kind: 'lockup',
      src,
      text: wordmark,
      accentPeak: true,
      ...sampler,
      lockup: { markBox: 3.05, markY: 2.28, wordCenterY: -1.96, wordHalfW: 2.6, wordBoxH: 1.15 },
    },
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
      formation: {
        key: 'installs', kind: 'image', src, dim: true,
        boxW: 3.3, boxH: 3.3, zBow: 0.9, ...sampler,
      },
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

  // 8 — the door. Closing on the lockup bookends the arc, and the director seats the
  // last lockup nearer than the first.
  beats.push({
    id: 'door',
    formation: {
      key: 'door',
      kind: 'lockup',
      src,
      text: wordmark,
      accentPeak: true,
      ...sampler,
      lockup: { markBox: 2.9, markY: 2.42, wordCenterY: -2.06, wordHalfW: 2.6, wordBoxH: 1.15 },
    },
    copy: b.door,
  });

  return { slug, name: product.name, beats };
}
