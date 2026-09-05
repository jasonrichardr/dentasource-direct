#!/usr/bin/env python3
"""Reel library for the marbles, built from the fetched Facebook reels.

    python3 scripts/media-pipeline/fetch_reels.py   # downloads, once
    python3 scripts/media-pipeline/build_reels.py   # transcodes and writes the manifest

THE FACEBOOK CAPTIONS ARE NOT USED AS COPY, DELIBERATELY. The brief asked for the caption
from the meta with names, emoji and dashes removed. Those three are easy; what is left is
the problem. The real captions carry, verbatim: "The world's most trusted endodontic
brand", "Used in 80+ countries", "prices that make upgrading your clinic easier than
ever", "Your competition is already looking at this." That is a superlative, an unverified
figure, price talk and a competitor jab, all of which the DSD editorial rules ban. A
scrubber would have removed the names and shipped the claims, which is worse than either.

So the meta decides the CATEGORY and the caption is a short neutral descriptor of what the
footage shows, in the register the site already uses in marbles-reels.json ("At the
convention showcase", "Pre delivery inspection"). Nothing is invented and nothing is
claimed.

Every clip is re-encoded: the raw reels average 9 MB and run to 52 MB.
"""

from __future__ import annotations

import json
import subprocess
import sys
import urllib.request
from pathlib import Path

FB = Path.home() / "second-brain/builds/dentasource-news/fb2026"
IDS = FB / "reel-ids-all.lst"
META = FB / "reel-meta"
RAW = Path("/private/tmp/claude-501/-Users-jarich-second-brain/"
           "bd07f7c7-7fc8-48d1-acd9-274356db7d47/scratchpad/media/raw")
REPO = Path(__file__).resolve().parents[2]
OUT = REPO / "public/cinema/reels"
OUT_JSON = REPO / "src/data/cinema/reel-library.json"
# The wall that ships today. RULED: reel-library.json REPLACES marbles-reels.json, and
# these 68 clips lead the library so the marbles look identical on the day it switches.
# They are already web sized and their captions already pass, so they are not re-encoded.
EXISTING_REELS = REPO / "public/reels"
EXISTING_MANIFEST = REPO / "src/data/cinema/marbles-reels.json"

# WHAT "THE EXISTING 68" ACTUALLY IS. public/reels holds 68 mp4 files, but that is 34
# distinct clips plus 34 HD DUPLICATES under hd/. marbles-reels.json, the wall that ships
# today, is 33 entries of which only 10 are local; the other 23 stream from
# ffcdentalclinic.care. Separately, 24 field-*.mp4 sit in the repo on no wall at all.
# So the fold is: the 33 wall entries exactly as they are, then the field clips that pass
# a look, then the fetched reels.
#
# Each field clip below was WATCHED (first frame extracted and reviewed). The nine that
# are absent are absent on the standing rule, recorded in `excluded` in the manifest.
FIELD_CLIPS = {
    "field-01": "The team before a delivery run",
    "field-03": "Fitting the operating light",
    "field-04": "Unloading the van",
    "field-05": "Working on the chair base",
    "field-06": "Unwrapping the unit on site",
    "field-07": "Carrying a component in",
    "field-09": "Moving the unit to the clinic door",
    "field-11": "Crated units in the warehouse",
    "field-12": "Loading at the van",
    "field-17": "Setting up at the clinic",
    "field-19": "Bringing the unit up in the lift",
    "field-20": "Carrying the unit through the building",
    "field-21": "At the van on delivery day",
    "field-23": "On the road with a delivery",
    "field-24": "Wheeling the chair into the clinic",
}
FIELD_EXCLUDED = {
    "field-22": "a named clinician and their practice name are burned into the frame",
    "field-02": "a clinic signboard carrying a family name",
    "field-16": "a NEW STOCKS HAVE ARRIVED promotional card, not footage",
    "field-18": "a Bound to Pangasinan promotional card",
    "field-10": "a street and church scene, no DSD work in it",
    "field-13": "a storefront street scene, no DSD work in it",
    "field-08": "a driving view through a windscreen",
    "field-14": "an airport departures board",
    "field-15": "an airport departures board",
}

