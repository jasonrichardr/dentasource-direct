# The studio

A local editor for the cinema's words and pictures. It runs on your own machine
only, and it edits the real JSON files that the site is built from.

## Running it

```bash
npm run dev
```

Then open **http://localhost:3000/studio**

That is the whole setup. There is no login, because there is nothing to log in
to: the studio does not exist anywhere but your machine. On the live site
`/studio` is a 404, and so is every one of its API routes.

## What you can do

**Pick an arc** on the left: Home, About, Contact, the product arcs, the Ask DSD
script, and the picture strips (our people, installs, see us in action, marble
reels, spare parts).

**Reorder beats** by dragging them in the left rail. The order in the list is
the order on the site.

**Hide a beat** with the ● button. It stays in the file, marked
`hidden: true`, and it is GONE from the site: every arc and every picture strip
filters hidden entries out, so the beat disappears on the next dev reload or
build, and its stop vanishes from the scroll rail with it. The same applies to
a hidden picture in a strip. Press ● again to bring it back. Nothing is
deleted, so this is the safe way to take something down.

**Edit the writing.** Every text field of the selected beat is an input: the
eyebrow, the headline, the body, the button labels and links, the lists of
statements and checklist lines. You get a live character count, and a red flag
if the sentence trips one of the house rules: a dash, an exclamation mark, the
word "factory", "#1", or a price. The flags are advice, not a lock. You can save
anyway if you mean it.

**Some fields are read only** and marked as such: `key`, `kind`, `slug`,
`route`. The code matches on those, so changing one silently breaks a beat.

**Photos and videos.** Drag the thumbnails to reorder them. Delete removes one.
Swap opens a picker with everything already on the site, with a search box.
Upload adds a new file from your computer:

- Photos are shrunk to 1800 px on the long edge automatically.
- Videos are stored as they are, with a warning over 8 MB, because that is real
  data on a phone.
- Alt text is required. A picture with no description cannot be added.
- Uploads land in `public/cinema/uploads/<year-month>/`.

**Send a picture somewhere else.** Tick the box on any thumbnail (or several),
press **Send to…**, and pick another set: another strip, or a particular beat's
own pictures. Choose **Move** to take it out of here, or **Copy** to leave it
in both. The alt text and the poster travel with it, and the entry is reshaped
to match whatever the target set uses.

- A transfer writes BOTH files immediately, each with its own `.bak`. It does
  not wait for Save, because leaving one half of a move unsaved is how the same
  picture ends up in two places.
- For that reason it asks you to save first if you have unsaved edits open. It
  reads what is on disk.
- A video can only be sent to a set that already carries video. The studio will
  not offer the others.

**Duplicate** copies a picture again inside the same set, next to itself.

**Some pictures are greyed out in the picker** for a particular set, with the
reason on hover. Those were taken out of that strip on purpose, usually because
the original photograph is only 360px wide and reads soft at tile size. They are
not swapped or enlarged, because each one's caption describes that exact scene.
They keep their place in the articles. The studio will not let one back in
through the picker or through Send to…, and a picture ruled out of ANY strip is
ruled out of all of them, because the reason is the photograph rather than the
particular strip. A beat's own pictures are not a strip and are left alone:
those render large, which is where a small original is fine.

**Open beat** opens that beat on the running site in a new tab.

**A greyed out arc** means that file is not in the repo right now. These
manifests are being reshaped while you work: one was deleted and folded into
another, one is being replaced. The studio lists it anyway with the reason, so
you can see it is coming rather than wonder where it went.

**Some fields under a photo are grey and cannot be typed into**: `meta_caption`,
the width and height, the source link, the id. They are generated next to the
file. Rewriting one here would only make it disagree with where it came from.

**Left out on purpose** appears under a picture set that carries exclusions,
with the reason for each. Most are privacy calls. It is read only.

**Part names that were guessed** show who named them and how sure that was. A
low-confidence tile is tinted amber. Read the name against the picture and press
**Confirm name** when it is right; the tint goes and the name is marked
confirmed. It is a quick way through a long list, and nothing is confirmed for
you.

