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

> a tile fills by **cover**, so the file needs `tilePx x 2` of width **and**
> `tileHeightPx x 2` of height.

The doubling is DPR 2, the retina case. Both dimensions because `object-fit:
cover` scales the source by whichever ratio is larger, so either side can be the
one that goes soft. The file's size is **measured off the file on disk** — sharp
for pictures, ffprobe for video — because a number in a manifest is a claim
about a photograph and this is the photograph.

What the lists declare, from the CSS that renders them:

| list | tile | needs |
|---|---|---|
| growth-partner, training-media | 384x288 | 768x576 |
| action-reels | 384 wide | 768 |
| installs | 288 wide | 576 |
| crew-shots | 126x84 | 252x168 |
| parts | 56x56 | 112x112 |

So the same 360x640 photograph is refused by the installs strip and accepted by
the crew row, with nothing to remember: four doors — the picker, "Send to…", an
upload, and the generators themselves — ask the same question.

A list that declares only `tilePx` is judged on the file's **short side**
instead, which for a tile no taller than it is wide implies both conditions and
errs toward barring. The two forms part company only for a landscape source in a
non-square tile: an 800x600 has the 768x576 that a 384x288 tile needs, and a
short side of 600 would refuse it. Nothing here is shaped that way; a list that
acquires such a file should declare its `tileHeightPx`.

A list that declares **no `tilePx`** bars nothing, and the studio labels it "no
tile size declared" rather than looking guarded.

`stripUnsafe` maps stay in the manifests as generated documentation of what a
pipeline found and why. They no longer decide anything. The header counts how
many of those flagged files fail this list's budget, and the picker greys every
other file that fails it too, whether or not anybody flagged it.

This is the fourth version of the rule. The first read "declares a stripUnsafe
map" as "tiles here are big" and over-barred the crew row for a week. The second
and third compared one dimension — the short side, then the width — each right
only while every soft source was portrait.

## Where it writes

The studio refuses to write anywhere except these three places:

- `src/data/cinema/**`
- `src/components/cinema-pages/*-beats.json`
- `public/cinema/uploads/**`

Anything else is a 400 and nothing is touched.
