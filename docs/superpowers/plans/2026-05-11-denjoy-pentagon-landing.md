# /denjoy Pentagon Landing — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing `/denjoy` page with a cinematic D+C hybrid — full-bleed Meet-Endo brand-film hero feeding into a single-viewport pentagon constellation map of all 12 Denjoy SKUs grouped into 5 chapters, with inline detail expand and a closing brand-film CTA.

**Architecture:** Server component page composes client components. New `Constellation` family (4 components) plus refactored `DenjoyHero` and `DenjoyCTA`. Data lives in `src/data/denjoy.js` (new `denjoyChapters` + 12 products in `denjoyProducts`). Two brand films served from `public/videos/denjoy/`. Real Denjoy product photos served from `public/images/denjoy/<slug>/`.

**Tech Stack:** Next.js 16.1.6 App Router · React 19.2.3 · Tailwind CSS 3.4 · framer-motion 12.34 · Netlify deploy

**Spec:** [`docs/superpowers/specs/2026-05-11-denjoy-pentagon-design.md`](../specs/2026-05-11-denjoy-pentagon-design.md)

**Branch:** `feat/denjoy-pentagon-2026`

**Validation strategy (no test framework in repo):** Each visual task ends with a manual browser-QA step at `localhost:3000/denjoy`. Data + helper changes get a syntax-and-render check via dev server. Final QA pass uses Netlify deploy preview.

---

## File Structure

### Created
| Path | Responsibility |
|---|---|
| `src/components/denjoy/Constellation.jsx` | Pentagon map orchestrator. Reads chapters + products from data. Manages selected-node state. |
| `src/components/denjoy/ConstellationNode.jsx` | One product dot. Hover/click states. |
| `src/components/denjoy/ChapterAnchor.jsx` | One of the 5 chapter cluster anchors. |
| `src/components/denjoy/InlineDetail.jsx` | Slide-up detail card below the constellation. |
| `src/components/denjoy/ChaptersBand.jsx` | Linear 5-card fallback band + mobile constellation collapse. |
| `scripts/fetch-denjoy-assets.sh` | One-shot bash script to yt-dlp + curl + ffmpeg the asset bundle. |
| `public/videos/denjoy/meet-endo.mp4` (+ 720p + poster) | Hero brand film. |
| `public/videos/denjoy/joining-forces.mp4` (+ 720p + poster) | CTA brand film. |
| `public/images/denjoy/<slug>/` (×9 new SKUs) | Real product photos lifted from Denjoy.cn. |

### Modified
| Path | Change |
|---|---|
| `src/data/denjoy.js` | Full rewrite — adds `denjoyChapters` and grows `denjoyProducts` from 5 → 12. New helper exports. |
| `src/app/denjoy/page.js` | Replaces `MeetEndoPanel` + `ProductPanel`-map with `Constellation` + `ChaptersBand`. Updates metadata + schema for 12 SKUs. |
| `src/components/denjoy/DenjoyHero.jsx` | Hero C variant — Meet-Endo `<video>` background, 2026 eyebrow, italic serif tagline, Messenger CTA. |
| `src/components/denjoy/DenjoyCTA.jsx` | Joining Forces `<video>` background, Pasig showroom address. |
| `src/components/denjoy/DenjoyFAQ.jsx` | Trim to 3 Q&As. |
| `next.config.mjs` | Add 2 new redirects for `/denjoy/imate3` + `/denjoy/aike`. |
| `src/app/sitemap.js` | Add 9 new SKU detail URLs, remove imate3 + aike. |

### Deleted
| Path | Reason |
|---|---|
| `src/components/denjoy/MeetEndoPanel.jsx` | Meet Endo is now the constellation center. |
| `src/components/denjoy/ProductPanel.jsx` | Replaced by Constellation + ChaptersBand. |
| `src/components/denjoy/DenjoyWhyPH.jsx` | Content folded into hero context + CTA. |
| `public/images/denjoy/imate3/` | Product retired. |
| `public/images/denjoy/aike/` | Product retired. |

---

## Phase 1 · Data Layer

### Task 1: Create the feature branch and restructure `src/data/denjoy.js`

**Files:**
- Modify: `src/data/denjoy.js` (full rewrite)

- [ ] **Step 1: Create the feature branch**

```bash
cd /Users/jarich/Antigravity/dentasource-direct
git checkout -b feat/denjoy-pentagon-2026
```

- [ ] **Step 2: Replace `src/data/denjoy.js` with the new shape**

Overwrite the entire file:

