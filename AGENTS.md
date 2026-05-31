# AGENTS.md — DentaSource Direct

The AI-brain for this repo. Read before changing anything. Cross-vendor (Claude, Cursor, Codex all read this file).

## What this is
The web property for **DentaSource Direct (DSD)** — the exclusive ROSON/Denjoy dental-equipment distributor in the Philippines (largest showroom, Pasig City). Today: a marketing/catalog site + an owner admin (`/admin/leads`). Tomorrow: a customer portal. North star: the **#1 digitally-advanced dental supplier in PH**. Full roadmap lives in the Obsidian command center (`~/second-brain/builds/dentasource-direct/COMMAND-CENTER.md`).

## Stack (do NOT rewrite — extend it)
- **Next.js 16** App Router · **React 19** · **Tailwind 3** · **Prisma 5** → **Postgres (Supabase)**
- **Auth: Supabase email magic-link** via `@supabase/ssr` (Clerk + svix were removed — do not reintroduce them)
- **Deploy: Netlify** (`ubiquitous-croissant-30d0d9`), production = the `main` branch
- Package manager: **npm**. Node 20+.

## Auth model (important)
- One Supabase project (`ewhjwimtywhbycgecnjw`), one magic-link flow, two authorization surfaces:
  - `/admin/*` → **owner email allow-list** (`src/lib/admin.js`, `isAdminEmail`). Closed set.
  - `/portal/*` (future) → **`ClinicUser` row lookup** by `user.email` → a `clinicId` (the tenant boundary). Open, data-driven.
- Middleware (`src/proxy.ts`) only checks "is there a session" and redirects to the right login. Per-surface authorization happens in the page/helper.
- Login UI: `signInWithOtp` (true magic-link, "the email suffices"). `/auth/callback` exchanges the code. Reuse these verbatim for the portal.

## Locked voice / content rules (non-negotiable — see the `dsd-product-page` skill)
1. **No competitor brand names** in user-facing copy. No head-to-head spec tables. DSD products stand on their own.
2. **Real product photos only.** AI imagery is for atmosphere, never as the product.
3. **Pasig showroom**, never Manila.
4. **No emojis in production UI** — use `lucide-react` icons, each semantically meaningful.
5. Peer voice — no "po"/"opo" in customer copy.
6. Messenger handle is **`m.me/dentasource`** (the real FB page). Not `dentasourcedirect`.

## How we build here (the discipline)
- **Plan before code.** Numbered plan files in `plans/NN-*.md` (Goal / Architecture / Tech Stack / Tasks). Refactors: Task 1 = "preserve current behavior."
- **Small PRs (<300 lines)** on feature branches off `main`. Never commit straight to `main` for features.
- **Gate before merge:** `npm run build` must pass (it runs `prisma generate && next build` = compile + typecheck + lint). Treat green build as the bar until a dedicated `check` script + Greptile reviewers land (Phase 3).
- **Screenshot any visible change + get owner go-ahead before deploying.** Never claim "shipped" until verified on the live URL.
- **14-day package rule:** never install an npm dependency younger than 14 days without a deliberate human OK (`npm view <pkg> time`).
- **After each feature, refactor for structure** — pull duplicated mechanics into shared modules. Known debt: ~4,000 LOC of duplicated `*Landing.jsx`/`*VisualTour.tsx` → collapse into one config-driven product engine (`/denjoy/[slug]` proves the pattern).

## Deploy
```bash
# from a verified feature branch, merged to main:
git push origin main      # triggers Netlify production deploy
```
Env lives in Netlify (and gitignored `.env.local` locally). Public keys: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Secrets: `DATABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`. The DB has a keep-alive GitHub Action (`/api/health`) so the free Supabase project never pauses.

## Key paths
- `src/lib/supabase/{server,client}.js` — Supabase clients (reuse) · `src/proxy.ts` — auth gate
- `src/lib/admin.js` — owner allow-list · `src/app/admin/leads/` — admin dashboard (template for new admin pages)
- `src/actions/lead.js` — lead capture (Prisma write + email) · `prisma/schema.prisma` — data model
- `plans/` — numbered plan files
