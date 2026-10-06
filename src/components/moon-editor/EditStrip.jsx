'use client';

// One home-page strip in edit mode, drawn in place of the moving marquee.
//
// Paused and scrollable sideways. Every tile carries a glass x (remove, with Undo in the
// toast); tapping one tile and then another in the same strip makes them trade places; the
// + tile at the front adds a photo (new photos land at the front, which is where the site
// plays from); the timing slider sets the strip's speed against the site's measured default,
// and Play shows the strip moving at that speed before anyone leaves edit mode. Tiles after
// the strip's cut (the site plays the first 44, the crew row 18) are dimmed, as in the console.

import { useRef, useState } from 'react';
import Image from 'next/image';
import { Film, Gauge, Loader2, Pause, Play, Plus, X } from 'lucide-react';
import { addPhoto, pickTile, removeTile, setSpeed, useEdit } from './editStore';

const ACCEPT = 'image/jpeg,image/png,image/webp';
const SPEED_MIN = 0.5;
const SPEED_MAX = 2;

/** The picture a tile shows: the still itself, or a clip's poster. */
const pictureOf = (t) => (t.type === 'video' ? t.poster : t.url);

function Tile({ deck, t, i, cut, picked, busy }) {
  const pic = pictureOf(t);
  return (
    <div
      className={`me-tile${picked ? ' is-picked' : ''}${i >= cut ? ' is-cut' : ''}`}
      role="button"
      tabIndex={0}
      aria-pressed={picked}
      aria-label={`${t.alt || 'Tile'}, number ${i + 1}. Tap two tiles to swap them.`}
      onClick={() => pickTile(deck, t.id)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pickTile(deck, t.id); } }}
    >
      {pic ? (
        <Image
          src={pic}
          alt=""
          width={t.w || 4}
          height={t.h || 3}
          sizes="240px"
          quality={75}
          style={{ aspectRatio: `${t.w || 4} / ${t.h || 3}` }}
          draggable={false}
        />
      ) : <span className="me-blank" aria-hidden="true" />}
      {t.type === 'video' ? <span className="me-kind" aria-hidden="true"><Film size={14} /></span> : null}
      <span className="me-n" aria-hidden="true">{i + 1}</span>
      <button
        type="button"
        className="lg lg-sm me-x"
        aria-label={`Remove tile ${i + 1}`}
        disabled={busy}
        onClick={(e) => { e.stopPropagation(); void removeTile(deck, t.id); }}
      >
        <X size={16} strokeWidth={2.4} />
      </button>
    </div>
  );
}

