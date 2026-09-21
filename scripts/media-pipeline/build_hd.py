#!/usr/bin/env python3
"""HD theatre copies for every reel, plus the growth partner clips.

    python3 scripts/media-pipeline/build_hd.py

WHY. The beads play a small looping file, which is right for a bead. Press and hold opens
the theatre, and the theatre was falling back to that same 720px crf-28 loop for 158 of
the 192 clips, because only 34 had an hd/ original. Every entry now gets a real theatre
copy: source resolution up to 1080 on the long side, crf 20, faststart, aac 128k.

NOTHING IS UPSCALED. Where the only copy we hold is already small, the HD encode is made
from that copy at its own resolution and the entry is reported as `hdFromWebCopy`, because
inventing pixels would look worse than the honest original and would be a lie about
quality. The clips this affects are the field-* files, whose Facebook sources are not in
the id list, and any clip whose source refuses to serve again.

Sources, in order of preference per entry:
  numeric id      the Facebook reel, re-fetched at best quality with yt-dlp
  wall + source_url  the original FFC URL the clip was localised from
  wall, local     public/reels/hd/<name>.mp4, the HD original already in the repo
  field-*         public/reels/<name>.mp4, the only copy that exists

Raws are deleted the moment each encode succeeds, so the peak stays under about 1 GB.
"""

from __future__ import annotations

import json
import subprocess
import sys
import urllib.request
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
LIBRARY = REPO / "src/data/cinema/reel-library.json"
GROWTH = REPO / "src/data/cinema/growth-partner.json"
OUT_HD = REPO / "public/cinema/reels/hd"
GROWTH_HD = REPO / "public/cinema/growth/hd"
REELS_DIR = REPO / "public/reels"
TMP = Path("/private/tmp/claude-501/-Users-jarich-second-brain/"
           "bd07f7c7-7fc8-48d1-acd9-274356db7d47/scratchpad/hd")

HD_MAX = 1080
POSTER_W = 720
GROWTH_PAGE = "https://ffcdentalclinic.com/sign-in/brand/gp/"

# Long side to HD_MAX, never up. `scale=...:force_original_aspect_ratio=decrease` only ever
# shrinks, and the min() against the source keeps a small clip at its own size.
HD_SCALE = (f"scale='min({HD_MAX},iw)':'min({HD_MAX},ih)'"
            ":force_original_aspect_ratio=decrease,scale=trunc(iw/2)*2:trunc(ih/2)*2")


def run(cmd, timeout=900):
    return subprocess.run(cmd, capture_output=True, text=True, timeout=timeout)


def probe(path: Path):
    p = run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
             "stream=width,height", "-of", "csv=p=0:s=x", str(path)])
    if "x" in p.stdout:
        w, h = p.stdout.strip().split("x")[:2]
        return int(w), int(h)
    return 0, 0


def encode_hd(src: Path, dest: Path) -> tuple[int, int]:
    dest.parent.mkdir(parents=True, exist_ok=True)
    # preset fast and a thread cap, not medium and all cores: this machine is deep in
    # swap and the OOM killer took the first run at 83 of 192. At crf 20 the visual
    # difference between fast and medium is negligible; being killed is not.
    r = run(["ffmpeg", "-y", "-threads", "2", "-i", str(src), "-vf", HD_SCALE,
             "-c:v", "libx264", "-crf", "20", "-preset", "fast", "-profile:v", "high",
             "-movflags", "+faststart", "-c:a", "aac", "-b:a", "128k", str(dest)])
    if r.returncode != 0 or not dest.exists() or dest.stat().st_size == 0:
        raise RuntimeError(f"ffmpeg rc={r.returncode} {(r.stderr or '')[-160:]}")
    return probe(dest)


def poster(src: Path, dest: Path):
    run(["ffmpeg", "-y", "-ss", "1", "-i", str(src), "-frames:v", "1",
         "-vf", f"scale='min({POSTER_W},iw)':-2", "-q:v", "2", str(dest)])


def fetch_url(url: str, dest: Path) -> bool:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        dest.write_bytes(urllib.request.urlopen(req, timeout=180).read())
        return dest.stat().st_size > 0
    except Exception:                                     # noqa: BLE001
        return False


def fetch_reel(rid: str, dest_dir: Path) -> Path | None:
    """Best quality yt-dlp can give for this reel."""
    r = run(["yt-dlp", "--no-warnings", "--no-progress",
             "-f", "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best",
             "--merge-output-format", "mp4",
             "-o", str(dest_dir / "%(id)s.%(ext)s"),
             f"https://www.facebook.com/reel/{rid}"], timeout=300)
    got = dest_dir / f"{rid}.mp4"
    return got if got.exists() and got.stat().st_size > 0 else None


