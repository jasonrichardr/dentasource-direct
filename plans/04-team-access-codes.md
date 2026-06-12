# Plan 04 — Team Access Codes: the DSD Team Console

**Status:** ACTIVE 2026-06-12 (Jarich: "add a button for my team login… 7 codes… a dashboard inside the website to assist clients").
**Base:** origin/main `42358ca`. Worktree `~/Antigravity/dsd-team-codes`, branch `feat/team-access-codes`. One PR, target < 300 lines (trim polish before safety if over).
**Stack rules:** No new npm deps (Node `crypto` is built in). No emojis in site copy. Match the portal visual language (#1a3c34, #F8F7F4, ink #1D1D1F, emerald accents, rounded-2xl, ring-1 ring-black/[0.06]).

## The shape
Seven access codes, one per team member. A code is never stored — only its SHA-256 hex hash, in a `TeamMember` row. Logging in with a code mints a DB-backed session (`TeamSession` row + 32-byte random token in an httpOnly cookie). The team dashboard at `/team` reuses the existing `InboxTable` so staff can read threads, reply as DSD, and resolve/reopen. Owner surfaces (`/admin/leads`, `/admin/warranties`, `/admin/inbox`) stay `isAdminEmail`-only.

## Tasks

1. **Schema** — add to `prisma/schema.prisma` (run `npx prisma generate` ONLY — never `db push`/`migrate`; prod DDL is applied surgically at ship time):
   ```prisma
   model TeamMember {
     id         String        @id @default(cuid())
     name       String
     codeHash   String        @unique // sha256 hex of the access code; plaintext never stored
     active     Boolean       @default(true)
     lastUsedAt DateTime?
     sessions   TeamSession[]
     createdAt  DateTime      @default(now())
   }

   model TeamSession {
     id           String     @id @default(cuid())
     token        String     @unique
     teamMemberId String
     teamMember   TeamMember @relation(fields: [teamMemberId], references: [id], onDelete: Cascade)
     expiresAt    DateTime
     createdAt    DateTime   @default(now())
     @@index([token])
   }
   ```
   → verify: `prisma generate` green.

2. **`src/lib/team.js`** — the team identity helper:
   - `getTeamMember()`: read cookie `dsd_team` via `next/headers` `cookies()`; look up `TeamSession` (include member); if missing/expired/`!active` return null (delete the expired session row best-effort). Returns `{ id, name }`.
   - `teamLogin(code)`: sha256 the code, find active `TeamMember` by `codeHash`; on hit create `TeamSession` (token = `crypto.randomBytes(32).toString('hex')`, expires 30 days), update `lastUsedAt`, return `{ token, expiresAt, name }`; on miss return null.
   - `teamLogout(token)`: delete the session row.
   - In-memory rate limit on login attempts (same pattern as `/api/leads`): max 10 tries / 10 min per key; the server action keys on a best-effort IP from `headers()`.
   → verify: identity only ever derived from the cookie token; no code or hash accepted from params at read time.

3. **Server actions `src/actions/team.js`** (`'use server'`):
   - `teamSignIn(formData)`: rate-limit → `teamLogin(code.trim().toUpperCase())` → on success set cookie `dsd_team` (httpOnly, secure, sameSite 'lax', path '/', maxAge 30d) → `redirect('/team')`. On failure return `{ error: 'That code did not work. Check it and try again.' }`.
   - `teamSignOut()`: read cookie, `teamLogout`, clear cookie, `redirect('/team/login')`.
   → verify: cookie flags exactly as specified.

4. **Staff gate on existing surfaces** — extend, don't loosen:
   - `src/actions/message.js`: `sendAdminReply` and `setThreadStatus` authorize when `isAdminEmail(user?.email)` **OR** `await getTeamMember()` is non-null. Keep behavior identical otherwise (sender stays `'DSD'`).
   - `src/app/api/admin/threads/route.js`: same OR-gate so the `/team` dashboard's 4s polling works.
   - DO NOT touch the gates on `/admin/leads`, `/admin/warranties`, `/admin/inbox` pages — owner-only stays owner-only.
   → verify: a request with neither admin session nor team cookie still gets 403/`Not authorized`.

5. **`/team/login` page** — branded card matching `/login` (small client component + server action): heading "DentaSource team", sub "Enter your access code to open the team console.", one input (placeholder `DSD-XXXX-XXXX`, autoComplete off, uppercase on input), submit "Open the console", inline error state, link back "Customer? Sign in here" → `/login`. `robots: noindex`.
6. **`/team` page** — server component: `const member = await getTeamMember()`; null → `redirect('/team/login')`. Query threads exactly like `/admin/inbox` does and render `<InboxTable threads={data} />` under a slim header: "Team Console — signed in as {member.name}" + a sign-out button (form action `teamSignOut`). `robots: noindex`, `dynamic = 'force-dynamic'`.
   → verify: build green; no Supabase dependency on this path.
7. **`/login` card button** — under the existing form (below "Email me a login link", separated by the same hairline OR-divider style), add a quiet secondary button/link: "DentaSource team? Sign in with your access code" → `/team/login`. Keep it visually subordinate to the customer flow.
   → verify: customer flow untouched; link navigates.

8. **Screenshots (gate, best-effort)** — `npm run dev` in the worktree, screenshot `/login` and `/team/login` (and `/team` redirect behavior) with the Playwright MCP browser; save PNGs to `/tmp/dsd-team-*.png`. If the dev server or MCP fights you for more than a few minutes, skip and say so.

## Gates
`npm run lint` (repo baseline only — 16 pre-existing problems) + `npm run build` green. No DB commands. No new deps. One commit on `feat/team-access-codes`; do not push.

## Ship sequence (owner-gated, not yours)
`prisma migrate diff` → filter to the new-table statements only (prod has known `updatedAt` DEFAULT drift — never blanket-push) → `db execute` → seed 7 hashed members → merge → Netlify → live verify.
