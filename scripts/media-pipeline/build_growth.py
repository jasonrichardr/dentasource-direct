#!/usr/bin/env python3
"""Growth partner media: the Training Center photographs and footage.

    python3 scripts/media-pipeline/build_growth.py

Source page: https://ffcdentalclinic.com/growth-partner/ , whose media all live under
/sign-in/brand/gp/. The page offers 37 images and 12 videos; this ships 19 and 8.

WHAT IS EXCLUDED, AND WHY. Every exclusion below was decided by OPENING the file, not by
reading its name, and each is a rule this repo already holds:

  kb-01..kb-16, digi-01  (17 images)
      Screenshots of individual clinicians' private knowledge bases. They carry a full
      personal name and a portrait in the sidebar of every frame, and several also show
      patient case data: tooth numbers, "recall verdict", healing notes. The no personal
      names in public files rule forbids the first and the second should never leave a
      clinic at all. These must not go on dentasourcedirect.com.

  reel-01   a speaker-lineup graphic: headshots and full names of named lecturers.
  reel-04   certificate handovers; the certificates carry the recipients' names.
  reel-05   a "LIMITED SLOTS, RESERVE NOW" promotional card. The brief says real
            photographs and footage only, no ad renders.
  reel-03   close ups of live procedures on patients in surgical drapes. Patient imagery
            is not marketing material, and consent for a supplier's marquee is not
            something this pipeline can assume.
  mini-18   320 by 240, far too small for the page.

WHAT SHIPS: venue-01..10 and scan-01..08 (the Training Center in use, roles only),
studio-01 (the filming setup, DSD logo on the wall), and the 8 reels that show teaching
and hands on work without names, certificates or patients.

Videos are re-encoded because the originals are unusable on the web: reel-12 alone is
76 MB, and the twelve together are 264 MB.
"""

from __future__ import annotations

import json
import re
import subprocess
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    sys.exit("Pillow is required")

REPO = Path(__file__).resolve().parents[2]
SRC = Path("/private/tmp/claude-501/-Users-jarich-second-brain/"
           "bd07f7c7-7fc8-48d1-acd9-274356db7d47/scratchpad/media/growth")
DL = SRC / "dl"
OUT = REPO / "public/cinema/growth"
OUT_JSON = REPO / "src/data/cinema/growth-partner.json"
PAGE_URL = "https://ffcdentalclinic.com/growth-partner/"

IMAGE_MAX = 1400
VIDEO_MAX = 720
POSTER_MAX = 480

# alt text is ROLE ONLY: what is happening, never who is doing it
IMAGES = (
    [(f"venue-{i:02d}.jpg", "A session under way in the Training Center") for i in range(1, 11)]
    + [(f"scan-{i:02d}.jpg", "Digital scanning and planning at a workstation") for i in range(1, 9)]
    + [("studio-01.jpg", "Filming a lesson on the Training Center floor")]
)
VIDEOS = [
    ("reel-02.mp4", "The teaching screen in the Training Center"),
    ("reel-06.mp4", "A lecturer presenting beside the instrument wall"),
    ("reel-07.mp4", "Hands on work at a phantom head station"),
    ("reel-08.mp4", "A session in progress on the training floor"),
    ("reel-09.mp4", "An instructor working through a case with attendees"),
    ("reel-10.mp4", "A demonstration on the main screen"),
    ("reel-11.mp4", "Attendees at the phantom head stations"),
    ("reel-12.mp4", "A lesson being delivered to the room"),
]
EXCLUDED = {
    "kb-01..kb-16, digi-01": "private knowledge base screenshots carrying a personal name, a portrait and patient case data",
    "reel-01": "speaker lineup graphic with names and headshots",
    "reel-04": "certificate handovers; certificates carry recipients' names",
    "reel-05": "promotional card, not footage",
    "reel-03": "close ups of live procedures on patients",
    "mini-18": "320 by 240, too small for the page",
}


def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True)


# Cap the LONG side, whichever it is. The obvious `scale='min(720,iw)':-2` caps the WIDTH,
# so a portrait reel that is already 720 wide sails through at 1280 tall, which is how the
# first run shipped 720x1280 files. force_original_aspect_ratio=decrease against a 720 box
# does it properly, and the second scale keeps both dimensions even for H.264.
SCALE = (f"scale='min({VIDEO_MAX},iw)':'min({VIDEO_MAX},ih)'"
         ":force_original_aspect_ratio=decrease,scale=trunc(iw/2)*2:trunc(ih/2)*2")


