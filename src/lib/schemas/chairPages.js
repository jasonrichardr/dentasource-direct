import { products } from '@/data/products';
import { productGraph, breadcrumbGraph } from './product';

// Maps each canonical chair landing route to the product slug in src/data/products.js.
// Source of truth for which routes display which chair.
const ROUTE_TO_SLUG = {
  '/a3': 'roson-dxa3',
  '/a3l': 'roson-dxa3l',
  '/a3s': 'roson-dxa3s',
  '/s3': 'roson-dxs3',
  '/s6': 'roson-dxs6',
  '/s9': 'roson-s9',
  '/n1': 'roson-dxn1',
  '/n2-pro': 'roson-dxn2-pro',
  '/n2-plus': 'roson-dxn2plus',
};

export function chairSchemas(routePath) {
  const slug = ROUTE_TO_SLUG[routePath];
  if (!slug) return null;
  const product = products.find((p) => p.slug === slug);
  if (!product) return null;
  return {
    product: productGraph(product, { urlPath: routePath }),
    breadcrumb: breadcrumbGraph(product, routePath),
  };
}
