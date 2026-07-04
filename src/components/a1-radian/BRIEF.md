# A1 Pro — rideradian-DNA section build brief (READ FIRST)

You are building ONE section component for the ROSON A1 Pro product page in the
"rideradian" design DNA. Read these three files before writing (they are the
source of truth and the style exemplar):

- `./primitives.jsx`  — the shared components you MUST use (do not re-implement).
- `./content.js`      — all copy + asset paths. Import your section's content; never hardcode strings that exist there.
- `./sections/HeroColorMorph.jsx` — the GOLD-STANDARD exemplar. Match its idiom exactly.

## Non-negotiable laws
1. **No new dependencies.** Only: `react`, `framer-motion` (import the motion component as `m`: `import { m } from 'framer-motion'`), `next/image`, `next/link`, `lucide-react` (icons, if truly needed), and the local `../primitives` + `../content`.
2. **Motion = transform + opacity ONLY.** Native scroll (no scroll hijack). Use `useScroll`/`useTransform` for scrubs, `whileInView` for reveals. Everything must honor `useReducedMotion()` — provide a static fallback (no pin, no scrub) when reduced.
3. **Two radii only:** full pill (controls) and 6px (media). **Zero shadows.** Depth comes from photography + the dark/light theme flip.
4. **One signal color:** emerald `var(--signal)` (#10b981) for CTAs, ticks, active accents. Orange `var(--ember)` only for rare hovers. Everything else is ink/bone/muted. The product photos carry all other color — never tint UI with pastels.
5. **Typography:** headings use class `radian-h` (Instrument Sans, weight 500, tracking −2.5%, leading ~1.02). Mono labels use `<MonoLabel>`/`<Eyebrow>` (IBM Plex Mono, uppercase). Body ~15px. Kill text density — say less, bigger. Max 5 things per cluster.
6. **DSD voice laws:** NO competitor brand names. NO emojis in UI (use lucide-react icons or the primitives' SVGs). "Pasig" showroom (never Manila). Real product angles only. Learning-first tone (no "#1" hype).
7. **Mobile-first, 390px must be flawless.** Full pinned scrubs are allowed on mobile but must stay 60fps (transform/opacity only, pre-sized images). Test mentally at 390px: no horizontal overflow, tap targets ≥40px, text legible.

## Design tokens (available inside the `.radian` wrapper — the page provides it)
CSS vars: `--ink #0A1410` · `--ink-raised #131c17` · `--bone #F5F5F7` · `--signal #10b981` · `--ember #F26522` · `--muted #7c8a83` (ghost text on dark) · `--muted-ink #6b7280` (ghost on light) · `--line` / `--line-ink` (hairlines) · `--ease` / `--ease-soft`.
Use them via Tailwind arbitrary values, e.g. `text-[var(--muted)]`, `bg-[var(--ink-raised)]`, `border-[var(--line)]`.
Tailwind font families: `font-display` (Instrument) · `font-mono` (Plex). Brand colors: `text-brand-green`, etc.

## Type scale (use clamp for fluidity)
- display (ONE per page, closing only): `text-[clamp(3rem,7vw,5.5rem)]`
- h2 section title: `text-[clamp(2rem,4.5vw,3rem)]`
- h3: `text-[clamp(1.5rem,3vw,2.25rem)]`
- body: `text-[15px] leading-snug`
- mono label: 11px (via `<MonoLabel>`)

## Rhythm & layout
- Section shell: use `<SectionWrap theme="dark|light" pad="py-[104px] md:py-[144px]" id="...">`. It provides the max-w-[1200px] container + horizontal padding. Pass `container={false}` for full-bleed sections and build your own inner container.
- Spacing ladder: 6 · 12 · 18 · 24 · 36 · 48 · 96 · 144 (Tailwind: gap-1.5, gap-3, gap-[18px], gap-6, gap-9, gap-12, py-24, py-36).
- Vertical hairline dividers `border-[var(--line)]` are on-brand (editorial).

## Primitives API (import from `../primitives`)
- `<Pill href variant="primary|ghost|solid" icon="arrow|plus">Label</Pill>` — the only button. primary=emerald, ghost=outline of current color, solid=ink-on-bone.
- `<MonoLabel as="span" className>` and `<Eyebrow signal className>text</Eyebrow>` (eyebrow has a leading tick; `signal` makes it emerald).
- `<MediaCard src alt caption priority sizes className imgClassName />` — 6px-radius image via `fill`; the PARENT you place it in must be `relative` with an explicit height/aspect. Optional mono caption chip pins bottom-left.
- `<SpecTick label value />` — mono spec line with emerald dot + hairline top.
- `<SectionWrap theme pad container id className>` — section shell.
- `<FadeUp delay className as="div">` — scroll reveal (transform+opacity). Or spread the `fadeUp` object onto an `m.*` element.
- `Arrow`, `Plus` — circled icon glyphs.

## Contrast rhythm (your section's assigned theme is in your task)
Hero(light) → Spotlight(dark) → Statement(dark, full-bleed image) → Editorial(light) → ColorMarquee(dark) → TechSpecs(dark) → Closing(dark).

## Output
Write exactly one file at the path in your task. Start with `'use client';`. Export default the section component (no props). Return a short summary of what you built + a self-check that you followed every law above.