def transcode(src: Path, dest: Path, poster: Path) -> tuple[float, int, int]:
    r = run(["ffmpeg", "-y", "-i", str(src), "-vf", SCALE,
             "-c:v", "libx264", "-crf", "28", "-preset", "veryfast", "-profile:v", "high",
             "-movflags", "+faststart", "-c:a", "aac", "-b:a", "96k", str(dest)])
    # A SILENT FAILURE IS THE ONE THAT SHIPS. The first run wrote two zero byte mp4s and
    # said nothing, because nothing checked. Fail loudly instead.
    if r.returncode != 0 or not dest.exists() or dest.stat().st_size == 0:
        raise RuntimeError(f"ffmpeg failed for {src.name}: "
                           f"rc={r.returncode} {(r.stderr or '').strip()[-200:]}")
    run(["ffmpeg", "-y", "-ss", "1", "-i", str(src), "-frames:v", "1",
         "-vf", f"scale='min({POSTER_MAX},iw)':-2", "-q:v", "4", str(poster)])
    p = run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
             "-of", "default=nw=1:nk=1", str(dest)])
    try:
        dur = round(float(p.stdout.strip()), 2)
    except ValueError:
        dur = 0.0
    w = h = 0
    p = run(["ffprobe", "-v", "error", "-select_streams", "v:0",
             "-show_entries", "stream=width,height", "-of", "csv=p=0:s=x", str(dest)])
    if "x" in p.stdout:
        w, h = (int(v) for v in p.stdout.strip().split("x")[:2])
    return dur, w, h


def page_copy() -> dict:
    html = next(SRC.glob("*.html")).read_text(encoding="utf8", errors="replace")
    import html as _html
    strip = lambda t: _html.unescape(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", t))).strip()
    h1 = [strip(x) for x in re.findall(r"<h1[^>]*>(.*?)</h1>", html, re.S)]
    h2 = [strip(x) for x in re.findall(r"<h2[^>]*>(.*?)</h2>", html, re.S)]
    drop = {"how we handle your details", "thank you."}
    return {
        "headline": h1[0] if h1 else "",
        "statements": [t for t in h2 if t and t.lower() not in drop][:8],
    }


def main() -> int:
    OUT.mkdir(parents=True, exist_ok=True)
    for stale in list(OUT.glob("*.jpg")) + list(OUT.glob("*.mp4")):
        stale.unlink()

    items, missing = [], []
    for name, alt in IMAGES:
        src = DL / name
        if not src.exists():
            missing.append(name)
            continue
        im = Image.open(src).convert("RGB")
        if max(im.size) > IMAGE_MAX:
            s = IMAGE_MAX / max(im.size)
            im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
        dest = OUT / name
        im.save(dest, "JPEG", quality=82, optimize=True, progressive=True)
        items.append({"type": "image", "src": f"/cinema/growth/{name}",
                      "width": im.width, "height": im.height, "alt": alt,
                      "source_url": PAGE_URL})

    for name, alt in VIDEOS:
        src = DL / name
        if not src.exists():
            missing.append(name)
            continue
        poster_name = name.replace(".mp4", "-poster.jpg")
        try:
            dur, w, h = transcode(src, OUT / name, OUT / poster_name)
        except RuntimeError as exc:
            print("  TRANSCODE FAILED:", exc)
            missing.append(name)
            continue
        items.append({"type": "video", "src": f"/cinema/growth/{name}",
                      "poster": f"/cinema/growth/{poster_name}",
                      "width": w, "height": h, "duration": dur, "alt": alt,
                      "source_url": PAGE_URL})

    payload = {
        "version": 1,
        "source": PAGE_URL,
        "generated": __import__("datetime").date.today().isoformat(),
        "notes": (
            "Training Center photographs and footage from the growth partner page, "
            "re-encoded for the web. ALT TEXT IS ROLE ONLY, never a person. The page "
            "offers 37 images and 12 videos; 19 and 8 ship. Excluded by opening each "
            "file: 17 private knowledge base screenshots carrying a personal name, a "
            "portrait and patient case data; a speaker lineup graphic and a certificate "
            "handover reel, both carrying names; a promotional card, which is an ad "
            "render rather than footage; a reel of live procedures on patients; and one "
            "image too small to use."
        ),
        "excluded": EXCLUDED,
        "copy": page_copy(),
        "counts": {"images": sum(1 for i in items if i["type"] == "image"),
                   "videos": sum(1 for i in items if i["type"] == "video"),
                   "missing": len(missing)},
        "items": items,
    }
    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf8")

    total = sum(f.stat().st_size for f in OUT.iterdir() if f.is_file())
    print(f"images {payload['counts']['images']}  videos {payload['counts']['videos']}  "
          f"missing {missing}")
    print(f"output {total/1e6:.1f} MB in {OUT}")
    for f in sorted(OUT.iterdir(), key=lambda f: -f.stat().st_size)[:3]:
        print(f"  largest {f.name} {f.stat().st_size/1e6:.2f} MB")
    print("copy:", json.dumps(payload["copy"])[:300])
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