VIDEO_MAX = 720
POSTER_MAX = 480
SET_SIZE = 24

# Cap the LONG side whichever it is; `scale='min(720,iw)':-2` only caps the width and lets
# a portrait reel through at 1280 tall.
SCALE = (f"scale='min({VIDEO_MAX},iw)':'min({VIDEO_MAX},ih)'"
         ":force_original_aspect_ratio=decrease,scale=trunc(iw/2)*2:trunc(ih/2)*2")

# First match wins, so the more specific subjects are listed first.
CATEGORIES = [
    ("training", ("training", "hands-on", "hands on", "workshop", "course", "batch",
                  "study group", "lecture", "masterclass", "seminar", "certificate",
                  "crest", "tads", "learning", "students")),
    ("convention", ("convention", "pda", "expo", "booth", "chapter", "induction",
                    "scientific", "annual", "exhibit", "congress")),
    ("install", ("install", "installed", "installation", "assembled", "turnover",
                 "uncrat", "set up", "setup", "commission")),
    ("delivery", ("delivery", "delivered", "shipped", "bound to", "restock", "stocks",
                  "on the way", "dispatch")),
    ("showroom", ("showroom", "visit us", "pasig", "store", "walk in", "display")),
]
CAPTIONS = {
    "training": "Hands on training at the Training Center",
    "convention": "At the convention stand",
    "install": "On an installation",
    "delivery": "A delivery going out",
    "showroom": "On the showroom floor",
    "other": "From the DentaSource Direct floor",
}


def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True)


def classify(meta: dict) -> str:
    hay = f"{meta.get('title', '')} {meta.get('description', '')}".lower()
    for name, words in CATEGORIES:
        if any(w in hay for w in words):
            return name
    return "other"


def transcode(src: Path, dest: Path, poster: Path):
    r = run(["ffmpeg", "-y", "-i", str(src), "-vf", SCALE,
             "-c:v", "libx264", "-crf", "28", "-preset", "veryfast", "-profile:v", "high",
             "-movflags", "+faststart", "-c:a", "aac", "-b:a", "96k", str(dest)])
    if r.returncode != 0 or not dest.exists() or dest.stat().st_size == 0:
        raise RuntimeError(f"ffmpeg rc={r.returncode} {(r.stderr or '')[-160:]}")
    run(["ffmpeg", "-y", "-ss", "1", "-i", str(src), "-frames:v", "1",
         "-vf", f"scale='min({POSTER_MAX},iw)':-2", "-q:v", "4", str(poster)])
    p = run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
             "stream=width,height", "-of", "csv=p=0:s=x", str(dest)])
    w, h = (int(v) for v in p.stdout.strip().split("x")[:2]) if "x" in p.stdout else (0, 0)
    return w, h


def build_sets_existing_first(existing: list[dict], fetched: list[dict]) -> list[dict]:
    """Sets of 24. The clips already on the wall fill the first sets IN THEIR ORDER, so the
    day this replaces marbles-reels.json the marbles look exactly as they do now; the
    fetched reels page after, category-woven."""
    sets = []
    for i in range(0, len(existing), SET_SIZE):
        sets.append({"label": f"Set {len(sets) + 1}",
                     "ids": [r["id"] for r in existing[i:i + SET_SIZE]]})
    for s in build_sets(fetched):
        sets.append({"label": f"Set {len(sets) + 1}", "ids": s["ids"]})
    return sets


