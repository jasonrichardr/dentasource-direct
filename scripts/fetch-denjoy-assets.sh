#!/usr/bin/env bash
# scripts/fetch-denjoy-assets.sh
# One-shot pull of brand films + per-product hero images for /denjoy.
# Idempotent — safe to re-run; existing files are skipped.
set -euo pipefail

REPO="$(cd "$(dirname "$0")/.." && pwd)"
VIDEO_DIR="$REPO/public/videos/denjoy"
IMG_DIR="$REPO/public/images/denjoy"

mkdir -p "$VIDEO_DIR" "$IMG_DIR"

echo "==> Fetching brand films via yt-dlp..."

# Meet-Endo 43s — hero loop
if [ ! -f "$VIDEO_DIR/meet-endo.mp4" ]; then
  yt-dlp -f 'bestvideo[height<=1080][ext=mp4]+bestaudio/best[ext=mp4]/best' \
         --merge-output-format mp4 \
         -o "$VIDEO_DIR/meet-endo.%(ext)s" \
         "https://youtu.be/O6odfHoymqw"
fi

# Joining Forces 23s — CTA bookend
if [ ! -f "$VIDEO_DIR/joining-forces.mp4" ]; then
  yt-dlp -f 'bestvideo[height<=1080][ext=mp4]+bestaudio/best[ext=mp4]/best' \
         --merge-output-format mp4 \
         -o "$VIDEO_DIR/joining-forces.%(ext)s" \
         "https://youtu.be/171806KYnyk"
fi

# Denjoy HQ aerial (corporate credibility)
if [ ! -f "$VIDEO_DIR/denjoy-hq.mp4" ]; then
  curl -sL --max-time 60 -o "$VIDEO_DIR/denjoy-hq.mp4" \
    "http://32091626.s21v.faiusr.com/58/ABUIABA6GAAgoNe-vgYo0vu4nQU.mp4"
fi

# Denjoy team event (corporate credibility)
if [ ! -f "$VIDEO_DIR/denjoy-team.mp4" ]; then
  curl -sL --max-time 60 -o "$VIDEO_DIR/denjoy-team.mp4" \
    "http://32091626.s21v.faiusr.com/58/ABUIABA6GAAgoNy-vgYooe2hzQU.mp4"
fi

echo "==> Re-encoding 720p mobile variants..."
for base in meet-endo joining-forces denjoy-hq denjoy-team; do
  if [ ! -f "$VIDEO_DIR/${base}-720.mp4" ]; then
    ffmpeg -i "$VIDEO_DIR/${base}.mp4" \
           -vf scale=-2:720 \
           -c:v libx264 -crf 24 -preset slow \
           -c:a aac -b:a 96k \
           -movflags +faststart \
           "$VIDEO_DIR/${base}-720.mp4"
  fi
done

echo "==> Cleaning up 1080p source files (only 720p variants are served)..."
for base in denjoy-hq denjoy-team; do
  [ -f "$VIDEO_DIR/${base}.mp4" ] && rm "$VIDEO_DIR/${base}.mp4"
done

echo "==> Extracting poster frames..."
for base in meet-endo joining-forces denjoy-hq denjoy-team; do
  if [ ! -f "$VIDEO_DIR/${base}-poster.jpg" ]; then
    ffmpeg -i "$VIDEO_DIR/${base}.mp4" -ss 1 -frames:v 1 -q:v 2 -update 1 \
           "$VIDEO_DIR/${base}-poster.jpg"
  fi
done

echo "==> Fetching per-product hero images from Denjoy.cn..."
# Format: "<slug>:<denjoyId>"
PRODUCTS=(
  "meta-endo-pro-i:58"
  "meta-endo:23"
  "ix7:24"
  "ix6:25"
  "i-moto:36"
  "iue1:41"
  "icure:39"
  "ipack:28"
  "meta-pack:26"
)

for entry in "${PRODUCTS[@]}"; do
  slug="${entry%:*}"
  id="${entry#*:}"
  product_dir="$IMG_DIR/$slug"
  mkdir -p "$product_dir"

  if [ -f "$product_dir/hero.jpg" ]; then
    echo "    [$slug] hero.jpg already present — skipping"
    continue
  fi

  echo "    [$slug] fetching from denjoy.cn/sys-pd/${id}.html"
  detail_html=$(curl -sL --compressed --max-time 20 -A "Mozilla/5.0" \
                "http://www.denjoy.cn/sys-pd/${id}.html")

  # Extract product hero via og:image (most reliable — product-specific, not site chrome)
  # Falls back to social share pic= URL, then src= scan.
  img_url=$(echo "$detail_html" \
            | python3 -c "
import sys, re, urllib.parse
html = sys.stdin.read()

# 1. og:image meta tag — product-specific hero used for sharing.
# Match both attribute orderings: property-first and content-first.
og = re.findall(
    r'<meta[^>]*property=["\']og:image["\'][^>]*content=["\']([^"\']+)["\']'
    r'|<meta[^>]*content=["\']([^"\']+)["\'][^>]*property=["\']og:image["\']',
    html, re.IGNORECASE,
)
og = [x for t in og for x in t if x]  # flatten tuple groups
if og:
    print(og[0])
    sys.exit()

# 2. Social share pic= URL (URL-encoded absolute URL)
pics = re.findall(r'[&?]pic=([^&\"\']+)', html)
for p in pics:
    decoded = urllib.parse.unquote(p)
    if decoded.startswith('http') and any(decoded.lower().endswith(e) for e in ['.jpg', '.jpeg', '.png']):
        print(decoded)
        sys.exit()

# 3. Fallback: src= scan (filters site chrome)
imgs = re.findall(r'src=\"(//?[^\"]+\.(?:jpg|jpeg|png))\"', html, re.IGNORECASE)
imgs = [u for u in imgs if 'no-pic' not in u and 'logo' not in u.lower() and 'qrcode' not in u.lower()]
imgs = ['https:' + u if u.startswith('//') else u for u in imgs]
imgs = [u for u in imgs if u.startswith('http')]
print(imgs[0] if imgs else '')
" || true)

  if [ -z "$img_url" ]; then
    echo "    [$slug] WARNING — no hero image found"
    continue
  fi

  curl -sL --max-time 30 "$img_url" -o "$product_dir/hero.jpg"
  echo "    [$slug] saved $(stat -f%z "$product_dir/hero.jpg") bytes"
done

echo ""
echo "==> Done."
echo "    Videos:   $VIDEO_DIR/"
echo "    Images:   $IMG_DIR/"
