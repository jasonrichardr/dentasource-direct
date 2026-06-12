# Plan 03 — Portal v2: The Living Messenger + Account Hub

**Status:** ACTIVE 2026-06-12 (Jarich: "make the sign-in feature really useful… messenger chat connected to their user login so the inquiry won't get lost").
**Base:** origin/main `e9ed9f9`. Worktree `~/Antigravity/dsd-portal-v2`. Two stacked branches, each its own PR < 300 lines.
**Stack rules:** No new npm deps. No emojis in site copy. Follow AGENTS.md. Apple-premium DSD brand (white canvas, emerald `#10b981` soul, ink `#1D1D1F`, existing portal palette `#1a3c34` / `#F8F7F4`).

## Why v2
v1 (commit b294116, live) proved the shape: Supabase login → one Thread per customer → /admin/inbox. But the chat is frozen (replies appear only on refresh), sends fail silently (optimistic msgs never reconciled), "Your equipment" is a placeholder, and contact-form Leads are invisible to the logged-in customer.

---

## PR 1 — `feat/portal-v2-live-chat` (the chat becomes alive)

1. **`GET /api/portal/thread`** (route handler) — requires Supabase user; returns own thread `{ status, messages: [{id, sender, body, createdAt}] }` (empty shape if no thread). `Cache-Control: no-store`.
   → verify: unauth'd curl gets 401 JSON; code review confirms email comes from `supabase.auth.getUser()`, never from params.
2. **`GET /api/admin/threads`** — requires `isAdminEmail`; returns all threads with messages (same serialization as the page).
   → verify: non-admin gets 403.
3. **PortalHome live updates** — poll the route every 4s, only while `document.visibilityState === 'visible'` (clear interval on hide/unmount). Server list REPLACES local state; keep only still-pending optimistic msgs appended after it. Failed `sendCustomerMessage` (returned `{error}` or thrown): remove the tmp bubble, restore the text into the textarea, show an inline error line with the reason.
   → verify: build green; reconciliation logic has no duplicate-key path (tmp msgs dropped once server copy arrives — match on body+sender of trailing pending msgs is acceptable v2 heuristic).
4. **InboxTable live updates + status workflow** — same 4s visible-only polling of `/api/admin/threads`; preserve which thread is open. New server action `setThreadStatus(threadId, status)` in `src/actions/message.js` (admin-gated, status whitelist OPEN|ANSWERED|RESOLVED). Buttons in ThreadView header: "Mark resolved" / "Reopen". Thread list: OPEN threads first (then lastMessageAt desc), OPEN gets the amber ring it already has.
   → verify: action rejects non-admin and bad status values.
5. **Customer status chip** — above the chat: OPEN+last msg is CUSTOMER → "Sent — we reply within the day"; ANSWERED → "DentaSource replied"; RESOLVED → "Resolved — message us anytime".
   → verify: visual states covered by the three statuses; no new copy with emojis.

Gate: `npm run lint` + `npm run build` green in the worktree. Diff < 300 lines.

## PR 2 — `feat/portal-v2-account-hub` (sign-in becomes genuinely useful) — stacked on PR 1

1. **"Your inquiries" card** — `/portal` page also queries `prisma.lead.findMany({ where: { email }, orderBy: { createdAt: 'desc' }, take: 10 })`. Replace the "After-sales" placeholder card with a real list: interest + date + friendly status (NEW→"Received", CONTACTED→"In progress", DEMO_SCHEDULED→"Demo scheduled", CLOSED_WON→"Completed", CLOSED_LOST→"Closed"). Empty state keeps a one-line promise.
   → verify: query filters by the signed-in email only.
2. **Real equipment card** — schema: add `customerEmail String?` + `@@index([customerEmail])` to `Warranty`. DO NOT run `prisma db push` from the worktree — prod DB change happens at ship time (additive nullable column; command goes in the PR description). Portal queries warranties by email → cards: productName, serialNumber, warranty window, ACTIVE (days left) / EXPIRED computed from `warrantyEnd`. Admin warranty create form (`/admin/warranties`) gains optional "Customer email (links to their portal account)" field.
   → verify: `prisma generate` ok; portal handles zero warranties with the existing placeholder copy.
3. **Customer reply notification (env-gated, best-effort)** — in `sendAdminReply`, after save: if `process.env.RESEND_API_KEY` is set, `fetch('https://api.resend.com/emails')` → to customerEmail, from `process.env.PORTAL_FROM_EMAIL || 'DentaSource Direct <onboarding@resend.dev>'`, subject "DentaSource replied to your message", short text + link to `https://dentasourcedirect.com/portal`. Wrapped in try/catch like `notifyDsd`. No key → skip silently.
   → verify: code path inert without env; no new deps.
4. **Contact form hook** — on the lead form's success state, add one line: "Sign in with this email to track your inquiry in your account" linking `/login?next=/portal`. Find the form component via the `/api/leads` or `createLead` usage.
   → verify: link present only in success state; styling matches form.

Gate: same as PR 1. Both branches committed locally; Jarich's word required before push/PR/merge/deploy and before the prod `prisma db push`.

## Deferred (v3, demand-gated)
Supabase Realtime instead of polling · file/photo attachments in chat · order tracking · multi-thread per customer · unread badges in site nav.
