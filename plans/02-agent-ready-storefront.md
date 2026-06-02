# Plan 02 — Agent-Ready Storefront (auth.md applied)

> Full reasoning + business case: `~/second-brain/builds/dentasource-direct/2026-06-03_agent-ready-storefront-plan.md`
> Source idea: godlike-learning seed `auth-md-agent-native-authentication` (Build #1).

## Goal
Let an AI agent (and our own team's Claude/Lodestar) discover DSD, read the catalog as JSON, query it via MCP, and submit an inquiry on a clinic's behalf — with no human clicking anything. Heavy agent-identity (ID-JAG/tokens) is DEFERRED (verdict: WATCH+PREP).

## Architecture (extend, don't rewrite)
- Catalog data stays in `src/data/products.js` (no DB migration — separate TODO).
- New shared module `src/lib/catalog.js` serializes products for agents (specs-only, NO pricing).
- New public read API (route handlers) + one spam-guarded write endpoint that reuses the existing lead pipeline.
- `public/auth.md` + upgraded `public/llms.txt` for discovery.

## Tasks
1. `src/lib/catalog.js` — `serializeProduct` (summary/full), `productUrl(slug)` (invert chairPages ROUTE_TO_SLUG + detailPath), `catalogCategories()`. → verify: unit-importable, returns absolute URLs.
2. `GET /api/catalog` — `{ site, categories, count, products[summary] }`, `?category=` filter, CORS + cache headers. → verify: `curl | jq '.count'` == products length; `?category=endo` filters.
3. `GET /api/catalog/[slug]` — full product or 404 JSON. → verify: `/api/catalog/roson-dxa3` returns specs+features.
4. `POST /api/leads` — JSON inquiry → validate → `prisma.lead.create` (message prefixed "[via AI agent / auth.md]", status NEW) + honeypot + in-memory rate-limit + CORS/OPTIONS. → verify: creates a NEW lead; honeypot + flood are dropped.
5. `public/auth.md` — honest spec: catalog public (no reg), inquiry via anonymous lead flow, scopes declared. → verify: served at root.
6. `public/llms.txt` — fix stale `/products` link (→ `/dentalchairs`), add `## For AI agents` section. → verify: no dead links.

## Gate
`npm run build` green. Small PR on `feat/agent-ready-storefront`. No new npm deps. No emojis. No competitor names. Pasig showroom. Owner verifies live URL before deploy.

## Deferred (Phase 5, demand-gated)
Full ID-JAG agent-verified registration + scoped per-clinic tokens + WorkOS AuthKit one-click. Trigger: recurring agent traffic on `/api/catalog` or `/api/leads`, or a customer asks for programmatic access. Revisit on the +90d seed refresh (2026-08-31).
