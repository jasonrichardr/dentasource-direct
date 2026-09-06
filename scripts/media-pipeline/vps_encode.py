#!/usr/bin/env python3
"""Encode every reel's theatre copy and bead loop, ON THE VPS, writing into the media root.

    # on the box, detached and resumable:
    nohup python3 /srv/media/work/vps_encode.py > /srv/media/work/encode.log 2>&1 &

WHY IT RUNS HERE. The Mac has ~1 GB of swap left and its OOM killer stopped this work three
times. The box has 4 vCPU and 13 GB free, does not swap, and Facebook serves it happily
(yt-dlp on the box even merges bestvideo+bestaudio, which the Mac's single-format fetch was
not getting). Output is written straight into /srv/media/dsd, so there is no rsync after.

WHAT IT MAKES, per reel:
  theatre  <hd path>    long side up to 1920, crf 20, audio kept
  bead     <src path>   720 WIDE, crf 24, MUTED, same duration and start
  poster   <poster>     720 wide, q2

NEVER UPSCALED. Both scales are min() against the source, so a clip smaller than the target
is encoded at its own size rather than blown up. Anything that ends up smaller than asked
for is listed in the state file as `from_small_source`, because claiming 1920 for a file
whose source is 720 would be a lie about quality.

RESUMABLE. Every finished id is appended to state.json; a re-run skips it. Raws are deleted
the moment both encodes exist, so the working directory never holds more than one.
"""

from __future__ import annotations

import json
import os
import shutil
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path("/srv/media/dsd")
WORK = Path("/srv/media/work")
LIB = WORK / "reel-library.json"
GROWTH = WORK / "growth-partner.json"
STATE = WORK / "state.json"

THEATRE_MAX = 1920
BEAD_W = 720
POSTER_W = 720
NICE = ["nice", "-n", "15", "ionice", "-c3"]


def sh(cmd, timeout=1800):
    return subprocess.run(cmd, capture_output=True, text=True, timeout=timeout)


def load_state() -> dict:
    if STATE.exists():
        return json.loads(STATE.read_text())
    return {"done": [], "failed": {}, "from_small_source": [], "started": time.time()}


def save_state(st: dict):
    STATE.write_text(json.dumps(st, indent=1))


def write_manifest(path: Path, doc: dict):
    """Write the manifest without ever dropping a key this script does not own.

    ☠️ THE VPS COPIES ARE STALE BY CONSTRUCTION. They were taken before the generators
    started emitting `tilePx`, `tileHeightPx`, `stripUnsafe` and `heldBack`, so writing
    this process's in-memory document straight out would delete those keys, and the loss
    would look exactly like a generator that had stopped working rather than like a
    transfer that ate them. Any top level key already on disk and absent here is carried
    forward instead of being overwritten with nothing.

    This is the second line of defence, not the first. Results come back to the repo by
    FIELD, never by file, so the repo manifest is never overwritten by this one at all.
    """
    if path.exists():
        try:
            on_disk = json.loads(path.read_text())
        except (json.JSONDecodeError, OSError):
            on_disk = {}
        for k, v in on_disk.items():
            if k not in doc:
                doc[k] = v
    path.write_text(json.dumps(doc, indent=2) + "\n")


def probe(p: Path):
    r = sh(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
            "stream=width,height", "-of", "csv=p=0:s=x", str(p)], timeout=120)
    if "x" in r.stdout:
        w, h = r.stdout.strip().split("x")[:2]
        return int(w), int(h)
    return 0, 0