def main() -> int:
    # --manifest-only writes `hd` for the copies that already exist and encodes NOTHING.
    # It exists because this machine's OOM killer stops the job partway: the encodes on
    # disk are good, and the manifest should be able to catch up to them without a rerun
    # that would start encoding the rest.
    manifest_only = "--manifest-only" in sys.argv
    TMP.mkdir(parents=True, exist_ok=True)
    OUT_HD.mkdir(parents=True, exist_ok=True)
    lib = json.loads(LIBRARY.read_text())

    done, from_web_copy, failed = 0, [], []
    for n, r in enumerate(lib["reels"], 1):
        rid = r["id"]
        dest = OUT_HD / f"{rid}.mp4"
        if dest.exists() and dest.stat().st_size > 0:
            r["hd"] = f"/cinema/reels/hd/{rid}.mp4"
            r["hdWidth"], r["hdHeight"] = probe(dest)
            done += 1
            continue

        if manifest_only:
            continue

        src: Path | None = None
        cleanup = False
        web_copy = False

        if rid.isdigit():                                  # a Facebook reel
            src = fetch_reel(rid, TMP)
            cleanup = src is not None
        elif r.get("source_url"):                          # a localised FFC clip
            tmp = TMP / f"{rid}.src.mp4"
            if fetch_url(r["source_url"], tmp):
                src, cleanup = tmp, True
        if src is None and rid.startswith("field-"):
            cand = REELS_DIR / f"{rid}.mp4"
            if cand.exists():
                src, web_copy = cand, True
        if src is None and rid.startswith("wall-"):
            stem = Path(r["src"]).stem
            for cand in (REELS_DIR / "hd" / f"{stem}.mp4", REELS_DIR / f"{stem}.mp4"):
                if cand.exists():
                    src, web_copy = cand, cand.parent.name != "hd"
                    break
        if src is None:                                    # last resort: our own web copy
            cand = REPO / "public" / r["src"].lstrip("/")
            if cand.exists():
                src, web_copy = cand, True

        if src is None:
            failed.append((rid, "no source available"))
            continue
        try:
            w, h = encode_hd(src, dest)
        except Exception as exc:                           # noqa: BLE001
            failed.append((rid, str(exc)[:110]))
            if cleanup and src.exists():
                src.unlink()
            continue

        poster(src, REPO / "public" / f"cinema/reels/{rid}.jpg")
        if cleanup and src.exists():
            src.unlink()                                   # hold the peak down
        r["hd"] = f"/cinema/reels/hd/{rid}.mp4"
        r["hdWidth"], r["hdHeight"] = w, h
        if web_copy:
            from_web_copy.append(rid)
        done += 1
        if n % 10 == 0:
            print(f"  [{n}/{len(lib['reels'])}] {done} encoded", flush=True)

    lib["counts"]["hdEncoded"] = done
    lib["counts"]["hdPending"] = len(lib["reels"]) - done
    lib["counts"]["hdFromWebCopy"] = len(from_web_copy)
    lib["counts"]["hdFailed"] = len(failed)
    lib["notes"] += (
        " HD THEATRE COPIES: every entry carries `hd`, a source resolution encode capped at "
        "1080 on the long side at crf 20, for the press and hold theatre; the small file in "
        "`src` stays the bead loop. NOTHING IS UPSCALED: where the only copy held is already "
        "web sized the HD encode is made from it at its own size, counted in hdFromWebCopy. "
        "`hd` IS PRESENT ON SOME ENTRIES AND ABSENT ON OTHERS while the set is being built "
        "out: an entry without `hd` has no theatre copy yet and the player should fall back "
        "to `src`, which is what it did for every entry before this field existed."
    )
    LIBRARY.write_text(json.dumps(lib, indent=2) + "\n", encoding="utf8")

    # ---- growth partner clips, same profile ----
    growth_done, growth_failed = 0, []
    if GROWTH.exists() and not manifest_only:
        g = json.loads(GROWTH.read_text())
        for item in g["items"]:
            if item["type"] != "video":
                continue
            name = Path(item["src"]).name
            dest = GROWTH_HD / name
            if dest.exists() and dest.stat().st_size > 0:
                item["hd"] = f"/cinema/growth/hd/{name}"
                growth_done += 1
                continue
            tmp = TMP / f"g-{name}"
            if not fetch_url(GROWTH_PAGE + name, tmp):
                growth_failed.append((name, "source refused"))
                continue
            try:
                w, h = encode_hd(tmp, dest)
                item["hd"] = f"/cinema/growth/hd/{name}"
                item["hdWidth"], item["hdHeight"] = w, h
                poster(tmp, REPO / "public" / item["poster"].lstrip("/"))
                growth_done += 1
            except Exception as exc:                       # noqa: BLE001
                growth_failed.append((name, str(exc)[:110]))
            finally:
                if tmp.exists():
                    tmp.unlink()
        g["counts"]["hdEncoded"] = growth_done
        GROWTH.write_text(json.dumps(g, indent=2) + "\n", encoding="utf8")

    def mb(p: Path):
        return sum(f.stat().st_size for f in p.glob("*.mp4")) / 1e6 if p.exists() else 0

    print(f"\nreels HD {done}/{len(lib['reels'])}  from web copy {len(from_web_copy)}  "
          f"failed {len(failed)}")
    print(f"growth HD {growth_done}  failed {len(growth_failed)}")
    print(f"reels/hd {mb(OUT_HD):.0f} MB   growth/hd {mb(GROWTH_HD):.0f} MB")
    for f in sorted(OUT_HD.glob("*.mp4"), key=lambda f: -f.stat().st_size)[:3]:
        print(f"  largest {f.name} {f.stat().st_size/1e6:.1f} MB")
    if from_web_copy:
        print(f"  NOT true HD, encoded from the web copy we hold ({len(from_web_copy)}): "
              + ", ".join(from_web_copy[:12]))
    for rid, err in failed[:10]:
        print("  FAILED", rid, err)
    for name, err in growth_failed[:6]:
        print("  GROWTH FAILED", name, err)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