## Logo dials

The **Logo dials** tab tunes the particle lockup live: vibrancy, brightness,
contrast, sharpness, dot size, edge erosion, and the dark and light registers.
Open the home page in a second tab and watch it move as you drag.

☠️ These are a preview setting in YOUR browser, not a saved file. They live in
`localStorage` under `dsd:lockup-dials`, they never reach the repo, and nobody
else sees them. When a setting looks right, the number has to be copied into
`LOCKUP_DEFAULTS` in `src/cinema/formations/lockupConfig.js` to make it real.

## Marquee speed

Set it by feel. The **Marquee speed** tab has a slider per family and a strip of
real photographs running under it at exactly that speed, so you can watch it
rather than guess a number.

- Two families, because FFC runs two: photographs and video, and a line of
  running text. Each has a desktop and a phone value.
- The strip in the panel is timed by the same code the site uses, so what you
  feel there is what ships.
- **Any site tab you have open re-times as you drag**, with no reload. If that
  tab is behind this one it catches up the moment you look at it, because a
  hidden tab does not paint.
- **Reset to FFC** puts back the measured originals.
- **Per marquee overrides** (behind the button) set one track differently from
  its family, for when a single strip needs it. Leave a box empty to follow the
  family. The track names are read out of the code, so the list is whatever the
  site actually has.

Nothing here changes what ships until you press **Save to settings.json**. Until
then it is only your browser. Saved speeds live in `src/data/cinema/settings.json`
and must be committed like any other content.

## Saving

Nothing saves until you press **Save changes**. There is no autosave.

When you save:

- the file is written back, pretty printed, exactly where it was;
- the previous version is kept beside it as `<file>.json.bak`, which is your
  undo;
- one line is appended to `src/data/cinema/.studio-log` so the change can be
  read back later. That log is gitignored and never ships.

## ☠️ The part that matters

**The JSON files ARE the site.** They are committed to the repo and the build
reads them. So after you finish editing:

```bash
git status          # see which JSON files changed
git add src/data/cinema src/components/cinema-pages   # and public/cinema/uploads if you added photos
git commit -m "cinema: copy and media edits from the studio"
```

If you do not commit them, your edits live only on your machine and the live
site will not change. If you uploaded photos, they must be committed too, or the
site will point at pictures that are not there.

The `.bak` files are working files. Do not commit those.

## Known, and deliberately left

The studio's compiled JavaScript is still in the production build output
(about 32 KB in `.next/static`). Removing it needs a build-time exclusion,
which costs more than it is worth: nothing sensitive is in it, no served page
loads it, and `/studio` and every `/api/studio` route return a hard 404 in
production from `src/proxy.ts`, so there is nothing for it to talk to.

## For whoever maintains the manifests

This part is not for editing copy; it is for the next builder who adds a
picture set. It lives here because STUDIO.md is what somebody reads before
touching these files.

Every media list may declare the size its tiles render at:

    "tilePx": 126,
    "tileHeightPx": 84

and the studio refuses a photograph for that list on the test the generators
use:

> a tile fills by **cover**, so the file covers it at
> `min(width / tilePx, height / tileHeightPx)`, and anything under **1.75** is
> refused.

Cover means the source is scaled by whichever ratio is larger, so either side
can be the one that goes soft. The file's size is **measured off the file on
disk** — sharp for pictures, ffprobe for video — because a number in a manifest
is a claim about a photograph and this is the photograph.

**1.75 rather than 2.** Two device pixels per css pixel is the retina ideal, and
holding it banned most of the site's own footage: what Facebook and FFC serve
natively is 720 wide, which fills a 384x288 tile at 1.875. The 360 wide crest
frames, the ones that genuinely look soft, fill it at 0.94 and still fail. The
number is `COVER_MIN` in `src/lib/studio/registry.js`, one named constant, so it
can be pushed back to 2 in one edit.

