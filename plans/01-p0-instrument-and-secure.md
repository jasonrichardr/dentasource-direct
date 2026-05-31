# Plan 01 — P0: Instrument & Secure

**Goal:** Make the DSD site measurable and stop active lead loss. After P0, Jarich can see his leads and his traffic, and the lead pipeline is reliable instead of silently failing.

## Context verified 2026-05-31 (read the real repo, not a summary)
- **Lead flow:** contact form → `submitLead` server action (`src/actions/lead.js`) → Prisma write to Postgres **and** an email to `dentasourcedirect@gmail.com` (via formsubmit.co). It calls `revalidatePath('/admin/leads')` — but `/admin` **does not exist**.
- **Database:** Supabase project `ewhjwimtywhbycgecnjw` ("DentaSource Direct website") was **PAUSED** (free-tier auto-sleep). `DATABASE_URL` is **absent from `.env.local`** (lives only in Netlify env) → local Prisma can't connect, and while the DB sleeps, writes fail and **only the email saved the lead**.
- **Analytics:** NONE in `src/app/layout.js`. The site cannot measure a single visit or Messenger click.
- **Broken Messenger link:** `src/components/contact/ShowroomInfo.jsx:64` → `m.me/dentasource` (should be `dentasourcedirect`). A live, lead-losing dead button. (The Denjoy components use the correct handle.)
- **Clerk:** installed, wraps the whole app, protects nothing. It will finally earn its keep guarding `/admin`.
- **No `netlify.toml`** in the repo — build config is dashboard-only (not reproducible from source).

## Tasks — each a small PR with an explicit verify (Karpathy goal-driven)
1. **Wake + de-risk the lead database.**
   → verify: project `ACTIVE_HEALTHY`; `SELECT count(*) FROM "Lead"` returns a number; Jarich picks a pause-prevention path (A: paid tier, B: a scheduled keep-alive ping, C: treat email as primary + DB as ledger). **[Jarich decision]**
2. **Fix the broken Messenger handle** in `ShowroomInfo.jsx`.
   → verify: the showroom "Message us" link resolves to `m.me/dentasourcedirect` on the live page.
3. **Wire `DATABASE_URL`** into `.env.local` (pooler connection string for the Supabase project) and confirm it in Netlify.
   → verify: a local read of the `Lead` table via Prisma succeeds (`npx prisma db pull` connects).
4. **Build `/admin/leads`** — a dashboard behind Clerk auth: list every lead, change status (NEW → CONTACTED → DEMO_SCHEDULED → CLOSED_WON / CLOSED_LOST — already in the schema), search, CSV export.
   → verify: logged in → see + manage leads; logged out → redirected to sign-in. Spot-checked on the live URL.
5. **Add analytics + conversion tracking.** GA4 via `@next/third-parties` (ships with Next — no young-package risk) or Plausible; Meta Pixel firing a `Lead` event on `submitLead` success and a `Contact` event on Messenger-button click.
   → verify: events land in GA / Meta Events Manager from the live URL.
6. **Commit `netlify.toml`** so the build is reproducible from source.
   → verify: a Netlify deploy succeeds using the committed config.

## Out of scope for P0 (don't scope-creep)
AGENTS.md + the gate (P1), the de-duplication refactor (P2), the harness (P3), and the GBP/Facebook track (parallel). No new npm dependencies younger than 14 days without a deliberate OK.