def encode(src: Path, dest: Path, vf: str, crf: str, mute: bool) -> tuple[int, int]:
    dest.parent.mkdir(parents=True, exist_ok=True)
    tmp = dest.with_suffix(".tmp.mp4")          # never write over the file being read
    cmd = NICE + ["ffmpeg", "-y", "-threads", "2", "-i", str(src), "-vf", vf,
                  "-c:v", "libx264", "-crf", crf, "-preset", "medium",
                  "-profile:v", "high", "-movflags", "+faststart"]
    cmd += ["-an"] if mute else ["-c:a", "aac", "-b:a", "128k"]
    cmd += [str(tmp)]
    r = sh(cmd)
    if r.returncode != 0 or not tmp.exists() or tmp.stat().st_size == 0:
        if tmp.exists():
            tmp.unlink()
        raise RuntimeError(f"ffmpeg rc={r.returncode} {(r.stderr or '')[-200:]}")
    tmp.replace(dest)
    return probe(dest)


def theatre_vf():
    return (f"scale='min({THEATRE_MAX},iw)':'min({THEATRE_MAX},ih)'"
            ":force_original_aspect_ratio=decrease,scale=trunc(iw/2)*2:trunc(ih/2)*2")


def bead_vf():
    # 720 WIDE, never up: min() against the source width, height follows the aspect
    return f"scale='min({BEAD_W},iw)':-2"


def source_for(r: dict) -> tuple[Path | None, bool]:
    """(path, is_temporary). Prefers the original over any copy we already hold."""
    rid = r["id"]
    if rid.isdigit():
        out = WORK / f"{rid}.mp4"
        if not out.exists():
            sh(NICE + ["yt-dlp", "--no-warnings", "--no-progress",
                       "-f", "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best",
                       "--merge-output-format", "mp4", "-o", str(WORK / "%(id)s.%(ext)s"),
                       f"https://www.facebook.com/reel/{rid}"], timeout=600)
        return (out, True) if out.exists() else (None, False)
    if r.get("source_url"):
        out = WORK / f"{rid}.src.mp4"
        # ☠️ PREFER THE hd/ SIBLING. source_url points at the `fb/` copy, which FFC
        # serves at 480x854: a web downscale, not an original. The same clip sits one
        # directory across under `hd/` at 720x1280. Localising from `fb/` would have
        # frozen the 33 clips that ship on the wall TODAY at 480 wide, below even the
        # bead target, and no re-encode recovers pixels that were never fetched.
        url = r["source_url"]
        if "/reels/hd/" in url:
            candidates = [url]
        elif "/reels/fb/" in url:
            candidates = [url.replace("/reels/fb/", "/reels/hd/"), url]
        else:
            candidates = [url.replace("/reels/", "/reels/hd/"), url]
        if not out.exists():
            for cand_url in candidates:
                sh(["curl", "-sfL", "--max-time", "300", "-o", str(out), cand_url], timeout=360)
                if out.exists() and out.stat().st_size > 0:
                    break
        if out.exists() and out.stat().st_size > 0:
            return out, True
    # The best copy already on the box: the repo's own hd original, else the web copy.
    #
    # ☠️ SNAPSHOT IT FIRST. The bead encode writes to r["src"], which for the field and
    # local wall clips IS this file. Encoding in place is safe within one run (the source
    # is read before the replace), but if the state file were ever lost, a re-run would
    # read the already-downscaled bead as its source and encode a copy of a copy. Working
    # from a snapshot in the work directory makes that impossible.
    stem = Path(r["src"]).stem
    for cand in (ROOT / "reels/hd" / f"{stem}.mp4", ROOT / r["src"].lstrip("/")):
        if cand.exists():
            snap = WORK / f"orig-{rid}.mp4"
            if not snap.exists():
                shutil.copy2(cand, snap)
            return snap, True
    return None, False


