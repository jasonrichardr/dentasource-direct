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

**Hide a beat** with the ● button. It stays in the file and gets marked
`hidden: true`. Note: the arc renderer has to be taught to skip hidden beats
before this changes what a visitor sees. Until then it is a note to yourself.

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

## Logo dials

The **Logo dials** tab tunes the particle lockup live: vibrancy, brightness,
contrast, sharpness, dot size, edge erosion, and the dark and light registers.
Open the home page in a second tab and watch it move as you drag.

☠️ These are a preview setting in YOUR browser, not a saved file. They live in
`localStorage` under `dsd:lockup-dials`, they never reach the repo, and nobody
else sees them. When a setting looks right, the number has to be copied into
`LOCKUP_DEFAULTS` in `src/cinema/formations/lockupConfig.js` to make it real.

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

## Where it writes

The studio refuses to write anywhere except these three places:

- `src/data/cinema/**`
- `src/components/cinema-pages/*-beats.json`
- `public/cinema/uploads/**`

Anything else is a 400 and nothing is touched.
