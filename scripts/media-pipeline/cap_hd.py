#!/usr/bin/env python3
"""Hold every HD theatre copy under the git file ceiling.

    python3 scripts/media-pipeline/cap_hd.py     (after build_hd.py)

GitHub refuses a file over 100 MB outright, so the cap here is 95 MB with room to spare.
A handful of the source reels run past two minutes and one raw was 133 MB, which at crf 20
and 1080 can land over the line.

Rather than dropping quality across the whole set for the sake of a few long clips, this
re-encodes ONLY the files that breach, stepping the quality down until each fits: crf 23,
then 26, then 900 px on the long side. Everything else is untouched, so a 6 MB clip stays
exactly as encoded.

Also re-runnable and idempotent: a file already under the cap is skipped.
"""

from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
LIBRARY = REPO / "src/data/cinema/reel-library.json"
DIRS = [REPO / "public/cinema/reels/hd", REPO / "public/cinema/growth/hd"]
CAP = 95 * 1024 * 1024

# each step is tried in order until the file fits
LADDER = [("23", 1080), ("26", 1080), ("26", 900), ("28", 720)]


def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True, timeout=1800)


def scale(px: int) -> str:
    return (f"scale='min({px},iw)':'min({px},ih)'"
            ":force_original_aspect_ratio=decrease,scale=trunc(iw/2)*2:trunc(ih/2)*2")


def probe(path: Path):
    p = run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
             "stream=width,height", "-of", "csv=p=0:s=x", str(path)])
    if "x" in p.stdout:
        w, h = p.stdout.strip().split("x")[:2]
        return int(w), int(h)
    return 0, 0


def main() -> int:
    fixed, failed = [], []
    for d in DIRS:
        if not d.exists():
            continue
        for f in sorted(d.glob("*.mp4")):
            if f.stat().st_size <= CAP:
                continue
            before = f.stat().st_size
            tmp = f.with_suffix(".capped.mp4")
            ok = False
            for crf, px in LADDER:
                r = run(["ffmpeg", "-y", "-i", str(f), "-vf", scale(px),
                         "-c:v", "libx264", "-crf", crf, "-preset", "medium",
                         "-profile:v", "high", "-movflags", "+faststart",
                         "-c:a", "aac", "-b:a", "128k", str(tmp)])
                if r.returncode == 0 and tmp.exists() and 0 < tmp.stat().st_size <= CAP:
                    tmp.replace(f)
                    fixed.append((f.name, before / 1e6, f.stat().st_size / 1e6, crf, px))
                    ok = True
                    break
                if tmp.exists():
                    tmp.unlink()
            if not ok:
                failed.append((f.name, before / 1e6))

    if fixed and LIBRARY.exists():
        lib = json.loads(LIBRARY.read_text())
        by_name = {n: (w, h) for n, *_ in [(x[0],) for x in fixed]
                   for w, h in [probe(REPO / "public/cinema/reels/hd" / n)]}
        for r in lib.get("reels", []):
            name = Path(r.get("hd", "")).name
            if name in by_name:
                r["hdWidth"], r["hdHeight"] = by_name[name]
        LIBRARY.write_text(json.dumps(lib, indent=2) + "\n", encoding="utf8")

    biggest = 0
    for d in DIRS:
        if d.exists():
            for f in d.glob("*.mp4"):
                biggest = max(biggest, f.stat().st_size)
    print(f"re-encoded over the 95 MB cap: {len(fixed)}")
    for n, b, a, crf, px in fixed:
        print(f"  {n}  {b:.1f} -> {a:.1f} MB  (crf {crf}, {px}px)")
    if failed:
        print(f"STILL OVER THE CAP ({len(failed)}), these would be refused by git:")
        for n, b in failed:
            print(f"  {n} {b:.1f} MB")
        return 1
    print(f"largest HD file now {biggest/1e6:.1f} MB, cap is 95 MB")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