def main() -> int:
    WORK.mkdir(parents=True, exist_ok=True)
    st = load_state()
    done = set(st["done"])
    lib = json.loads(LIB.read_text())
    reels = lib["reels"]
    n_start = len(done)

    for i, r in enumerate(reels, 1):
        rid = r["id"]
        if rid in done:
            continue
        src, temporary = source_for(r)
        if src is None:
            st["failed"][rid] = "no source"
            save_state(st)
            continue

        sw, sh_ = probe(src)
        try:
            hd_path = ROOT / (r.get("hd") or f"/cinema/reels/hd/{rid}.mp4").lstrip("/")
            hw, hh = encode(src, hd_path, theatre_vf(), "20", mute=False)
            bead_path = ROOT / r["src"].lstrip("/")
            bw, bh = encode(src, bead_path, bead_vf(), "24", mute=True)
            if r.get("poster"):
                sh(NICE + ["ffmpeg", "-y", "-ss", "1", "-i", str(src), "-frames:v", "1",
                           "-vf", f"scale='min({POSTER_W},iw)':-2", "-q:v", "2",
                           str(ROOT / r["poster"].lstrip("/"))], timeout=180)
        except Exception as exc:                              # noqa: BLE001
            st["failed"][rid] = str(exc)[:160]
            save_state(st)
            if temporary and src.exists():
                src.unlink()
            continue

        r["hd"] = r.get("hd") or f"/cinema/reels/hd/{rid}.mp4"
        r["hdWidth"], r["hdHeight"] = hw, hh
        r["width"], r["height"] = bw, bh
        # THE SOURCE CEILING, RECORDED. Several of these clips cannot reach the target
        # because the best copy that exists is smaller: the wall clips top out at FFC's
        # own 720 or 540 wide masters. Writing the source dimensions means nobody re-runs
        # this expecting 1920 and concludes the encoder is broken.
        r["sourceWidth"], r["sourceHeight"] = sw, sh_
        # NEVER PADDED. Every clip keeps its native aspect; 24 of the 192 are not 9:16
        # (17 landscape, 7 other portrait) and the bead sampler crops min(w,h) from the
        # file's own metadata, so padding to 9:16 would put black bars inside the glass.
        if max(hw, hh) < THEATRE_MAX or bw < BEAD_W:
            st["from_small_source"].append(
                {"id": rid, "source": f"{sw}x{sh_}", "theatre": f"{hw}x{hh}", "bead": f"{bw}x{bh}"})
        if temporary and src.exists():
            src.unlink()                                       # never hold two raws
        done.add(rid)
        st["done"] = sorted(done)
        save_state(st)
        lib["reels"] = reels
        write_manifest(LIB, lib)                                # manifest survives a kill

        if len(done) % 50 == 0 or i == len(reels):
            print(f"[{len(done)}/{len(reels)}] encoded, {len(st['failed'])} failed", flush=True)

    # ---- growth partner clips, same theatre profile ----
    if GROWTH.exists():
        g = json.loads(GROWTH.read_text())
        for item in g["items"]:
            if item["type"] != "video":
                continue
            name = Path(item["src"]).name
            key = f"growth:{name}"
            if key in done:
                continue
            tmp = WORK / f"g-{name}"
            if not tmp.exists():
                sh(["curl", "-sL", "--max-time", "300", "-o", str(tmp),
                    "https://ffcdentalclinic.com/sign-in/brand/gp/" + name], timeout=360)
            if not tmp.exists() or tmp.stat().st_size == 0:
                st["failed"][key] = "source refused"
                save_state(st)
                continue
            try:
                hd = ROOT / f"cinema/growth/hd/{name}"
                hw, hh = encode(tmp, hd, theatre_vf(), "20", mute=False)
                item["hd"] = f"/cinema/growth/hd/{name}"
                item["hdWidth"], item["hdHeight"] = hw, hh
                done.add(key)
                st["done"] = sorted(done)
            except Exception as exc:                           # noqa: BLE001
                st["failed"][key] = str(exc)[:160]
            finally:
                if tmp.exists():
                    tmp.unlink()
                save_state(st)
                write_manifest(GROWTH, g)

    print(f"\nDONE. encoded this run: {len(done) - n_start}, total {len(done)}, "
          f"failed {len(st['failed'])}, smaller than target {len(st['from_small_source'])}")
    for k, v in list(st["failed"].items())[:10]:
        print("  FAILED", k, v)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