function Preview({ deck, tiles, cut, speed, compact }) {
  // the strip as a visitor will see it: the same doubled track, the same measured speed
  // (src/lib/cinema/marquee.js reads data-speed), only the first `cut` tiles
  const shown = tiles.slice(0, cut).filter((t) => pictureOf(t));
  const doubled = [...shown, ...shown];
  if (compact) {
    return (
      <div className="dsd-news-row me-preview">
        <div className="dsd-news-track" data-marquee={`edit-${deck}`} data-speed={speed}>
          {doubled.map((t, i) => (
            <Image key={`${i}-${t.id}`} className="dsd-crew-shot" src={pictureOf(t)} alt="" width={126} height={84} quality={75} />
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="dsd-strip dsd-mixed me-preview">
      <div className="dsd-strip-track" data-marquee={`edit-${deck}`} data-speed={speed}>
        {doubled.map((t, i) => (
          <Image
            key={`${i}-${t.id}`}
            src={pictureOf(t)}
            alt=""
            width={t.w || 4}
            height={t.h || 3}
            sizes="(max-width: 700px) 60vw, 300px"
            quality={75}
            style={{ aspectRatio: t.type === 'video' ? '9 / 16' : `${t.w || 4} / ${t.h || 3}` }}
          />
        ))}
      </div>
    </div>
  );
}

export default function EditStrip({ deck, near, compact = false }) {
  const st = useEdit();
  const fileRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const d = st.decks ? st.decks[deck] : null;
  const busy = !!(st.busy && st.busy[deck]);
  const uploads = (st.uploads && st.uploads[deck]) || [];
  const cls = `me-strip${compact ? ' is-compact' : ''}`;

  if (!d) {
    return <div className={cls} data-deck={deck}><p className="me-note">{st.loadError || 'Loading the strip...'}</p></div>;
  }
  if (!d.exists) {
    return (
      <div className={cls} data-deck={deck}>
        <p className="me-note">{d.name} is not set up in the console yet. Copy it from the site first (the WWW seed), then edit it here.</p>
      </div>
    );
  }

  const cut = d.shown || 44;
  const speed = typeof d.speed === 'number' ? d.speed : 1;
  const picked = st.picked && st.picked.deck === deck ? st.picked.id : null;
  const pickedAt = picked ? d.tiles.findIndex((t) => t.id === picked) : -1;

  return (
    <div className={cls} data-deck={deck}>
      <div className="me-head">
        <span className="me-name">{d.name}</span>
        <span className="me-count">
          {d.tiles.length} {d.tiles.length === 1 ? 'tile' : 'tiles'} · plays the first {Math.min(cut, d.tiles.length)}
          {busy ? <Loader2 className="me-spin" size={13} aria-label="Saving" /> : null}
        </span>
        <span className="me-hint">{pickedAt >= 0 ? `Tile ${pickedAt + 1} picked: tap another to swap them` : 'Tap two tiles to swap them'}</span>
      </div>

      {playing ? (
        near ? <Preview deck={deck} tiles={d.tiles} cut={cut} speed={speed} compact={compact} /> : null
      ) : (
        <div className="me-scroll">
          <button type="button" className="lg me-add" aria-label={`Add a photo to ${d.name}`} disabled={busy} onClick={() => fileRef.current && fileRef.current.click()}>
            <Plus size={26} strokeWidth={2.2} />
            <span>Photo</span>
          </button>
          <input
            ref={fileRef}
            type="file"
            accept={ACCEPT}
            hidden
            data-me-upload={deck}
            onChange={(e) => {
              const f = e.target.files && e.target.files[0];
              e.target.value = '';
              if (f) void addPhoto(deck, f);
            }}
          />
          {uploads.map((u) => (
            <div className="me-tile is-uploading" key={u.key} aria-label="A photo on its way">
              {u.preview ? <Image src={u.preview} alt="" width={4} height={3} unoptimized style={{ aspectRatio: '4 / 3' }} /> : <span className="me-blank" />}
              <span className="me-up"><Loader2 className="me-spin" size={22} /></span>
            </div>
          ))}
          {near ? d.tiles.map((t, i) => (
            <Tile key={t.id} deck={deck} t={t} i={i} cut={cut} picked={picked === t.id} busy={busy} />
          )) : null}
        </div>
      )}

      <div className="me-timing">
        <Gauge size={16} aria-hidden="true" />
        <label className="me-timing-label" htmlFor={`me-speed-${deck}`}>Timing</label>
        <input
          id={`me-speed-${deck}`}
          className="me-range"
          type="range"
          min={SPEED_MIN}
          max={SPEED_MAX}
          step={0.05}
          value={speed}
          aria-valuetext={`${speed.toFixed(2)} times the normal speed`}
          onChange={(e) => setSpeed(deck, Number(e.target.value))}
        />
        <output className="me-speed" htmlFor={`me-speed-${deck}`}>{speed.toFixed(2)}x</output>
        <button type="button" className="lg lg-sm me-play" onClick={() => setPlaying((p) => !p)} aria-pressed={playing}>
          {playing ? <Pause size={14} /> : <Play size={14} />}
          {playing ? 'Arrange' : 'Play'}
        </button>
      </div>
    </div>
  );
}
