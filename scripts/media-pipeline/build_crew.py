#!/usr/bin/env python3
"""Crew shots: technicians at a chair, and sales staff with clients.

    python3 scripts/media-pipeline/build_crew.py

PICKED BY LOOKING. The 635 photographs in public/images/news were laid out as labelled
contact sheets and chosen by eye, because filenames do not tell you what is in a frame.
That mattered: a filename sweep of the install and delivery folders would have shipped
"PROOF OF DELIVERY" cards, "How We Install Your Dental Chair" promo graphics, and six
model cards carrying PRICES ("Php 22,403"), which the editorial rules ban outright. The
rest of the archive is largely Denjoy product renders, also excluded.

The frames below are real photographs of real work: crates coming off a van, a unit being
uncrated and assembled, a technician under a chair with tools, staff demonstrating an
instrument to a visitor at a booth, staff at a desk with paperwork.

ALT TEXT IS ROLE ONLY. Nobody is named, and the alts describe the work, not the worker.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    sys.exit("Pillow is required")

REPO = Path(__file__).resolve().parents[2]
OUT_JSON = REPO / "src/data/cinema/crew-shots.json"

# index -> alt, from the two contact sheets. Indices below 1000 are the install and
# delivery sheet, 1000 and above the rest of the archive. Both sheets were regenerated
# with share cards filtered out BEFORE picking, so the numbering here is stable.
TECHNICIAN = {
    0: "Moving the wrapped unit into the operatory",
    2: "The install team working on the chair base",
    3: "Setting the unit up on the operatory floor",
    4: "Checking the console after assembly",
    6: "Mounting the instrument holders",
    7: "Working through the delivery system",
    9: "Carrying a component in",
    12: "Connecting the lines under the unit",
    13: "Lifting the chair frame into position",
    14: "Fitting the backrest",
    16: "Fitting the spittoon bowl",
    19: "Working on the control block",
    21: "Cleaning the bowl before handover",
    22: "Wheeling the unit in on a trolley",
    32: "Unloading the crate from the van",
    37: "Uncrating a unit on delivery day",
    39: "Unwrapping the chair in the clinic",
    40: "Assembling the unit on site",
    61: "Servicing the chair at the clinic",
    71: "Setting the operating light",
}
SALES = {
    1004: "Showing the range on a tablet",
    1005: "Walking a visitor through a unit",
    1006: "Talking a clinic through the options",
    1007: "The team at the convention stand",
    1019: "A chairside demonstration for a visitor",
    1020: "Visitors seated at the stand",
    1031: "Demonstrating an apex locator",
    1032: "Explaining the endodontic range",
    1033: "Two visitors trying the instrument",
    1034: "A hands on demonstration at the stand",
    1066: "The stand during the convention",
    1067: "Answering questions at the stand",
    1079: "Going through an order together",
    1092: "Desk work on a clinic order",
    1114: "Visitors at the stand",
    1117: "The team at the end of a convention day",
}


# OG cards are SHARE ARTWORK, not photographs: they carry overlaid titles, logos and in
# one case a map of the delivery area. One slipped into the first run of this list and the
# proof sheet caught it, so the rule is enforced here rather than trusted to the picks.
def is_share_card(path: Path) -> bool:
    n = path.name.lower()
    return n.startswith("og") or "-og-" in n or n == "og.jpg"


# ☠️ TOO SMALL FOR A STRIP TILE, AND NOT SWAPPABLE. These frames are 360x640, which is
# their source reel's native size: Facebook never published them larger, so there is
# nothing to re-fetch. They are ALSO published article photographs whose alt text names
# that exact scene ("The Crest instructor in loupes working a handpiece on a phantom
# head"), so overwriting the file with a bigger frame from another course would caption
# one event with a picture of another. The articles keep them, where 360 wide reads fine;
# the strips drop them.
# ☠️ TILE SIZE DECIDES, NOT MANIFEST TYPE. Ruled a117e320 after builder-home's
# counterexample: crew-shots' row is 126px, where a 360 wide photograph is fine, so a
# blanket "strip manifest" ban removed two frames from the one place they still worked.
#
# The comparison is min(srcW/tileW, srcH/tileH) >= DPR, NOT tileW*DPR vs the long side.
# These tiles are object-fit: cover, which crops the excess, so the BINDING axis is the
# smaller of the two ratios. The long side shorthand gets crew-shots right and
# training-media wrong: a 360x640 frame in a 320x240 tile has a long side of 640, which
# clears 320*2, yet only 360 pixels cover a 640 device px width. Measured, not assumed.
#
# The case that started it: v039-1, v039-2, v039-5, v033-8, v301-2, all 360x640 because
# that is their source reel's native size. Under this rule they are barred where the tile
# is large and kept where it is small, rather than banned everywhere by name.
DPR = 2


def strip_unsafe(src_w: int, src_h: int, tile_w: int, tile_h: int) -> str | None:
    """Reason the file is too soft for this tile, or None if it is fine."""
    if not src_w or not src_h:
        return None
    if min(src_w / tile_w, src_h / tile_h) >= DPR:
        return None
    return (f"{src_w}x{src_h} into a {tile_w}x{tile_h} css tile: needs "
            f"{tile_w * DPR}x{tile_h * DPR} device px at DPR {DPR}")

TILE_W, TILE_H = 126, 84   # .dsd-crew-shot in home-cinema.css, measured


# THE INDEX IS REBUILT FROM THE REPO, NOT READ FROM A SCRATCH FILE. The first version of
# this script read the contact-sheet index out of the session scratchpad, which meant that
# once the intermediates were deleted the generator could not run at all: the picks below
# were frozen numbers pointing at a list that no longer existed. The same rules that built
# those sheets are stated here instead, so the numbering is reproducible from the repo
# alone and a re-run is a real check rather than a wish.
#
# Rules, exactly as the sheets were built: install and delivery folders first, up to 6
# photographs each, indices from 0; then every other folder, up to 4 each, indices from
# 1000. Share cards are filtered out BEFORE numbering, which is why the numbering is
# stable even though og.jpg exists in most folders.
TECH_KEYWORDS = ("install", "deliver", "technician", "service", "dismantling",
                 "restock", "pre-delivery", "turnover", "upgrade")
NEWS = REPO / "public/images/news"


def _folder_images(slug: str, limit: int) -> list[Path]:
    files = [f for f in sorted((NEWS / slug).glob("*.jpg")) if not is_share_card(f)]
    return files[:limit]


def build_index() -> dict[int, Path]:
    slugs = sorted(p.name for p in NEWS.iterdir() if p.is_dir())
    tech = [s for s in slugs if any(k in s for k in TECH_KEYWORDS)]
    other = [s for s in slugs if not any(k in s for k in TECH_KEYWORDS)]
    idx, n = {}, 0
    for s in tech:
        for f in _folder_images(s, 6):
            idx[n] = f
            n += 1
    n = 1000
    for s in other:
        for f in _folder_images(s, 4):
            idx[n] = f
            n += 1
    return idx


def main() -> int:
    idx = build_index()
    items, missing, skipped = [], [], {}

    def add(i: int, alt: str, kind: str):
        src = idx.get(i)
        if not src or not src.exists():
            missing.append(i)
            return
        if is_share_card(src):
            raise SystemExit(f"index {i} is a share card, not a photograph: {src.name}")

        with Image.open(src) as im:
            w, h = im.size
        why = strip_unsafe(w, h, TILE_W, TILE_H)
        if why:
            skipped[src.name] = why
            return
        items.append({"src": "/" + str(src.relative_to(REPO / "public")),
                      "alt": alt, "kind": kind, "width": w, "height": h})

    # alternate technician and sales so a row never runs as one kind
    tech = list(TECHNICIAN.items())
    sales = list(SALES.items())
    for n in range(max(len(tech), len(sales))):
        if n < len(tech):
            add(tech[n][0], tech[n][1], "technician")
        if n < len(sales):
            add(sales[n][0], sales[n][1], "sales")

    payload = {
        "version": 1,
        "source": "public/images/news, the published article archive",
        "generated": __import__("datetime").date.today().isoformat(),
        "notes": (
            "Technicians at a chair and sales staff with clients, chosen by looking at "
            "the frames rather than by filename. ALT TEXT IS ROLE ONLY, nobody is named. "
            "Real photographs only: the archive's PROOF OF DELIVERY cards, the How We "
            "Install promo graphics, the six model cards carrying prices, and the Denjoy "
            "product renders are all excluded. Items alternate technician and sales so a "
            "row never runs as one kind."
            + (" REMOVED AT THIS TILE SIZE: " + ", ".join(sorted(skipped)) + "."
               if skipped else "")
        ),
        "tilePx": TILE_W,
        "tileHeightPx": TILE_H,
        "stripUnsafe": dict(sorted(skipped.items())),
        "counts": {"total": len(items),
                   "technician": sum(1 for i in items if i["kind"] == "technician"),
                   "sales": sum(1 for i in items if i["kind"] == "sales"),
                   "removedTooSmall": len(skipped)},
        "items": items,
    }
    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf8")
    print(f"crew shots {payload['counts']}")
    if missing:
        print("missing indices:", missing)
    print("json ->", OUT_JSON)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
