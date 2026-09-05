#!/usr/bin/env python3
"""Build the spare-parts marquee assets for the after-sales beat.

Re-runnable:  python3 scripts/parts-pipeline/build.py

SOURCE. The parts come from DSD's own service hub knowledge base, which is a Quartz
site generated from the Convex KB. Its generated page lives on this Mac at
  ~/second-brain/builds/dsd-techhub/content/spare-parts.md
and is the SAME catalogue served at the servicehub URL, so the pipeline reads the local
file rather than scraping the live site. Each entry carries an RV code, a category, a
human name where the source has one, and a Convex storage image URL. Images are fetched
once and cached in the scratchpad, so a re-run costs nothing after the first.

WHAT THE IMAGES ARE. Despite the page describing them as exploded diagrams, they are
studio photographs of the individual parts on a white ground. No code number is burned
into any image, so nothing has to be painted out.

CODE NUMBERS NEVER RENDER (Jarich's ruling). `code` is kept in the JSON for internal
reference only, and slugs are built from the part NAME, never the code, so a code cannot
leak into a filename or a URL either.

NAMES ARE NEVER INVENTED. 161 of the 244 catalogue entries carry no name in the source,
only an RV code. Those keep `name: null` and `labelled: false`; the marquee can show the
photograph without a caption. Making up a name for them would be fabricating a spec.
"""

from __future__ import annotations

import io
import json
import re
import sys
import unicodedata
import urllib.request
from collections import Counter
from pathlib import Path

try:
    from PIL import Image, ImageFilter
except ImportError:  # pragma: no cover
    sys.exit("Pillow is required:  python3 -m pip install --user Pillow")

REPO = Path(__file__).resolve().parents[2]
SOURCE_MD = Path.home() / "second-brain/builds/dsd-techhub/content/spare-parts.md"
SOURCE_URL = "https://dsd-servicehub-11edfd29b6df.vercel.app/spare-parts"
OUT_IMG = REPO / "public/cinema/parts"
OUT_JSON = REPO / "src/data/cinema/parts.json"
CACHE = Path("/private/tmp/claude-501/-Users-jarich-second-brain/"
             "bd07f7c7-7fc8-48d1-acd9-274356db7d47/scratchpad/parts/cache")
CONTACT_SHEET = Path.home() / "second-brain/builds/dsd-site-overhaul/proof/parts-contact-sheet.png"

MAX_SIDE = 800
WEBP_OVER_BYTES = 150 * 1024
NEAR_WHITE = 240          # a pixel is "paper" when every channel is at least this

# Fragments the source stores in the name column that are not part names: continuation
# text from the printed table ("For the S9"), or a bare adjective. Shown as a caption
# they would read as nonsense, so they are treated as unnamed rather than renamed.
NOT_A_NAME = {
    "normal", "water", "external", "round", "mounted", "box", "two-hole", "for",
}

# The two catalogue rows whose <b> ran the RV code into the start of the part name.
MERGED_CODE_AND_NAME = {
    "RV112-1Motor": ("RV112-1", "Motor"),
    "RV022-13-way": ("RV022-1", "3-way"),
}

# Marquee order: recognisable things first, and the opening run alternates categories so
# the strip reads as variety rather than as four suction filters in a row.
CATEGORY_ORDER = [
    "Headrest & Upholstery",
    "Syringe & Handpiece",
    "Light & X-Ray",
    "Motor & Chair",
    "Suction",
    "Water System",
    "Spittoon",
    "Electrical",
    "Covers & Frame",
    "Other",
]


def slugify(text: str) -> str:
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode()
    text = re.sub(r"[^a-zA-Z0-9]+", "-", text).strip("-").lower()
    return re.sub(r"-{2,}", "-", text)


