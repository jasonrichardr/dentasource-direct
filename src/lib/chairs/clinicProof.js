// lib/chairs/clinicProof.js — a chair's proof from real clinics, for the shared chair template.
//
// Server only. Nothing here is new: the install photographs, the related articles, the eight
// checklist lines and the two bench photographs were already chosen per product in
// src/data/cinema/products.json, where the old product pages read them. This lifts them into
// the plain shape the template's sections render.
//
// The manifest is reached through getProductEntry(), which already passes it through
// visible(), so a product hidden in the studio returns null here and the sections that need
// this simply do not render.

import { getProductEntry } from '@/cinema/product/productConfig';
import { newsData } from '@/data/news';

const NEWS_BY_SLUG = new Map(newsData.map((n) => [n.slug, n]));

// House rule: no em or en dashes in the chair pages' copy. A few older article titles carry
// one ("How We Install Your Dental Chair \u2014 Step by Step"); here it reads as a colon.
const plain = (title) => String(title || '').replace(/\s*[\u2013\u2014]\s*/g, ': ');

export function clinicProof(slug) {
  const product = getProductEntry(slug);
  if (!product) return null;
  const b = product.beats || {};

  // A chair's own install photographs, each one captioned with the article it came from.
  const installs = (b.inRealClinics?.items || [])
    .map((it) => {
      const article = NEWS_BY_SLUG.get(it.slug);
      if (!article || !it.image) return null;
      return { slug: it.slug, image: it.image, alt: it.alt, title: plain(article.title), date: article.date };
    })
    .filter(Boolean);

  // With no install photographs yet, the chair's related articles stand in.
  const news = (b.relatedNews || [])
    .map((s) => {
      const article = NEWS_BY_SLUG.get(s);
      if (!article || !article.image) return null;
      return { slug: s, image: article.image, alt: plain(article.title), title: plain(article.title), date: article.date };
    })
    .filter(Boolean);

  const insp = b.inspectionAndInstallation || {};
  return {
    stories: installs.length ? { kind: 'installs', items: installs } : { kind: 'news', items: news },
    inspection: {
      checklist: insp.checklist || [],
      photos: (insp.media || []).slice(0, 2),
    },
  };
}
