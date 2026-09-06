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
        return None, 0, set()
    src = json.loads(vps_path.read_text())
    src_by = {key(i): i for i in src.get("reels", src.get("items", []))}
    changed = 0
    targets = list(base.get("reels", base.get("items", [])))
    for lst in extra_lists:
        targets += base.get(lst, [])
    for item in targets:
        other = src_by.get(key(item))
        if not other:
            continue
        for f in fields:
            if f in other and other[f] not in (None, "") and item.get(f) != other[f]:
                item[f] = other[f]
                changed += 1
    before = set(json.loads(base_path.read_text()).keys())
    after = set(base.keys())
    return base, changed, before - after


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
        merged, changed, lost = merge(base_path, VPS / name, k, fields, extra)
        if merged is None:
            continue
        keys = [key for key in ("tilePx", "tileHeightPx", "stripUnsafe", "heldBack",
                                "excluded", "counts", "notes") if key in merged]
        print(f"  {name}: {changed} field updates")
        print(f"    generator keys still present: {', '.join(keys) or 'NONE'}")
        if lost:
            print(f"    ☠️ TOP LEVEL KEYS LOST: {sorted(lost)}")
            ok = False
        if APPLY:
            base_path.write_text(json.dumps(merged, indent=2) + "\n", encoding="utf8")
    print("\n" + ("no keys lost" if ok else "REFUSING, keys would be lost"))
    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
