#!/usr/bin/env python3
"""Fetch every Facebook reel in reel-ids-all.lst with yt-dlp, one at a time.

    python3 scripts/media-pipeline/fetch_reels.py

Downloads only. Transcoding and the manifest are build_reels.py, so a failed or
interrupted fetch never costs the work already done: raw files are cached in the session
scratchpad and an id already present is skipped.

ONE AT A TIME, WITH A PAUSE. This is someone else's public page being read 144 times;
serialising with a short sleep is the polite way to do it and also the way least likely
to get the page rate limited halfway through.
"""

from __future__ import annotations

import subprocess
import sys
import time
from pathlib import Path

IDS = Path.home() / "second-brain/builds/dentasource-news/fb2026/reel-ids-all.lst"
RAW = Path("/private/tmp/claude-501/-Users-jarich-second-brain/"
           "bd07f7c7-7fc8-48d1-acd9-274356db7d47/scratchpad/media/raw")
FAILED = RAW.parent / "failed.txt"
SLEEP_SECONDS = 2


def main() -> int:
    ids = [line.strip() for line in IDS.read_text().split() if line.strip()]
    RAW.mkdir(parents=True, exist_ok=True)
    have = {p.stem for p in RAW.glob("*.mp4")}
    todo = [i for i in ids if i not in have]
    print(f"{len(ids)} ids, {len(have)} already fetched, {len(todo)} to go", flush=True)

    failed = []
    for n, rid in enumerate(todo, 1):
        cmd = ["yt-dlp", "--no-warnings", "--no-progress", "-f", "mp4/best",
               "-o", str(RAW / "%(id)s.%(ext)s"),
               f"https://www.facebook.com/reel/{rid}"]
        try:
            r = subprocess.run(cmd, capture_output=True, text=True, timeout=180)
            ok = (RAW / f"{rid}.mp4").exists()
            if not ok:
                failed.append((rid, (r.stderr or r.stdout or "no output").strip()[:120]))
                print(f"  [{n}/{len(todo)}] FAIL {rid}", flush=True)
            else:
                mb = (RAW / f"{rid}.mp4").stat().st_size / 1e6
                print(f"  [{n}/{len(todo)}] ok   {rid}  {mb:.1f} MB", flush=True)
        except subprocess.TimeoutExpired:
            failed.append((rid, "timeout after 180s"))
            print(f"  [{n}/{len(todo)}] TIMEOUT {rid}", flush=True)
        time.sleep(SLEEP_SECONDS)

    FAILED.write_text("\n".join(f"{i}\t{e}" for i, e in failed))
    total_mb = sum(p.stat().st_size for p in RAW.glob("*.mp4")) / 1e6
    print(f"\nfetched {len(list(RAW.glob('*.mp4')))} of {len(ids)}   "
          f"failed {len(failed)}   raw {total_mb:.0f} MB")
    if failed:
        print("failures written to", FAILED)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
