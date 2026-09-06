#!/usr/bin/env python3
"""Training media: photographs from the training articles, plus the training reels.

    python3 scripts/media-pipeline/build_training.py     (run build_reels.py first)

Images are picked from the 15 training articles by LOOKING at a labelled contact sheet,
not by filename. Videos are taken from reel-library.json by id, every reel the classifier
put in the `training` category, so there is one copy of each clip on disk and the library
stays the single source for reels.

Ordering is image, video, image, so the marquee alternates without the consumer doing
anything.

EXCLUDED, each decided by opening the frame:
  the "hands on live patients" article  patients under drapes mid procedure, faces and
                                        mouths visible. Not marketing material, and
                                        consent for a supplier's page cannot be assumed.
  the DIGITAL DENTISTRY course poster   a promo graphic carrying speaker headshots and
  and the Q&A card                      names; the brief says real photographs only.
  the certificate collages              certificates carry the recipients' names.
  individual portraits                  a portrait is a person, not the work.

ALT TEXT IS ROLE ONLY. Note that two article slugs carry a clinician's name, which
survives in the image PATH because those are the live URLs on the site and cannot be
changed here. No name is ever rendered.
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
LIBRARY = REPO / "src/data/cinema/reel-library.json"
OUT_JSON = REPO / "src/data/cinema/training-media.json"

# index on train.png -> alt
PICKS = {
    0: "The Training Center floor before a session",
    1: "A lesson on the main screen",
    2: "Working at a phantom head station",
    3: "A demonstration on the teaching model",
    5: "The operatory bay set up for teaching",
    6: "Stations ready for a hands on course",
    7: "The registration table before a course",
    11: "A session under way",
    12: "Following the lesson at a station",
    16: "Guiding a technique at the chair",
    17: "Attendees working through a case",
    18: "Working under the operating light",
    19: "Close work at the station",
    20: "Practising on the teaching model",
    22: "The room during a hands on session",
    23: "A station in use",
    24: "The teaching bay in use",
    26: "Presenting from a tablet",
    27: "Reviewing a case at the screen",
    29: "The class at their stations",
    30: "Working through a case together",
    31: "A course in progress",
    32: "Using the microscope at the bench",
    33: "The lesson on the big screen",
    34: "The room mid session",
    36: "Talking a step through at the chair",
    38: "A group around a station",
    40: "The class watching a demonstration",
    45: "The room during a lecture",
    47: "A lecture in the Training Center",
    50: "A demonstration at the chair",
    52: "Attendees at the workstations",
    55: "The seminar floor",
    65: "A hands on session under way",
    67: "A demonstration for the room",
    70: "Working at the bench",
    76: "Presenting to the class",
    78: "A session at the stand",
}


# ☠️ TOO SMALL FOR A STRIP TILE, AND NOT SWAPPABLE. These frames are 360x640, which is
# their source reel's native size: Facebook never published them larger, so there is
# nothing to re-fetch. They are ALSO published article photographs whose alt text names
# that exact scene ("The Crest instructor in loupes working a handpiece on a phantom
# head"), so overwriting the file with a bigger frame from another course would caption
# one event with a picture of another. The articles keep them, where 360 wide reads fine;
# the strips drop them.
REASON = (
    "360x640 source, too soft at strip tile size. NOT swapped for a larger frame: "
    "each is a published article photograph whose alt text describes that exact "
    "scene, so repointing the file would caption one event with a picture of "
    "another. The articles keep them, where 360 wide reads correctly."
)
STRIP_UNSAFE = {"v039-1.jpg", "v039-2.jpg", "v039-5.jpg", "v033-8.jpg", "v301-2.jpg"}


def load_index() -> dict[int, Path]:
    out = {}
    for line in (SC / "train.txt").read_text().splitlines():
        if not line.strip():
            continue
        i, p = line.split("\t", 1)
        out[int(i)] = REPO / p
    return out


def main() -> int:
    idx = load_index()
    images, missing, skipped = [], [], []
    for i, alt in PICKS.items():
        src = idx.get(i)
        if not src or not src.exists():
            missing.append(i)
            continue
        if src.name.lower().startswith("og"):
            raise SystemExit(f"index {i} is a share card: {src.name}")
        if src.name in STRIP_UNSAFE:
            print(f"  skipped {src.name}: too small for a strip tile, see STRIP_UNSAFE")
            skipped.append(src.name)
            continue
        with Image.open(src) as im:
            w, h = im.size
        images.append({"type": "image", "src": "/" + str(src.relative_to(REPO / "public")),
                       "alt": alt, "width": w, "height": h})

    videos = []
    if LIBRARY.exists():
        lib = json.loads(LIBRARY.read_text())
        for r in lib.get("reels", []):
            if r.get("category") == "training":
                videos.append({"type": "video", "src": r["src"], "poster": r.get("poster"),
                               "alt": r.get("caption") or r.get("alt"),
                               "width": r.get("width"), "height": r.get("height"),
                               "duration": r.get("duration"), "reel_id": r["id"]})
    else:
        print("reel-library.json not found: run build_reels.py first, shipping images only")

    # image, video, image. A PROPORTIONAL merge, not a fixed step: with 38 images and 30
    # videos an integer step floors to 1, which alternates neatly until the videos run out
    # and then dumps the last 8 images in a block at the end. Walking both lists by their
    # own ratio keeps the mix even the whole way through, wherever a reader starts.
    items = []
    if videos and images:
        ni, nv = len(images), len(videos)
        i = v = 0
        while i < ni or v < nv:
            # take from whichever list is further behind its own share of the run
            if v >= nv or (i < ni and (i + 0.5) / ni <= (v + 0.5) / nv):
                items.append(images[i]); i += 1
            else:
                items.append(videos[v]); v += 1
    else:
        items = images or videos

    payload = {
        "version": 1,
        "source": "public/images/news training articles, and reel-library.json for the footage",
        "generated": __import__("datetime").date.today().isoformat(),
        "notes": (
            "Photographs from the 15 training articles, picked by looking at a contact "
            "sheet, interleaved with every reel the library classified as training so the "
            "marquee alternates image, video, image. Videos reference the reel library by "
            "id; there is one copy of each clip on disk. ALT TEXT IS ROLE ONLY. Excluded: "
            "the live patient procedure frames, the course poster and Q and A card, which "
            "are promo graphics carrying speaker names, the certificate collages, and "
            "individual portraits."
            + (" REMOVED FROM THIS STRIP: " + ", ".join(sorted(skipped)) + ". " + REASON
               if skipped else "")
        ),
        "stripUnsafe": {n: REASON for n in sorted(skipped)},
        "counts": {"images": len(images), "videos": len(videos),
                   "total": len(items), "removedTooSmall": len(skipped)},
        "items": items,
    }
    OUT_JSON.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf8")
    print(f"training media: {payload['counts']}")
    if missing:
        print("missing indices:", missing)
    print("json ->", OUT_JSON)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
