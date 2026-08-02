#!/bin/bash
# ADD A SONG TO THE FFC SOUNDTRACK (Jarich's standing order, 2026-07-31).
#
#   bash scripts/add-to-soundtrack.sh <slug> "<Title>" "<Artist>" <audio-file> [cover-image]
#
# Does the whole job: transcode to the library's own settings, square the cover,
# drop both into public/audio/lounge/, and append a row to public/audio/soundtrack.json.
# Commit + push this repo afterwards and BOTH apps pick the song up on next load —
# the FFC front desk and the DA inventory lounge read that manifest at runtime, so
# neither app needs a redeploy.
#
# 64k AAC + loudnorm is not a preference, it is THE setting: the whole library was
# encoded this way so no track jumps in volume against another.
set -euo pipefail

[ $# -lt 4 ] && { echo "usage: $0 <slug> \"<Title>\" \"<Artist>\" <audio> [cover]"; exit 1; }
SLUG="$1"; TITLE="$2"; ARTIST="$3"; AUDIO="$4"; COVER="${5:-}"
ALBUM="${ALBUM:-Lofi & Chill}"
# KIND drives the ALTERNATION (a song, then a mix, then a song — see each app's
# lib/soundtrackOrder.ts). Unset it and the row reads as 'lofi', which is how a
# three-minute song quietly becomes background music that never gets its turn.
# Default from the album so the common case is right without thinking about it.
case "$ALBUM" in
  "Songs") KIND="${KIND:-song}" ;;
  "Ragnarok") KIND="${KIND:-classic}" ;;
  *) KIND="${KIND:-lofi}" ;;
esac
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/public/audio/lounge"
MANIFEST="$ROOT/public/audio/soundtrack.json"
mkdir -p "$OUT"

# -nostdin is mandatory: ffmpeg inside a loop otherwise EATS the caller's stdin,
# and a stray "q" quits the encoder mid-file, leaving a silently truncated track.
echo "→ transcoding $SLUG (64k AAC + loudnorm)…"
ffmpeg -nostdin -y -v error -i "$AUDIO" -vn -af loudnorm=I=-16:TP=-1.5:LRA=11 \
  -c:a aac -b:a 64k -ar 44100 -ac 2 -movflags +faststart "$OUT/$SLUG.m4a"

if [ -n "$COVER" ] && [ -f "$COVER" ]; then
  echo "→ squaring the cover…"
  ffmpeg -nostdin -y -v error -i "$COVER" \
    -vf "crop='min(iw,ih)':'min(iw,ih)',scale=400:400" -q:v 3 "$OUT/$SLUG.jpg"
fi

echo "→ adding to the manifest…"
SLUG="$SLUG" TITLE="$TITLE" ARTIST="$ARTIST" ALBUM="$ALBUM" KIND="$KIND" MANIFEST="$MANIFEST" OUT="$OUT" \
python3 - <<'PY'
import json, os, pathlib
slug, manifest = os.environ["SLUG"], pathlib.Path(os.environ["MANIFEST"])
base = "https://dentasourcedirect.com/audio/lounge/"
doc = json.loads(manifest.read_text())
src = f"{base}{slug}.m4a"
doc["tracks"] = [t for t in doc["tracks"] if t.get("src") != src]  # idempotent re-add
row = {"src": src, "name": os.environ["TITLE"], "artist": os.environ["ARTIST"], "album": os.environ["ALBUM"], "kind": os.environ["KIND"]}
if (pathlib.Path(os.environ["OUT"]) / f"{slug}.jpg").exists():
    row["art"] = f"{base}{slug}.jpg"
# New songs lead the list, like the rest of the Lofi drop.
first_other = next((i for i, t in enumerate(doc["tracks"]) if t.get("album") != row["album"]), len(doc["tracks"]))
doc["tracks"].insert(first_other, row)
if row["album"] not in doc.get("albums", []):
    doc.setdefault("albums", []).insert(0, row["album"])
doc["version"] = int(doc.get("version", 1)) + 1
manifest.write_text(json.dumps(doc, indent=1, ensure_ascii=False))
print(f"   manifest v{doc['version']} — {len(doc['tracks'])} tracks, kind={row['kind']}")
PY

echo
echo "✓ $TITLE is in. Now:  git add public/audio && git commit && git push"
echo "  Both apps pick it up on their next load — no app redeploy."
