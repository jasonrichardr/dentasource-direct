#!/usr/bin/env python3
"""Apply the VPS encode's results to the repo manifests, by FIELD, never by file.

    python3 merge_encode.py [--apply]      (default is a dry run)

☠️ NEVER COPY THE VPS MANIFEST OVER THE REPO ONE. The VPS copies were taken before the
generators started emitting `tilePx`, `stripUnsafe` and `heldBack`, so a whole-file
overwrite silently deletes them, and the loss looks exactly like a generator that stopped
working. This reads the repo manifest as the base and writes ONLY the fields the encode
produces. Any key it does not own survives because it is never touched.

Fields owned by the encode, and nothing else:
  reel-library   hd, hdWidth, hdHeight, width, height, sourceWidth, sourceHeight
  growth         hd, hdWidth, hdHeight

Growth items are matched on `src` and the search covers `heldBack` too, because the 8
clips are held at the current tile and still get a theatre copy.
"""
from __future__ import annotations
import json, sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
VPS = Path(sys.argv[sys.argv.index("--from") + 1]) if "--from" in sys.argv else Path(
    "/private/tmp/claude-501/-Users-jarich-second-brain/"
    "bd07f7c7-7fc8-48d1-acd9-274356db7d47/scratchpad/vps")
APPLY = "--apply" in sys.argv

REEL_FIELDS = ("hd", "hdWidth", "hdHeight", "width", "height",
               "sourceWidth", "sourceHeight")
GROWTH_FIELDS = ("hd", "hdWidth", "hdHeight")


def merge(base_path: Path, vps_path: Path, key, fields, extra_lists=()):
    base = json.loads(base_path.read_text())
    if not vps_path.exists():
        print(f"  {vps_path.name}: not fetched, skipped")
        return None, 0, set(), set(), [], []
    src = json.loads(vps_path.read_text())
    src_by = {key(i): i for i in src.get("reels", src.get("items", []))}
    changed = 0
    matched: set = set()
    targets = list(base.get("reels", base.get("items", [])))
    for lst in extra_lists:
        targets += base.get(lst, [])
    for item in targets:
        other = src_by.get(key(item))
        if not other:
            continue
        matched.add(key(item))
        for f in fields:
            if f in other and other[f] not in (None, "") and item.get(f) != other[f]:
                item[f] = other[f]
                changed += 1
    # ☠️ WHAT DOES THIS ASSERT BY OMISSION? builder-room's audit question, turned on this
    # script. It reported "N field updates" and "no keys lost", and a reader takes that as
    # "everything came home". It never said how many rows it FAILED to match, so a merge
    # that silently skipped half the library printed the same clean line as a complete one.
    # A count of what was done is not evidence about what was not done.
    unmatched_src = sorted(set(src_by) - matched)
    unmatched_base = sorted({key(i) for i in targets} - matched)
    before = set(json.loads(base_path.read_text()).keys())
    after = set(base.keys())
    return base, changed, before - after, matched, unmatched_src, unmatched_base


def growth_beads(base_path: Path, beads_path: Path) -> int:
    """Carry the re-encoded growth BEAD dimensions home, by field like everything else.

    ☠️ WITHOUT THIS STEP THE BEAD PASS IS INVISIBLE AND SILENTLY UNDONE. growth_beads.py
    writes the new files into the media root but does not touch the manifest, and
    build_growth's refresh reads video sizes FROM the manifest, because those files are on
    the origin and cannot be measured locally. So a re-judge straight after the pass would
    compare the new files against their OLD 404x720 rows and hold them again, exactly as
    if nothing had been encoded. The work would be done, paid for, and thrown away by the
    next generator run.

    vps_encode owns `hd` for growth; this owns `width` and `height`, which nothing owned
    before because growth's beads had never been re-encoded.
    """
    if not beads_path.exists():
        print("  growth-beads.json: not fetched, growth bead sizes NOT updated")
        return 0
    base = json.loads(base_path.read_text())
    by_name = {r["clip"]: r for r in json.loads(beads_path.read_text()) if r.get("encoded")}
    changed, seen = 0, set()
    for item in list(base.get("items", [])) + list(base.get("heldBack", [])):
        r = by_name.get(Path(item.get("src", "")).name)
        if not r:
            continue
        w, h = (int(v) for v in r["encoded"].split("x"))
        seen.add(r["clip"])
        if (item.get("width"), item.get("height")) != (w, h):
            item["width"], item["height"] = w, h
            changed += 1
    stranded = sorted(set(by_name) - seen)
    print(f"  growth beads: {changed} rows resized, {len(seen)} of {len(by_name)} matched")
    if stranded:
        print(f"    \u2620 {len(stranded)} RE-ENCODED CLIPS HAVE NO ROW HERE: "
              f"{', '.join(stranded)}")
    if APPLY:
        base_path.write_text(json.dumps(base, indent=2) + "\n", encoding="utf8")
    return changed


