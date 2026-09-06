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
MARBLE_PX: int | None = 480
COVER_MIN = 0.95

# ☠️ RECORD HOW THE NUMBER WAS OBTAINED, BECAUSE NOBODY CAN RE-MEASURE IT.
# builder-room's point and it is the right one: every other tile on this arc can be
# checked by opening devtools and reading a box. A bead cannot. It is a sample of a
# texture inside a three.js scene, so there is no element to inspect and no way for the
# next person to confirm or refute this number without redoing the whole derivation.
# The provenance therefore ships IN the manifest rather than living in a commit message.
# Fill both fields when MARBLE_PX is set; the script refuses without them.
MARBLE_PX_METHOD: str | None = (
    "builder-home projected the LIVE three.js scene in a proof build: camera.position.z, "
    "camera.fov and canvas.clientHeight read off the running page, and each bead's radius "
    "off its cannon body after the shoal settled. Viewport and canvas 1440x900, z=7, "
    "fov=45. Hero bead (index 0) world radius 1.554 -> 482.4 css px diameter; smallest "
    "bead 161.7. Phone 390x844 at z=13 gives a 217.5 hero. Reproduced independently from "
    "source: baseR = 0.56 * beadScale(1.5) = 0.840, hero = baseR * 1.85 "
    "(marbleCluster.js:285), diameter 3.108 against a visible height of "
    "2*7*tan(22.5) = 5.799, which is 0.536 of a 900px canvas = 482.4. Derivation and "
    "measurement agree to a tenth of a pixel. NOTE the video disc inside the bead is only "
    "54% of it unmagnified (260.0 px) and the glass refracts that across the whole sphere, "
    "so 482 is the right quantity and 260 is a different one that happens to look "
    "plausible. A brightness scan of a frame CANNOT confirm this: the beads overlap. "
    "WHY THE DESKTOP NUMBER GOVERNS AND THE PHONE'S 217.5 IS ONLY ON RECORD: the wall "
    "serves the SAME clips to both viewports. REEL_SETS is built once at module scope "
    "from the library and sliced into fixed sets, and MarblesPanel picks by setIndex, "
    "never by device, so there is no phone set to judge separately. The strictest tile "
    "therefore has to govern, or a clip that is fine on a phone and soft on a desktop "
    "ships soft. That is what makes 480 correct rather than merely conservative, and it "
    "means every bar here is a DESKTOP bar: on the phone tile every shape in the library "
    "clears 0.95, 480x854 at 2.21 and 720x406 at 1.87, so nothing is ever held there. "
    "WHY THIS TILE ALONE SPREADS 2.22x ACROSS VIEWPORTS while every other tile on the arc "
    "varies about 1.10x: the phone was moved to cameraZ 13.0 two rounds ago to fit a "
    "portrait stage, a framing decision about the shoal's geometry that had nothing to do "
    "with resolution. The strictness is a side effect of that, not a deliberate choice, "
    "and a reader who does not know it will assume otherwise. THE COUPLING RUNS BOTH "
    "WAYS: cameraZ and beadScale in panels.jsx SET this tile, and this tile decides which "
    "clips may appear at all. Raise cameraZ and the beads shrink, the gate loosens, and "
    "clips judged too soft become admissible; lower it and clips already on the wall "
    "become barred. builder-home documented that at the call site in ec58d50; if this "
    "tile ever stops matching the wall, that comment is where the cause will be."
)
MARBLE_PX_RAW: float | None = 482.4      # the measurement BEFORE rounding down


