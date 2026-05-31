# Plan 00 — DSD Website: The Skilled-Chain Program (overview)

**Status:** ACTIVE — decided via build-pipeline 2026-05-31 (GO: "Full chain, sequenced").
**Repo:** github.com/jasonrichardr/dentasource-direct · **Deploy:** Netlify (`ubiquitous-croissant-30d0d9`)
**Stack (keep as-is):** Next.js 16 / React 19 / Tailwind 3 / Prisma + Postgres (Supabase) / Clerk auth.

---

## Goal (the end-state)
Turn the vibe-coded DSD marketing site into a professionally-engineered, **measurable, money-capturing** web property — without changing the stack. "Done" means Jarich can:
1. See every lead in a dashboard he logs into.
2. See site traffic in analytics (today the site is blind).
3. Trust the lead pipeline never silently fails.
4. Ship a new product page as a **data object**, not a 700-line copy.
5. Rely on a discipline scaffold (AGENTS.md, a test gate, PR reviewers) so future work is never vibe-coded again.

## Why (the honest frame)
The site is well-built for its stage but **blind** (no analytics), **slightly leaky** (a broken Messenger link + a lead DB that fell asleep), and **undisciplined** (no AGENTS.md / gate / tests, ~4,000 LOC of duplicated product-page code). The website is **not** DSD's #1 revenue lever — Google Business Profile + Facebook is. That runs as a parallel non-code track. The cheap, high-leverage site fixes and the engineering discipline are still worth shipping.

## The four phases — each ships as small, gated PRs
| Phase | Plan file | What | Why first |
|---|---|---|---|
| **P0** Instrument & secure | `plans/01-p0-instrument-and-secure.md` | See the data, stop the leaks, wake + de-risk the lead DB, build `/admin/leads`, add analytics. | You can't optimize a funnel you can't see. Front-loads measurement so nothing later is vanity. |
| **P1** Discipline scaffold | `plans/02-p1-discipline-scaffold.md` | AGENTS.md, command-center, the `check` gate, opensrc, PR discipline. | Stops work from being vibe-coded. |
| **P2** Kill duplication | `plans/03-p2-product-engine.md` | Collapse 5 `*Landing.jsx` + 9 `*VisualTour.tsx` into one config-driven engine (like `/denjoy/[slug]` already proves). | New SKU becomes a data object; biggest engineering win — safest after the gate exists. |
| **P3** Operate | `plans/04-p3-harness.md` | harness-engineering persona PR reviewers + CI running the gate. | Only makes sense once there's a clean V1 to defend. |

## Verification gate (per agentic-engineering discipline)
Every PR: **< 300 lines**, `/grep-loop` + review to **5/5**, **`npm run check`** (to be created in P1) green, **screenshot before any visible change**, Jarich go-ahead **before** Netlify deploy. Never claim "shipped" until verified on the live URL.

## Parallel track (non-code — flagged, not owned by this plan)
Claim + fully optimize the Google Business Profile, generate 50+ reviews, run one Meta campaign to dentists in NCR/Cebu/Davao. This is the real near-term money lever for a PH dental-equipment distributor whose deals close at the showroom.