```js
// src/data/denjoy.js
//
// Source of truth for the /denjoy landing page and detail pages.
// Chapters are first-class. Products carry a `chapter` foreign key.

export const denjoyChapters = [
  { id: 'integrated',  roman: 'I',   name: 'Integrated Systems',
    color: '#ffd49a',  position: 'top'         },          // 0°
  { id: 'apex',        roman: 'II',  name: 'Apex Locators',
    color: '#9ad4ff',  position: 'upper-right' },          // 72°
  { id: 'microscopes', roman: 'III', name: 'Microscopes',
    color: '#c4a4ff',  position: 'lower-right' },          // 144°
  { id: 'motors',      roman: 'IV',  name: 'Motors & Tools',
    color: '#ff9ad4',  position: 'lower-left'  },          // 216°
  { id: 'auxiliary',   roman: 'V',   name: 'Auxiliary & Packs',
    color: '#9affc4',  position: 'upper-left'  },          // 288°
];

export const denjoyProducts = [
  // ============================================================
  // Chapter I — Integrated Systems
  // ============================================================
  {
    slug: 'meet-endo',
    name: 'Meet Endo',
    fullName: 'Meet Endo All-in-One Endodontic System',
    tagline: 'The integrated endodontic system, reimagined.',
    chapter: 'integrated',
    isFlagship: true,
    isNew: false,
    launchedAt: '2026-04-20',
    denjoyId: 22,
    denjoyUrl: 'http://www.denjoy.cn/sys-pd/22.html',
    heroImage: '/images/denjoy/meet-endo/meetendo-studio-ui-on.jpg',
    gallery: [
      '/images/denjoy/meet-endo/denjoy-meetendo-1.jpg',
      '/images/denjoy/meet-endo/denjoy-meetendo-2.jpg',
      '/images/denjoy/meet-endo/meetendo-showroom-front.jpg',
      '/images/denjoy/meet-endo/meetendo-showroom-full.jpg',
      '/images/denjoy/meet-endo/meetendo-studio-alt.jpg',
    ],
    modules: [
      { name: 'MeetPex',   role: 'Apex Locator',  color: '#2a4d7a', description: 'Precision apex detection integrated into the touchscreen module.' },
      { name: 'MeetMotor', role: 'Endo Motor',    color: '#5c1a3a', description: 'Cordless endo motor with programmable torque profiles.' },
      { name: 'MeetFill',  role: 'GP Obturation', color: '#1a3c34', description: 'Gutta-percha obturation with thermal delivery control.' },
    ],
    keyFeatures: [
      'Integrated touchscreen running the MeetPex, MeetMotor, and MeetFill modules in one workflow.',
      'Mobile rolling cart — fits small Philippine clinic operatories.',
      'Four pen-holder slots for connected handpieces.',
      'Already installed at DSD Manila showroom for demo.',
    ],
    messengerText: "Hi DSD, I'd like to know more about the Denjoy Meet Endo.",
    videos: [
      { id: 'O6odfHoymqw', title: 'Denjoy Meet-Endo brand film', duration: '0:43' },
      { id: 'nlgMFP3HzJs', title: 'Meet Endo: The Ultimate Integrated Root Canal System', duration: '0:55' },
      { id: 'k2ZrdMYsfRg', title: 'Meta Endo 4-in-1 Unboxing', duration: '4:37' },
      { id: 'ney0zANs43E', title: '2024 Shanghai Dental Expo Highlight', duration: '0:33' },
    ],
  },
  {
    slug: 'meta-endo-pro-i',
    name: 'Meta Endo Pro I',
    fullName: 'Meta Endo Pro I Endodontic System',
    tagline: 'Surf the canal with joy.',
    chapter: 'integrated',
    isFlagship: false,
    isNew: true,
    launchedAt: '2026-05-11',
    denjoyId: 58,
    denjoyUrl: 'http://www.denjoy.cn/sys-pd/58.html',
    heroImage: '/images/denjoy/meta-endo-pro-i/hero.jpg',
    gallery: [],
    keyFeatures: [
      'Pro evolution of the Meta Endo integrated platform.',
      'Same trusted Denjoy 4-in-1 endo workflow with refinements.',
      'Configurable per clinic operatory layout.',
      'Coming to DSD Manila showroom for live demo.',
    ],
    messengerText: "Hi DSD, I'd like to know more about the Meta Endo Pro I.",
    videos: [],
  },
  {
    slug: 'meta-endo',
    name: 'Meta Endo',
    fullName: 'Meta Endo 4-in-1 Endodontic System',
    tagline: 'Four-in-one endo, classic.',
    chapter: 'integrated',
    isFlagship: false,
    isNew: true,
    launchedAt: '2026-05-11',
    denjoyId: 23,
    denjoyUrl: 'http://www.denjoy.cn/sys-pd/23.html',
    heroImage: '/images/denjoy/meta-endo/hero.jpg',
    gallery: [],
    keyFeatures: [
      '4-in-1 integrated endo system — apex locator + motor + fill + activation in one base unit.',
      'The reference platform the Meet Endo and Meta Endo Pro I evolved from.',
      'Trusted Denjoy lineage since 2004.',
      'Suitable for clinics scaling endo capacity without going full Meet Endo Pro I.',
    ],
    messengerText: "Hi DSD, I'd like to know more about the Meta Endo.",
    videos: [
      { id: 'k2ZrdMYsfRg', title: 'Meta Endo 4-in-1 Unboxing', duration: '4:37' },
    ],
  },

  // ============================================================
  // Chapter II — Apex Locators
  // ============================================================
  {
    slug: 'free-pex',
    name: 'FREE PEX',
    fullName: 'FREE PEX Benchtop Apex Locator',
    tagline: 'Benchtop apex locator, built to stay put.',
    chapter: 'apex',
    isFlagship: false,
    isNew: false,
    launchedAt: '2026-04-20',
    denjoyId: 29,
    denjoyUrl: 'http://www.denjoy.cn/sys-pd/29.html',
    heroImage: '/images/denjoy/free-pex/freepex-three-quarter.jpg',
    gallery: [
      '/images/denjoy/free-pex/denjoy-freepex-1.jpg',
      '/images/denjoy/free-pex/denjoy-freepex-2.jpg',
      '/images/denjoy/free-pex/freepex-front.jpg',
    ],
    keyFeatures: [
      'Benchtop form factor — parks on the operatory counter, never rolls away.',
      'Large color display readable from chair-side.',
      'Multi-frequency measurement for wet or dry canals.',
      'Built by Denjoy, endo specialists since 2004.',
    ],
    messengerText: "Hi DSD, I'd like to know more about the Denjoy FREE PEX.",
    videos: [
      { id: 'bjmTrWOAK1c', title: 'New 6th-Generation Multi-Frequency Chip', duration: '1:20' },
      { id: '-GcLmwsAbPQ', title: 'Cost-Effective Accuracy Demonstration', duration: '2:40' },
      { id: 'xprn-n8mIsg', title: 'High-Accuracy 6th-Gen Apex Locator', duration: '1:20' },
    ],
  },
  {
    slug: 'i-pexo',
    name: 'i-Pexo',
    fullName: 'i-Pexo Touchable Apex Locator',
    tagline: 'The apex locator that feels like a phone.',
    chapter: 'apex',
    isFlagship: false,
    isNew: false,
    launchedAt: '2026-04-20',
    denjoyId: 31,
    denjoyUrl: 'http://www.denjoy.cn/sys-pd/31.html',
    heroImage: '/images/denjoy/i-pexo/denjoy-ipexo-1.jpg',
    gallery: [
      '/images/denjoy/i-pexo/denjoy-ipexo-2.jpg',
      '/images/denjoy/i-pexo/denjoy-ipexo-3.jpg',
      '/images/denjoy/i-pexo/denjoy-ipexo-4.jpg',
      '/images/denjoy/i-pexo/denjoy-ipexo-5.jpg',
    ],
    keyFeatures: [
      'Touchable phone-format interface — intuitive for any modern clinician.',
      'Same measurement engine that powers the MeetPex module inside Meet Endo.',
      'Rechargeable battery with all-day clinic endurance.',
      'Wireless handpiece connection.',
    ],
    messengerText: "Hi DSD, I'd like to know more about the Denjoy i-Pexo.",
    videos: [
      { id: 'jmpYr-jqe0s', title: 'High-Precision Touchscreen Apex Locator', duration: '1:27' },
      { id: 'b1zRZSZMnMw', title: 'How to Operate a High-Accuracy Apex Locator', duration: '1:20' },
    ],
  },

  // ============================================================
  // Chapter III — Microscopes
  // ============================================================
  {
    slug: 'ix7',
    name: 'ix7',
    fullName: 'ix7 Dental Microscope',
    tagline: 'See the canal, properly.',
    chapter: 'microscopes',
    isFlagship: false,
    isNew: true,
    launchedAt: '2026-05-11',
    denjoyId: 24,
    denjoyUrl: 'http://www.denjoy.cn/sys-pd/24.html',
    heroImage: '/images/denjoy/ix7/hero.jpg',
    gallery: [],
    keyFeatures: [
      'High-magnification dental microscope for endodontic precision.',
      'The flagship microscope in Denjoy\'s ix family.',
      'Pairs with the Meet Endo workflow for full-system endodontics.',
      'Local install + training via DSD Manila showroom.',
    ],
    messengerText: "Hi DSD, I'd like to know more about the Denjoy ix7 microscope.",
    videos: [
      { id: 's-m0MTzbhe0', title: 'Microscope Unboxing & Installation', duration: '6:38' },
      { id: 'BzjLwsg2q0s', title: 'Explore Denjoy Microscope (Part II)', duration: '6:58' },
      { id: 'ofFaQAONEzM', title: 'Explore Denjoy Microscope (Part I)', duration: '7:50' },
    ],
  },
  {
    slug: 'ix6',
    name: 'ix6',
    fullName: 'ix6 Dental Microscope',
    tagline: 'High-precision optics, made local.',
    chapter: 'microscopes',
    isFlagship: false,
    isNew: true,
    launchedAt: '2026-05-11',
    denjoyId: 25,
    denjoyUrl: 'http://www.denjoy.cn/sys-pd/25.html',
    heroImage: '/images/denjoy/ix6/hero.jpg',
    gallery: [],
    keyFeatures: [
      'Mid-tier dental microscope in the ix family.',
      'Same Denjoy optics quality, more accessible price point.',
      'Suitable for clinics scaling into microscope-assisted endo.',
      'Demos available at DSD Manila showroom.',
    ],
    messengerText: "Hi DSD, I'd like to know more about the Denjoy ix6 microscope.",
    videos: [
      { id: 's-m0MTzbhe0', title: 'Microscope Unboxing & Installation', duration: '6:38' },
    ],
  },

  // ============================================================
  // Chapter IV — Motors & Tools
  // ============================================================
  {
    slug: 'i-moto',
    name: 'i-Moto',
    fullName: "i-Moto Dentist's Dexterous Tool",
    tagline: 'Cordless precision, dentist-grade.',
    chapter: 'motors',
    isFlagship: false,
    isNew: true,
    launchedAt: '2026-05-11',
    denjoyId: 36,
    denjoyUrl: 'http://www.denjoy.cn/sys-pd/36.html',
    heroImage: '/images/denjoy/i-moto/hero.jpg',
    gallery: [],
    keyFeatures: [
      'Cordless endo motor in the i-family lineage.',
      'Programmable torque profiles for rotary file work.',
      'Same motor engine inside the Meet Endo MeetMotor module.',
      'Compact form fits any glove.',
    ],
    messengerText: "Hi DSD, I'd like to know more about the Denjoy i-Moto.",
    videos: [],
  },

  // ============================================================
  // Chapter V — Auxiliary & Packs
  // ============================================================
  {
    slug: 'iue1',
    name: 'iUe1',
    fullName: 'iUe1 Ultrasonic Activator',
    tagline: 'Ultrasonic irrigation, evolved.',
    chapter: 'auxiliary',
    isFlagship: false,
    isNew: true,
    launchedAt: '2026-05-11',
    denjoyId: 41,
    denjoyUrl: 'http://www.denjoy.cn/sys-pd/41.html',
    heroImage: '/images/denjoy/iue1/hero.jpg',
    gallery: [],
    keyFeatures: [
      'Ultrasonic activator for more effective root canal irrigation.',
      "The successor to AIKE in Denjoy's ultrasonic line.",
      'Ergonomic handpiece with multiple tip options.',
      'Pairs with any apex-locator-driven endo workflow.',
    ],
    messengerText: "Hi DSD, I'd like to know more about the Denjoy iUe1.",
    videos: [
      { id: 'dqI_autD9Ko', title: 'Denjoy iUe1 ultrasonic activator', duration: '0:30' },
    ],
  },
  {
    slug: 'icure',
    name: 'iCure',
    fullName: 'iCure Cordless Obturation System',
    tagline: 'Cordless GP obturation, simplified.',
    chapter: 'auxiliary',
    isFlagship: false,
    isNew: true,
    launchedAt: '2026-05-11',
    denjoyId: 39,
    denjoyUrl: 'http://www.denjoy.cn/sys-pd/39.html',
    heroImage: '/images/denjoy/icure/hero.jpg',
    gallery: [],
    keyFeatures: [
      'Cordless GP obturation system from the i-family.',
      'Thermal delivery control for predictable canal sealing.',
      'Pairs with FREE PEX, i-Pexo, or Meet Endo workflows.',
      'Compact form for chairside operatory use.',
    ],
    messengerText: "Hi DSD, I'd like to know more about the Denjoy iCure.",
    videos: [],
  },
  {
    slug: 'ipack',
    name: 'iPack',
    fullName: 'iPack Endo Accessory Bundle',
    tagline: 'Everything the i-family pairs with.',
    chapter: 'auxiliary',
    isFlagship: false,
    isNew: true,
    launchedAt: '2026-05-11',
    denjoyId: 28,
    denjoyUrl: 'http://www.denjoy.cn/sys-pd/28.html',
    heroImage: '/images/denjoy/ipack/hero.jpg',
    gallery: [],
    keyFeatures: [
      'Curated accessory bundle for the i-family endo line.',
      'Standardized consumables and tip options across i-Pexo, i-Moto, iCure.',
      'Reduces consumable SKU sprawl in the operatory.',
      'Ask DSD for the current iPack contents.',
    ],
    messengerText: "Hi DSD, I'd like to know more about the Denjoy iPack.",
    videos: [],
  },
  {
    slug: 'meta-pack',
    name: 'Meta Pack',
    fullName: 'Meta Pack Integrated System Bundle',
    tagline: 'Everything the Meta line pairs with.',
    chapter: 'auxiliary',
    isFlagship: false,
    isNew: true,
    launchedAt: '2026-05-11',
    denjoyId: 26,
    denjoyUrl: 'http://www.denjoy.cn/sys-pd/26.html',
    heroImage: '/images/denjoy/meta-pack/hero.jpg',
    gallery: [],
    keyFeatures: [
      'Curated accessory bundle for the Meta Endo line.',
      'Consumables and tips matched to Meta Endo and Meta Endo Pro I workflows.',
      'Sized for high-volume endo practices.',
      'Ask DSD for the current Meta Pack contents.',
    ],
    messengerText: "Hi DSD, I'd like to know more about the Denjoy Meta Pack.",
    videos: [],
  },
];

// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------
export const getProductsByChapter = (chapterId) =>
  denjoyProducts.filter((p) => p.chapter === chapterId);

export const getFlagship = () =>
  denjoyProducts.find((p) => p.isFlagship);

export const getDenjoyBySlug = (slug) =>
  denjoyProducts.find((p) => p.slug === slug);

export const getNewProducts = () =>
  denjoyProducts.filter(
    (p) => p.isNew && (Date.now() - new Date(p.launchedAt) < 90 * 86400000)
  );

// Backwards-compatible helper used by /denjoy/[slug] and others.
// Filters out the flagship from the co-stars list.
export const getCoStars = () =>
  denjoyProducts.filter((p) => !p.isFlagship);
```