**And a list may set its own floor** with `"coverMin"`. The marbles render
inside glass, which forgives a source a flat strip shows up, and Facebook's
ceiling is 720 on the short side, so `reel-library.json` declares `1.0` and a
720x1280 clip fills its 482x482 bead at 1.49 instead of being refused. A list
with no `coverMin` uses the house floor, and the studio prints a floor in the
label only when it is not the house one, so an unusual bar cannot pass for the
normal one.

What the lists declare, from the CSS that renders them:

| list | pictures | clips | a 720x1280 file fills the picture tile at |
|---|---|---|---|
| action-reels, growth-partner, training-media | 384x288 | 162x288 | 1.88, offered |
| installs | 288x216 | — | 2.50, offered |
| crew-shots | 126x84 | — | 5.71, offered |
| parts | 56x56 | — | 12.9, offered |

and the 360x640 crest frames fill a 384x288 tile at 0.94 and the 126x84 crew row
at 2.86 — refused by the first, offered by the second.

**A list renders a tile per kind.** In the mixed track a clip gets
`aspect-ratio: 9/16` and a picture `4/3` at a shared height, so the boxes are
162x288 and 384x288 (measured off the rendered element, not read out of the
stylesheet — `.dsd-reel` in `home-cinema.css` describes a layout that was
replaced and renders nowhere). A 404x720 reel fills its own tile at 2.49 and the
picture tile at 1.05, so a clip is judged by `tileVideoPx` /
`tileVideoHeightPx` and a picture by `tilePx` / `tileHeightPx`.

**A null is a declaration. A missing key is not.**

| in the manifest | what it means | what the studio does |
|---|---|---|
| `"tileVideoPx": 162` | measured | judges every clip against it |
| `"tileVideoPx": null` | this list carries no video | refuses every clip, "takes images only" |
| no `tileVideoPx` key | nobody has measured it | bars nothing, labels "video tile not declared" |

The same for the picture keys. This is the `stripUnsafe` proxy again in
miniature: an absence cannot tell "not applicable" from "not measured", and the
studio should not have to guess which one a silence is.

**Not every tile crops.** `.dsd-part-img` is `object-fit: contain`, which fits
the file inside the box rather than filling it, so the ratio is
`max(w / tilePx, h / tileHeightPx)` — the other extreme. A manifest whose tiles
contain says `"tileFit": "contain"`; `parts.json` does. Judged as cover it would
refuse four of its own thumbnails: `light-arm-2.png` at 348x68 fills a 56x56 tile
at 1.21 by cover and 6.21 by contain.

Nothing to remember: four doors — the picker, "Send to…", an upload, and the
generators themselves — run the same arithmetic.

A list that declares only `tilePx` is judged as though its tile were square,
which makes the test the file's **short side** over that width. It is
conservative for a wide landscape source: an 800x600 covers a 384x288 tile at
2.08 but a square 384 at 1.56. A list holding landscape material should declare
its `tileHeightPx`.

A list that declares **no `tilePx`** bars nothing, and the studio labels it "no
tile size declared" rather than looking guarded.

**Where a tile size came from** can travel with it, in `tileSource`, and the
studio prints it in the hover on the set. Every other tile can be checked by
opening the page and inspecting the element; the marbles' bead cannot, because
it is a texture sample inside a three.js scene with no element to inspect. A
number nobody can re-measure has to carry its own paper trail, and the place it
is needed is where somebody is using the number.

`stripUnsafe` maps stay in the manifests as generated documentation of what a
pipeline found and why. They no longer decide anything. The header counts how
many of those flagged files fail this list's budget, and the picker greys every
other file that fails it too, whether or not anybody flagged it.

This is the fifth version of the rule, and the first four are worth knowing
because each looked settled. "Declares a stripUnsafe map" read as "tiles here
are big" over-barred the crew row for a week. The short side, then the width,
were each right only while every soft source was portrait. Exact cover against a
hard 2.0 was geometrically correct and still wrong in practice, because it
banned the 720 wide material the site is made of.

## Where it writes

The studio refuses to write anywhere except these three places:

- `src/data/cinema/**`
- `src/components/cinema-pages/*-beats.json`
- `public/cinema/uploads/**`

Anything else is a 400 and nothing is touched.