def judge(w: int, h: int, tw: float, th: float | None = None) -> float:
    """Cover ratio. Two axes on purpose, even though the bead is square.

    ☠️ TAKES BOTH AXES SO THE GUARD BELOW SURVIVES BEING COPIED. builder-room's caution:
    on a rectangular tile whose axes round independently, a flip is per-axis and a test
    written on the file's SHORT SIDE cannot see it. Their example, a mixed image tile
    measured 384.4x288.3 and declared 380x280 at the 1.75 floor: a 700x500 file goes from
    1.734 held to 1.786 passing, driven entirely by the HEIGHT axis, and its short side of
    500 sits nowhere near the short-side band of [665.0, 672.70). Reproduced before
    accepting it.

    For a square tile the ratio form and the short-side band are the same statement, so
    marbles needs neither the generality nor loses anything by having it. The next list to
    copy this guard will be one of the mixed ones, and those are rectangles.
    """
    return min(w / tw, h / (th if th is not None else tw))


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
    if not MARBLE_PX_METHOD or MARBLE_PX_RAW is None:
        raise SystemExit(
            "MARBLE_PX_METHOD and MARBLE_PX_RAW are required alongside MARBLE_PX.\n"
            "This tile cannot be re-measured from the page, so a number without its\n"
            "provenance is a number nobody after you can check or correct."
        )
    if MARBLE_PX % 10 or MARBLE_PX > MARBLE_PX_RAW:
        raise SystemExit(
            f"MARBLE_PX {MARBLE_PX} must be MARBLE_PX_RAW {MARBLE_PX_RAW} rounded DOWN "
            "to a multiple of 10.")
    apply = "--apply" in sys.argv
    lib = json.loads(LIBRARY.read_text())
    every = list(lib["reels"]) + list(lib.get("heldBack", []))
    guard(every)

    # ☠️ THE ROUNDING IS A SAFETY GUARD AND MUST NOT ITSELF DECIDE ANYTHING.
    # builder-room found that rounding down is not order-preserving across a ten boundary:
    # a raw of 428 declares 420, and at 420 the 720x406 landscape clips score 0.967 and
    # pass, when the measurement itself would have held them at 0.949. The guard against a
    # two pixel miss silently turns the gate into documentation.
    #
    # The fix is NOT to re-assert the acceptance criteria, which team-lead dropped as
    # illustrations: the measurement decides, and if it decides nothing is held then
    # nothing is held. The fix is that the ROUNDING must not change what the measurement
    # decided. Rounding down can only raise a ratio, so it can only ADMIT what the raw
    # would have held, and a verdict flips exactly for a short side in
    # [COVER_MIN * declared, COVER_MIN * raw). For 482.4 -> 480 that band is
    # [456.0, 458.28) and the library holds nothing in it. For 428 -> 420 it is
    # [399.0, 406.6), which is where those landscape clips live.
    # per-axis, not per-short-side: min(w/twRaw, h/thRaw) < floor <= min(w/twDec, h/thDec)
    flipped = [r for r in every
               if judge(r["width"], r["height"], MARBLE_PX, MARBLE_PX) >= COVER_MIN
               > judge(r["width"], r["height"], MARBLE_PX_RAW, MARBLE_PX_RAW)]
    if flipped:
        raise SystemExit(
            f"REFUSING: rounding {MARBLE_PX_RAW} down to {MARBLE_PX} changes the verdict "
            f"on {len(flipped)} clips, which the rounding is not allowed to do.\n"
            f"  flip band is short side in "
            f"[{COVER_MIN * MARBLE_PX:.1f}, {COVER_MIN * MARBLE_PX_RAW:.2f})\n"
            f"  affected: {', '.join(r['id'] for r in flipped[:6])}\n"
            "  Declare the raw measurement, or take the rounding to team-lead as a ruling."
        )

    keep, held = [], []
    for r in every:
        ratio = judge(r["width"], r["height"], MARBLE_PX, MARBLE_PX)
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
    lib["tileSource"] = (
        f"{MARBLE_PX_METHOD}; measured {MARBLE_PX_RAW}px, declared {MARBLE_PX}px "
        "(rounded down to a multiple of 10 so a few optimistic pixels cannot delete a "
        "whole shape). THIS TILE HAS NO ELEMENT: the beads are a texture sampled inside a "
        "three.js scene, so it cannot be re-measured in devtools the way every other tile "
        "can. To revise it, redo the derivation from marbleCluster.js or re-measure on a "
        "rendered canvas, and state which."
    )
    lib["reels"] = keep
    lib["heldBack"] = held

    print(f"marbles tile {MARBLE_PX}x{MARBLE_PX}, floor {COVER_MIN}")
    print(f"  {len(keep)} clips on the wall, {len(held)} held")
    for r in held[:8]:
        print("   ", r["id"], r["heldReason"])
    # the ruling's acceptance criteria, checked rather than assumed
    shapes = {(r["width"], r["height"]) for r in every}
    if (480, 854) in shapes:
        print(f"  ACCEPTANCE 480x854 passes: {judge(480, 854, MARBLE_PX, MARBLE_PX) >= COVER_MIN}")
    if (720, 406) in shapes:
        print(f"  ACCEPTANCE 720x406 held:   {judge(720, 406, MARBLE_PX, MARBLE_PX) < COVER_MIN}")
    if apply:
        LIBRARY.write_text(json.dumps(lib, indent=2) + "\n", encoding="utf8")
        print("  written")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
