// GET /api/catalog/[slug] — full record for one product (specs + features, no pricing).
// Part of the agent-ready storefront (Plan 02).
import { fullProduct } from '@/lib/catalog';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Cache-Control': 'public, max-age=600, s-maxage=3600, stale-while-revalidate=86400',
};

export async function GET(_request, { params }) {
  // Next.js 16: route handler params is async.
  const { slug } = await params;
  const product = fullProduct(slug);

  if (!product) {
    return Response.json(
      { error: 'not_found', slug, hint: 'List all products at /api/catalog' },
      { status: 404, headers: CORS }
    );
  }

  return Response.json({ product }, { headers: CORS });
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}