- [ ] **Step 3: Run dev server and check the existing `/denjoy` still renders without runtime errors**

```bash
npm run dev
```

Expected: dev server boots. Open `http://localhost:3000/denjoy` in browser. Existing page should still render (it imports `getCoStars` which still exists). Many products will lack hero images at this point (we haven't downloaded them yet) — broken images are expected. Stop the dev server with Ctrl-C.

- [ ] **Step 4: Commit**

```bash
git add src/data/denjoy.js
git commit -m "data(denjoy): chapters + 12 products + helpers for pentagon landing"
```

---

## Phase 2 · Asset Pipeline

### Task 2: Create the asset-fetch script and download brand videos

**Files:**
- Create: `scripts/fetch-denjoy-assets.sh`
- Create: `public/videos/denjoy/meet-endo.mp4` (+ 720p + poster)
- Create: `public/videos/denjoy/joining-forces.mp4` (+ 720p + poster)

- [ ] **Step 1: Create `scripts/fetch-denjoy-assets.sh`**

```bash
#!/usr/bin/env bash
# scripts/fetch-denjoy-assets.sh
# One-shot pull of brand films + per-product hero images for /denjoy.
# Idempotent — safe to re-run; existing files are skipped.
set -euo pipefail

REPO="$(cd "$(dirname "$0")/.." && pwd)"
VIDEO_DIR="$REPO/public/videos/denjoy"
IMG_DIR="$REPO/public/images/denjoy"

mkdir -p "$VIDEO_DIR" "$IMG_DIR"

echo "==> Fetching brand films via yt-dlp..."

# Meet-Endo 43s — hero loop
if [ ! -f "$VIDEO_DIR/meet-endo.mp4" ]; then
  yt-dlp -f 'bestvideo[height<=1080][ext=mp4]+bestaudio/best[ext=mp4]/best' \
         --merge-output-format mp4 \
         -o "$VIDEO_DIR/meet-endo.%(ext)s" \
         "https://youtu.be/O6odfHoymqw"
fi

# Joining Forces 23s — CTA bookend
if [ ! -f "$VIDEO_DIR/joining-forces.mp4" ]; then
  yt-dlp -f 'bestvideo[height<=1080][ext=mp4]+bestaudio/best[ext=mp4]/best' \
         --merge-output-format mp4 \
         -o "$VIDEO_DIR/joining-forces.%(ext)s" \
         "https://youtu.be/171806KYnyk"
fi

echo "==> Re-encoding 720p mobile variants..."
for base in meet-endo joining-forces; do
  if [ ! -f "$VIDEO_DIR/${base}-720.mp4" ]; then
    ffmpeg -i "$VIDEO_DIR/${base}.mp4" \
           -vf scale=-2:720 \
           -c:v libx264 -crf 24 -preset slow \
           -c:a aac -b:a 96k \
           -movflags +faststart \
           "$VIDEO_DIR/${base}-720.mp4"
  fi
done

echo "==> Extracting poster frames..."
for base in meet-endo joining-forces; do
  if [ ! -f "$VIDEO_DIR/${base}-poster.jpg" ]; then
    ffmpeg -i "$VIDEO_DIR/${base}.mp4" -ss 1 -vframes 1 -q:v 2 \
           "$VIDEO_DIR/${base}-poster.jpg"
  fi
done

echo "==> Fetching per-product hero images from Denjoy.cn..."
# Format: "<slug>:<denjoyId>"
PRODUCTS=(
  "meta-endo-pro-i:58"
  "meta-endo:23"
  "ix7:24"
  "ix6:25"
  "i-moto:36"
  "iue1:41"
  "icure:39"
  "ipack:28"
  "meta-pack:26"
)

for entry in "${PRODUCTS[@]}"; do
  slug="${entry%:*}"
  id="${entry#*:}"
  product_dir="$IMG_DIR/$slug"
  mkdir -p "$product_dir"

  if [ -f "$product_dir/hero.jpg" ]; then
    echo "    [$slug] hero.jpg already present — skipping"
    continue
  fi

  echo "    [$slug] fetching from denjoy.cn/sys-pd/${id}.html"
  detail_html=$(curl -sL --compressed --max-time 20 -A "Mozilla/5.0" \
                "http://www.denjoy.cn/sys-pd/${id}.html")

  # Extract the first product-detail PNG/JPG (the marketing hero baked into the page)
  img_url=$(echo "$detail_html" \
            | python3 -c "
import sys, re
html = sys.stdin.read()
imgs = re.findall(r'src=\"(//?[^\"]+\.(?:jpg|jpeg|png))\"', html, re.IGNORECASE)
imgs = [u for u in imgs if 'no-pic' not in u and 'logo' not in u.lower() and 'qrcode' not in u.lower()]
imgs = ['https:' + u if u.startswith('//') else u for u in imgs]
imgs = [u for u in imgs if u.startswith('http')]
print(imgs[0] if imgs else '')
")

  if [ -z "$img_url" ]; then
    echo "    [$slug] WARNING — no hero image found"
    continue
  fi

  curl -sL --max-time 30 "$img_url" -o "$product_dir/hero.jpg"
  echo "    [$slug] saved $(stat -f%z "$product_dir/hero.jpg") bytes"
done

echo ""
echo "==> Done."
echo "    Videos:   $VIDEO_DIR/"
echo "    Images:   $IMG_DIR/"
```

- [ ] **Step 2: Make it executable**

```bash
chmod +x scripts/fetch-denjoy-assets.sh
```

- [ ] **Step 3: Verify yt-dlp + ffmpeg are available**

```bash
which yt-dlp && yt-dlp --version
which ffmpeg && ffmpeg -version | head -1
```

Expected: both binaries report a version. If `yt-dlp` is missing: `pipx install yt-dlp`. If `ffmpeg` is missing: `brew install ffmpeg`.

- [ ] **Step 4: Run the script**

```bash
./scripts/fetch-denjoy-assets.sh
```

Expected output ends with `==> Done.` and lists video + image directories. Total runtime: 2-4 minutes depending on network. Final `public/videos/denjoy/` should contain 6 files (2 mp4 + 2 mp4-720 + 2 poster.jpg). Final `public/images/denjoy/` should contain 9 new SKU folders, each with `hero.jpg`.

- [ ] **Step 5: Spot-check the assets**

```bash
ls -la public/videos/denjoy/
du -sh public/videos/denjoy/
ls public/images/denjoy/ | grep -E "(meta-endo-pro-i|ix7|iue1)" -A1
```

Expected: `public/videos/denjoy/` is roughly 15-30MB total. Each new SKU folder has a `hero.jpg` with non-zero size.

- [ ] **Step 6: Commit**

```bash
git add scripts/fetch-denjoy-assets.sh public/videos/denjoy public/images/denjoy
git commit -m "assets(denjoy): fetch script + brand films + per-product hero images"
```

---

## Phase 3 · Hero Refactor

### Task 3: Refactor `DenjoyHero` to Hero C variant

**Files:**
- Modify: `src/components/denjoy/DenjoyHero.jsx` (full rewrite)

- [ ] **Step 1: Replace `src/components/denjoy/DenjoyHero.jsx` with the Hero C variant**

```jsx
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const MESSENGER_HREF =
  'https://m.me/dentasourcedirect?ref=denjoy_2026_landing';

export default function DenjoyHero() {
  return (
    <section
      className="relative h-screen min-h-[600px] w-full overflow-hidden bg-black flex items-center justify-center"
      aria-labelledby="denjoy-hero-title"
    >
      {/* Brand film background */}
      <video
        src="/videos/denjoy/meet-endo.mp4"
        poster="/videos/denjoy/meet-endo-poster.jpg"
        autoPlay
        muted
        playsInline
        loop
        className="absolute inset-0 h-full w-full object-cover opacity-90"
        aria-hidden="true"
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/80"
        aria-hidden="true"
      />

      {/* Eyebrow */}
      <div className="absolute top-6 left-6 right-6 z-10 flex items-center justify-between text-white text-[11px] font-bold uppercase tracking-[0.35em]">
        <span>DENJOY · PHILIPPINES</span>
        <span className="opacity-50">2026</span>
      </div>

      {/* Tagline */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className="absolute left-[5%] right-[5%] bottom-[18%] z-10 max-w-4xl"
      >
        <h1
          id="denjoy-hero-title"
          className="font-serif italic text-3xl md:text-5xl lg:text-7xl text-white leading-[1.05] tracking-tight"
        >
          The Denjoy line —
          <br />
          <strong className="font-semibold not-italic">
            finally, all of it. Locally.
          </strong>
        </h1>
      </motion.div>

      {/* CTA — Messenger */}
      <Link
        href={MESSENGER_HREF}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute left-[5%] bottom-[8%] z-10 inline-block bg-amber-200 text-amber-900 font-semibold text-[11px] tracking-[0.2em] uppercase px-4 py-2 rounded transition-colors hover:bg-amber-100"
      >
        Chat about Denjoy →
      </Link>

      {/* Scroll cue */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute right-[5%] bottom-[8%] z-10 flex items-center gap-2 text-white/60 text-[10px] font-semibold tracking-[0.3em] uppercase"
        aria-hidden="true"
      >
        <span>See the 12</span>
        <span>↓</span>
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 2: Run dev server and verify**

```bash
npm run dev
```

Open `http://localhost:3000/denjoy`. Expected:
- Meet-Endo brand film autoplays muted, loops seamlessly
- Eyebrow shows `DENJOY · PHILIPPINES` (left) + `2026` (right)
- Italic Georgia tagline reads "The Denjoy line — / **finally, all of it. Locally.**"
- Amber CTA button bottom-left says "Chat about Denjoy →"
- Bouncing scroll cue bottom-right says "See the 12 ↓"
- Vignette darkens edges for tagline contrast
- Stop dev server.

- [ ] **Step 3: Commit**

```bash
git add src/components/denjoy/DenjoyHero.jsx
git commit -m "feat(denjoy): refactor hero to cinematic Meet-Endo brand-film variant"
```

---

## Phase 4 · Constellation Tier

### Task 4: Build `ConstellationNode` component

**Files:**
- Create: `src/components/denjoy/ConstellationNode.jsx`

- [ ] **Step 1: Create `src/components/denjoy/ConstellationNode.jsx`**

```jsx
'use client';

import { motion } from 'framer-motion';

/**
 * One product dot on the constellation map.
 *
 * Props:
 *  - product: a denjoyProducts entry
 *  - chapterColor: hex string for glow
 *  - isSelected: boolean — currently expanded in InlineDetail
 *  - onSelect: (slug) => void — fires on click
 *  - position: { left, top } as CSS percentage strings
 *  - showLabel: boolean — always-visible label (for chapter anchors); else tooltip-on-hover
 */
export default function ConstellationNode({
  product,
  chapterColor,
  isSelected,
  onSelect,
  position,
  showLabel = false,
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(product.slug)}
      className="absolute group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 rounded-full"
      style={{
        left: position.left,
        top: position.top,
        transform: 'translate(-50%, -50%)',
        zIndex: isSelected ? 6 : 4,
      }}
      aria-label={`${product.name} — ${product.fullName}`}
      aria-pressed={isSelected}
    >
      <motion.span
        className="block rounded-full"
        style={{
          width: isSelected ? 22 : 14,
          height: isSelected ? 22 : 14,
          background: isSelected
            ? `radial-gradient(circle, #fff 0%, ${chapterColor} 100%)`
            : 'rgba(255,255,255,0.85)',
          boxShadow: isSelected
            ? `0 0 22px ${chapterColor}, 0 0 44px ${chapterColor}80`
            : `0 0 8px ${chapterColor}AA`,
        }}
        whileHover={{ scale: 1.25 }}
        animate={isSelected ? { scale: 1.15 } : { scale: 1 }}
        transition={{ duration: 0.2 }}
      />
      {/* ✦ NEW tag */}
      {product.isNew && (
        <span
          className="absolute -top-1 -right-3 text-amber-200 text-[9px] leading-none font-bold tracking-wider"
          aria-hidden="true"
        >
          ✦
        </span>
      )}
      {/* Label — always-visible variant */}
      {showLabel && (
        <span className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap text-white/80 text-[10px] font-semibold tracking-[0.08em]">
          {product.name}
        </span>
      )}
      {/* Tooltip — hover variant */}
      {!showLabel && (
        <span className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded bg-black/70 px-2 py-1 text-[10px] font-semibold text-white tracking-[0.08em] opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          {product.name}
          {product.isNew && <span className="ml-1 text-amber-200">✦</span>}
        </span>
      )}
    </button>
  );
}
```

- [ ] **Step 2: Verify the file compiles (no other components consume it yet — Constellation will in Task 7)**

The file is self-contained. No browser check needed yet.

- [ ] **Step 3: Commit**

```bash
git add src/components/denjoy/ConstellationNode.jsx
git commit -m "feat(denjoy): ConstellationNode — product dot with hover/selected states"
```

---

### Task 5: Build `ChapterAnchor` component

**Files:**
- Create: `src/components/denjoy/ChapterAnchor.jsx`

- [ ] **Step 1: Create `src/components/denjoy/ChapterAnchor.jsx`**

```jsx
'use client';

