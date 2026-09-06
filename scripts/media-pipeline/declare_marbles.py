#!/usr/bin/env python3
"""Declare the marbles tile on reel-library.json and hold what the glass cannot carry.

    python3 scripts/media-pipeline/declare_marbles.py            (dry run)
    python3 scripts/media-pipeline/declare_marbles.py --apply

☠️ RUN THIS ONLY AFTER merge_encode.py --apply. The rows carry the BEAD dimensions, and
until the encode's results are merged they are the OLD 404 wide beads from the long-side
cap. Judged against a ~480 tile those score 0.84 and the rule holds 159 of 192 clips,
five sixths of the wall, for a reason that evaporates the moment the real numbers land.
The guard below refuses to run rather than trusting whoever invokes it.

WHY MARBLES GET THEIR OWN FLOOR. A bead is not a flat tile. Each one samples a SQUARE from
the clip, which is why the tile is square and why tileVideoPx equals tilePx (it is all
video). The glass then refracts what it samples, and refraction forgives a softer source
than a flat strip does. Facebook's ceiling is 720 on the short side, so the 1.75 the strips
use would fail almost the whole library for a softness nobody can see through curved glass.
0.95 is where team-lead put it: below about 1.0 a bead visibly pixelates, and the target is
the true landscape reels rather than ordinary 480x854 portrait.

THE TILE IS ROUNDED DOWN to a multiple of ten on purpose. Measured at 482 the rule would
have held 25 clips that are 480 wide, a TWO PIXEL miss on the second most common shape in
the library. Rounding down means a measurement that is a few pixels optimistic cannot
quietly delete a whole class of clips.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
LIBRARY = REPO / "src/data/cinema/reel-library.json"

# ☠️ SET FROM builder-home's MEASUREMENT OF THE RENDERED BEAD, then rounded DOWN to a
# multiple of 10. It is deliberately None until that lands: this tile cannot be read off
# an element the way every other one can, because the beads are drawn in a WebGL canvas
# and `beadScale` is a three.js scene parameter in panels.jsx, not a CSS value. Deriving
# it from marbleCluster.js (fov 45, cameraZ 7.0, baseR 0.56*1.5) gives 0.2897 of the
# canvas height, which is 261 css px at a 900px canvas and 464 at 1600px, and that
# derivation ignores the refraction magnification it cannot compute. A guess here is worth
# nothing: between 260 and 500 this rule either does nothing or holds a quarter of the wall.
MARBLE_PX: int | None = None
COVER_MIN = 0.95


def judge(w: int, h: int, d: int) -> float:
    """Cover ratio for a square tile. The bead samples a square, so both axes bind."""
    return min(w / d, h / d)


def guard(reels: list[dict]) -> None:
    """Refuse to judge rows that are not post-encode. Loudly, per the ruling."""
    stale = [r["id"] for r in reels if not r.get("hd")]
    sizeless = [r["id"] for r in reels if not (r.get("width") and r.get("height"))]
    if stale or sizeless:
        raise SystemExit(
            "REFUSING TO JUDGE: reel-library is not post-encode.\n"
            f"  {len(stale)} rows carry no `hd`, so the encode has not reached them\n"
            f"  {len(sizeless)} rows carry no width/height\n"
            "  Run merge_encode.py --apply first. Judging the pre-encode 404 wide beads\n"
            "  against this tile holds five sixths of the library for no real reason."
        )


def main() -> int:
    if MARBLE_PX is None:
        raise SystemExit(
            "MARBLE_PX is not set. It needs builder-home's measured bead diameter,\n"
            "rounded DOWN to a multiple of 10. See the note above; do not guess it."
        )
    apply = "--apply" in sys.argv
    lib = json.loads(LIBRARY.read_text())
    every = list(lib["reels"]) + list(lib.get("heldBack", []))
    guard(every)

    keep, held = [], []
    for r in every:
        ratio = judge(r["width"], r["height"], MARBLE_PX)
        if ratio >= COVER_MIN:
            keep.append(r)
        else:
            r = dict(r)
            r["heldReason"] = (f"{r['width']}x{r['height']} into a {MARBLE_PX}px bead: "
                               f"covers it {ratio:.2f} times, under the {COVER_MIN} floor")
            held.append(r)

    lib["tileFit"] = "cover"
    lib["tilePx"] = lib["tileHeightPx"] = MARBLE_PX
    lib["tileVideoPx"] = lib["tileVideoHeightPx"] = MARBLE_PX   # all video
    lib["coverMin"] = COVER_MIN
    lib["reels"] = keep
    lib["heldBack"] = held

    print(f"marbles tile {MARBLE_PX}x{MARBLE_PX}, floor {COVER_MIN}")
    print(f"  {len(keep)} clips on the wall, {len(held)} held")
    for r in held[:8]:
        print("   ", r["id"], r["heldReason"])
    # the ruling's acceptance criteria, checked rather than assumed
    shapes = {(r["width"], r["height"]) for r in every}
    if (480, 854) in shapes:
        print(f"  ACCEPTANCE 480x854 passes: {judge(480, 854, MARBLE_PX) >= COVER_MIN}")
    if (720, 406) in shapes:
        print(f"  ACCEPTANCE 720x406 held:   {judge(720, 406, MARBLE_PX) < COVER_MIN}")
    if apply:
        LIBRARY.write_text(json.dumps(lib, indent=2) + "\n", encoding="utf8")
        print("  written")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
