// Catalog serialization for the agent-ready storefront (Plan 02).
// Turns src/data/products.js into clean, agent-consumable JSON.
// SPECS-ONLY by design — no pricing is exposed (price stays a human conversation / lead).
import { products, categories, getProductBySlug, getProductsByCategory } from '@/data/products';

const SITE = 'https://dentasourcedirect.com';

// Slug → canonical page route. Source of truth for chairs is
// src/lib/schemas/chairPages.js (ROUTE_TO_SLUG); mirrored here inverted so this
// module has no schema.org dependency. Keep in sync if chair routes change.
const SLUG_TO_ROUTE = {
  'roson-dxa3': '/a3',
  'roson-dxa3l': '/a3l',
  'roson-dxa3s': '/a3s',
  'roson-dxs3': '/s3',
  'roson-dxs6': '/s6',
  'roson-s9': '/s9',
  'roson-dxn1': '/n1',
  'roson-dxn2-pro': '/n2-pro',
  'roson-dxn2plus': '/n2-plus',
};

// Human-friendly labels for the category ids actually present on products.
// (products.js `categories` omits 'chair', which the chair products use.)
const CATEGORY_LABELS = {
  chair: 'Dental Chairs',
  imaging: 'Imaging & X-Ray',
  endo: 'Endodontics',
  curing: 'Curing & Filling',
  sterilization: 'Sterilization',
  accessories: 'Accessories',
};

function absUrl(path) {
  if (!path) return null;
  return path.startsWith('http') ? path : `${SITE}${path}`;
}

// Canonical product page URL, or null when a product has no dedicated page.
export function productUrl(product) {
  const route = product.detailPath || SLUG_TO_ROUTE[product.slug] || null;
  return absUrl(route);
}

function productImage(product) {
  const img = product.heroImage || (product.images && product.images[0]) || null;
  return absUrl(img);
}

// Compact card for the list endpoint.
export function serializeSummary(product) {
  return {
    slug: product.slug,
    name: product.name,
    category: product.category,
    categoryLabel: CATEGORY_LABELS[product.category] || product.category,
    badge: product.badge || null,
    tagline: product.tagline || null,
    shortDesc: product.shortDesc || null,
    url: productUrl(product),
    image: productImage(product),
  };
}

// Full record for the detail endpoint. Specs + features are the gold for agents;
// marketing deep-dives and configurator internals are intentionally omitted.
export function serializeProduct(product) {
  return {
    ...serializeSummary(product),
    description: product.description || null,
    features: product.features || [],
    specs: product.specs || {},
    images: (product.images || []).map(absUrl),
  };
}

// Distinct categories actually present in the catalog, with counts + labels.
export function catalogCategories() {
  const counts = {};
  for (const p of products) counts[p.category] = (counts[p.category] || 0) + 1;
  return Object.keys(counts)
    .sort()
    .map((id) => ({ id, label: CATEGORY_LABELS[id] || id, count: counts[id] }));
}

export function allSummaries(categoryId) {
  const list =
    categoryId && categoryId !== 'all'
      ? getProductsByCategory(categoryId)
      : products;
  return list.map(serializeSummary);
}

export function fullProduct(slug) {
  const p = getProductBySlug(slug);
  return p ? serializeProduct(p) : null;
}

export const CATALOG_SITE = SITE;
// Re-export so route handlers don't need a second import of products.js.
export { categories as rawCategories, products as rawProducts };