def parse_catalogue(md: str):
    """Return [{code, name, category, url}] in source order."""
    heads = [(m.start(), m.group(1).strip())
             for m in re.finditer(r"^## (.+?) \(\d+\)\s*$", md, re.M)]

    def category_at(pos: int) -> str:
        current = "Other"
        for start, title in heads:
            if start < pos:
                current = title
            else:
                break
        return current

    parts = []
    for m in re.finditer(r'<a href="([^"]+)"[^>]*>.*?<b>([^<]+)</b>\s*([^<]*)</span></a>',
                         md, re.S):
        url, code, name = m.group(1), m.group(2).strip(), m.group(3).strip()
        # EXACTLY TWO source rows ran the code and the name together inside the <b>.
        # A lookup, not a regex: every pattern I tried backtracked and split clean codes
        # into fake names ("RV035" -> code "RV03" + name "5", "RV026-1" -> "RV02" + "6-1"),
        # which is how a first run claimed 232 named parts instead of 83. Two known data
        # defects are better handled by naming them than by a rule that guesses.
        if code in MERGED_CODE_AND_NAME:
            code, head = MERGED_CODE_AND_NAME[code]
            name = f"{head} {name}".strip()
        if name.strip().lower().rstrip(".") in NOT_A_NAME:
            name = ""
        parts.append({"code": code, "name": name or None,
                      "category": category_at(m.start()), "url": url})
    return parts


def fetch(url: str, dest: Path) -> bytes:
    if dest.exists():
        return dest.read_bytes()
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    data = urllib.request.urlopen(req, timeout=60).read()
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_bytes(data)
    return data


def cut_background(img: Image.Image):
    """Flood the near-white paper inward from the border and make it transparent.

    Flooding FROM THE BORDER rather than keying every white pixel is what keeps a white
    highlight in the middle of a chrome fitting: an interior highlight is never reached
    by the flood, so it survives. Returns (image, cleaned) where cleaned is False when
    the part does not sit on a white ground, in which case it is left untouched.
    """
    img = img.convert("RGBA")
    w, h = img.size
    px = img.load()

    def is_paper(xy):
        r, g, b, a = px[xy]
        return a > 0 and r >= NEAR_WHITE and g >= NEAR_WHITE and b >= NEAR_WHITE

    border = [(x, y) for x in range(w) for y in (0, h - 1)]
    border += [(x, y) for y in range(h) for x in (0, w - 1)]
    paper_border = sum(1 for p in border if is_paper(p))
    if paper_border < len(border) * 0.9:
        return img, False           # a studio background that is not white: leave it

    seen = bytearray(w * h)
    stack = [p for p in border if is_paper(p)]
    for x, y in stack:
        seen[y * w + x] = 1
    while stack:
        x, y = stack.pop()
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < w and 0 <= ny < h and not seen[ny * w + nx] and is_paper((nx, ny)):
                seen[ny * w + nx] = 1
                stack.append((nx, ny))

    mask = Image.frombytes("L", (w, h), bytes(255 if b else 0 for b in seen))
    # 1px feather so the cut edge is not a staircase against the dark page
    mask = mask.filter(ImageFilter.GaussianBlur(1))
    alpha = img.getchannel("A").point(lambda v: v)
    keep = Image.eval(mask, lambda v: 255 - v)
    img.putalpha(Image.composite(keep, alpha, Image.new("L", (w, h), 255)))
    return img, True


def trim_and_fit(img: Image.Image) -> Image.Image:
    box = img.getchannel("A").getbbox()
    if box:
        img = img.crop(box)
    if max(img.size) > MAX_SIDE:
        scale = MAX_SIDE / max(img.size)
        img = img.resize((max(1, round(img.width * scale)), max(1, round(img.height * scale))),
                         Image.LANCZOS)
    return img


