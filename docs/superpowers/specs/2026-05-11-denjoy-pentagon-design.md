# /denjoy Pentagon Landing — Design Spec

**Date:** 2026-05-11
**Status:** Approved · ready for implementation plan
**Owner:** Jarich (DSD) · Lodestar (design)
**Branch:** `feat/denjoy-pentagon-2026`
**Replaces:** existing `/denjoy` (commits up to `86c7d4a`)

---

## 1 · Why this exists

The current `/denjoy` page renders a single `ProductPanel` component four times in a `.map()`, alternating only the image side. That repeating-slab pattern is the "template" feeling Jarich wants gone.

The product lineup is also changing for the 2026 push:

- **Retired:** `imate3`, `AIKE`
- **Added (9 new SKUs):** Meta Endo Pro I · Meta Endo · ix7 · ix6 · i-Moto · iUe1 · iCure · iPack · Meta Pack
- **Total products on the new landing:** **12** (every Denjoy SKU **except `iFinder`**)

Twelve products in a vertical ProductPanel slab map would amplify the template feel by 3×. We need a different organizing principle, not more polish.

---

## 2 · Goals

- Reinvent the visual paradigm — no slabs of repeated panels.
- Showcase 12 SKUs across 5 categories without overwhelming.
- Reuse the existing media stack: Higgsfield MCP (already installed), halodental-style serif typography (already locked on `/roray-xray`), `framer-motion` (already a dependency).
- Premium, cinematic feel — Apple-launch energy.
- Tell the system story in a single page — Meet Endo at the center, every other SKU orbits it.
- Differentiate from the locked Roray product-page pattern (so `/denjoy` doesn't read as one giant Roray).

## Non-goals

- Rebuilding `/denjoy/meet-endo` — it's the bespoke flagship page and stays as-is.
- Rebuilding the `/denjoy/[slug]` co-star template — it auto-handles the 9 new SKUs once they're in `denjoyProducts`.
- Adding a Meta Endo Pro I configurator on the landing — explicitly out of scope per Jarich ("don't add configurations of meta endo pro here on Denjoy landing").
- Building a new design system from scratch — we compose with what's already in the repo.

---

## 3 · Architecture — D + C combined

The landing is a top-to-bottom sequence of six sections. **Direction D (Cinematic Reel)** opens the page; **Direction C (Constellation System)** anchors the second viewport; everything else supports those two.

```
┌─────────────────────────────────────────────────┐
│ 1 · HERO                                         │ full-bleed Meet-Endo 43s loop
│   Meet-Endo brand film + serif tagline + CTA     │ + 2026 eyebrow (Hero C)
├─────────────────────────────────────────────────┤
│ 2 · CONSTELLATION                                │ single-viewport interactive map
│   ★ Meet Endo at center, 5 chapters orbit        │ pentagon geometry
├─────────────────────────────────────────────────┤
│ 3 · INLINE DETAIL                                │ slide-up card on node click
│   real product photo + 3-4 key features +        │ AnimatePresence
│   "see full page" + Messenger                    │
├─────────────────────────────────────────────────┤
│ 4 · CHAPTERS BAND                                │ linear fallback band
│   I → II → III → IV → V (5 cards)                │ also drives mobile collapse
├─────────────────────────────────────────────────┤
│ 5 · CTA                                          │ Joining Forces 23s loop bg
│   Pasig showroom + Messenger                     │ "brand bookend"
├─────────────────────────────────────────────────┤
│ 6 · SHORT FAQ                                    │ trimmed to 3 Q&As
│   for SEO long-tail only                         │ retained from existing
└─────────────────────────────────────────────────┘
```

### Retired sections
- `MeetEndoPanel` — Meet Endo is now the constellation center.
- `ProductPanel` ×4 — replaced by the constellation + chapters band.
- `DenjoyWhyPH` — content folded into hero context + CTA.
- Long FAQ — trimmed to 3 Q&As, kept for SEO.

### Sections kept from existing `/denjoy`
- `MessengerButton` — sticky mobile bar stays.
- `Lightbox` — used on detail pages, untouched.

---

## 4 · The 5 chapters (Pentagon)

Five chapters arranged at pentagon points (72° apart) around Meet Endo. Each chapter encodes a step of the endodontic workflow.

| # | Chapter | Position | Color | SKUs |
|---|---|---|---|---|
| **★** | Meet Endo (flagship) | center | `#ffffff → #cce4ff` glow | 1 |
| **I** | Integrated Systems | 0° (top) | `#ffd49a` | 3 — Meet Endo★ · Meta Endo Pro I · Meta Endo |
| **II** | Apex Locators | 72° (upper-right) | `#9ad4ff` | 2 — FREE PEX · i-Pexo |
| **III** | Microscopes | 144° (lower-right) | `#c4a4ff` | 2 — ix6 · ix7 |
| **IV** | Motors & Tools | 216° (lower-left) | `#ff9ad4` | 1 — i-Moto |
| **V** | Auxiliary & Packs | 288° (upper-left) | `#9affc4` | 4 — iUe1 · iCure · iPack · Meta Pack |

**Why pentagon, not square:** Microscopes (ix6, ix7) are premium new SKUs that deserve their own slot. The pentagon shape also reads as a clinical workflow loop. Chapter IV with one SKU (i-Moto) is acceptable — better than burying a motor under "auxiliary."

**Why these category names:** Sourced from Denjoy.cn's own product taxonomy (Apex Locator / Endo Integrated System / Medical Microscope / Endo Motor / Ultrasonic Activator). "Auxiliary & Packs" is our DSD-original phrasing for the bundle group.

---

## 5 · Hero (Direction D · variant "C · Active")

### Layout

```
┌────────────────────────────────────────────────────────┐
│  DENJOY · PHILIPPINES                          2026    │  eyebrow
│                                                        │
│                                                        │
│              [Meet-Endo 43s loop, full-bleed]          │
│                                                        │
│                                                        │
│  The Denjoy line —                                     │  italic serif tagline
│  finally, all of it. Locally.                          │  bold continuation
│                                                        │
│  CHAT ABOUT DENJOY →               SEE THE 12 ↓        │  CTA + scroll cue
└────────────────────────────────────────────────────────┘
```

### Specs

| Field | Value |
|---|---|
| **Brand film** | Meet-Endo 43s — `https://youtu.be/O6odfHoymqw` (yt-dlp'd, hosted local) |
| **Loop** | Yes, seamless |
| **Audio** | Muted (autoplay-required), no toggle in hero |
| **Poster frame** | First frame extracted via `ffmpeg`, shown until video buffers |
| **Mobile encode** | 720p re-encode at CRF 24 |
| **Eyebrow left** | `DENJOY · PHILIPPINES` (uppercase, 0.35em letterspace, 700 weight) |
| **Eyebrow right** | `2026` (replaces "EXCLUSIVE" — Jarich's correction) |
| **Tagline** | *"The Denjoy line —"* (italic Georgia 22-32px) ↵ ***"finally, all of it. Locally."*** (bold serif) |
| **CTA** | `CHAT ABOUT DENJOY →` opens Messenger with prefill `"Hi DSD, I'd like to chat about the Denjoy launch."` |
| **Scroll cue** | `SEE THE 12 ↓` bottom-center |
| **Tagline motion** | 0.9s fade-in + 12px upward drift on mount, then static |
| **Vignette** | Radial darken at edges for tagline contrast |

### Retired hero variants

- A · Pure Cinema — too contextless for cold visitors
- B · Editorial — too quiet, no click-driver

### Tagline rationale

"All of it. Locally." captures the new positioning: 12 SKUs (was 5), all local distribution. Italics + bold mirrors the halodental serif treatment locked on `/roray-xray`.

---

## 6 · Constellation (Direction C · Pentagon)

### Geometry

- **Center:** Meet Endo, ~11% width radius, white→sky gradient with two-layer glow.
- **Anchors:** 5 chapter anchors at pentagon points (32% from center, 72° apart).
- **SKU nodes:** smaller circles arrayed around their chapter anchor (3-4° spread).
- **Lines:** SVG paths from center → anchors, dotted orbit guides at two radii.
- **Background:** linear gradient `#06101e → #0d1626 → #1a2342` + subtle radial glows + 8 starfield dots.

### Interaction

| Event | Behavior |
|---|---|
| **Hover node** | Soft glow (scale 1.15) + tooltip with name + line glows from center |
| **Click node** | InlineDetail slides up below constellation; node stays "selected" gold |
| **Click another node** | InlineDetail content swaps (no close-then-open) |
| **Click Meet Endo center** | Routes to `/denjoy/meet-endo` (the bespoke flagship page) |
| **Hover anchor (not SKU)** | Anchor pulses; all SKUs in that chapter glow softly |
| **Click anchor** | Smooth-scroll to corresponding card in Chapters Band |

### Labels

- **Always visible:** Meet Endo center label · 5 chapter anchor labels · 8 ✦ NEW tags
- **On hover:** Per-SKU name tooltip (since 12 always-visible labels would be busy)

### ✦ NEW tag behavior

```js
const isNew = product.isNew && (Date.now() - new Date(product.launchedAt) < 90 * 24*60*60*1000);
```

8 SKUs flagged `isNew: true` with `launchedAt: '2026-05-11'`. Tag fades after 2026-08-09 (90d).

### Mobile fallback (`<= 720px`)

The constellation collapses to a vertical chapter list:

```
★ MEET ENDO (full-width hero card)
─────────────────────────────────
I · INTEGRATED SYSTEMS  3 SKUs
  · Meta Endo Pro I ✦
  · Meta Endo ✦
─────────────────────────────────
II · APEX LOCATORS  2 SKUs
  · FREE PEX
  · i-Pexo
─────────────────────────────────
III · MICROSCOPES  2 SKUs
  · ix6 ✦
  · ix7 ✦
─────────────────────────────────
IV · MOTORS & TOOLS  1 SKU
  · i-Moto ✦
─────────────────────────────────
V · AUXILIARY & PACKS  4 SKUs
  · iUe1 ultrasonic ✦
  · iCure ✦
  · iPack ✦
  · Meta Pack ✦
```

Same `<Constellation>` component, different layout via `useMediaQuery`. Tap-to-expand replaces hover.

### InlineDetail card

Slide-up animation via `framer-motion AnimatePresence`. Layout:

```
┌─────────────────────┬──────────────────────────────────┐
│                     │ CHAPTER III · MICROSCOPES        │
│  [product photo]    │ ix7 — wireless next-gen scope.   │
│                     │                                  │
│  4:3 aspect         │ • Feature 1                      │
│                     │ • Feature 2                      │
│                     │ • Feature 3                      │
│                     │                                  │
│                     │ [See full ix7 page →]  [Chat]    │
└─────────────────────┴──────────────────────────────────┘
```

---

## 7 · Data model

`src/data/denjoy.js` is restructured. Chapters become first-class.

### `denjoyChapters`

```js
export const denjoyChapters = [
  { id: 'integrated',  roman: 'I',   name: 'Integrated Systems',
    color: '#ffd49a',  position: 'top'         },         // 0°
  { id: 'apex',        roman: 'II',  name: 'Apex Locators',
    color: '#9ad4ff',  position: 'upper-right' },         // 72°
  { id: 'microscopes', roman: 'III', name: 'Microscopes',
    color: '#c4a4ff',  position: 'lower-right' },         // 144°
  { id: 'motors',      roman: 'IV',  name: 'Motors & Tools',
    color: '#ff9ad4',  position: 'lower-left'  },         // 216°
  { id: 'auxiliary',   roman: 'V',   name: 'Auxiliary & Packs',
    color: '#9affc4',  position: 'upper-left'  },         // 288°
];
```

### `denjoyProducts` schema

```js
{
  slug:        'meta-endo-pro-i',          // url path segment under /denjoy/
  name:        'Meta Endo Pro I',          // short name on constellation node
  fullName:    'Meta Endo Pro I Endodontic System',  // detail page H1
  tagline:     'Surf the canal with joy.',  // short hero line, written per product
  chapter:     'integrated',                // FK to denjoyChapters.id
  isFlagship:  false,                       // only Meet Endo is true
  isNew:       true,                        // ✦ tag — auto-fades after 90d
  launchedAt:  '2026-05-11',                // controls ✦ fade-out
  denjoyId:    58,                          // back-pointer to denjoy.cn/sys-pd/{id}.html
  denjoyUrl:   'http://www.denjoy.cn/sys-pd/58.html',  // data-only, never rendered
  heroImage:   '/images/denjoy/meta-endo-pro-i/hero.jpg',
  gallery:     ['/images/denjoy/meta-endo-pro-i/01.jpg', ...],
  keyFeatures: [/* 3-4 short bullets — extracted from real product images */],
  messengerText: "Hi DSD, I'd like to know more about the Meta Endo Pro I.",
  videos:      [/* {id, title, duration} for YouTube embeds on detail page */],
}
```

### All 12 products (final list)

| Slug | Chapter | New? | DenjoyID |
|---|---|---|---|
| `meet-endo` | integrated (★ flagship) | no | 22 |
| `meta-endo-pro-i` | integrated | ✦ yes | 58 |
| `meta-endo` | integrated | ✦ yes | 23 |
| `free-pex` | apex | no | 29 |
| `i-pexo` | apex | no | 31 |
| `ix7` | microscopes | ✦ yes | 24 |
| `ix6` | microscopes | ✦ yes | 25 |
| `i-moto` | motors | ✦ yes | 36 |
| `iue1` | auxiliary | ✦ yes | 41 |
| `icure` | auxiliary | ✦ yes | 39 |
| `ipack` | auxiliary | ✦ yes | 28 |
| `meta-pack` | auxiliary | ✦ yes | 26 |

### Helpers

```js
export const getProductsByChapter = (id) => denjoyProducts.filter(p => p.chapter === id);
export const getFlagship          = ()    => denjoyProducts.find(p => p.isFlagship);
export const getDenjoyBySlug      = (slug)=> denjoyProducts.find(p => p.slug === slug);
export const getNewProducts       = ()    => denjoyProducts.filter(p =>
  p.isNew && (Date.now() - new Date(p.launchedAt) < 90 * 86400000));
```

---

## 8 · Components

### New components

| File | Responsibility |
|---|---|
| `src/components/denjoy/Constellation.jsx` | The pentagon map. Reads `denjoyChapters` for anchor layout, calls `getProductsByChapter()` for each. SVG for lines + orbit guides; CSS-positioned divs for nodes (tap targets). |
| `src/components/denjoy/ConstellationNode.jsx` | One product dot. `framer-motion whileHover` glow. Emits `onSelect(slug)` on click. |
| `src/components/denjoy/ChapterAnchor.jsx` | The 5 cluster anchors with chapter label + SKU count + Roman numeral. |
| `src/components/denjoy/InlineDetail.jsx` | Slide-up card. `AnimatePresence` for mount/unmount. Reads selected slug from parent state. Real product photo + features + actions. |
| `src/components/denjoy/ChaptersBand.jsx` | Linear fallback band (5-card row). Doubles as mobile constellation collapse. |

### Refactored components

| File | Changes |
|---|---|
| `src/components/denjoy/DenjoyHero.jsx` | Replace stacked text with Hero C: `<video>` Meet-Endo 43s loop · 2026 eyebrow · italic serif tagline · `CHAT ABOUT DENJOY →` Messenger CTA · `SEE THE 12 ↓` scroll cue. |
| `src/components/denjoy/DenjoyCTA.jsx` | Joining Forces 23s loop as background · Pasig showroom address · Messenger button. "Brand bookend" of the page. |
| `src/components/denjoy/DenjoyFAQ.jsx` | Trim to 3 Q&As (kept for SEO long-tail). |

### Retired components

| File | Reason |
|---|---|
| `src/components/denjoy/MeetEndoPanel.jsx` | Meet Endo is now the constellation center. |
| `src/components/denjoy/ProductPanel.jsx` | Replaced by Constellation + ChaptersBand. |
| `src/components/denjoy/DenjoyWhyPH.jsx` | Content folded into hero context + CTA. |

### Untouched

`MessengerButton`, `Lightbox`, `VideoSection`, `MeetEndoDetail`, `CoStarDetail` — used by detail pages.

---

## 9 · Animation strategy

`framer-motion` (already installed, used in existing `DenjoyHero`).

| Element | Animation |
|---|---|
| Hero tagline | `initial={opacity:0, y:12}` → `animate={opacity:1, y:0}` over 0.9s `easeOut` |
| Hero scroll cue | `animate={y:[0,8,0]}` infinite loop (existing pattern) |
| Constellation node hover | `whileHover={scale:1.15}` + glow box-shadow |
| Constellation node selected | `animate={scale:1.25}` + brighter glow |
| InlineDetail mount | `<AnimatePresence>` → slide up 24px + fade over 0.4s |
| InlineDetail unmount | reverse |
| ChaptersBand cards | staggered `whileInView` reveal (50ms delay each) |
| Mobile | `prefers-reduced-motion` respected — animations disabled |

SVG line animations (constellation) use CSS `stroke-dashoffset` transitions — lighter than framer-motion for path drawing.

---

## 10 · Asset pipeline

### Step 1 — Brand videos

```bash
yt-dlp -f 'bestvideo[height<=1080][ext=mp4]+bestaudio/best' \
  -o 'public/videos/denjoy/meet-endo.%(ext)s' \
  https://youtu.be/O6odfHoymqw

yt-dlp -f 'bestvideo[height<=1080][ext=mp4]+bestaudio/best' \
  -o 'public/videos/denjoy/joining-forces.%(ext)s' \
  https://youtu.be/171806KYnyk
```

### Step 2 — 720p mobile re-encodes

```bash
cd public/videos/denjoy
ffmpeg -i meet-endo.mp4 -vf scale=-2:720 -crf 24 -preset slow meet-endo-720.mp4
ffmpeg -i joining-forces.mp4 -vf scale=-2:720 -crf 24 -preset slow joining-forces-720.mp4
```

### Step 3 — Poster frames (first frame at 0:01)

```bash
ffmpeg -i meet-endo.mp4 -ss 1 -vframes 1 -q:v 2 meet-endo-poster.jpg
ffmpeg -i joining-forces.mp4 -ss 1 -vframes 1 -q:v 2 joining-forces-poster.jpg
```

### Step 4 — Per-product hero + gallery images

For each of the 9 new SKUs (existing 3 SKUs Meet Endo / FREE PEX / i-Pexo keep their current images):

```bash
# parses sys-pd/{id}.html, extracts first 4-5 product images, downloads to per-slug folder
for slug_id in "meta-endo-pro-i:58" "meta-endo:23" "ix7:24" "ix6:25" \
               "i-moto:36" "iue1:41" "icure:39" "ipack:28" "meta-pack:26"; do
  slug="${slug_id%:*}"; id="${slug_id#*:}"
  mkdir -p "public/images/denjoy/${slug}"
  # python script extracts image URLs from denjoy.cn HTML, downloads top 5
done
```

A small Node/Python utility script lives at `scripts/fetch-denjoy-assets.js` to make this repeatable.

### Step 5 — Image optimization (optional but recommended)

```bash
# convert to webp at 80% quality for hero images
for f in public/images/denjoy/**/hero.jpg; do
  cwebp -q 80 "$f" -o "${f%.jpg}.webp"
done
```

Total expected build size delta: **~40MB** (well within Netlify's 100MB build budget).

---

## 11 · Routes

| Route | Action |
|---|---|
| `/denjoy` | Rebuilt with new architecture (this spec) |
| `/denjoy/meet-endo` | **Untouched** — bespoke flagship page stays |
| `/denjoy/[slug]` | **Untouched** — auto-handles all 9 new SKUs once they're in `denjoyProducts` |
| `/denjoy/imate3` | **301 → `/denjoy`** in `next.config.js` redirects |
| `/denjoy/aike` | **301 → `/denjoy`** |

### `next.config.js` redirects

```js
async redirects() {
  return [
    { source: '/denjoy/imate3', destination: '/denjoy', permanent: true },
    { source: '/denjoy/aike',   destination: '/denjoy', permanent: true },
  ];
}
```

### Asset cleanup

After deploy, delete `public/images/denjoy/imate3/` and `public/images/denjoy/aike/` (current size ~600KB).

---

## 12 · SEO / metadata

### `/denjoy` page metadata

```js
export const metadata = {
  title: 'All of Denjoy in the Philippines — 12 Endo Instruments | DentaSource Direct',
  description: 'The complete Denjoy endodontic line — Meet Endo, Meta Endo Pro I, Meta Endo, ix6/ix7 microscopes, FREE PEX, i-Pexo, i-Moto, iUe1, iCure, iPack, Meta Pack. Exclusive distribution by DentaSource Direct. Pasig showroom demos available.',
  alternates: { canonical: 'https://dentasourcedirect.com/denjoy' },
  openGraph: {
    title: 'The Denjoy line — finally, all of it. Locally.',
    description: 'Twelve Denjoy instruments in one Philippines lineup. Meet Endo, Meta Endo Pro I, Meta Endo, ix6/ix7 microscopes, FREE PEX, i-Pexo, i-Moto, iUe1, iCure, iPack, Meta Pack.',
    url: 'https://dentasourcedirect.com/denjoy',
    type: 'website',
    locale: 'en_PH',
    siteName: 'DentaSource Direct',
    images: [/* updated to a constellation hero still */],
  },
  // ... twitter card mirrors openGraph
};
```

### `productHubSchema`

`@type: ProductGroup` listing all 12 SKUs with their `@id` URLs (`https://dentasourcedirect.com/denjoy/<slug>`). Brand: Denjoy. Seller: DentaSource Direct, areaServed: Philippines.

### `sitemap.js`

Add the 9 new detail-page URLs:

```
/denjoy/meta-endo-pro-i
/denjoy/meta-endo
/denjoy/ix7
/denjoy/ix6
/denjoy/i-moto
/denjoy/iue1
/denjoy/icure
/denjoy/ipack
/denjoy/meta-pack
```

Remove imate3 + aike URLs.

### `public/llms.txt` (if present)

Append the 12-SKU Denjoy section so AI assistants pick it up. Verify file existence first; create if absent (DSD AI Dominance Playbook calls for this).

---

## 13 · Constraints from Jarich's locked memory

The implementation must respect these locked rules:

- **DSD = Pasig Showroom · 610 C. Maybunga Rd, Pasig City 1600.** Use full address in CTA + schema `address` field. (`reference_dsd_pasig_showroom_exclusive`)
- **EXCLUSIVE Denjoy Distributor** (not "Authorized") — wording lives in OG description, schema `seller`, and any DSD-distribution mention. The hero eyebrow uses `2026` per Jarich's correction; "exclusive" stays in supporting copy.
- **Real product photos only** for Denjoy SKUs — no AI-generated product imagery on detail pages. (`feedback_real_product_images`)
- **No competitor comparisons** in copy. (`dsd-product-page` skill)
- **No personal names + JF Empire** in public-broadcast files (llms.txt, schema, OG). (`feedback_no_personal_names_in_public_files`)
- **Visually rich content** — embed product photos + Obsidian-style callouts where the page has explanatory text. (`feedback_visual_content`)
- **DSD deploys via Netlify** (project: `ubiquitous-croissant-30d0d9`). All previews + production through Netlify CI. (`reference_dsd_deploy_platform`)
- **Production repo:** `/Users/jarich/Antigravity/dentasource-direct/` only. (`reference_dsd_production_repo`)
- **DSD deploy protocol:** visual changes → show local/screenshot first; invisible changes (schema, redirects) → proceed. (`feedback_dsd_deploy_protocol`)
- **Never reveal Denjoy contact info** publicly — Jarich is sole contact for Joanna. The factory phone/email at the bottom of `denjoy.cn` does not appear on `/denjoy`. (`feedback_jarich_sole_denjoy_contact`)
- **Denjoy.cn SSL is expired** — use `http://` for any data-pipeline URLs. (`reference_denjoy_ssl_expired`)
- **Use canonical Denjoy product names.** (`project_denjoy_product_naming`)

---

## 14 · Phasing

**Single feature branch · multi-commit · one PR.**

```
feat/denjoy-pentagon-2026
  ├─ commit 1 — data: chapters + 12 products + helpers
  ├─ commit 2 — assets: yt-dlp videos + denjoy.cn images
  ├─ commit 3 — hero: refactor DenjoyHero (Hero C, video, 2026 eyebrow)
  ├─ commit 4 — constellation: Constellation/Node/Anchor/InlineDetail
  ├─ commit 5 — chapters band + CTA refactor + FAQ trim
  ├─ commit 6 — routes: 301 redirects + sitemap + metadata + schema
  └─ commit 7 — cleanup: retire components, drop imate3/aike assets
```

One PR for atomic visual flip in production.

### Implementation order (high-level — full plan in `writing-plans` output)

1. **Data layer** — restructure `src/data/denjoy.js`, add 9 new product entries (with placeholder copy where Denjoy.cn doesn't yield text).
2. **Asset pipeline** — `scripts/fetch-denjoy-assets.js` runs yt-dlp + curl + ffmpeg.
3. **Hero refactor** — `DenjoyHero.jsx` Hero C variant.
4. **Constellation tier** — `Constellation.jsx`, `ConstellationNode.jsx`, `ChapterAnchor.jsx`, `InlineDetail.jsx`.
5. **Chapters band** — `ChaptersBand.jsx`.
6. **CTA refactor** — `DenjoyCTA.jsx` with Joining Forces video + Pasig address.
7. **FAQ trim** — `DenjoyFAQ.jsx` to 3 Q&As.
8. **Routes & SEO** — `next.config.js` redirects, `sitemap.js`, page metadata, `productHubSchema`.
9. **Cleanup** — delete retired components + imate3/aike assets.
10. **Local QA** — scroll, hover, click, mobile breakpoints; verify all 12 detail pages render.
11. **Deploy preview** — Netlify deploy preview URL → visual review with Jarich.
12. **Production merge** — single squashed PR to `main`.

---

## 15 · Success criteria

- **No template feel** — visitor cannot identify a single component repeated more than once on `/denjoy` (excluding navbar/footer).
- **All 12 SKUs reachable** in one click from `/denjoy` (constellation nodes or chapters band).
- **Brand-film hero** loads under 2.5s LCP on a mid-tier mobile device.
- **`/denjoy/meet-endo` and `/denjoy/[slug]/*` continue to work** for all 12 products without route regressions.
- **301 redirects** for `/denjoy/imate3` and `/denjoy/aike` return `301` (not 302 or 404).
- **Schema validates** on Google Rich Results Test for ProductGroup with 12 children.
- **Mobile collapses cleanly** to vertical chapters list under 720px viewport.
- **No new "Authorized"** wording — all DSD-Denjoy mentions use "Exclusive."

---

## 16 · Open items (for the implementation plan to resolve)

- **Per-SKU `keyFeatures` content** — Denjoy.cn bakes specs into PNG product images. We'll OCR or visually read the downloaded PNGs during data-population. Each new SKU needs 3-4 short bullets.
- **Per-SKU taglines** — write our own (Jarich approved this in brainstorming). Draft list goes into the implementation plan.
- **Constellation node positions for the 12 SKUs** — need final pixel-precise (or %-based) coordinates per chapter.
- **YouTube videos for each new SKU's detail page** — pull from Denjoy's channel where possible (`UC3C3au98fGvv7zXIxK8zruQ`); skip if no relevant videos exist.
- **Mobile breakpoint tuning** — 720px is the planned cut-off; may move to 768px after device testing.

---

## 17 · References

- **Brainstorming artifacts:**
  `/Users/jarich/Antigravity/dentasource-direct/.superpowers/brainstorm/56277-1778432210/content/`
  (4 visual-companion HTML screens used to make these decisions: `direction-moodboard.html`, `architecture-d-plus-c.html`, `constellation-deep-dive.html` → `constellation-corrected-pentagon.html`, `hero-deep-dive.html`)
- **Locked Roray product-page reference:** `src/app/roray-xray/page.tsx` + `src/components/roray-xray/` (halodental-style serif lock)
- **Existing /denjoy code that gets refactored or retired:**
  `src/app/denjoy/page.js` · `src/data/denjoy.js` · `src/components/denjoy/{DenjoyHero,MeetEndoPanel,ProductPanel,DenjoyWhyPH,DenjoyFAQ,DenjoyCTA,MessengerButton}.jsx`
- **AI infrastructure available (used implicitly, not directly here):**
  Higgsfield MCP — pointer at `~/second-brain/ai-portal/2026-05-08_p25_claude-higgsfield-mcp-automate-anything.md`. Available as backup if real product video b-roll is insufficient. Not in critical path.
- **Source data:**
  Denjoy product catalog: `http://www.denjoy.cn/sys-pd/{id}.html` per product
  Denjoy YouTube channel: `https://www.youtube.com/channel/UC3C3au98fGvv7zXIxK8zruQ`
- **Previous /denjoy launch context:** `project_denjoy_launch_may_2026` memory; the 5-product launch shipped in May; this is the 12-product expansion.

---

**End of spec.** Implementation plan to be authored next via `superpowers:writing-plans`.
