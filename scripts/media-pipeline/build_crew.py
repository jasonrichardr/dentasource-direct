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
SC = Path("/private/tmp/claude-501/-Users-jarich-second-brain/"
          "bd07f7c7-7fc8-48d1-acd9-274356db7d47/scratchpad/media/crew")
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


def load_index(name: str) -> dict[int, Path]:
    out = {}
    for line in (SC / name).read_text().splitlines():
        if not line.strip():
            continue
        idx, path = line.split("\t", 1)
        out[int(idx)] = REPO / path
    return out


def main() -> int:
    idx = load_index("t2.txt") | load_index("o2.txt")
    items, missing = [], []

    def add(i: int, alt: str, kind: str):
        src = idx.get(i)
        if not src or not src.exists():
            missing.append(i)
            return
        if is_share_card(src):
            raise SystemExit(f"index {i} is a share card, not a photograph: {src.name}")
        with Image.open(src) as im:
            w, h = im.size
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
        ),
        "counts": {"total": len(items),
                   "technician": sum(1 for i in items if i["kind"] == "technician"),
                   "sales": sum(1 for i in items if i["kind"] == "sales"),
                   "missing": len(missing)},
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