def contact_sheet(entries, path: Path, cols: int = 12, cell: int = 130):
    """A dark ground on purpose: transparency only shows against something."""
    rows = (len(entries) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * cell, rows * cell), (10, 14, 22))
    for i, e in enumerate(entries):
        try:
            tile = Image.open(OUT_IMG / f"{e['slug']}.png").convert("RGBA")
        except OSError:
            continue
        tile.thumbnail((cell - 14, cell - 14), Image.LANCZOS)
        x = (i % cols) * cell + (cell - tile.width) // 2
        y = (i // cols) * cell + (cell - tile.height) // 2
        sheet.paste(tile, (x, y), tile)
    path.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(path, optimize=True)
    return sheet.size


def main() -> int:
    if not SOURCE_MD.exists():
        sys.exit(f"catalogue not found: {SOURCE_MD}")
    parts = parse_catalogue(SOURCE_MD.read_text(encoding="utf8"))
    print(f"catalogue: {len(parts)} entries, "
          f"{sum(1 for p in parts if p['name'])} with a name in the source")

    OUT_IMG.mkdir(parents=True, exist_ok=True)
    CACHE.mkdir(parents=True, exist_ok=True)
    # Generated directory, rebuilt every run: clear it so a renamed part cannot leave a
    # stale image behind that parts.json no longer references. Scoped to this directory
    # and to the two extensions this script writes.
    for stale in list(OUT_IMG.glob("*.png")) + list(OUT_IMG.glob("*.webp")):
        stale.unlink()

    used, produced, uncleaned, failed = set(), [], [], []
    for i, p in enumerate(parts):
        base = slugify(p["name"]) if p["name"] else "part"
        slug = base
        n = 2
        while slug in used:
            slug = f"{base}-{n}"
            n += 1
        used.add(slug)

        try:
            raw = fetch(p["url"], CACHE / f"{p['code'].replace('/', '_')}.bin")
            img = Image.open(io.BytesIO(raw))
        except Exception as exc:                      # noqa: BLE001
            failed.append((p["code"], str(exc)[:80]))
            continue

        img, cleaned = cut_background(img)
        if not cleaned:
            uncleaned.append({"slug": slug, "code": p["code"], "name": p["name"]})
        img = trim_and_fit(img)

        dest = OUT_IMG / f"{slug}.png"
        img.save(dest, "PNG", optimize=True)
        if dest.stat().st_size > WEBP_OVER_BYTES:
            img.save(OUT_IMG / f"{slug}.webp", "WEBP", quality=86, method=6)

        produced.append({
            "slug": slug,
            "name": p["name"],
            "labelled": bool(p["name"]),
            "src": f"/cinema/parts/{slug}.png",
            "width": img.width,
            "height": img.height,
            "category": p["category"],
            "cleaned": cleaned,
            "code": p["code"],
        })

    # ---- marquee order ----
    # named first, category priority next, and then an interleave so the opening run of
    # the strip alternates categories instead of showing one bucket in a block.
    named = [e for e in produced if e["labelled"]]
    unnamed = [e for e in produced if not e["labelled"]]
    buckets: dict[str, list] = {}
    for e in named:
        buckets.setdefault(e["category"], []).append(e)
    ordered, guard = [], 0
    while any(buckets.values()) and guard < 10000:
        for cat in CATEGORY_ORDER:
            if buckets.get(cat):
                ordered.append(buckets[cat].pop(0))
        guard += 1
    ordered += unnamed

    payload = {
        "version": 1,
        "source": SOURCE_URL,
        "generated": __import__("datetime").date.today().isoformat(),
        "notes": (
            "Spare parts from DSD's own service hub knowledge base, built by "
            "scripts/parts-pipeline/build.py from the catalogue that generates that site. "
            "RULED: code numbers never render. `code` is internal reference only and slugs "
            "are built from the part name, never the code. White studio backgrounds are "
            "flood filled from the border so interior highlights survive. 161 of the 244 "
            "catalogue entries carry NO name in the source, only a code; those keep "
            "name null and labelled false so the marquee can show the photograph without a "
            "caption. No name has been invented. Order: named parts first, categories "
            "interleaved so the opening run reads as variety, unnamed photographs after."
        ),
        "counts": {
            "catalogue": len(parts),
            "produced": len(produced),
            "named": len(named),
            "unnamed": len(unnamed),
            "backgroundNotCleaned": len(uncleaned),
            "failed": len(failed),
        },
        "parts": [
            {k: e[k] for k in ("slug", "name", "labelled", "src", "width", "height",
                               "category", "code")}
            for e in ordered
        ],
    }
    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf8")

    size = contact_sheet(ordered, CONTACT_SHEET)

    print(f"produced {len(produced)} images  named {len(named)}  unnamed {len(unnamed)}")
    if uncleaned:
        print(f"background NOT cleaned ({len(uncleaned)}): "
              + ", ".join(f"{u['slug']}" for u in uncleaned[:12]))
    if failed:
        print(f"failed ({len(failed)}): " + ", ".join(f"{c} {e}" for c, e in failed[:8]))
    biggest = sorted(OUT_IMG.glob("*.png"), key=lambda f: f.stat().st_size, reverse=True)[:3]
    for f in biggest:
        print(f"  largest: {f.name} {f.stat().st_size // 1024} KB")
    print(f"categories: {dict(Counter(e['category'] for e in ordered))}")
    print(f"contact sheet {size[0]}x{size[1]} -> {CONTACT_SHEET}")
    print(f"json -> {OUT_JSON}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
