'use client';

// ══════════════════════════════════════════════════════════════════════════
// 🎧 THE ROOM
//
// The FFC music room (dock pill → full-screen player → breathing module),
// ported into DentaSource Direct as real components. The source is the
// template-literal block in ffc-patient-management/scripts/fork-thanks-cinema.ts
// that gets grafted before </body> on /sign-in, /thanks, /careers and
// /growth-partner. Every id, every measured layout number, every autoplay law
// and every fallback is kept; the markup is React with refs instead of one
// injected string, and the canvas work lives in ./spectrum.js and ./orb.js.
//
// WHAT DID NOT COME ACROSS (all FFC-only): the /thanks personaliser, the Convex
// receipt-token query, the visit beacon, patient names, branch names, the
// FFC Umami site ids, the page-aware opener (this room has one page), the jazz
// door postMessage bridge, and the removal of the cinema's old #ambient-dock.
//
// ☠️ THE SONG'S REAL IDENTITY IS NEVER SHOWN. Not in the DOM, not in aria, not
// in Media Session. Everywhere it is called exactly "Thank you." The title is
// the feeling, not the file.
// ══════════════════════════════════════════════════════════════════════════

import { useEffect, useRef } from 'react';

import './room.css';
import { AFTER, AFTER_FOOTER, LABELS, MODES, sig } from './breathing';
import { drawOrb } from './orb';
import { AGC_F, BANDS, BARS, bandHue, drawSpectrum, paintBands } from './spectrum';
import { THOUGHTS, deal } from './thoughts';

/** The one track. CORS verified: `access-control-allow-origin: *` on this exact
 *  path, which is required because Web Audio reads pure SILENCE from a tainted
 *  stream. This is DSD's own file, on DSD's own domain; FFC streams it from
 *  here too, so it must never move. */
const SONG = 'https://dentasourcedirect.com/audio/lounge/lofi-17-sermon-in-the-forum-hifi.m4a';
/** 📱 THE PHONE RENDITION. The master is 96 MB at 198 kbps; on a phone with weak
 *  signal it was the stream that stuttered while the visitor scrolled. Coarse
 *  pointer devices get the SAME piece at 80 kbps HE-AAC (~31 MB, same timeline,
 *  so every CHAPTER timestamp still lands), served from this origin. */
const SONG_PHONE = '/cinema/room/lounge-phone-80k.m4a';
/** Runtime of the master, in seconds (ffprobe: 3896.1). The chapter rail lays
 *  itself out against THIS, not against a duration read from the element, so
 *  the bar is correctly proportioned before a byte of audio has loaded. */
const SONG_SECONDS = 3896;
/** 💛 THE SONG OPENS AT SMOOTH DRIFT, the heart chapter's own timestamp. Keep
 *  it in step with CHAPTERS. Loop wraps to 0:00 afterwards, so the opening is
 *  still met, just not first. */
const SD_START = 2140;

/** ☠️ THE ONE EDITABLE LIST. Nothing else here hardcodes a chapter: the rail,
 *  the markers, the running title and the clock all read this array.
 *  The BOUNDARIES are measured, not guessed (a Foote structural pipeline over
 *  the decoded master, each boundary snapped to the quietest second within
 *  ±8s so a chapter never opens mid-phrase). The NAMES come from listening.
 *  A chapter is [seconds, title] plus, optionally, the SHAPE of its marker. */
const CHAPTERS = [
  [0, 'Soulful Sax'],
  [170, 'Soulful Trumpet'],
  [388, 'Midnight Keys'],
  [558, 'Evening Breeze'],
  [1160, 'Velvet Reeds'],
  [1347, 'Twilight Tune'],
  [1960, 'Velvet Groove'],
  // 💛 THE ONE HEART ON THE RAIL. A quiet easter egg, and the only chapter that
  //    is not a circle. Nobody is told it is there.
  [2140, 'Smooth Drift', 'heart'],
  [2706, 'Night Groove'],
  [2935, 'Golden Hour'],
  [3110, 'Amber Lights'],
  [3310, 'Bright Horn'],
  [3506, 'Slow Rain'],
  [3689, 'Last Light'],
];

/** GAP is a percentage of the whole bar, so the visual gap between chapters
 *  stays even at any width instead of growing on the long ones. */
const GAP = 0.7;
const SEGMENTS = CHAPTERS.map((c, i) => {
  const a0 = c[0];
  const a1 = i + 1 < CHAPTERS.length ? CHAPTERS[i + 1][0] : SONG_SECONDS;
  return {
    t: a0,
    title: c[1],
    mark: c[2],
    left: (a0 / SONG_SECONDS) * 100,
    width: Math.max(((a1 - a0) / SONG_SECONDS) * 100 - GAP, 0.6),
  };
});

/** The readout's rows, in order. Only the values change, so the labels are
 *  markup and the values are refs. */
const STAT_ROWS = [
  'FORMAT', 'LOUDNESS', 'PEAK', 'RMS', 'DOMINANT', 'ROLL-OFF', 'CREST',
  'BRIGHTNESS', 'TEXTURE', 'HEADROOM', 'BASS ENERGY', 'SPREAD', 'NOTE', 'ANALYSER',
];

const MIN_IDLE = '◷  one quiet minute';
const NOTES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];