/**
 * One chapter anchor on the constellation — Roman numeral, label, SKU count.
 *
 * Props:
 *  - chapter: denjoyChapters entry (id, roman, name, color, position)
 *  - skuCount: number of products in this chapter
 *  - position: { left, top } as CSS percentage strings (anchor center)
 *  - onClick: () => void — scrolls to ChaptersBand card for this chapter
 */
export default function ChapterAnchor({ chapter, skuCount, position, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute z-5 flex flex-col items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 rounded"
      style={{
        left: position.left,
        top: position.top,
        transform: 'translate(-50%, -50%)',
      }}
      aria-label={`Chapter ${chapter.roman}: ${chapter.name}, ${skuCount} SKUs`}
    >
      {/* Anchor dot */}
      <span
        className="block rounded-full"
        style={{
          width: 28,
          height: 28,
          background: `radial-gradient(circle, #fff 0%, ${chapter.color} 100%)`,
          boxShadow: `0 0 18px ${chapter.color}D9`,
        }}
        aria-hidden="true"
      />
      {/* Label — always visible */}
      <span className="whitespace-nowrap rounded border border-white/20 bg-white/10 px-2 py-1 text-center text-[10px] font-bold uppercase leading-tight tracking-[0.2em] text-white backdrop-blur-sm">
        <span className="mr-1 italic font-normal text-white/55 font-serif">
          {chapter.roman}
        </span>
        {chapter.name}
        <span className="block text-[9px] font-normal italic text-white/55 font-serif tracking-normal">
          {skuCount} SKU{skuCount === 1 ? '' : 's'}
        </span>
      </span>
    </button>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/denjoy/ChapterAnchor.jsx
git commit -m "feat(denjoy): ChapterAnchor — pentagon cluster anchor with Roman + SKU count"
```

---

### Task 6: Build `InlineDetail` component

**Files:**
- Create: `src/components/denjoy/InlineDetail.jsx`

- [ ] **Step 1: Create `src/components/denjoy/InlineDetail.jsx`**

```jsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { denjoyChapters } from '@/data/denjoy';

/**
 * Slide-up detail card displayed below the constellation when a node is selected.
 *
 * Props:
 *  - product: selected denjoyProducts entry, or null when nothing is selected
 *  - onClose: () => void — clears selection
 */
export default function InlineDetail({ product, onClose }) {
  return (
    <AnimatePresence mode="wait">
      {product && (
        <motion.div
          key={product.slug}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="relative mt-6 grid grid-cols-1 md:grid-cols-[5fr_6fr] gap-6 rounded-lg border border-white/10 bg-white/5 p-6 text-white"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 z-10 rounded p-1 text-white/60 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-200"
            aria-label="Close detail"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          {/* Hero image */}
          <div className="relative aspect-[4/3] overflow-hidden rounded">
            <Image
              src={product.heroImage}
              alt={product.fullName}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover"
            />
          </div>

          {/* Body */}
          <div>
            <div className="text-amber-200 text-[10px] font-bold uppercase tracking-[0.25em] mb-2">
              Chapter {chapterRomanFor(product.chapter)} ·{' '}
              {chapterNameFor(product.chapter)}
            </div>
            <h2 className="font-serif italic text-2xl md:text-3xl mb-2 tracking-tight">
              {product.name} —{' '}
              <strong className="font-semibold not-italic">
                {product.tagline}
              </strong>
            </h2>
            <ul className="space-y-1.5 text-white/80 text-sm leading-snug">
              {product.keyFeatures.map((feat, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-amber-200/80 mt-0.5" aria-hidden="true">
                    ·
                  </span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href={`/denjoy/${product.slug}`}
                className="inline-block rounded bg-amber-200 px-4 py-2 text-[12px] font-semibold text-amber-900 transition-colors hover:bg-amber-100"
              >
                See full {product.name} page →
              </Link>
              <Link
                href={messengerHref(product.messengerText)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded border border-white/30 px-4 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-white/10"
              >
                Chat about {product.name}
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function chapterRomanFor(id) {
  return denjoyChapters.find((c) => c.id === id)?.roman ?? '';
}

function chapterNameFor(id) {
  return denjoyChapters.find((c) => c.id === id)?.name ?? '';
}

function messengerHref(prefill) {
  const text = encodeURIComponent(prefill);
  return `https://m.me/dentasourcedirect?ref=denjoy_2026_landing&text=${text}`;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/denjoy/InlineDetail.jsx
git commit -m "feat(denjoy): InlineDetail — slide-up product card below constellation"
```

---

### Task 7: Build `Constellation` orchestrator component

**Files:**
- Create: `src/components/denjoy/Constellation.jsx`

- [ ] **Step 1: Create `src/components/denjoy/Constellation.jsx`**

```jsx
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  denjoyChapters,
  denjoyProducts,
  getProductsByChapter,
  getFlagship,
  getDenjoyBySlug,
} from '@/data/denjoy';
import ChapterAnchor from './ChapterAnchor';
import ConstellationNode from './ConstellationNode';
import InlineDetail from './InlineDetail';

// Pentagon anchor positions (CSS % values from map center).
// Order matches denjoyChapters array order: 0°, 72°, 144°, 216°, 288°.
const ANCHOR_POSITIONS = [
  { left: '50%',  top: '14%' }, // I  · top
  { left: '80%',  top: '36%' }, // II · upper-right
  { left: '69%',  top: '80%' }, // III · lower-right
  { left: '31%',  top: '80%' }, // IV · lower-left
  { left: '20%',  top: '36%' }, // V  · upper-left
];

// Per-chapter SKU node positions (offsets around their anchor).
// Each chapter has up to 4 nodes; only the first N are used per chapter SKU count.
const NODE_POSITIONS = {
  integrated:  [{ left: '34%', top: '8%'  }, { left: '66%', top: '8%'  }, { left: '50%', top: '24%' }],
  apex:        [{ left: '88%', top: '20%' }, { left: '92%', top: '46%' }],
  microscopes: [{ left: '60%', top: '88%' }, { left: '78%', top: '93%' }],
  motors:      [{ left: '22%', top: '93%' }],
  auxiliary:   [{ left: '8%',  top: '20%' }, { left: '6%',  top: '50%' }, { left: '14%', top: '70%' }, { left: '32%', top: '52%' }],
};

export default function Constellation() {
  const [selectedSlug, setSelectedSlug] = useState(null);

  const flagship = useMemo(() => getFlagship(), []);
  const productsByChapter = useMemo(
    () => Object.fromEntries(
      denjoyChapters.map((ch) => [
        ch.id,
        getProductsByChapter(ch.id).filter((p) => !p.isFlagship),
      ])
    ),
    []
  );

  const selectedProduct = selectedSlug ? getDenjoyBySlug(selectedSlug) : null;

  const scrollToChapter = (chapterId) => {
    const el = document.getElementById(`chapter-${chapterId}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section
      id="denjoy-constellation"
      aria-labelledby="constellation-heading"
      className="relative w-full bg-gradient-to-br from-[#06101e] via-[#0d1626] to-[#1a2342] py-12 md:py-16"
    >
      <h2 id="constellation-heading" className="sr-only">
        The Denjoy line — 12 instruments, 5 chapters
      </h2>

      <div className="mx-auto max-w-7xl px-4">
        {/* Map (desktop only) */}
        <div className="relative hidden md:block aspect-[16/10] w-full">
          {/* Connecting SVG lines from center to each anchor */}
          <svg
            className="absolute inset-0 h-full w-full pointer-events-none"
            viewBox="0 0 1000 625"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {ANCHOR_POSITIONS.map((pos, i) => {
              const cx1 = 500;
              const cy1 = 312.5;
              const cx2 = (parseFloat(pos.left) / 100) * 1000;
              const cy2 = (parseFloat(pos.top) / 100) * 625;
              return (
                <line
                  key={`line-${i}`}
                  x1={cx1}
                  y1={cy1}
                  x2={cx2}
                  y2={cy2}
                  stroke={`${denjoyChapters[i].color}66`}
                  strokeWidth="1"
                  strokeDasharray="2 4"
                />
              );
            })}
            {/* Two orbit guide circles */}
            <circle cx="500" cy="312.5" r="120" fill="none" stroke="rgba(180,220,255,0.08)" strokeWidth="1" strokeDasharray="2 6" />
            <circle cx="500" cy="312.5" r="200" fill="none" stroke="rgba(180,220,255,0.08)" strokeWidth="1" strokeDasharray="2 6" />
          </svg>

          {/* Center: Meet Endo */}
          <Link
            href={`/denjoy/${flagship.slug}`}
            className="absolute z-10 flex flex-col items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-full"
            style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
            aria-label={`${flagship.fullName} — flagship — open detail page`}
          >
            <span
              className="block rounded-full"
              style={{
                width: 80,
                height: 80,
                background:
                  'radial-gradient(circle, #fff 0%, #cce4ff 60%, #6aa8ff 100%)',
                boxShadow:
                  '0 0 30px rgba(180,220,255,0.95), 0 0 60px rgba(120,180,255,0.6)',
              }}
              aria-hidden="true"
            />
            <span className="mt-2 font-serif italic text-white/70 text-[10px] tracking-widest">
              ★ FLAGSHIP
            </span>
            <span className="mt-1 whitespace-nowrap rounded border border-white/20 bg-black/40 px-2.5 py-1 text-[11px] font-bold tracking-[0.2em] text-white">
              MEET ENDO
            </span>
          </Link>

          {/* Chapter anchors + their SKU nodes */}
          {denjoyChapters.map((chapter, ci) => {
            const products = productsByChapter[chapter.id] ?? [];
            return (
              <div key={chapter.id}>
                <ChapterAnchor
                  chapter={chapter}
                  skuCount={
                    chapter.id === 'integrated'
                      ? products.length + 1 /* +1 for flagship */
                      : products.length
                  }
                  position={ANCHOR_POSITIONS[ci]}
                  onClick={() => scrollToChapter(chapter.id)}
                />
                {products.map((product, pi) => {
                  const pos = NODE_POSITIONS[chapter.id]?.[pi];
                  if (!pos) return null;
                  return (
                    <ConstellationNode
                      key={product.slug}
                      product={product}
                      chapterColor={chapter.color}
                      isSelected={selectedSlug === product.slug}
                      onSelect={setSelectedSlug}
                      position={pos}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Mobile fallback — vertical chapters list */}
        <div className="md:hidden flex flex-col gap-4">
          <Link
            href={`/denjoy/${flagship.slug}`}
            className="block rounded-lg border border-white/15 bg-gradient-to-br from-blue-900/40 to-indigo-900/40 p-6 text-center"
          >
            <div className="font-serif italic text-white/70 text-[10px] tracking-widest mb-2">
              ★ FLAGSHIP
            </div>
            <div className="font-serif italic text-2xl text-white">
              {flagship.name}
            </div>
            <div className="text-white/70 text-sm mt-1">
              {flagship.tagline}
            </div>
          </Link>
          {denjoyChapters.map((chapter) => {
            const products = productsByChapter[chapter.id] ?? [];
            if (products.length === 0) return null;
            return (
              <div
                key={chapter.id}
                className="rounded-lg border border-white/10 bg-white/5 p-4"
              >
                <div className="text-white/60 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
                  <span className="font-serif italic font-normal mr-1 text-white/40">
                    {chapter.roman}
                  </span>
                  {chapter.name}
                </div>
                <div className="flex flex-col gap-2">
                  {products.map((p) => (
                    <button
                      key={p.slug}
                      type="button"
                      onClick={() => setSelectedSlug(p.slug)}
                      className="flex items-center justify-between text-left text-white py-1 px-2 rounded transition-colors hover:bg-white/5 focus:outline-none focus-visible:bg-white/10"
                    >
                      <span className="font-medium text-sm">
                        {p.name}
                        {p.isNew && (
                          <span className="ml-1 text-amber-200" aria-hidden="true">
                            ✦
                          </span>
                        )}
                      </span>
                      <span className="text-white/40 text-xs">→</span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Inline detail card */}
        <InlineDetail
          product={selectedProduct}
          onClose={() => setSelectedSlug(null)}
        />
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/denjoy/Constellation.jsx
git commit -m "feat(denjoy): Constellation — pentagon orchestrator with SVG lines + mobile fallback"
```

---

## Phase 5 · Chapters Band + CTA + FAQ

### Task 8: Build `ChaptersBand` component

**Files:**
- Create: `src/components/denjoy/ChaptersBand.jsx`

- [ ] **Step 1: Create `src/components/denjoy/ChaptersBand.jsx`**

```jsx
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  denjoyChapters,
  getProductsByChapter,
} from '@/data/denjoy';

/**
 * Linear band of 5 chapter cards. Renders below the constellation as a
 * navigable category index. Each card lists its SKUs as inline links.
 */
export default function ChaptersBand() {
  return (
    <section
      aria-labelledby="chapters-band-heading"
      className="bg-white py-12 md:py-16"
    >
      <div className="mx-auto max-w-7xl px-4">
        <h2
          id="chapters-band-heading"
          className="font-serif italic text-2xl md:text-3xl text-zinc-900 mb-6 tracking-tight"
        >
          The line, by chapter.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {denjoyChapters.map((chapter, i) => {
            const products = getProductsByChapter(chapter.id);
            return (
              <motion.div
                key={chapter.id}
                id={`chapter-${chapter.id}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="rounded-lg border border-zinc-200 bg-zinc-50 p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="block h-3 w-3 rounded-full"
                    style={{ background: chapter.color }}
                    aria-hidden="true"
                  />
                  <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                    <span className="font-serif italic font-normal text-zinc-400 mr-1">
                      {chapter.roman}
                    </span>
                    Chapter
                  </span>
                </div>
                <div className="font-serif italic text-lg text-zinc-900 mb-3 leading-tight">
                  {chapter.name}
                </div>
                <ul className="space-y-1">
                  {products.map((p) => (
                    <li key={p.slug}>
                      <Link
                        href={`/denjoy/${p.slug}`}
                        className="block text-sm text-zinc-700 hover:text-amber-700 transition-colors"
                      >
                        {p.isFlagship && (
                          <span className="text-amber-600 mr-1" aria-hidden="true">
                            ★
                          </span>
                        )}
                        {p.name}
                        {p.isNew && (
                          <span className="ml-1 text-amber-500 text-xs" aria-hidden="true">
                            ✦
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/denjoy/ChaptersBand.jsx
git commit -m "feat(denjoy): ChaptersBand — linear 5-card chapter index for SEO + mobile"
```

---

### Task 9: Refactor `DenjoyCTA` with Joining Forces video + Pasig address

**Files:**
- Modify: `src/components/denjoy/DenjoyCTA.jsx` (full rewrite)

- [ ] **Step 1: Replace `src/components/denjoy/DenjoyCTA.jsx`**

```jsx
'use client';

import Link from 'next/link';

const MESSENGER_HREF =
  'https://m.me/dentasourcedirect?ref=denjoy_2026_landing';

export default function DenjoyCTA() {
  return (
    <section
      aria-labelledby="denjoy-cta-heading"
      className="relative h-[70vh] min-h-[480px] w-full overflow-hidden bg-black flex items-center justify-center"
    >
      {/* Joining Forces brand-bookend video */}
      <video
        src="/videos/denjoy/joining-forces.mp4"
        poster="/videos/denjoy/joining-forces-poster.jpg"
        autoPlay
        muted
        playsInline
        loop
        className="absolute inset-0 h-full w-full object-cover opacity-70"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/80"
        aria-hidden="true"
      />

      {/* Eyebrow */}
      <div className="absolute top-6 left-6 right-6 z-10 flex items-center justify-between text-white text-[11px] font-bold uppercase tracking-[0.35em]">
        <span>JOINING FORCES · DSD × DENJOY</span>
        <span className="opacity-50">PASIG</span>
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center text-white">
        <h2
          id="denjoy-cta-heading"
          className="font-serif italic text-3xl md:text-5xl leading-[1.1] tracking-tight mb-4"
        >
          Demo any of these in our{' '}
          <strong className="not-italic font-semibold">Pasig showroom.</strong>
        </h2>
        <p className="text-white/80 text-sm md:text-base mb-2">
          DentaSource Direct · 610 C. Maybunga Rd, Pasig City 1600
        </p>
        <p className="text-white/55 text-[11px] uppercase tracking-[0.2em] mb-8">
          Exclusive Denjoy Distributor · Philippines
        </p>

        <Link
          href={MESSENGER_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded bg-amber-200 px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-amber-900 transition-colors hover:bg-amber-100"
        >
          Chat about Denjoy →
        </Link>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/denjoy/DenjoyCTA.jsx
git commit -m "feat(denjoy): refactor CTA with Joining Forces video + Pasig showroom"
```

---

### Task 10: Trim `DenjoyFAQ` to 3 Q&As for SEO

**Files:**
- Modify: `src/components/denjoy/DenjoyFAQ.jsx` (rewrite the FAQ array)

- [ ] **Step 1: Read existing `DenjoyFAQ.jsx` to preserve its layout/styling**

```bash
cat src/components/denjoy/DenjoyFAQ.jsx | head -80
```

Note the existing `faqs` array near the top of the file and the JSX shape. We're keeping the visual treatment, only changing the content.

- [ ] **Step 2: Replace the file**

Open `src/components/denjoy/DenjoyFAQ.jsx` and replace its entire contents with:

```jsx
'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

const faqs = [
  {
    q: 'How many Denjoy products does DentaSource Direct distribute in the Philippines?',
    a: 'Twelve, as of 2026. The full Denjoy line is exclusively distributed by DSD: 3 integrated systems (Meet Endo, Meta Endo Pro I, Meta Endo), 2 apex locators (FREE PEX, i-Pexo), 2 microscopes (ix6, ix7), 1 cordless motor (i-Moto), and 4 auxiliary products (iUe1, iCure, iPack, Meta Pack).',
  },
  {
    q: 'Where can I see and demo a Denjoy unit before buying?',
    a: 'At the DentaSource Direct Pasig showroom — 610 C. Maybunga Rd, Pasig City 1600. The Meet Endo flagship is already installed for live demos. Other units are demo-ready by appointment. Message us via the chat to schedule.',
  },
  {
    q: 'Is DentaSource Direct an official Denjoy distributor?',
    a: 'DSD is the exclusive Denjoy distributor in the Philippines. All units sold by DSD include local warranty, training, and direct support — not just import paperwork.',
  },
];

export default function DenjoyFAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section
      aria-labelledby="denjoy-faq-heading"
      className="bg-zinc-50 py-12 md:py-16"
    >
      <div className="mx-auto max-w-3xl px-4">
        <h2
          id="denjoy-faq-heading"
          className="font-serif italic text-2xl md:text-3xl text-zinc-900 mb-6 tracking-tight"
        >
          Common questions.
        </h2>
        <div className="space-y-2">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="rounded-lg border border-zinc-200 bg-white overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left focus:outline-none focus-visible:bg-zinc-100"
                  aria-expanded={isOpen}
                >
                  <span className="font-medium text-zinc-900 text-sm md:text-base">
                    {faq.q}
                  </span>
                  <span
                    className={`text-zinc-400 transition-transform ${
                      isOpen ? 'rotate-45' : ''
                    }`}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-4 text-zinc-700 text-sm leading-relaxed">
                    {faq.a}
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/denjoy/DenjoyFAQ.jsx
git commit -m "feat(denjoy): trim FAQ to 3 Q&As covering line size, demo, exclusivity"
```

---

## Phase 6 · Page Assembly

### Task 11: Update `src/app/denjoy/page.js` to use new components + 12-SKU schema

**Files:**
- Modify: `src/app/denjoy/page.js` (full rewrite)

- [ ] **Step 1: Replace `src/app/denjoy/page.js`**

```jsx
import Script from 'next/script';
import DenjoyHero from '@/components/denjoy/DenjoyHero';
import Constellation from '@/components/denjoy/Constellation';
import ChaptersBand from '@/components/denjoy/ChaptersBand';
import DenjoyFAQ from '@/components/denjoy/DenjoyFAQ';
import DenjoyCTA from '@/components/denjoy/DenjoyCTA';
import MessengerButton from '@/components/denjoy/MessengerButton';
import { denjoyProducts } from '@/data/denjoy';
import styles from './page.module.css';

export const metadata = {
  title:
    'All of Denjoy in the Philippines — 12 Endo Instruments | DentaSource Direct',
  description:
    'The complete Denjoy endodontic line — Meet Endo, Meta Endo Pro I, Meta Endo, ix6/ix7 microscopes, FREE PEX, i-Pexo, i-Moto, iUe1, iCure, iPack, Meta Pack. Exclusive distribution by DentaSource Direct. Pasig showroom demos available.',
  keywords: [
    'Denjoy Philippines',
    'endo motor Philippines',
    'apex locator Philippines',
    'dental microscope Philippines',
    'cordless endo motor Philippines',
    'ultrasonic activator Philippines',
    'root canal equipment Philippines',
    'Denjoy Meet Endo',
    'Denjoy ix7 microscope',
    'Denjoy ix6 microscope',
    'Meta Endo Pro I',
    'DentaSource Direct',
  ],
  alternates: { canonical: 'https://dentasourcedirect.com/denjoy' },
  openGraph: {
    title: 'The Denjoy line — finally, all of it. Locally.',
    description:
      'Twelve Denjoy instruments in one Philippines lineup. Meet Endo, Meta Endo Pro I, Meta Endo, ix6/ix7 microscopes, FREE PEX, i-Pexo, i-Moto, iUe1, iCure, iPack, Meta Pack. Exclusive distribution by DentaSource Direct.',
    url: 'https://dentasourcedirect.com/denjoy',
    siteName: 'DentaSource Direct',
    locale: 'en_PH',
    type: 'website',
    images: [
      {
        url: 'https://dentasourcedirect.com/videos/denjoy/meet-endo-poster.jpg',
        width: 1200,
        height: 630,
        alt: 'The Denjoy line in the Philippines — twelve instruments, exclusive distribution by DentaSource Direct',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All of Denjoy in the Philippines | DentaSource Direct',
    description:
      'Twelve Denjoy instruments in one Philippines lineup. Exclusive by DSD.',
    images: ['https://dentasourcedirect.com/videos/denjoy/meet-endo-poster.jpg'],
  },
};

const productHubSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProductGroup',
  name: 'Denjoy Endodontic Equipment — Philippines',
  description:
    'Twelve Denjoy endodontic and microscopy products distributed exclusively in the Philippines by DentaSource Direct.',
  brand: { '@type': 'Brand', name: 'Denjoy' },
  url: 'https://dentasourcedirect.com/denjoy',
  image:
    'https://dentasourcedirect.com/videos/denjoy/meet-endo-poster.jpg',
  seller: {
    '@type': 'Organization',
    name: 'DentaSource Direct',
    url: 'https://dentasourcedirect.com',
    areaServed: 'Philippines',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '610 C. Maybunga Rd',
      addressLocality: 'Pasig City',
      postalCode: '1600',
      addressCountry: 'PH',
    },
  },
  hasVariant: denjoyProducts.map((p) => ({
    '@type': 'Product',
    name: p.fullName,
    url: `https://dentasourcedirect.com/denjoy/${p.slug}`,
    brand: { '@type': 'Brand', name: 'Denjoy' },
  })),
};

export default function DenjoyPage() {
  return (
    <>
      <Script
        id="denjoy-product-schema"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(productHubSchema)}
      </Script>
      <main className={styles.scrollContainer}>
        <DenjoyHero />
        <Constellation />
        <ChaptersBand />
        <DenjoyCTA />
        <DenjoyFAQ />
      </main>
      <div className={styles.mobileStickyBar}>
        <MessengerButton
          prefillText="Hi DSD, I'd like to chat about the Denjoy line."
          label="Chat about Denjoy"
        />
      </div>
    </>
  );
}
```

- [ ] **Step 2: Run dev server**

```bash
npm run dev
```

- [ ] **Step 3: Browser-QA `/denjoy` end-to-end**

Open `http://localhost:3000/denjoy`. Verify:

- Hero plays Meet-Endo brand film, eyebrow shows `DENJOY · PHILIPPINES` / `2026`, italic tagline, amber CTA, "See the 12" scroll cue
- Scrolling reveals constellation map with Meet Endo at center, 5 chapter anchors, all SKU dots positioned around their anchors
- Hovering a SKU shows its tooltip name; clicking opens InlineDetail card below the map with hero image + features + "See full page →" + "Chat about" button
- Clicking another SKU swaps the InlineDetail content
- Clicking the close (×) button collapses InlineDetail
- ChaptersBand shows 5 cards with Roman numerals + chapter names + SKU lists, each SKU is a link
- DenjoyCTA plays Joining Forces film, shows "Demo any of these in our **Pasig showroom.**" + Pasig address + Messenger button
- DenjoyFAQ shows 3 Q&As, accordion-expand works
- Mobile sticky Messenger bar visible at viewport bottom
- Resize to <720px width: constellation collapses to vertical chapter list
- No console errors

Stop dev server.

- [ ] **Step 4: Commit**

```bash
git add src/app/denjoy/page.js
git commit -m "feat(denjoy): assemble pentagon landing page + 12-SKU schema + 2026 metadata"
```

---

## Phase 7 · Routes & SEO

### Task 12: Add 301 redirects for retired imate3 + aike

**Files:**
- Modify: `next.config.mjs` (extend `redirects()` array)

- [ ] **Step 1: Read current `next.config.mjs`**

```bash
cat next.config.mjs
```

Note the existing `async redirects()` block returning an array of 3 redirects (a3-dental-chair, dental-chairs, products/:path+).

- [ ] **Step 2: Edit `next.config.mjs` to add 2 new redirects**

In the `return [` array inside `redirects()`, before the closing `];`, add these two entries:

```js
      {
        source: '/denjoy/imate3',
        destination: '/denjoy',
        permanent: true,
      },
      {
        source: '/denjoy/aike',
        destination: '/denjoy',
        permanent: true,
      },
```

The full `redirects()` block should now have 5 entries.

- [ ] **Step 3: Restart dev server and verify**

```bash
npm run dev
```

Open `http://localhost:3000/denjoy/imate3` — expect a 308 (Next.js renders permanent redirects as 308 in dev) → lands on `/denjoy`.
Open `http://localhost:3000/denjoy/aike` — same.
Open `http://localhost:3000/denjoy/meet-endo` — bespoke flagship page should still render unchanged.
Open `http://localhost:3000/denjoy/ix7` — `[slug]` route should render the new SKU page from data (may have empty gallery — that's expected).

Stop dev server.

- [ ] **Step 4: Commit**

```bash
git add next.config.mjs
git commit -m "feat(denjoy): 301 redirects for retired imate3 + aike → /denjoy"
```

---

### Task 13: Update `src/app/sitemap.js` for new SKUs

**Files:**
- Modify: `src/app/sitemap.js`

- [ ] **Step 1: Read current sitemap**

```bash
cat src/app/sitemap.js
```

Identify how Denjoy URLs are listed today (look for `/denjoy/imate3` and `/denjoy/aike` entries).

- [ ] **Step 2: Edit `src/app/sitemap.js`**

Find the array entries for `/denjoy/imate3` and `/denjoy/aike` and **delete** them.

In the same array, **add** these 9 new entries (keep formatting consistent with the file's existing entries — match `lastModified`, `changeFrequency`, `priority` to neighboring `/denjoy/*` entries):

```js
{ url: 'https://dentasourcedirect.com/denjoy/meta-endo-pro-i', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
{ url: 'https://dentasourcedirect.com/denjoy/meta-endo',       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
{ url: 'https://dentasourcedirect.com/denjoy/ix7',             lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
{ url: 'https://dentasourcedirect.com/denjoy/ix6',             lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
{ url: 'https://dentasourcedirect.com/denjoy/i-moto',          lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
{ url: 'https://dentasourcedirect.com/denjoy/iue1',            lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
{ url: 'https://dentasourcedirect.com/denjoy/icure',           lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
{ url: 'https://dentasourcedirect.com/denjoy/ipack',           lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
{ url: 'https://dentasourcedirect.com/denjoy/meta-pack',       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
```

- [ ] **Step 3: Verify**

```bash
npm run dev
```

Open `http://localhost:3000/sitemap.xml` — should be valid XML, contain all 12 `/denjoy/*` SKU URLs, and **not** contain `/denjoy/imate3` or `/denjoy/aike`. Stop dev server.

- [ ] **Step 4: Commit**

```bash
git add src/app/sitemap.js
git commit -m "feat(denjoy): update sitemap — drop imate3+aike, add 9 new Denjoy SKUs"
```

---

## Phase 8 · Cleanup

### Task 14: Delete retired components

**Files:**
- Delete: `src/components/denjoy/MeetEndoPanel.jsx`
- Delete: `src/components/denjoy/ProductPanel.jsx`
- Delete: `src/components/denjoy/DenjoyWhyPH.jsx`

- [ ] **Step 1: Confirm nothing imports these any more**

```bash
grep -rn "MeetEndoPanel\|ProductPanel\|DenjoyWhyPH" src --include="*.jsx" --include="*.js" --include="*.tsx" --include="*.ts"
```

Expected: no matches outside the files themselves. (If there are imports, fix them first — the new `page.js` should already have removed them.)

- [ ] **Step 2: Delete the files**

```bash
rm src/components/denjoy/MeetEndoPanel.jsx
rm src/components/denjoy/ProductPanel.jsx
rm src/components/denjoy/DenjoyWhyPH.jsx
```

- [ ] **Step 3: Verify dev server still boots**

```bash
npm run dev
```

Open `http://localhost:3000/denjoy` — should render identically to the previous task. Stop dev server.

- [ ] **Step 4: Commit**

```bash
git add -A src/components/denjoy/
git commit -m "chore(denjoy): retire MeetEndoPanel + ProductPanel + DenjoyWhyPH components"
```

---

### Task 15: Delete retired imate3 + aike image folders

**Files:**
- Delete: `public/images/denjoy/imate3/` (entire folder)
- Delete: `public/images/denjoy/aike/` (entire folder)

- [ ] **Step 1: Confirm nothing references these images**

```bash
grep -rn "denjoy/imate3\|denjoy/aike" src public --include="*.js" --include="*.jsx" --include="*.tsx" --include="*.json"
```

Expected: no matches. If any remain, resolve them first.

- [ ] **Step 2: Delete the folders**

```bash
rm -rf public/images/denjoy/imate3
rm -rf public/images/denjoy/aike
```

- [ ] **Step 3: Verify**

```bash
ls public/images/denjoy/
```

Expected: 12 folders (one per current SKU). No `imate3` or `aike`.

- [ ] **Step 4: Commit**

```bash
git add -A public/images/denjoy/
git commit -m "chore(denjoy): drop imate3 + aike image assets — products retired"
```

---

## Phase 9 · QA & Deploy

### Task 16: Local end-to-end QA pass

**Files:** none (browser testing only)

- [ ] **Step 1: Run a clean dev build**

```bash
npm run dev
```

- [ ] **Step 2: Walk through this checklist in browser at `http://localhost:3000`**

Hero
- [ ] `/denjoy` hero plays Meet-Endo brand film muted on autoplay
- [ ] Eyebrow `DENJOY · PHILIPPINES` (left) + `2026` (right)
- [ ] Italic tagline + bold continuation visible
- [ ] "Chat about Denjoy →" amber CTA opens Messenger in new tab with prefill
- [ ] "See the 12 ↓" scroll cue bouncing bottom-right

Constellation
- [ ] All 5 chapter anchors visible (I top, II upper-right, III lower-right, IV lower-left, V upper-left)
- [ ] Meet Endo center node white-blue glow with "★ FLAGSHIP" + "MEET ENDO" labels
- [ ] All 11 co-star nodes visible at their chapter clusters
- [ ] ✦ NEW tag visible on the 8 new SKUs (Meta Endo Pro I, Meta Endo, ix6, ix7, i-Moto, iUe1, iCure, iPack, Meta Pack)
- [ ] Hovering any node shows tooltip with SKU name
- [ ] Clicking a node opens InlineDetail with that product's hero + features + buttons
- [ ] Clicking another node swaps InlineDetail content (no flicker)
- [ ] InlineDetail close (×) button collapses the detail
- [ ] Clicking Meet Endo center routes to `/denjoy/meet-endo`
- [ ] Clicking a chapter anchor smooth-scrolls to its ChaptersBand card
- [ ] Resize to 700px width — constellation collapses to vertical chapter list with tap-to-expand SKUs

ChaptersBand
- [ ] 5 chapter cards visible with Roman numeral + name + SKU list
- [ ] Each SKU is a clickable link to `/denjoy/<slug>`
- [ ] Meet Endo shows ★ flagship marker
- [ ] New SKUs show ✦

CTA
- [ ] Joining Forces brand film plays muted on autoplay
- [ ] "Demo any of these in our **Pasig showroom.**" tagline visible
- [ ] Address `610 C. Maybunga Rd, Pasig City 1600` displayed
- [ ] "Exclusive Denjoy Distributor · Philippines" eyebrow
- [ ] Messenger CTA opens chat in new tab

FAQ
- [ ] 3 Q&As visible
- [ ] First Q&A open by default
- [ ] Click question expands/collapses with smooth animation

Detail pages
- [ ] `/denjoy/meet-endo` — bespoke flagship page renders unchanged
- [ ] `/denjoy/ix7` — renders via `[slug]` template, shows ix7 data
- [ ] `/denjoy/iue1`, `/denjoy/meta-endo-pro-i`, others — all render
- [ ] `/denjoy/imate3` → redirects to `/denjoy` (308 in dev)
- [ ] `/denjoy/aike` → redirects to `/denjoy`
- [ ] `/denjoy/iFinder` → 404 (intentionally excluded)

Console & accessibility
- [ ] Browser console has zero errors and zero React warnings
- [ ] Keyboard tab through `/denjoy`: hero CTA, all constellation nodes, ChaptersBand links, CTA Messenger button — focus rings visible
- [ ] Screen reader sees `<button aria-label>` and `<section aria-labelledby>` on all interactive regions

Build sanity
- [ ] `npm run build` completes without errors
- [ ] `npm run lint` reports zero new errors

- [ ] **Step 3: Commit any tweaks discovered during QA**

If the QA pass surfaced bugs, fix them and commit individually with descriptive messages. Otherwise, no commit needed for this task.

---

### Task 17: Push branch + Netlify deploy preview review

**Files:** none (git + Netlify only)

- [ ] **Step 1: Push the branch**

```bash
git push -u origin feat/denjoy-pentagon-2026
```

- [ ] **Step 2: Wait for Netlify deploy preview**

Netlify auto-builds the branch. The preview URL pattern is:
`https://deploy-preview-<N>--ubiquitous-croissant-30d0d9.netlify.app`

Find the exact URL via `gh pr create` output (Step 3) or via Netlify dashboard.

- [ ] **Step 3: Open the PR**

```bash
gh pr create --base main --title "feat(denjoy): pentagon landing — 12-SKU 2026 expansion" --body "$(cat <<'EOF'
## Summary

Replaces /denjoy with cinematic D+C hybrid: full-bleed Meet-Endo brand-film hero feeding a single-viewport pentagon constellation map of all 12 Denjoy SKUs grouped into 5 chapters.

- Retires: imate3, AIKE
- Adds: Meta Endo Pro I, Meta Endo, ix7, ix6, i-Moto, iUe1, iCure, iPack, Meta Pack
- New components: Constellation, ConstellationNode, ChapterAnchor, InlineDetail, ChaptersBand
- Refactored: DenjoyHero (Hero C variant), DenjoyCTA (Joining Forces backdrop + Pasig address)
- Trimmed: DenjoyFAQ to 3 Q&As
- 301 redirects for retired imate3 + aike
- Updated metadata, OG, ProductGroup schema, sitemap

Spec: `docs/superpowers/specs/2026-05-11-denjoy-pentagon-design.md`
Plan: `docs/superpowers/plans/2026-05-11-denjoy-pentagon-landing.md`

## Test plan

- [ ] Netlify deploy preview /denjoy renders with brand film hero
- [ ] Constellation interactive on desktop (hover, click, scroll-to-chapter)
- [ ] Mobile collapses to vertical chapter list under 720px
- [ ] /denjoy/meet-endo bespoke flagship page unchanged
- [ ] /denjoy/[any new slug] renders via [slug] template
- [ ] /denjoy/imate3 + /denjoy/aike redirect to /denjoy (301)
- [ ] /sitemap.xml lists all 12 Denjoy SKUs, no imate3/aike
- [ ] OG card image loads on social preview
- [ ] Lighthouse score: LCP under 2.5s on mid-tier mobile
- [ ] Schema validates on Google Rich Results Test

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 4: Open the deploy-preview URL and run the QA checklist from Task 16 against it**

The deploy-preview must pass all the same checks as the local pass.

- [ ] **Step 5: Hand off to Jarich for visual review**

Per locked memory `feedback_dsd_deploy_protocol`: visual changes require Jarich's screenshot review before production merge. Send him the deploy-preview URL via Telegram. Wait for his sign-off.

- [ ] **Step 6: After Jarich approves — fire async Codex review on the PR**

```bash
codex review --base main --title "denjoy pentagon landing"
```

Per locked memory `feedback_codex_self_review` + `feedback_codex_background_review`: run Codex review in background after code work, keep moving. If Codex flags issues, fix in follow-up commits to the same branch.

- [ ] **Step 7: After Codex passes + Jarich approves — squash-merge to main**

```bash
gh pr merge --squash --delete-branch
```

Production deploy on Netlify auto-triggers from main. Verify production `https://dentasourcedirect.com/denjoy` matches the deploy preview.

---

## Plan complete — saved to `docs/superpowers/plans/2026-05-11-denjoy-pentagon-landing.md`
