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

**Open beat** opens that beat on the running site in a new tab.

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

## Where it writes

The studio refuses to write anywhere except these three places:

- `src/data/cinema/**`
- `src/components/cinema-pages/*-beats.json`
- `public/cinema/uploads/**`

Anything else is a 400 and nothing is touched.
