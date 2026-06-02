// GET /api/catalog — public, machine-readable product catalog for AI agents.
// SPECS-ONLY (no pricing). Part of the agent-ready storefront (Plan 02).
//   ?category=chair|imaging|endo|curing|sterilization|accessories  (optional filter)
import { allSummaries, catalogCategories, CATALOG_SITE } from '@/lib/catalog';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  // Public catalog: cache at the edge for an hour, allow stale while revalidating.
  'Cache-Control': 'public, max-age=600, s-maxage=3600, stale-while-revalidate=86400',
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const products = allSummaries(category);

  return Response.json(
    {
      site: CATALOG_SITE,
      business: 'DentaSource Direct',
      note: 'Specs-only catalog. Pricing and stock are by inquiry — POST /api/leads or see /auth.md. Full record per item: GET /api/catalog/{slug}.',
      categories: catalogCategories(),
      count: products.length,
      products,
    },
    { headers: CORS }
  );
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}