export default function Room() {
  const dockRef = useRef(null);
  const roomRef = useRef(null);
  const xRef = useRef(null);
  const themeRef = useRef(null);
  const eqRefs = useRef([]);
  const dpRef = useRef(null);
  const specRef = useRef(null);
  const bandRefs = useRef([]);
  const chRef = useRef(null);
  const chbRef = useRef(null);
  const chtRef = useRef(null);
  const chnRef = useRef(null);
  const cwrapRef = useRef(null);
  const segRefs = useRef([]);
  const dotRefs = useRef([]);
  const playRef = useRef(null);
  const auRef = useRef(null);
  const statRefs = useRef([]);
  const orbRef = useRef(null);
  const phRef = useRef(null);
  const cdRef = useRef(null);
  const capRef = useRef(null);
  const minRef = useRef(null);
  const afterRef = useRef(null);
  const afHRef = useRef(null);
  const afFeelRef = useRef(null);
  const afSciRef = useRef(null);
  const afSpendRef = useRef(null);
  const thRefs = useRef([]);
  const sheetRef = useRef(null);
  const scrimRef = useRef(null);
  const listRef = useRef(null);
  const shxRef = useRef(null);

  useEffect(() => {
    const D = document;
    const dock = dockRef.current;
    const room = roomRef.current;
    if (!dock || !room) return undefined;

    let reduce = false;
    try {
      reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
      /* no matchMedia: assume motion is fine */
    }

    // ── the element ────────────────────────────────────────────────────────
    // ☠️ A <video>, NOT new Audio() — AND THIS IS THE WHOLE FIX. Measured in
    // headless Chrome under BOTH mobile autoplay policies:
    //
    //   muted new Audio().play()          → REJECTED NotAllowedError
    //   muted <video playsinline>.play()  → RESOLVED, currentTime advancing
    //
    // The "muted media may autoplay" concession every browser grants is a VIDEO
    // privilege. An <audio> element is refused muted exactly as it is refused
    // unmuted, so the silent warm-up could never even start while the carrier
    // was new Audio(). Same file, same HTMLMediaElement API, same
    // MediaElementSource into the analyser. It carries no picture: the m4a is
    // audio-only, so videoWidth is 0.
    const a = D.createElement('video');
    // playsinline BOTH ways, or iOS takes the stream fullscreen instead of
    // playing it behind the page.
    a.playsInline = true;
    a.setAttribute('playsinline', '');
    a.setAttribute('webkit-playsinline', '');
    a.setAttribute('disableremoteplayback', '');
    // It must be IN the document (WebKit will not autoplay a detached element)
    // but never display:none, which is grounds for refusing to decode. One
    // transparent pixel parked off-stage, untouchable.
    a.style.cssText =
      'position:fixed;left:-9999px;top:0;width:1px;height:1px;opacity:0;pointer-events:none';
    // crossOrigin BEFORE src, always. A tainted stream makes the AnalyserNode
    // read pure silence, so the whole wall would draw a dead flat line and look
    // broken rather than look wrong.
    a.crossOrigin = 'anonymous';
    // coarse pointer = a phone or tablet = the phone rendition (and, below, the
    // gesture-gated load-time ask). Decided once, here, before src.
    let coarse = false;
    try {
      coarse = matchMedia('(pointer: coarse)').matches;
    } catch (e) {
      /* no matchMedia: treat as a desktop */
    }
    // ☠️ 'metadata' IS NOT SMALL ON WEBKIT: measured, the element pulled the
    // ENTIRE 96 MB master before anybody touched anything, while Chrome fetched
    // 140 KB. 'none' fetches nothing until play() asks.
    a.preload = 'none';
    a.loop = true;
    a.volume = 0;
    // ── 📶 NO SRC UNTIL A GESTURE ASKS FOR ONE ─────────────────────────────
    // ☠️ preload='none' IS NOT ENOUGH ON ITS OWN, and this was measured, not
    // assumed. With the src assigned at mount, a no-gesture page load fetched
    // the 96 MB master anyway: once on /cinema-lab and THREE times on /, which
    // reached readyState 4 (enough data) without anybody touching the page.
    // play() forces the resource selection algorithm no matter what preload
    // says, and the desktop branch used to call play() at load. While a media
    // element is loading it also holds the delaying-the-load-event flag, which
    // is the mechanism behind a navigation that waits on 'load' hanging.
    //
    // So the element now has NO src until the first gesture. Assignment and the
    // opener seed both happen inside ensureSrc(), which every path that could
    // start audio calls first. A visitor who never touches the page costs
    // exactly zero bytes, which was always this room's stated law: the desktop
    // load-time autoplay was the one exception, and it is withdrawn.
    let srcArmed = false;
    function ensureSrc() {
      if (srcArmed) return;
      srcArmed = true;
      a.src = coarse ? SONG_PHONE : SONG;
      // The opener is seeded as the spec's "default playback start position":
      // a currentTime set at HAVE_NOTHING is applied when metadata lands, and
      // both engines honour it. ☠️ NO-REWIND: the same assignment inside the
      // un-mute path never takes, so it must happen while the element is cold,
      // which is here, in the same task as the src.
      try {
        a.currentTime = SD_START;
      } catch (e) {
        /* cold element refused the seek: the metadata handler will retry */
      }
    }
    a.addEventListener(
      'loadedmetadata',
      () => {
        try {
          if (a.currentTime < 1 && !started) a.currentTime = SD_START;
        } catch (e) {
          /* nothing to do: the song simply opens at 0:00 */
        }
      },
      { once: true },
    );
    (D.body || D.documentElement).appendChild(a);

    // 🔕 THE RINGER SWITCH. An iPhone defaults a web page to the 'ambient' audio
    // session, which the hardware mute switch silences OUTRIGHT, so a visitor
    // whose ringer is off gets a page that has done everything right, reports
    // itself playing, and makes no sound. Declaring 'playback' opts out of that
    // switch. Safari-only and feature-detected.
    try {
      if (navigator.audioSession) navigator.audioSession.type = 'playback';
    } catch (e) {
      /* not Safari */
    }

    // The song's display identity, everywhere. Never the real title.
    try {
      if (navigator.mediaSession) {
        navigator.mediaSession.metadata = new window.MediaMetadata({
          title: 'Thank you.',
          artist: 'DentaSource Direct',
          artwork: [{ src: '/cinema/brand/dsd-round.png', sizes: '512x512', type: 'image/png' }],
        });
      }
    } catch (e) {
      /* no Media Session: the lock screen simply shows nothing */
    }

    // ── 🔇→🔊 THE MUTED WARM-UP ─────────────────────────────────────────────
    // WebKit's policy, verbatim: muted media may autoplay, but "if a video
    // element gains an audio track or becomes un-muted without a user gesture,
    // playback will pause." THIS BUYS NO SOUND WITHOUT A GESTURE, and nothing
    // can; do not let anyone improve it into a promise the platform forbids.
    //
    // What it DOES buy is the failure we were losing to. A cold play() must
    // reach the network before it can commit, and both engines drop the
    // activation if the commitment does not land promptly inside the gesture.
    // Flipping 'muted' on an element that is ALREADY decoding is synchronous,
    // so the gesture we do get is far more likely to convert.
    //
    // 📶 It starts ON FIRST CONTACT, never on load: a visitor who never touches
    // the page pays 0 KB. The 20s cap saves no bytes on its own (Chrome takes
    // its whole ~6 MB buffer in one burst) but it stops the decode and stops a
    // long idle session from buffering further. It is not the data-saver and
    // must not be sold as one; the data-saver is WHEN we start.
    let warmCap = 0;
    let capped = false;
    let userPaused = false;
    // 🎬 THE THIRD LEGITIMATE PAUSE. 'suppressed' = a showcase video or the marble
    // theater is speaking and we stood aside for it; 'reelOn' = it still is. Both
    // ride the same seam as userPaused and capped, so the revocation handler keeps
    // its hands off them. See THE VIDEO ETIQUETTE below.
    let suppressed = false;
    let reelOn = false;
    function warmRun() {
      capped = false;
      ensureSrc();
      a.muted = true;
      a.play()
        .then(() => {
          clearTimeout(warmCap);
          warmCap = setTimeout(() => {
            if (a.muted && !a.paused) {
              capped = true;
              a.pause();
            }
          }, 20000);
        })
        .catch(() => {
          // Leave it MUTED. A rejected warm-up is usually transient, and
          // un-muting here was observed to hand back an element that later
          // started ALOUD with no gesture behind it.
        });
    }
    function warmUp() {
      // 🚦 And never at all for someone who has ASKED to be spared. Data Saver,
      // 2g and 3g opt out completely; tap-to-play still works untouched.
      try {
        const c = navigator.connection;
        if (c && (c.saveData || /^[23]g$/.test(c.effectiveType || ''))) return;
      } catch (e) {
        /* no Network Information API */
      }
      warmRun();
    }

    /** The only definition of "they can hear it" that matters.
     *  ☠️ NOT a volume test. The element starts at volume 0 on purpose and the
     *  1.2s fade is OURS to run; gating on volume here would deadlock the page
     *  into permanent silence. */
    function audible() {
      return !a.paused && !a.muted;
    }

    let started = false;
    /** The 1.2s entry ramp. It is a volume curve, not a visual one, so reduced
     *  motion keeps the fade (an abrupt start is the harsher experience) but
     *  runs it on a coarse timer: no requestAnimationFrame anywhere in this room
     *  once a visitor has asked for less motion. */
    function fadeIn() {
      const t0 = performance.now();
      const set = () => {
        const k = Math.min(1, (performance.now() - t0) / 1200);
        try {
          a.volume = 0.6 * k;
        } catch (e) {
          /* volume is read-only on iOS: the element plays at system volume */
        }
        return k >= 1;
      };
      if (reduce) {
        const iv = setInterval(() => {
          if (set()) clearInterval(iv);
        }, 50);
        return;
      }
      const step = () => {
        if (!set()) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }

    // ☠️ A 'playing' EVENT IS NOT SOUND. THIS COST THE WHOLE FEATURE ONCE:
    //   0.01s  play() called, EVT play, EVT waiting   (no track loaded yet)
    //   2.52s  EVT canplay, EVT playing, play RESOLVED ← we believed this
    //   2.56s  EVT pause {paused:true}                 ← 40ms later, gone
    // Chrome lets an unmuted play() succeed on a media element whose audio track
    // has not arrived, then applies the autoplay policy and PAUSES it the
    // instant it sees one. So commitment now requires the clock to have MOVED:
    // we look, wait 420ms, and look again.
    let confirming = 0;
    let everCommitted = false;
    let touched = false;
    // volumechange can fire before the transport is wired; paint() is a function
    // declaration and hoists, but the elements it writes to are read later.
    let paintReady = false;

    function commit() {
      started = true;
      disarm();
      clearTimeout(warmCap);
      dock.classList.remove('idle');
      dock.setAttribute('aria-label', 'Open the music room');
      if (everCommitted) return;
      everCommitted = true;
      fadeIn();
      cheap();
    }
    /** Sound did not survive. Put the invitation back, re-arm every gesture, and
     *  go back to running silently so the next one only has to un-mute. */
    function fallBack() {
      started = false;
      clearTimeout(confirming);
      confirming = 0;
      dock.classList.add('idle');
      dock.setAttribute('aria-label', 'Play the music and open the room');
      arm();
      // ☠️ ONLY IF THEY HAVE ACTUALLY TOUCHED THE PAGE. Without this guard a
      // load-time phantom start gets revoked, this handler runs, and the warm-up
      // spends megabytes on somebody who never lifted a finger.
      if (touched) warmUp();
    }
    function onPlaying() {
      // A MUTED element is "playing" and nobody hears it, so the dock must stay
      // in its TAP TO PLAY state and the arming must stay live. Only real sound
      // retires the invitation.
      if (!audible() || started || confirming) return;
      const mark = a.currentTime;
      confirming = setTimeout(() => {
        confirming = 0;
        if (audible() && a.currentTime > mark) commit();
        else fallBack();
      }, 420);
    }
    // ☠️ REVOCATION CAN ARRIVE AFTER COMMITMENT, measured: Chrome let the piece
    // play a real 0.70s and pulled it 740ms after we committed. Whatever the
    // platform takes back, the page must ASK AGAIN rather than sit there showing
    // an equaliser over silence. Two pauses are legitimate and must not trigger
    // this: the visitor's own ❙❙, and our 20s data cap.
    function onPause() {
      if (userPaused || capped || suppressed) return;
      fallBack();
    }
    function onVolumeChange() {
      // 'playing' does NOT fire when a running element is un-muted; it is already
      // playing. 'volumechange' does, and it is the ONLY signal the warm-up path
      // has that the flip took. It is also the only signal the equaliser's gate
      // has that silence just became sound, so the transport repaint rides along.
      if (!started && audible()) onPlaying();
      if (paintReady) paint();
    }
    a.addEventListener('pause', onPause);
    a.addEventListener('playing', onPlaying);
    a.addEventListener('volumechange', onVolumeChange);

    // AUDIBLE AUTOPLAY WITH ZERO GESTURES IS BLOCKED BY EVERY MOBILE BROWSER.
    // So: ask anyway, and on rejection arm PERSISTENT listeners.
    // ☠️ ARM THE RELEASE, NOT JUST THE PRESS. iOS hands out media activation on
    // the END of a gesture (touchend / pointerup / click) and commonly refuses
    // it for a scroll flick outright, so listening only to touchstart was asking
    // at the one moment iOS says no. 'scroll' is safe here because these are not
    // 'once' listeners: a scroll that cannot grant activation simply fails and
    // costs nothing, while on Android it is usually what starts the music.
    const armed = ['touchend', 'pointerup', 'click', 'pointerdown', 'touchstart', 'wheel', 'keydown', 'scroll'];
    /** ☠️ THE ARMED LISTENERS GO THROUGH HERE, NEVER STRAIGHT TO kick(). An ambient
     *  gesture must not start the song over a video that is already speaking, which
     *  is the same rule FloatingLounge keeps with its reelOn check. A deliberate ask
     *  (the dock, ▶, a chapter tap) still calls kick() directly and still wins. */
    function kickAmbient() {
      if (reelOn) return;
      kick();
    }
    function arm() {
      for (let i = 0; i < armed.length; i++) {
        D.addEventListener(armed[i], kickAmbient, { capture: true, passive: true });
      }
    }
    function disarm() {
      for (let i = 0; i < armed.length; i++) D.removeEventListener(armed[i], kickAmbient, true);
    }
    function kick() {
      touched = true;
      // the gesture is what buys the bytes; nothing is fetched before this line
      ensureSrc();
      graph();
      if (a.muted) {
        // The cheap ask: a synchronous property flip on a running element.
        clearTimeout(warmCap);
        a.muted = false;
        if (a.paused) a.play().catch(() => {});
        // GUARD, READ THE FLIP BACK. WebKit PAUSES media un-muted without a
        // valid gesture, and a browser is free to refuse the property outright.
        // Either way go back to running silently rather than leaving a dead
        // element behind, and stay armed so the next gesture gets its turn.
        setTimeout(() => {
          if (!started && (a.paused || a.muted)) warmUp();
        }, 260);
        return;
      }
      // This gesture asks for real sound. If the platform refuses it, spend the
      // refusal on the warm-up: go silent-running now so the NEXT gesture only
      // has to flip a boolean.
      a.play().catch(() => {
        warmUp();
      });
    }

    // ── ☠️ THERE IS NO LOAD-TIME ASK ANY MORE ──────────────────────────────
    // FFC calls play() at load on a desktop, reasoning that a machine which
    // permits autoplay should have the music going before the first beat is
    // read. On a phone it already refused to, because Chrome optimistically
    // resolves play() before the audio track lands, grabs megabytes of buffer,
    // THEN applies the policy and pauses: the visitor hears nothing and pays
    // for it. Measured here, the desktop branch was just as expensive and
    // costlier still on this site, because it is the one thing that can hold a
    // navigation waiting on 'load'.
    // So every device now waits for contact. The armed list includes scroll and
    // wheel, and this is a scroll-driven site, so on a desktop the music still
    // starts within about a second of arrival; the difference is that it starts
    // because somebody moved, not because a page opened.
    arm();

    // ── the graph ──────────────────────────────────────────────────────────
    // Built on the FIRST GESTURE, never before: routing an element through a
    // SUSPENDED AudioContext plays silence, so the plain element owns playback
    // until a gesture exists to resume a context with.
    let ctx = null;
    let an = null;
    let bins = null;
    let wave = null;
    function graph() {
      try {
        if (!ctx) {
          const AC = window.AudioContext || window.webkitAudioContext;
          if (!AC) return;
          ctx = new AC();
          an = ctx.createAnalyser();
          an.fftSize = 2048;
          an.smoothingTimeConstant = 0.8;
          ctx.createMediaElementSource(a).connect(an);
          an.connect(ctx.destination);
          bins = new Uint8Array(an.frequencyBinCount);
          // PEAK, RMS and CREST come from the WAVEFORM, not the spectrum: 128 is
          // silence in a byte-domain buffer.
          wave = new Uint8Array(an.fftSize);
        }
        if (ctx.state === 'suspended') ctx.resume();
      } catch (e) {
        ctx = null;
        an = null;
      }
    }
    D.addEventListener('pointerdown', graph, { capture: true, passive: true });
    // 🔌 COMING BACK. iOS moves an AudioContext to 'interrupted'/'suspended' on
    // a lock, a tab switch or a phone call and does NOT restore it on return, so
    // the music would come back to a wall drawing a dead flat line. Returning to
    // the page is itself the activation.
    function onVisibility() {
      if (!D.hidden && ctx && ctx.state !== 'running') {
        try {
          ctx.resume();
        } catch (e) {
          /* the next gesture will resume it */
        }
      }
    }
    D.addEventListener('visibilitychange', onVisibility);

    function read() {
      if (an && bins) {
        an.getByteFrequencyData(bins);
        return true;
      }
      return false;
    }
    /** Flat loudness this frame: drives the ambient wash's strength. */
    function level() {
      if (!bins) return 0;
      let s = 0;
      for (let i = 0; i < bins.length; i++) s += bins[i];
      return s / (bins.length * 255);
    }
    /** THE SPECTRAL CENTROID: the centre of mass of the sound in Hz, i.e. where
     *  the energy actually sits right now. The wash is tinted by THIS and not by
     *  an average, so a bright passage washes the room violet and a bassy one
     *  washes it red, exactly like the wall's own hue law. */
    function centroid() {
      if (!bins) return 200;
      const nyq = (ctx ? ctx.sampleRate : 44100) / 2;
      const per = nyq / bins.length;
      let num = 0;
      let den = 0;
      for (let i = 0; i < bins.length; i++) {
        num += i * per * bins[i];
        den += bins[i];
      }
      return den > 0 ? num / den : 200;
    }
    function energy(lo, hi) {
      if (!bins) return 0;
      const nyq = (ctx ? ctx.sampleRate : 44100) / 2;
      const per = nyq / bins.length;
      let v = 0;
      const i0 = Math.max(0, Math.floor(lo / per));
      const i1 = Math.min(bins.length - 1, Math.ceil(hi / per));
      for (let i = i0; i <= i1; i++) if (bins[i] > v) v = bins[i];
      return v / 255;
    }

    // ── ⏱ THE SCHEDULER ────────────────────────────────────────────────────
    // ☠️ NOTHING IN THIS ROOM FREE-RUNS WHILE NOTHING IS PLAYING. Measured by the
    // engine builder in Phase C: with prefers-reduced-motion on, the cinema and
    // the sky both stood down and this chunk was still asking for 61 animation
    // frames a second on an idle page. The cause was the dock's equaliser: it
    // started on the first confirmed sound and then never stopped, so one pause
    // left a 60 Hz loop running for the rest of the session to draw three bars
    // that are CONSTANTS whenever the music is not playing.
    //
    // Two rules now, and they are independent:
    //   1. a loop runs only while it has something to say. The equaliser writes
    //      its resting heights ONCE and stops the moment playback pauses.
    //   2. under reduced motion nothing uses requestAnimationFrame at all. The
    //      loops fall back to a calm interval, because a visitor who asked for
    //      less motion has not asked for a 60 Hz repaint of it.
    const LOW_HZ = 8;
    /** rAF when motion is welcome, a calm interval when it is not. Idempotent:
     *  start() on a running loop is a no-op, stop() always leaves nothing armed. */
    function makeLoop(step) {
      let raf = 0;
      let timer = 0;
      let on = false;
      return {
        start() {
          if (on) return;
          on = true;
          if (reduce) {
            step();
            timer = setInterval(step, 1000 / LOW_HZ);
          } else {
            const tick = (t) => {
              if (!on) return;
              raf = requestAnimationFrame(tick);
              step(t);
            };
            raf = requestAnimationFrame(tick);
          }
        },
        stop() {
          on = false;
          if (raf) {
            cancelAnimationFrame(raf);
            raf = 0;
          }
          if (timer) {
            clearInterval(timer);
            timer = 0;
          }
        },
      };
    }

    // ── the dock's three bars: the CHEAP loop, the only one that may run while
    //    the room is closed. ~20fps in rAF mode, three numbers, no canvas.
    const eq = eqRefs.current;
    let last = 0;
    function eqStep(t) {
      const now = t || performance.now();
      // the throttle belongs to the rAF path only; the interval is already calm
      if (!reduce && now - last < 50) return;
      last = now;
      const lit = read() && !a.paused;
      const v = [
        lit ? energy(40, 160) : 0.18,
        lit ? energy(300, 2000) : 0.3,
        lit ? energy(3000, 12000) : 0.22,
      ];
      for (let i = 0; i < eq.length; i++) {
        if (!eq[i]) continue;
        eq[i].style.height =
          (reduce ? 3 + v[i] * 6 : 3 + Math.min(1, v[i] * 1.25) * 12).toFixed(1) + 'px';
      }
    }
    const eqLoop = makeLoop(eqStep);
    function cheap() {
      eqLoop.start();
    }

    // ── the wall ───────────────────────────────────────────────────────────
    const cv = specRef.current;
    const c2 = cv.getContext('2d');
    const peaks = new Array(BARS).fill(0);
    let agc = AGC_F;

    function wallStep() {
      const lit = read() && !a.paused && !reduce;
      agc = drawSpectrum(c2, cv, {
        lit,
        reduce,
        peaks,
        agc,
        bins,
        sampleRate: ctx ? ctx.sampleRate : 44100,
        energy,
        level,
        centroid,
      });
      orb();
      paintBands(bandRefs.current, lit, energy);
    }
    const wallLoop = makeLoop(wallStep);

    // ── 🔬 THE AUDIOPHILE READOUT ──────────────────────────────────────────
    // Every live number below comes from OUR analyser, computed the way the
    // desk's own panel computes it, rather than plausible-looking numbers
    // invented to fill a table. It runs ONLY while the expander is open, at a
    // calm ~5 Hz: this is a thing to read, not a thing to watch flicker.
    const dB = (x) => (x <= 0 ? -Infinity : 20 * Math.log10(x));
    /** Nearest note, A4 = 440, twelve equal steps to the octave. The cents
     *  offset is the honest part: it says how close the reading really is. */
    function noteOf(hz) {
      if (!hz || hz < 16) return '—';
      const semis = (12 * Math.log(hz / 440)) / Math.LN2;
      const nearest = Math.round(semis);
      const cents = Math.round((semis - nearest) * 100);
      const idx = (((nearest + 9) % 12) + 12) % 12;
      const octave = 4 + Math.floor((nearest + 9) / 12);
      return NOTES[idx] + octave + '  ' + (cents >= 0 ? '+' : '') + cents + '¢';
    }
    function metrics() {
      if (!an || !bins || !wave || a.paused) return null;
      an.getByteFrequencyData(bins);
      an.getByteTimeDomainData(wave);
      const n = bins.length;
      const per = ctx.sampleRate / 2 / n;

      // peak + RMS from the waveform
      let peak = 0;
      let sq = 0;
      for (let i = 0; i < wave.length; i++) {
        const v = (wave[i] - 128) / 128;
        const ab = v < 0 ? -v : v;
        if (ab > peak) peak = ab;
        sq += v * v;
      }
      const rms = Math.sqrt(sq / wave.length);

      // where the energy is, and where it stops
      let domBin = 0;
      let domVal = -1;
      let rolloff = 0;
      for (let j = 0; j < n; j++) {
        if (bins[j] > domVal) {
          domVal = bins[j];
          domBin = j;
        }
        if (bins[j] > 12) rolloff = j; // last bin carrying real signal
      }

      // centroid + flatness in one pass. Flatness is the geometric mean over the
      // arithmetic mean (1 for noise, ~0 for a tone) taken in the LOG domain, so
      // one silent bin cannot zero the whole product.
      let wsum = 0;
      let msum = 0;
      let logSum = 0;
      let counted = 0;
      for (let k = 1; k < n; k++) {
        const mg = bins[k] / 255;
        if (mg <= 0) continue;
        wsum += k * per * mg;
        msum += mg;
        logSum += Math.log(mg);
        counted++;
      }
      const centroidHz = msum > 0 ? wsum / msum : 0;
      const flatness =
        counted > 0 && msum > 0 ? Math.min(1, Math.exp(logSum / counted) / (msum / counted)) : 0;

      const bassEnd = Math.max(1, Math.round(160 / per));
      let bassSum = 0;
      for (let b = 0; b < bassEnd && b < n; b++) bassSum += bins[b];

      return {
        peakDb: dB(peak),
        rmsDb: dB(rms),
        crestDb: peak > 0 && rms > 0 ? dB(peak) - dB(rms) : 0,
        dominantHz: Math.round(domBin * per),
        rolloffHz: Math.round(rolloff * per),
        centroidHz: Math.round(centroidHz),
        flatness,
        bass: bassSum / (bassEnd * 255),
      };
    }
    let statsTimer = 0;
    function paintStats() {
      const m = metrics();
      const num = (x) => x.toLocaleString();
      const d = (x) => (Number.isFinite(x) ? x.toFixed(1) + ' dB' : '−∞ dB');
      // OUR real analyser config, read from the live context, never copied.
      const sp =
        an && ctx
          ? an.frequencyBinCount + ' bands · ' + (ctx.sampleRate / 1000).toFixed(1) + ' kHz · FFT ' + an.fftSize
          : '—';
      const values = [
        'AAC-LC · 192 kbps · 44.1 kHz · stereo',
        'EBU R128 · −16 LUFS · TP −1.5',
        m ? d(m.peakDb) : '—',
        m ? d(m.rmsDb) : '—',
        m && m.dominantHz ? num(m.dominantHz) + ' Hz' : '—',
        m && m.rolloffHz ? (m.rolloffHz / 1000).toFixed(1) + ' kHz' : '—',
        m && m.crestDb ? m.crestDb.toFixed(1) + ' dB' : '—',
        m && m.centroidHz ? num(m.centroidHz) + ' Hz' : '—',
        m ? Math.round(m.flatness * 100) + '% noise · ' + Math.round((1 - m.flatness) * 100) + '% tone' : '—',
        m && Number.isFinite(m.peakDb) ? Math.abs(m.peakDb).toFixed(1) + ' dB to clip' : '—',
        m ? Math.round(m.bass * 100) + '% · <160 Hz' : '—',
        m && m.rolloffHz ? (m.rolloffHz / 1000).toFixed(1) + ' kHz usable band' : '—',
        m && m.dominantHz ? noteOf(m.dominantHz) : '—',
        sp,
      ];
      for (let i = 0; i < values.length; i++) {
        const el = statRefs.current[i];
        if (el) el.textContent = values[i];
      }
    }
    function statsOn() {
      if (statsTimer) return;
      graph(); // opening the panel is a gesture too
      paintStats();
      statsTimer = setInterval(paintStats, 200); // ~5 Hz, calm to read
    }
    function statsOff() {
      clearInterval(statsTimer);
      statsTimer = 0;
    }
    const au = auRef.current;
    function onToggle() {
      if (au.open) statsOn();
      else statsOff();
    }
    au.addEventListener('toggle', onToggle);

    // ── the thought stream ─────────────────────────────────────────────────
    // A shuffle DECK, not a redraw: all of them, then a new deal, so a line
    // cannot come round twice before the round is over.
    const slots = thRefs.current;
    let act = 0;
    let deck = [];
    let prevIdx = -1;
    let thTimer = 0;
    function nextThought() {
      if (!deck.length) deck = deal(prevIdx);
      prevIdx = deck.shift();
      // double-buffer: write to the hidden span, then cross-fade. The text of a
      // visible node is never touched (the iPhone ghosting fix).
      const cur = slots[act];
      const nxt = slots[1 - act];
      if (!cur || !nxt) return;
      nxt.textContent = THOUGHTS[prevIdx];
      // two lines, never three: step the size down until this thought fits
      let fs = 17;
      nxt.style.fontSize = fs + 'px';
      while (fs > 11 && nxt.scrollHeight > fs * 1.4 * 2 + 4) {
        fs -= 0.5;
        nxt.style.fontSize = fs + 'px';
      }
      cur.classList.remove('on');
      nxt.classList.add('on');
      act = 1 - act;
      thTimer = setTimeout(nextThought, 7000);
    }

    // ── THE BREATH ─────────────────────────────────────────────────────────
    let mode = 0;
    let cycleT0 = 0;
    const orbCv = orbRef.current;
    const orbC2 = orbCv.getContext('2d');
    const phEl = phRef.current;
    const cdEl = cdRef.current;
    const capEl = capRef.current;
    const sheet = sheetRef.current;
    const scrim = scrimRef.current;
    const list = listRef.current;
    let lastPhase = -1;

    function paintCap() {
      capEl.textContent = '';
      const b = D.createElement('b');
      b.textContent = MODES[mode][0];
      capEl.appendChild(b);
      capEl.appendChild(D.createTextNode(' · tap to change'));
    }
    paintCap();

    // ── ◷ one quiet minute → ✨ the afterglow ──────────────────────────────
    // The countdown reads performance.now(), same law as the breath clock: a
    // minute that is not a minute would be a small lie in a room built on
    // honesty. While it runs the pill is a BARE CLOCK; the words come after,
    // when they are earned. At zero the afterglow blooms. Tapping mid-run
    // cancels quietly. No sound, ever: the reward for a quiet minute is never a
    // loud thing.
    const minEl = minRef.current;
    const afEl = afterRef.current;
    let minT0 = 0;
    let minTick = 0;
    function afHide() {
      afEl.hidden = true;
    }
    function afShow() {
      const card = AFTER[mode] || AFTER[0];
      afHRef.current.textContent = card.h;
      afFeelRef.current.textContent = card.feel;
      afSciRef.current.textContent = card.sci;
      afSpendRef.current.textContent = card.spend;
      afEl.hidden = false;
      afEl.focus({ preventScroll: true });
    }
    function minReset() {
      clearInterval(minTick);
      minTick = 0;
      minT0 = 0;
      minEl.classList.remove('run');
      minEl.textContent = MIN_IDLE;
      minEl.setAttribute('aria-label', 'Breathe with the orb for one quiet minute');
    }
    function minPaint() {
      const left = Math.max(0, 60 - Math.floor((performance.now() - minT0) / 1000));
      if (left > 0) {
        // the bare clock: no words while counting; 60 introduces itself as 1:00
        const mm = Math.floor(left / 60);
        const ss = left % 60;
        minEl.textContent = '◷  ' + mm + ':' + (ss < 10 ? '0' : '') + ss;
        return;
      }
      minReset();
      afShow();
    }
    function onMin() {
      graph(); // a tap is a gesture; feed the audio graph
      if (minTick) {
        minReset();
        return;
      }
      afHide(); // a fresh minute clears the old card
      minT0 = performance.now();
      minEl.classList.add('run');
      minEl.setAttribute('aria-label', 'Counting down one quiet minute. Tap again to stop early.');
      minPaint();
      minTick = setInterval(minPaint, 250); // fast enough that no shown second is stale
    }
    function onAfterKey(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        afHide();
      }
    }
    minEl.addEventListener('click', onMin);
    afEl.addEventListener('click', afHide);
    afEl.addEventListener('keydown', onAfterKey);

    function selectMode(i) {
      if (i < 0 || i >= MODES.length) return;
      mode = i;
      cycleT0 = 0; // restart the cycle so the new pattern begins at its inhale
      const cards = list.children;
      for (let k = 0; k < cards.length; k++) {
        const on = k === i;
        cards[k].classList.toggle('sel', on);
        cards[k].setAttribute('aria-selected', String(on));
      }
      paintCap();
      afHide(); // a card describes the breath that EARNED it, never the next one
    }

    // ── the sheet ──
    // Tapping the orb asks the question; choosing answers it and gets out of the
    // way. Closing by ✕ or by tapping outside changes NOTHING.
    let sheetOpen = false;
    function openSheet() {
      if (sheetOpen) return;
      sheetOpen = true;
      scrim.hidden = false;
      sheet.hidden = false;
      const sel = list.querySelector('.tx-mode.sel');
      if (sel) sel.scrollIntoView({ block: 'nearest' });
      shxRef.current.focus();
    }
    function closeSheet() {
      if (!sheetOpen) return;
      sheetOpen = false;
      scrim.hidden = true;
      sheet.hidden = true;
      orbCv.focus();
    }
    function onOrbKey(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openSheet();
      }
    }
    function onListClick(e) {
      const card = e.target.closest ? e.target.closest('.tx-mode') : null;
      if (!card) return;
      selectMode(+card.getAttribute('data-i'));
      closeSheet();
    }
    orbCv.addEventListener('click', openSheet);
    orbCv.addEventListener('keydown', onOrbKey);
    shxRef.current.addEventListener('click', closeSheet);
    scrim.addEventListener('click', closeSheet);
    list.addEventListener('click', onListClick);

    /** Drawn every frame by the wall's own loop, so the breath and the music are
     *  one instrument. Reads the clock itself; the words are inked here. */
    function orb() {
      const now = performance.now();
      if (!cycleT0) cycleT0 = now;
      const bassNow = read() && !a.paused ? energy(30, 140) : 0.2;
      const { phase, left } = drawOrb(orbC2, orbCv, {
        mode: MODES[mode],
        cycleT0,
        now,
        reduce,
        bassNow,
      });
      if (phase !== lastPhase) {
        lastPhase = phase;
        phEl.textContent = LABELS[phase];
        // The phase tints the words: rising, held, falling.
        phEl.style.color =
          phase === 0
            ? 'rgba(110,231,183,.92)'
            : phase === 2
              ? 'rgba(150,205,235,.85)'
              : 'rgba(236,253,245,.8)';
      }
      cdEl.textContent = Math.ceil(left) + '';
    }

    // ── 📖 THE CHAPTER RAIL ────────────────────────────────────────────────
    const chEl = chRef.current;
    const chBar = chbRef.current;
    const chWrap = cwrapRef.current;
    const chT = chtRef.current;
    const chN = chnRef.current;
    const segs = segRefs.current;
    const dots = dotRefs.current;
    // The base class is REMEMBERED, because paintCh() rewrites className every
    // time the chapter changes: writing 'tx-cdot' flat there would quietly strip
    // the heart off the rail the first time the playhead moved.
    const dotBase = SEGMENTS.map((s) => 'tx-cdot' + (s.mark === 'heart' ? ' tx-heart' : ''));
    let curCh = -1;

    function clock(t) {
      const w = Math.max(0, Math.floor(t));
      const h = Math.floor(w / 3600);
      const m = Math.floor((w % 3600) / 60);
      const s2 = w % 60;
      return (h ? h + ':' + (m < 10 ? '0' : '') + m : '' + m) + ':' + (s2 < 10 ? '0' : '') + s2;
    }
    function chapterAt(t) {
      let i = 0;
      for (let j = 0; j < CHAPTERS.length; j++) if (t >= CHAPTERS[j][0]) i = j;
      return i;
    }
    function paintCh() {
      const t = a.currentTime || 0;
      const i = chapterAt(t);
      for (let j = 0; j < segs.length; j++) {
        if (!segs[j]) continue;
        const b0 = CHAPTERS[j][0];
        const b1 = j + 1 < CHAPTERS.length ? CHAPTERS[j + 1][0] : SONG_SECONDS;
        const k = t <= b0 ? 0 : t >= b1 ? 1 : (t - b0) / (b1 - b0);
        segs[j].firstChild.style.width = k * 100 + '%';
      }
      if (i !== curCh) {
        curCh = i;
        chT.textContent = CHAPTERS[i][1];
        for (let d = 0; d < dots.length; d++) {
          if (dots[d]) dots[d].className = dotBase[d] + (d === i ? ' on' : '');
        }
        for (let e2 = 0; e2 < segs.length; e2++) {
          if (segs[e2]) segs[e2].className = 'tx-cs' + (e2 === i ? ' on' : '');
        }
        chBar.setAttribute('aria-valuetext', CHAPTERS[i][1]);
      }
      chN.textContent = clock(t) + ' / ' + clock(SONG_SECONDS);
      chBar.setAttribute('aria-valuenow', Math.floor(t));
    }
    // 'timeupdate' fires ~4x a second, which is plenty for a 65-minute bar and
    // costs nothing next to putting this in the wall's rAF loop.
    a.addEventListener('timeupdate', paintCh);
    a.addEventListener('seeked', paintCh);

    /** Seek, and treat the tap as what it also is: a GESTURE. Tapping a chapter
     *  on a page whose sound the platform has refused should both move the
     *  playhead AND make the ask. */
    function seekTo(t) {
      try {
        a.currentTime = Math.max(0, Math.min(SONG_SECONDS - 1, t));
      } catch (e) {
        /* not seekable yet: the rail still repaints from the clock */
      }
      paintCh();
      kick();
    }
    // Tap anywhere = seek proportionally; tap near a marker = open that chapter
    // at its first note. SNAP is in pixels, so the "near" zone feels the same
    // whatever the screen width.
    const SNAP = 13;
    function onBarClick(ev) {
      const r = chWrap.getBoundingClientRect();
      if (!r.width) return;
      const x = ev.clientX - r.left;
      const frac = Math.max(0, Math.min(1, x / r.width));
      let best = -1;
      let bestPx = 1e9;
      for (let j = 0; j < CHAPTERS.length; j++) {
        const px = Math.abs((CHAPTERS[j][0] / SONG_SECONDS) * r.width - x);
        if (px < bestPx) {
          bestPx = px;
          best = j;
        }
      }
      seekTo(bestPx <= SNAP ? CHAPTERS[best][0] : frac * SONG_SECONDS);
      show();
    }
    function onBarKey(ev) {
      const k = ev.key;
      const i = chapterAt(a.currentTime || 0);
      if (k === 'ArrowRight') seekTo((a.currentTime || 0) + 30);
      else if (k === 'ArrowLeft') seekTo((a.currentTime || 0) - 30);
      else if (k === 'PageDown') seekTo(CHAPTERS[Math.min(CHAPTERS.length - 1, i + 1)][0]);
      else if (k === 'PageUp') seekTo(CHAPTERS[Math.max(0, i - 1)][0]);
      else if (k === 'Home') seekTo(0);
      else return;
      ev.preventDefault();
      show();
    }
    chBar.addEventListener('click', onBarClick);
    chBar.addEventListener('keydown', onBarKey);

    // ── the 2-second auto-hide ─────────────────────────────────────────────
    let hideT = 0;
    function show() {
      chEl.classList.remove('tx-hid');
      clearTimeout(hideT);
      hideT = setTimeout(() => chEl.classList.add('tx-hid'), 2000);
    }
    // Any contact with the room brings it back, including a plain pointermove,
    // so on a desktop it reappears under the cursor without a click.
    const wake = ['pointermove', 'pointerdown', 'touchstart', 'wheel', 'scroll', 'keydown'];
    for (let wi = 0; wi < wake.length; wi++) {
      room.addEventListener(wake[wi], show, { capture: true, passive: true });
    }
    paintCh();

    // ── ▶ THE TRANSPORT ────────────────────────────────────────────────────
    // The one play/pause control, on the rail rather than standing alone above
    // the wall. Same intent flag, same kick(), same dock mirroring, because that
    // logic is what keeps a refused platform ask honest.
    const pp = playRef.current;
    function paint() {
      const p = a.paused;
      pp.textContent = p ? '▶' : '❙❙';
      pp.setAttribute('aria-label', p ? 'Play the music' : 'Pause the music');
      if (dpRef.current) dpRef.current.textContent = p ? '▶' : '❙❙';
      // ⏱ THE GATE. ☠️ THE TEST IS audible(), NOT !a.paused, and the difference is
      // the whole bug. A muted warm-up is NOT paused — and it cannot be paused, by
      // design: the revocation handler reads any pause it did not authorise as the
      // platform taking sound away and goes straight back to silent running. So a
      // gate on `paused` left the equaliser looping at 60 Hz over an analyser that
      // was reading silence, drawing three bars at their 3px resting height.
      // Nothing to hear means nothing to draw: write the resting heights once and
      // stand down. Real sound re-arms it, which is why volumechange repaints too.
      if (!audible()) {
        eqStep();
        eqLoop.stop();
      } else {
        eqLoop.start();
      }
    }
    function onPlayClick() {
      graph();
      // A manual press always wins over auto-resume: whatever a speaking video did
      // to this player, the visitor has just overruled it.
      suppressed = false;
      // Pressing it counts as touching the rail, so the bar stays up for another
      // 2s instead of fading out from under the finger.
      show();
      // Record the INTENT, so the revocation handler can tell a deliberate ❙❙
      // apart from the platform yanking the sound away.
      if (a.paused) {
        userPaused = false;
        kick();
      } else {
        userPaused = true;
        a.pause();
      }
    }
    pp.addEventListener('click', onPlayClick);
    a.addEventListener('play', paint);
    a.addEventListener('pause', paint);
    paintReady = true;
    paint();

    // ── 🎬 THE VIDEO ETIQUETTE — one audio source at a time ──────────────────
    // The site already coordinates its audio through one window event:
    //   window.dispatchEvent(new CustomEvent('dsd:videoaudio', { detail: { on } }))
    // fired by the home VideoShowcase as a reel takes the centre of the screen,
    // and by GlassMarbles / ArticleMarbles as the theater opens and closes.
    // FloatingLounge and FocusMusic both answer it the same way, and so does this
    // room: stand aside while a video speaks, come back when it stops, and only if
    // WE were the one who stepped away. It replaces FFC's __txHush / __txEnsurePlay
    // window bridges, which were function calls into a page that no longer exists.
    //
    // ☠️ THE TEST IS audible(), NOT !a.paused. The muted warm-up is "not paused"
    // and makes no sound, so suppressing it would set the resume flag on silence
    // and then hand the reel's ending an un-mute nobody asked for. Only real,
    // hearable music is worth standing aside for.
    function onVideoAudio(e) {
      reelOn = !!(e.detail && e.detail.on);
      if (reelOn) {
        if (audible()) {
          suppressed = true;
          clearTimeout(warmCap);
          a.pause();
        }
      } else if (suppressed) {
        suppressed = false;
        // Same resume path as the visitor's own ▶: intent recorded, kick() rides,
        // so a platform refusal still falls back cleanly and the dock stays honest.
        userPaused = false;
        kick();
      }
    }
    window.addEventListener('dsd:videoaudio', onVideoAudio);

    // ── open / close ───────────────────────────────────────────────────────
    // 📢 THE ROOM SAYS WHEN IT HOLDS THE SCREEN. The stage is opaque, so while
    // the room is open the scroll cinema behind it is painting frames nobody can
    // see. CSS can hide the canvas but it cannot stop a rAF loop, so the room
    // announces itself and the engine idles on its own terms:
    //   window.addEventListener('dsd:room', e => e.detail.open ? pause() : resume())
    // Fire and forget, exactly like the site's own dsd:videoaudio: the room does
    // not know or care whether anybody is listening.
    let roomOpen = false;
    function announceRoom(open_) {
      roomOpen = open_;
      try {
        window.dispatchEvent(new CustomEvent('dsd:room', { detail: { open: open_ } }));
      } catch (e) {
        /* no CustomEvent constructor: the engine simply keeps running */
      }
    }

    // Tapping the dock ANYWHERE opens the room. It never pauses the music: the
    // pause pill is the door, not the switch.
    function open() {
      // Opening the room is itself a gesture, so the graph is safe to build here
      // and it MUST be built here: autoplay can succeed with no pointerdown at
      // all, in which case the analyser would otherwise not exist yet and the
      // wall would draw its idle skyline over live music.
      graph();
      room.classList.add('on');
      room.setAttribute('aria-hidden', 'false');
      D.documentElement.style.overflow = 'hidden';
      // Makes "the dock can never collide with the ✕" a guarantee rather than a
      // happy consequence of the room being opaque.
      D.documentElement.classList.add('tx-open');
      announceRoom(true);
      paintTheme();
      wallLoop.start();
      nextThought();
      cycleT0 = 0; // every visit starts on an inhale
      xRef.current.focus();
    }
    function close() {
      room.classList.remove('on');
      room.setAttribute('aria-hidden', 'true');
      D.documentElement.style.overflow = '';
      D.documentElement.classList.remove('tx-open');
      announceRoom(false);
      // The expensive loop stops with the room, and it is the ONLY thing driving
      // the wall AND the orb, so closing the room really does stop both. The
      // dock keeps its cheap three bars.
      wallLoop.stop();
      clearTimeout(thTimer);
      statsOff(); // the readout is the room's, and the room is shut
      closeSheet();
      dock.focus();
    }
    // The tap IS the gesture, so it both starts the music and opens the room,
    // which is the whole point of the dock existing before playback does.
    function dockTap() {
      kick();
      open();
    }
    function onDockKey(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        dockTap();
      }
    }
    dock.addEventListener('click', dockTap);
    dock.addEventListener('keydown', onDockKey);
    xRef.current.addEventListener('click', close);

    // 🌗 The room's mode switch. ☠️ THIS ROOM READS THE THEME, IT NEVER SETS IT.
    // The page's own toggle owns `dsd:theme`, the data-theme stamp and the sky
    // engine, so this button clicks that one by proxy and there stays exactly
    // one source of truth. If the page ships no toggle the button never shows
    // itself, rather than quietly growing a second, disagreeing writer.
    const th = themeRef.current;
    const findSwitch = () => D.getElementById('theme-switch') || D.querySelector('.cinema-switch');
    function paintTheme() {
      th.classList.toggle('tx-has-switch', !!findSwitch());
      th.textContent = D.documentElement.getAttribute('data-theme') === 'dark' ? '☀' : '☾';
    }
    function onTheme() {
      const sw = findSwitch();
      if (sw) sw.click();
      paintTheme();
    }
    th.addEventListener('click', onTheme);
    paintTheme();

    // Escape peels ONE layer at a time: the sheet first, the room only once
    // there is no sheet left to dismiss.
    function onEscape(e) {
      if (e.key !== 'Escape' || !room.classList.contains('on')) return;
      if (sheetOpen) closeSheet();
      else close();
    }
    D.addEventListener('keydown', onEscape);

    return () => {
      disarm();
      D.removeEventListener('pointerdown', graph, true);
      D.removeEventListener('visibilitychange', onVisibility);
      D.removeEventListener('keydown', onEscape);
      window.removeEventListener('dsd:videoaudio', onVideoAudio);
      for (let wi = 0; wi < wake.length; wi++) room.removeEventListener(wake[wi], show, true);
      a.removeEventListener('pause', onPause);
      a.removeEventListener('playing', onPlaying);
      a.removeEventListener('volumechange', onVolumeChange);
      a.removeEventListener('timeupdate', paintCh);
      a.removeEventListener('seeked', paintCh);
      a.removeEventListener('play', paint);
      a.removeEventListener('pause', paint);
      eqLoop.stop();
      wallLoop.stop();
      clearTimeout(warmCap);
      clearTimeout(confirming);
      clearTimeout(thTimer);
      clearTimeout(hideT);
      clearInterval(statsTimer);
      clearInterval(minTick);
      D.documentElement.classList.remove('tx-open');
      D.documentElement.style.overflow = '';
      // Unmounting while open never calls close(), and an engine that was told
      // to idle would stay idle for ever. Hand the screen back.
      if (roomOpen) announceRoom(false);
      try {
        a.pause();
      } catch (e) {
        /* already gone */
      }
      a.removeAttribute('src');
      if (a.parentNode) a.parentNode.removeChild(a);
      try {
        if (ctx) ctx.close();
      } catch (e) {
        /* context already closed */
      }
    };
  }, []);

  return (
    <>
      <div
        id="tx-dock"
        className="idle"
        role="button"
        tabIndex={0}
        aria-label="Play the music and open the room"
        ref={dockRef}
      >
        <span className="tx-eq" aria-hidden="true">
          <i ref={(el) => { eqRefs.current[0] = el; }} />
          <i ref={(el) => { eqRefs.current[1] = el; }} />
          <i ref={(el) => { eqRefs.current[2] = el; }} />
        </span>
        <span className="tx-note" aria-hidden="true">♪</span>
        <span className="tx-dt">Thank you.</span>
        <span className="tx-hint" aria-hidden="true">TAP TO PLAY</span>
        <span className="tx-dp" aria-hidden="true" ref={dpRef}>❙❙</span>
      </div>

      {/* ☠️ the ✕ and 🌗 live OUTSIDE the room ON PURPOSE: a backdrop-filter
          ancestor demotes fixed children to absolute on mobile Chromium, and
          they scrolled away with the content. Out here they are truly fixed.
          ✕ at the thumb (lower-LEFT, the room's original law), 🌗 lower-right.
          .tx-open on <html> is what shows them with the room. */}
      <button id="tx-x" type="button" aria-label="Close this room. The music keeps playing." ref={xRef}>
        ✕
      </button>
      <button id="tx-theme" type="button" aria-label="Switch between light and dark mode" ref={themeRef}>
        ☾
      </button>

      <div id="tx-room" role="dialog" aria-modal="true" aria-label="Thank you" aria-hidden="true" ref={roomRef}>
        <div className="tx-in">
          <h2 className="tx-h">Thank you.</h2>
          <p className="tx-sub">
            A little music while you look around. It keeps playing when you leave this room.
          </p>
          <div id="tx-logo" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/cinema/brand/dsd-round.png" alt="" width="74" height="74" decoding="async" />
          </div>
          <div className="tx-specwrap">
            <canvas id="tx-spec" aria-hidden="true" ref={specRef} />
          </div>
          <div id="tx-bands" aria-hidden="true">
            {BANDS.map((b, i) => (
              <div className="tx-b" key={b[0]}>
                <div className="tx-bm">
                  <div
                    className="tx-bf"
                    ref={(el) => { bandRefs.current[i] = el; }}
                    style={{
                      background: `linear-gradient(180deg,hsl(${bandHue(i) + 40} 100% 74%),hsl(${bandHue(i)} 96% 52%))`,
                    }}
                  />
                </div>
                <div className="tx-bn">{b[0]}</div>
                <div className="tx-bz">{b[1]}</div>
              </div>
            ))}
          </div>
          <div id="tx-ch" ref={chRef}>
            <div className="tx-chh">
              <button id="tx-play" type="button" aria-label="Pause the music" ref={playRef}>
                ❙❙
              </button>
              <span id="tx-chn" ref={chnRef}>0:00 / 0:00</span>
              <span id="tx-cht" ref={chtRef}>—</span>
            </div>
            <div
              id="tx-chb"
              role="slider"
              tabIndex={0}
              aria-label="Chapters — seek within the music"
              aria-valuemin={0}
              aria-valuemax={SONG_SECONDS}
              aria-valuenow={0}
              aria-valuetext="Start"
              ref={chbRef}
            >
              <div className="tx-cwrap" id="tx-cwrap" ref={cwrapRef}>
                {SEGMENTS.map((s, i) => (
                  <div
                    className="tx-cs"
                    key={'s' + s.t}
                    style={{ left: s.left + '%', width: s.width + '%' }}
                    ref={(el) => { segRefs.current[i] = el; }}
                  >
                    <i />
                  </div>
                ))}
                {SEGMENTS.map((s, i) => (
                  <span
                    className={'tx-cdot' + (s.mark === 'heart' ? ' tx-heart' : '')}
                    key={'d' + s.t}
                    style={{ left: s.left + '%' }}
                    aria-hidden="true"
                    ref={(el) => { dotRefs.current[i] = el; }}
                  >
                    {s.mark === 'heart' ? (
                      <svg viewBox="0 0 24 22" aria-hidden="true" focusable="false">
                        <path d="M12 21C12 21 2.6 15.1 2.6 8.9A5 5 0 0 1 12 6.2 5 5 0 0 1 21.4 8.9C21.4 15.1 12 21 12 21Z" />
                      </svg>
                    ) : null}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="tx-chip">
            <span className="tx-chip-master">🎧&nbsp; High-Res Master &nbsp;·&nbsp;</span>
            <span className="tx-chip-phone">🎧&nbsp; Phone mix &nbsp;·&nbsp;</span> Best with headphones
          </div>
          <details className="tx-au" ref={auRef}>
            <summary>🔬 FOR AUDIOPHILES ▾</summary>
            <div id="tx-stats">
              {STAT_ROWS.map((k, i) => (
                <div className="tx-row" key={k}>
                  <span className="tx-k">{k}</span>
                  <span className="tx-v" ref={(el) => { statRefs.current[i] = el; }}>—</span>
                </div>
              ))}
            </div>
            <p>
              The bars are spaced logarithmically, because your ears are. The faint glow underneath is
              a reflection, not a bug. Consider the floor freshly polished.
            </p>
            <p>
              The white dashes are peak caps. They fall slower than the music so you can see what just
              happened.
            </p>
          </details>
          <div className="tx-brh">
            <canvas id="tx-orb" role="button" tabIndex={0} aria-label="Change the breathing pattern" ref={orbRef} />
            <p id="tx-ph" aria-live="polite" ref={phRef}>Breathe in</p>
            <p id="tx-cd" aria-hidden="true" ref={cdRef} />
            <p id="tx-cap" ref={capRef} />
            <button
              id="tx-min"
              type="button"
              aria-label="Breathe with the orb for one quiet minute"
              ref={minRef}
            >
              {MIN_IDLE}
            </button>
            <div
              id="tx-after"
              hidden
              role="button"
              tabIndex={0}
              aria-label="Close this note and keep breathing"
              ref={afterRef}
            >
              <p className="tx-af-h" ref={afHRef} />
              <p className="tx-af-k">YOU MAY FEEL</p>
              <p className="tx-af-p" ref={afFeelRef} />
              <p className="tx-af-k">WHAT JUST HAPPENED</p>
              <p className="tx-af-p" ref={afSciRef} />
              <p className="tx-af-k">SPEND THIS CLARITY ON</p>
              <p className="tx-af-p" ref={afSpendRef} />
              <p className="tx-af-f">{AFTER_FOOTER}</p>
            </div>
            <div id="tx-th" aria-live="off">
              <span ref={(el) => { thRefs.current[0] = el; }} />
              <span ref={(el) => { thRefs.current[1] = el; }} />
            </div>
          </div>
        </div>

        {/* The pattern picker. Nothing permanent eats the stage: the orb is the
            whole control, and this only exists while it is being asked for. */}
        <div id="tx-scrim" hidden ref={scrimRef} />
        <div id="tx-sheet" role="dialog" aria-modal="true" aria-label="Breathing patterns" hidden ref={sheetRef}>
          <div className="tx-sh-top">
            <span className="tx-sh-t">Meditate</span>
            <button id="tx-sh-x" type="button" aria-label="Close without changing the pattern" ref={shxRef}>
              ✕
            </button>
          </div>
          <div id="tx-sh-list" role="listbox" aria-label="Breathing patterns" ref={listRef}>
            {MODES.map((m, i) => (
              <button
                className={'tx-mode' + (i === 0 ? ' sel' : '')}
                type="button"
                role="option"
                data-i={i}
                aria-selected={i === 0}
                key={m[0]}
              >
                <span className="tx-mn">
                  {m[0]}
                  <span className="tx-mp">{sig(m)}</span>
                </span>
                <span className="tx-md">{m[5]}</span>
                <span className="tx-mb">{m[6]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
