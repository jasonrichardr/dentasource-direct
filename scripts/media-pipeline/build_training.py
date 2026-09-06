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
# ☠️ TILE SIZE DECIDES, NOT MANIFEST TYPE. Ruled a117e320 after builder-home's
# counterexample: crew-shots' row is 126px, where a 360 wide photograph is fine, so a
# blanket "strip manifest" ban removed frames from the one place they still worked.
#
# THE TEST IS EXACT COVER: min(srcW/tileW, srcH/tileH) >= COVER_MIN. These tiles are
# object-fit: cover, which crops the excess, so the source has to satisfy BOTH axes and
# the binding one is whichever ratio is smaller. It is NOT the long side, which would
# compute 288*2 = 576 < 640 for installs and re-admit v301-2, undoing a correct removal.
# It is not the width either.
#
# ☠️ COVER_MIN IS 1.75, NOT 2.0, AND THAT IS A DELIBERATE RELAXATION. team-lead's call,
# 2026-09-06, and Jarich can push it back to 2.0. 2.0 is the ideal: two source pixels per
# css pixel on a DPR 2 screen. But Facebook and FFC natively serve 720 wide material, and
# on a 384 tile that is 1.875, a 6 percent shortfall nobody can see. A hard 2.0 banned
# most of the site's own footage over 48 pixels, which is a worse outcome than a marginal
# softness. 1.75 readmits the whole 720 wide pile and still fails the 360 wide frames at
# 0.94, which are the ones that genuinely look soft. The cliff moved; the test did not.
#
# THE SHORT SIDE SHORTHAND AGREED WITH THE EXACT FORM ON ALL 124 FILES WE HOLD, checked
# at 2.0. builder-room's studio (39093a8) compares short sides and must carry the SAME
# 1.75, or a file the studio bars is not the file the generator bars.
COVER_MIN = 1.75


def strip_unsafe(src_w: int, src_h: int, tile_w: int, tile_h: int) -> str | None:
    """Reason the file is too soft for this tile, or None if it is fine."""
    if not src_w or not src_h:
        return None
    ratio = min(src_w / tile_w, src_h / tile_h)
    if ratio >= COVER_MIN:
        return None
    return (f"{src_w}x{src_h} into a {tile_w}x{tile_h} css tile: covers it "
            f"{ratio:.2f} times, under the {COVER_MIN} floor")

TILE_W, TILE_H = 384, 288   # .dsd-mixed .dsd-strip-track img, MEASURED on a 1440x900 production build

# ☠️ A MIXED TRACK HAS TWO TILES, NOT ONE, AND THEY SHARE A HEIGHT.
# home-cinema.css gives `.dsd-mixed .dsd-strip-track video` AND `... img` the same
# height, clamp(150px, 32vh, 300px), at aspect-ratio 9/16, then overrides the IMAGE alone
# to 4/3. The stylesheet says it in words: "a still is landscape where a reel is portrait:
# it keeps the same HEIGHT". So at 1440x900 the height is 288 for both and the widths part:
#
#   image   288 * 4/3  = 384x288      video   288 * 9/16 = 162x288
#
# 384x288 is builder-home's measurement of the rendered element. The video tile is the
# SAME measured height down the other branch of the same rule, so it is measured too,
# not guessed. It is NOT `.dsd-reel`, which is dead CSS: that class appears nowhere in
# src/ outside the stylesheet and nothing renders it, so the ~190x338 it implies is not
# any tile on the page.
#
# One tile cannot judge both. A 404x720 clip covers the image tile 1.05 times and the
# video tile 2.49, and it is the video tile it actually lands in.
TILE_VIDEO_W, TILE_VIDEO_H = 162, 288   # .dsd-mixed .dsd-strip-track video, 9/16 at 288


def tile_for(kind: str) -> tuple[int, int]:
    """The box this kind of file actually renders in."""
    return (TILE_VIDEO_W, TILE_VIDEO_H) if kind == "video" else (TILE_W, TILE_H)


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


# THE INDEX IS REBUILT FROM THE REPO, NOT READ FROM A SCRATCH FILE. Like build_crew.py,
# this read its contact-sheet numbering out of the session scratchpad, so once the
# intermediates were deleted the generator could not run at all and PICKS was a list of
# frozen numbers pointing at nothing. The rule that built the sheet is stated here instead.
#
# The rule: the training article folders below, in the order they appear in news-fb-2026.js,
# each folder's jpgs sorted by name with share cards filtered out BEFORE numbering, numbered
# from 0 straight through.
#
# PROVEN, not assumed. Every one of the 36 picked indices resolves to exactly the file the
# committed manifest already carries, and indices 16 and 19, which the old hand-written
# exclusion list named as v039-2 and v039-5, land on v039-2 and v039-5. Two independent
# facts the reconstruction had to satisfy and does.
#
# Folders after tads-training-first-batch-dr-emil cannot be pinned: no pick indexes into
# them, so their presence or order is invisible to this check. They are left out rather
# than guessed, which is safe because nothing downstream of the last pick is numbered.
TRAIN_SLUGS = [
    "dentasource-training-center-opens-pasig",
    "pda-quezon-city-3rd-scientific-seminar-2026",
    "9-day-digital-dentistry-course-2026",
    "crest-hands-on-digital-designing-training",
    "cbct-training-crest-study-group-dr-loleng",
    "3d-printing-nesting-post-processing-training",
    "digital-shade-matching-stain-glazing-training",
    "impacted-teeth-armamentarium-training-dr-loleng",
    "smile-design-guided-crown-lengthening-training",
    "pda-benguet-chapter-induction-baguio-2026",
    "digital-smile-mockup-training-crest",
    "digital-cad-designing-training-crest",
    "tads-training-first-batch-dr-emil",
]
NEWS = REPO / "public/images/news"


def load_index() -> dict[int, Path]:
    idx, n = {}, 0
    for slug in TRAIN_SLUGS:
        folder = NEWS / slug
        if not folder.is_dir():
            raise SystemExit(f"training folder missing, index would shift: {slug}")
        for f in sorted(folder.glob("*.jpg")):
            if f.name.lower().startswith("og"):     # share cards never entered the sheet
                continue
            idx[n] = f
            n += 1
    return idx


def main() -> int:
    idx = load_index()
    images, missing, skipped = [], [], {}
    for i, alt in PICKS.items():
        src = idx.get(i)
        if not src or not src.exists():
            missing.append(i)
            continue
        if src.name.lower().startswith("og"):
            raise SystemExit(f"index {i} is a share card: {src.name}")

        with Image.open(src) as im:
            w, h = im.size
        why = strip_unsafe(w, h, TILE_W, TILE_H)
        if why:
            skipped[src.name] = why
            continue
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
                why = strip_unsafe(r.get("width") or 0, r.get("height") or 0,
                                   *tile_for("video"))
                if why:
                    skipped[Path(r["src"]).name] = why
                    videos.pop()
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
            + (" REMOVED AT THIS TILE SIZE: " + ", ".join(sorted(skipped)) + "."
               if skipped else "")
        ),
        "tilePx": TILE_W,
        "tileHeightPx": TILE_H,
        "tileVideoPx": TILE_VIDEO_W,
        "tileVideoHeightPx": TILE_VIDEO_H,
        "stripUnsafe": dict(sorted(skipped.items())),
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