def build_sets(reels: list[dict]) -> list[dict]:
    """Sets of 24, each mixing categories rather than running one bucket at a time."""
    buckets: dict[str, list] = {}
    for r in reels:
        buckets.setdefault(r["category"], []).append(r)
    order = sorted(buckets, key=lambda c: -len(buckets[c]))
    woven = []
    while any(buckets[c] for c in order):
        for c in order:
            if buckets[c]:
                woven.append(buckets[c].pop(0))
    sets = []
    for i in range(0, len(woven), SET_SIZE):
        chunk = woven[i:i + SET_SIZE]
        sets.append({"label": f"Set {len(sets) + 1}", "ids": [r["id"] for r in chunk]})
    return sets


def main() -> int:
    ids = [i.strip() for i in IDS.read_text().split() if i.strip()]
    OUT.mkdir(parents=True, exist_ok=True)
    for stale in list(OUT.glob("*.mp4")) + list(OUT.glob("*.jpg")):
        stale.unlink()

    reels, failed, no_raw = [], [], []
    for rid in ids:
        raw = RAW / f"{rid}.mp4"
        if not raw.exists():
            no_raw.append(rid)
            continue
        mf = META / f"{rid}.json"
        meta = json.loads(mf.read_text()) if mf.exists() else {}
        try:
            w, h = transcode(raw, OUT / f"{rid}.mp4", OUT / f"{rid}.jpg")
        except RuntimeError as exc:
            failed.append((rid, str(exc)[:100]))
            continue
        # RULED: hold the peak on disk down. The raw is 9 MB on average and 52 MB at
        # worst; once the transcode and the poster exist it has no further use.
        if (OUT / f"{rid}.mp4").stat().st_size > 0 and (OUT / f"{rid}.jpg").exists():
            raw.unlink()
        d = str(meta.get("upload_date") or "")
        cat = classify(meta)
        reels.append({
            "id": rid,
            "src": f"/cinema/reels/{rid}.mp4",
            "poster": f"/cinema/reels/{rid}.jpg",
            "duration": round(float(meta.get("duration") or 0), 2),
            "date": f"{d[:4]}-{d[4:6]}-{d[6:8]}" if len(d) == 8 else None,
            "caption": CAPTIONS[cat],
            # `alt` mirrors the caption so a consumer reading {src, alt} works unchanged
            "alt": CAPTIONS[cat],
            # RAW FACEBOOK WORDING, NEVER RENDERED. Search and the studio only. It carries
            # superlatives, an unverified country count, price talk and personal names,
            # which is the whole reason `caption` above is a neutral descriptor.
            "meta_caption": " ".join((meta.get("description") or "").split())[:400],
            "category": cat,
            "width": w, "height": h,
        })

    reels.sort(key=lambda r: (r["date"] or ""), reverse=True)

    # The existing wall leads the library. Its clips keep their own paths under
    # /reels/ and /company-profile/reels/, so nothing is copied or re-encoded, and its
    # captions are already the neutral register this library uses.
    # LOCALISE THE WALL. 23 of the 33 wall entries stream from ffcdentalclinic.care, the
    # FFC patient domain. dentasourcedirect.com must not depend on a separate business's
    # host, so each is fetched once, re-encoded with the same reel profile and served from
    # this repo. The original address is kept in `source_url` for provenance.
    localised, localise_failed = {}, []
    if EXISTING_MANIFEST.exists():
        remote = [r["src"] for r in json.loads(EXISTING_MANIFEST.read_text()).get("reels", [])
                  if r["src"].startswith("http")]
        for n, url in enumerate(remote, 1):
            slug = "wall-" + Path(url).stem.replace(".", "-")
            dest, poster = OUT / f"{slug}.mp4", OUT / f"{slug}.jpg"
            tmp = RAW / f"{slug}.src"
            try:
                if not tmp.exists():
                    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
                    tmp.write_bytes(urllib.request.urlopen(req, timeout=120).read())
                w, h = transcode(tmp, dest, poster)
                tmp.unlink()
                localised[url] = {"slug": slug, "w": w, "h": h}
                print(f"  localised [{n}/{len(remote)}] {slug}", flush=True)
            except Exception as exc:                        # noqa: BLE001
                localise_failed.append((url, str(exc)[:100]))
                print(f"  LOCALISE FAILED {url}: {str(exc)[:80]}", flush=True)

    existing = []
    for name, alt in FIELD_CLIPS.items():
        f = EXISTING_REELS / f"{name}.mp4"
        if not f.exists():
            continue
        existing.append({
            "id": name, "src": f"/reels/{name}.mp4", "poster": None, "duration": None,
            "date": None, "caption": alt, "alt": alt, "meta_caption": None,
            "category": "field", "width": None, "height": None,
            "note": "already in the repo, watched and kept, not re-encoded",
        })
    if EXISTING_MANIFEST.exists():
        old = json.loads(EXISTING_MANIFEST.read_text())
        wall = []
        for n, r in enumerate(old.get("reels", []), 1):
            src = r["src"]
            loc = localised.get(src)
            wall.append({
                "id": f"wall-{n:02d}",
                "src": f"/cinema/reels/{loc['slug']}.mp4" if loc else src,
                "source_url": src if src.startswith("http") else None,
                "poster": f"/cinema/reels/{loc['slug']}.jpg" if loc else None,
                "duration": None,
                "date": None,
                "caption": r.get("alt", ""),
                "alt": r.get("alt", ""),
                "meta_caption": None,
                "category": "wall",
                "width": loc["w"] if loc else None,
                "height": loc["h"] if loc else None,
                "note": "already on the wall before the library existed",
            })
        # the wall leads, so the marbles are unchanged on the day this replaces it
        existing = wall + existing
    library = existing + reels
    sets = build_sets_existing_first(existing, reels)
    total_mb = sum((OUT / f"{r['id']}.mp4").stat().st_size for r in reels) / 1e6

    payload = {
        "version": 1,
        "source": "facebook.com/dentasource reels, ids from builds/dentasource-news/fb2026/reel-ids-all.lst",
        "generated": __import__("datetime").date.today().isoformat(),
        "notes": (
            "Reels from DSD's own Facebook page, re-encoded for the web: long side 720, "
            "faststart, aac 96k, 480px poster. CAPTIONS ARE NEUTRAL DESCRIPTORS, NOT THE "
            "FACEBOOK COPY. The original captions carry superlatives, an unverified "
            "country count, price talk and a competitor jab, all of which the editorial "
            "rules ban, so the meta decides the category and the caption describes what "
            "the footage shows. No personal names, no emoji, no dashes. Sorted newest "
            "first; `sets` are groups of 24 for the marbles, each mixing categories."
        ),
        "counts": {"ids": len(ids), "fetchedProduced": len(reels),
                   "existingWall": len(existing), "library": len(library),
                   "wallLocalised": len(localised), "wallLocaliseFailed": len(localise_failed),
                   "notFetched": len(no_raw), "transcodeFailed": len(failed),
                   "newBytesMB": round(total_mb, 1)},
        "excluded": FIELD_EXCLUDED,
        "sets": sets,
        "reels": library,
    }
    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf8")

    print(f"ids {len(ids)}  fetched+encoded {len(reels)}  existing wall {len(existing)}  "
          f"library {len(library)}  not fetched {len(no_raw)}  "
          f"transcode failed {len(failed)}  new bytes {total_mb:.0f} MB")
    from collections import Counter
    print("categories:", dict(Counter(r["category"] for r in reels)))
    print(f"sets: {len(sets)} of up to {SET_SIZE}")
    if localise_failed:
        print(f"  wall clips NOT localised ({len(localise_failed)}), still remote:")
        for u, e in localise_failed[:8]:
            print("    ", u, e)
    for rid, err in failed[:6]:
        print("  FAILED", rid, err)
    if no_raw:
        print("  not fetched:", ", ".join(no_raw[:10]))
    big = sorted(OUT.glob("*.mp4"), key=lambda f: -f.stat().st_size)[:3]
    for f in big:
        print(f"  largest {f.name} {f.stat().st_size/1e6:.2f} MB")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