def wall_beads(base_path: Path, beads_path: Path) -> int:
    """Carry the re-encoded landscape WALL bead dimensions home, by field.

    Same reason as growth_beads(): wall_beads.py writes files and not manifests, and
    nothing else measures a file that lives on the origin. Without this the 15 clips stay
    held at their old 720x406 rows and the re-encode is thrown away.
    """
    if not beads_path.exists():
        print("  wall-beads.json: not fetched, wall bead sizes NOT updated")
        return 0
    base = json.loads(base_path.read_text())
    by_id = {r["id"]: r for r in json.loads(beads_path.read_text()) if r.get("bead")}
    changed, seen = 0, set()
    for item in list(base.get("reels", [])) + list(base.get("heldBack", [])):
        r = by_id.get(item.get("id"))
        if not r:
            continue
        w, h = (int(v) for v in r["bead"].split("x"))
        seen.add(r["id"])
        if (item.get("width"), item.get("height")) != (w, h):
            item["width"], item["height"] = w, h
            changed += 1
    stranded = sorted(set(by_id) - seen)
    print(f"  wall beads: {changed} rows resized, {len(seen)} of {len(by_id)} matched")
    if stranded:
        print(f"    \u2620 {len(stranded)} RE-ENCODED CLIPS HAVE NO ROW HERE: "
              f"{', '.join(stranded)}")
    if APPLY:
        base_path.write_text(json.dumps(base, indent=2) + "\n", encoding="utf8")
    return changed


def main() -> int:
    print(f"{'APPLYING' if APPLY else 'DRY RUN'}, reading encode results from {VPS}\n")
    ok = True
    for name, k, fields, extra in (
        # ☠️ heldBack FOR REELS TOO, EVEN THOUGH IT IS EMPTY TODAY. declare_marbles moves a
        # clip that cannot carry the bead into heldBack, and a later encode still produces
        # new dimensions for it. Searching only `reels` would leave those rows frozen at
        # whatever they held the day they were set aside, so a clip could never measure its
        # way back onto the wall. Growth already had this; reels did not, purely because
        # nothing had moved yet.
        ("reel-library.json", lambda i: i.get("id"), REEL_FIELDS, ("heldBack",)),
        ("growth-partner.json", lambda i: i.get("src"), GROWTH_FIELDS, ("heldBack",)),
    ):
        base_path = REPO / "src/data/cinema" / name
        merged, changed, lost, matched, un_src, un_base = merge(
            base_path, VPS / name, k, fields, extra)
        if merged is None:
            continue
        keys = [key for key in ("tilePx", "tileHeightPx", "stripUnsafe", "heldBack",
                                "excluded", "counts", "notes") if key in merged]
        print(f"  {name}: {changed} field updates across {len(matched)} matched rows")
        if un_src:
            ok = False
            print(f"    \u2620 {len(un_src)} ROWS ON THE BOX HAVE NO COUNTERPART HERE, so "
                  f"their encode is stranded: {', '.join(map(str, un_src[:6]))}")
        if un_base:
            print(f"    {len(un_base)} rows here were not touched by the encode "
                  f"(expected while it is still running): "
                  f"{', '.join(map(str, un_base[:4]))}")
        print(f"    generator keys still present: {', '.join(keys) or 'NONE'}")
        if lost:
            print(f"    ☠️ TOP LEVEL KEYS LOST: {sorted(lost)}")
            ok = False
        if APPLY:
            base_path.write_text(json.dumps(merged, indent=2) + "\n", encoding="utf8")
    growth_beads(REPO / "src/data/cinema/growth-partner.json", VPS / "growth-beads.json")
    wall_beads(REPO / "src/data/cinema/reel-library.json", VPS / "wall-beads.json")
    print("\n" + ("no keys lost" if ok else "REFUSING, keys would be lost"))
    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
