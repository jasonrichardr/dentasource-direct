// THE ROOM — ported 1:1 from ffcdentalclinic.com/growth-partner on 2026-09-17. Paths, the opener and the thought stream are DSD's; everything else is the FFC script verbatim.
    (function () {
      var D = document;
      var dock = D.getElementById('tx-dock'), room = D.getElementById('tx-room');
      if (!dock || !room) return;
      // 🤝 on /growth-partner the room wears DentaSource's circle (2026-08-30 — Jarich: "make the
      // logo of mp3 player here the dentasource logo circle instead"); everywhere else, the crest.
      if (location.pathname.indexOf('/growth-partner') !== -1) {
        var txl = D.querySelector('#tx-logo img'); if (txl) txl.src = '/images/brand/dsd-mark.png';
      }
      var reduce = false;
      try { reduce = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

      // Retire the cinema's own player on this page — see the CSS note above.
      // Removing the NODE (not just hiding it) takes its click handlers with it,
      // so its 60-track shuffle can never start a second stream behind ours.
      var amb = D.getElementById('ambient-dock');
      if (amb && amb.parentNode) amb.parentNode.removeChild(amb);

      // ── the element ──────────────────────────────────────────────────────
      // ☠️ A <video>, NOT new Audio() — AND THIS IS THE WHOLE FIX (2026-08-13).
      // Measured in headless Chrome under BOTH mobile autoplay policies
      // (user-gesture-required and document-user-activation-required):
      //
      //   muted new Audio().play()          → REJECTED NotAllowedError
      //   muted <video playsinline>.play()  → RESOLVED, currentTime advancing
      //
      // The "muted media may autoplay" concession that every browser grants is a
      // VIDEO privilege. An <audio> element is refused muted exactly as it is
      // refused unmuted, so the silent warm-up this page needs could never even
      // start while the carrier was new Audio(). Same file, same HTMLMediaElement
      // API, same MediaElementSource into the analyser (verified — the wall is
      // unaffected); the tag is simply the one the platforms will run.
      // It carries no picture: the m4a is audio-only, so videoWidth is 0.
      var a = D.createElement('video');
      // playsinline BOTH ways, or iOS takes the stream fullscreen instead of
      // playing it behind the cinema.
      a.playsInline = true;
      a.setAttribute('playsinline', '');
      a.setAttribute('webkit-playsinline', '');
      a.setAttribute('disableremoteplayback', '');
      // It must be IN the document — WebKit will not autoplay a detached element —
      // but never display:none, which is grounds for refusing to decode. One
      // transparent pixel parked off-stage, untouchable.
      a.style.cssText = 'position:fixed;left:-9999px;top:0;width:1px;height:1px;opacity:0;pointer-events:none';
      // crossOrigin BEFORE src, always. A tainted stream makes the AnalyserNode
      // read pure silence, so the whole wall would draw a dead flat line and
      // look broken rather than look wrong.
      a.crossOrigin = 'anonymous';
      // coarse pointer = a phone/tablet = the phone rendition (and, below, the
      // gesture-gated load-time ask). Decided once, here, before src.
      var coarse = false;
      try { coarse = matchMedia('(pointer: coarse)').matches; } catch (e) {}
      // 📶 METADATA, NOT AUTO (2026-08-13 ruling). The master is a 96 MB m4a. On
      // 'auto' a browser is free to start pulling tens of megabytes the moment the
      // page loads — including for a patient on clinic mobile data who never taps
      // play at all. Playback still begins on the first gesture and still starts
      // promptly, because the element streams from the network rather than waiting
      // to be whole; all this gives up is speculative buffering nobody asked for.
      // ☠️ 'metadata' IS NOT SMALL ON WEBKIT (measured 2026-08-27, bytes off the wire
      // on the Safari engine, no gesture at all): the element pulled the ENTIRE 96 MB
      // master — twice, once from 0 and once from the Smooth-Drift seek — before the
      // patient touched anything, while Chrome fetched 140 KB. That stream, plus 36
      // reel <video>s doing the same, is what starved the song on a phone and made
      // it stutter while scrolling. 'none' fetches nothing until play() asks.
      a.preload = 'none';
      a.loop = true;
      a.volume = 0;
      a.src = coarse ? "/audio/lounge/lofi-17-sermon-in-the-forum.m4a" : "/audio/lounge/lofi-17-sermon-in-the-forum-hifi.m4a";
      // 💛 THE SONG OPENS AT SMOOTH DRIFT (2026-08-14 — Jarich: "play first the
      // smooth drift upon activity of the user. instead of the 00:00"). The seek
      // happens HERE, at metadata time, BEFORE any playback path runs — the
      // ☠️ NO-REWIND lesson below stands: a currentTime assignment inside the
      // un-mute gesture path never takes, so the start position must be seeded
      // while the element is still cold. Loop wraps to 0:00 afterwards, so the
      // patient still meets the opening — just not first. 2140 = the heart
      // chapter's own timestamp in CHAPTERS; keep them in step.
      // 💛→🌇 PAGE-AWARE OPENER (2026-08-16 — Jarich, on /checkin: "play the
      // Golden Hour brother auto play that here"). The check-in page opens the
      // song at GOLDEN HOUR (2935, the loudest chapter of the fourteen); the
      // thank-you and sign-in pages keep Smooth Drift. Keep both numbers in
      // step with CHAPTERS above.
      // 🌇 /careers opens at Golden Hour too (2026-08-28 — Jarich: "start the song here at
      // Golden Hour 48:55") — 2935 is the chapter's own timestamp, keep it in step with CHAPTERS.
      // 🎹 /growth-partner opens at Midnight Keys (388, 2026-08-30 — Jarich: "autoplay it in
      // Midnight Keys 6:28"); careers + checkin at Golden Hour; the rest at Smooth Drift.
      var SD_START = 388; // 🎹 Midnight Keys, as on the growth-partner page
      // With preload 'none' there is no metadata until the first play(), so the
      // opener is seeded NOW as the spec's "default playback start position" (a
      // currentTime set at HAVE_NOTHING is applied when metadata lands — both
      // engines honour it), and the metadata handler stays as the belt to that
      // brace. It no longer waits on !touched: the first play() IS a touch.
      try { a.currentTime = SD_START; } catch (e) {}
      a.addEventListener('loadedmetadata', function () {
        try { if (a.currentTime < 1 && !started) a.currentTime = SD_START; } catch (e) {}
      }, { once: true });
      (D.body || D.documentElement).appendChild(a);

      // 🔕 THE RINGER SWITCH. An iPhone defaults a web page to the 'ambient'
      // audio session, which the hardware mute switch silences OUTRIGHT — so a
      // patient whose ringer is off gets a page that has done everything right,
      // reports itself playing, and makes no sound. Declaring 'playback' (this is
      // a deliberate listen, not an incidental beep) opts out of that switch.
      // Safari-only and feature-detected; nothing else has the property.
      try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) {}

      // The song's display identity, everywhere. Never the real title.
      try {
        if (navigator.mediaSession) {
          navigator.mediaSession.metadata = new MediaMetadata({
            title: 'Thank you.',
            artist: 'DentaSource Direct',
            artwork: [{ src: '/images/brand/dsd-mark.png', sizes: '512x512', type: 'image/png' }],
          });
        }
      } catch (e) {}

      // ── 🔇→🔊 THE MUTED WARM-UP ──────────────────────────────────────────
      // WebKit's policy, verbatim: muted media may autoplay, but "if a video
      // element gains an audio track or becomes un-muted without a user gesture,
      // playback will pause." MEASURED here too — a gesture-free a.muted=false on
      // a happily-running muted video left {muted:false, paused:TRUE}. So the
      // un-mute is activation-gated exactly like play() is. THIS BUYS NO SOUND
      // WITHOUT A GESTURE, and nothing can; do not let anyone "improve" it into a
      // promise the platform forbids.
      //
      // What it DOES buy is the failure we were actually losing to. A cold play()
      // must reach out to the network before it can commit, and both engines drop
      // the activation if the commitment does not land promptly inside the
      // gesture. Flipping 'muted' on an element that is ALREADY decoding is
      // synchronous — nothing to wait for — so the gesture we do get is far more
      // likely to convert. That is the entire margin available to us, and it is
      // the margin the patient's tap was falling into.
      //
      // 📶 DATA COST — the ruling, and the measurement that decided it. Numbers
      // from headless Chrome against this exact build, bytes counted off the wire
      // per request, no gestures at all:
      //
      //   shipped build (HEAD, preload='metadata')      0 KB
      //   warm-up on page LOAD                       6148 KB, all of it by t≈2s
      //
      // Two things follow, and the second one killed the first design.
      // (1) The 20s cap saves NOTHING on its own. Chrome takes its whole ~6MB
      //     buffer in ONE burst and then fetches nothing for the next 18s, so
      //     pausing at 20s gives back no bytes. The cap is kept — it stops the
      //     decode and stops a long idle session from ever buffering further —
      //     but it is not the data-saver, and must not be sold as one.
      // (2) The data-saver is WHEN we start. On load, every patient who scans a
      //     receipt and never touches the page pays 6MB on clinic mobile data for
      //     music they never hear. That is a straight regression against the
      //     preload='metadata' ruling made hours earlier, so we do not do it.
      //
      // The warm-up now starts ON FIRST CONTACT instead — see kick(). A gesture
      // that fails to buy sound starts the silent run, so the NEXT gesture only
      // has to flip a boolean. Nobody who never touches the page pays anything
      // (0 KB, baseline preserved), and everybody who engages still gets the warm
      // element in hand before the tap that matters. On iOS this is near-perfect
      // timing: the first gesture is a scroll, which platform law says can never
      // start sound anyway, so it is spent on the warm-up instead of wasted.
      function warmUp() {
        // 🚦 And never at all for a patient who has ASKED to be spared. Data
        // Saver, 2g and 3g opt out completely; tap-to-play still works untouched.
        try {
          var c = navigator.connection;
          if (c && (c.saveData || /^[23]g$/.test(c.effectiveType || ''))) return;
        } catch (e) {}
        warmRun();
      }
      // 'capped' = we paused it ourselves to stop spending data.
      // 'userPaused' = the patient pressed ❙❙. Neither is a platform revocation,
      // and the recovery handler below must keep its hands off both.
      var warmCap = 0, capped = false, userPaused = false;
      function warmRun() {
        capped = false;
        a.muted = true;
        a.play().then(function () {
          clearTimeout(warmCap);
          warmCap = setTimeout(function () {
            if (a.muted && !a.paused) { capped = true; a.pause(); }
          }, 20000);
        }).catch(function () {
          // Leave it MUTED. A rejected warm-up is usually transient — an abort
          // while the media is still loading, not a policy refusal — and
          // un-muting here was observed to hand back an element that later
          // started ALOUD with no gesture behind it. Staying muted costs
          // nothing: the next gesture goes down the un-mute path either way,
          // and that path re-plays if the element is paused.
        });
      }

      /** The only definition of "the patient can hear it" that matters.
          ☠️ NOT a volume test. The element starts at volume 0 on purpose and the
          1.2s fade is OURS to run — gating on volume here would deadlock the page
          into permanent silence: onPlaying would bail, fadeIn would never start,
          and the volume would sit at 0 for ever. Running + un-muted is the whole
          question; the ramp is a consequence, not a precondition. */
      function audible() { return !a.paused && !a.muted; }

      var started = false;
      function fadeIn() {
        var t0 = 0;
        function step(t) {
          if (!t0) t0 = t;
          var k = Math.min(1, (t - t0) / 1200);
          try { a.volume = 0.6 * k; } catch (e) {}
          if (k < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      }
      // ☠️ A 'playing' EVENT IS NOT SOUND. THIS COST US THE WHOLE FEATURE ONCE —
      // measured, with the event log to prove it (2026-08-13):
      //
      //   0.01s  play() called, EVT play, EVT waiting      (no track loaded yet)
      //   2.52s  EVT canplay, EVT playing, play() RESOLVED  ← we believed this
      //   2.56s  EVT pause  {paused:true}                   ← 40ms later, gone
      //
      // Chrome lets an unmuted play() succeed on a media element whose audio
      // track has not arrived, then applies the autoplay policy and PAUSES it the
      // instant it sees one. The old handler committed on that phantom: it called
      // disarm(), which tore off every gesture listener, and un-idled the dock.
      // The patient was left with a bar claiming to play over a paused element
      // and NOTHING — no scroll, no tap outside the dock — able to revive it.
      //
      // So commitment now requires the clock to have MOVED. We look, wait, and
      // look again; only playback that survives 420ms and advances currentTime is
      // real. Everything reversible stays reversible until then.
      var confirming = 0;
      function onPlaying() {
        // A MUTED element is "playing" and the patient hears nothing, so the dock
        // must stay in its TAP-TO-PLAY state and the arming must stay live. Only
        // real sound retires the invitation.
        if (!audible() || started || confirming) return;
        var mark = a.currentTime;
        confirming = setTimeout(function () {
          confirming = 0;
          if (audible() && a.currentTime > mark) commit();
          else fallBack();
        }, 420);
      }
      /** Confirmed, moving, un-muted sound. The ONLY place the dock stops asking.
       *  The one-shot flourishes are guarded separately, because a revocation can
       *  send us back through here and neither the fade nor the equaliser loop
       *  should ever run twice. */
      var everCommitted = false;
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
       *  go back to running silently so the next one only has to un-mute.
       *  arm() is idempotent — the same listener, type and phase never doubles. */
      function fallBack() {
        started = false;
        clearTimeout(confirming); confirming = 0;
        dock.classList.add('idle');
        dock.setAttribute('aria-label', 'Play the music and open the room');
        arm();
        // ☠️ ONLY IF THEY HAVE ACTUALLY TOUCHED THE PAGE. Measured: without this
        // guard the load-time phantom start gets revoked, this handler runs, and
        // the warm-up spends 3MB on a patient who never lifted a finger — the very
        // regression moving the warm-up to first contact was meant to prevent.
        if (touched) warmUp();
      }
      // ☠️ REVOCATION CAN ARRIVE AFTER COMMITMENT — measured, and the reason this
      // handler does not simply bail on 'started'. Chrome let the piece play a
      // real 0.70s, so the clock-moved confirmation was RIGHT to commit, and then
      // pulled it anyway once it had the audio track:
      //
      //   2.83s  EVT playing, play() RESOLVED
      //   3.57s  EVT pause {paused:true, t:0.70}   ← 740ms after we committed
      //
      // Whatever the platform takes back, the page must ASK AGAIN rather than sit
      // there showing an equaliser over silence. Two pauses are legitimate and
      // must not trigger this: the patient's own ❙❙, and our 20s data cap.
      a.addEventListener('pause', function () {
        if (userPaused || capped) return;
        fallBack();
      });
      a.addEventListener('playing', onPlaying);
      // 'playing' does NOT fire when a running element is un-muted — it is already
      // playing. 'volumechange' does, and it is the ONLY signal the warm-up path
      // has that the flip took. Gated on !started so the fade's own 70-odd
      // volumechange frames cost nothing.
      a.addEventListener('volumechange', function () { if (!started && audible()) onPlaying(); });

      // AUDIBLE AUTOPLAY WITH ZERO GESTURES IS BLOCKED BY EVERY MOBILE BROWSER.
      // That is platform law, not something a page can fix. So: ask anyway, and
      // on rejection arm ONE-TIME listeners. This page is scroll-driven, so the
      // first gesture lands within about a second of the scan — the closest legal
      // thing to "the music starts when you scan".
      // ☠️ ARM THE RELEASE, NOT JUST THE PRESS (2026-08-13 — Jarich's scroll on a
      // real phone did not start the music). iOS hands out media activation on the
      // END of a gesture — touchend / pointerup / click — and commonly refuses it
      // for a scroll flick outright. Listening only to touchstart/pointerdown was
      // therefore asking at the one moment iOS says no.
      //
      // 'scroll' is back in the list, and it is safe now for the reason it was
      // dangerous before: these listeners are PERSISTENT, not once. A scroll that
      // cannot grant activation simply fails and costs nothing, while on Android
      // it is usually the very first thing that starts the music. Each of these
      // just tries again until one succeeds; they come off in onPlaying.
      // The idle TAP-TO-PLAY dock remains the guaranteed door regardless.
      var armed = ['touchend', 'pointerup', 'click', 'pointerdown', 'touchstart', 'wheel', 'keydown', 'scroll'];
      function disarm() { for (var i = 0; i < armed.length; i++) D.removeEventListener(armed[i], kick, true); }
      // NOT 'once' either, for the same reason: a rejected attempt must leave the
      // listeners in place so the NEXT gesture can try again. They come off only
      // when the audio genuinely plays — see onPlaying.
      var touched = false;
      function kick() {
        touched = true;
        graph();
        if (a.muted) {
          // The cheap ask: a synchronous property flip on a running element.
          // Seek to 0 so the patient hears the piece from its opening rather than
          // from wherever the silent warm-up happened to reach.
          clearTimeout(warmCap);
          // ☠️ NO REWIND HERE — tried, measured, abandoned. The intent was to
          // seek to 0 so the patient hears the piece from its opening rather
          // than from wherever the silent warm-up reached. Setting currentTime
          // to 0 works perfectly in isolation (10.03 → 0 → 0.36 measured), but
          // through THIS path it never takes: the clock ran 9.27 → 12.15 and
          // then 10.35 → 11.65 unbroken across two builds, guarded and
          // unguarded alike, while the un-mute beside it worked every time.
          // Rather than ship a line that does nothing and a comment that lies
          // about it, it is gone. The cost is real but trivial — the track is a
          // 65-minute ambient loop with no opening to miss. If anyone wants it
          // back, the thing to explain FIRST is why the assignment is lost here
          // and not two lines away in a bare handler.
          a.muted = false;
          if (a.paused) a.play().catch(function () {});
          // GUARD — READ THE FLIP BACK. WebKit PAUSES media that is un-muted
          // without a valid gesture, and a browser is free to simply refuse the
          // property. Either way (still paused, or muted again), go back to
          // running silently rather than leaving a dead element behind — and stay
          // armed, so the next gesture gets its own turn.
          setTimeout(function () {
            if (!started && (a.paused || a.muted)) warmUp();
          }, 260);
          return;
        }
        // This gesture asks for real sound. If the platform refuses it, spend the
        // refusal on the warm-up: go silent-running now so the NEXT gesture only
        // has to flip a boolean. This is the whole data-saver — a page nobody
        // touches never reaches this line, and never spends a byte.
        a.play().catch(function () { warmUp(); });
      }
      function arm() { for (var i = 0; i < armed.length; i++) D.addEventListener(armed[i], kick, { capture: true, passive: true }); }
      // ── the load-time ask, and why it is gated ───────────────────────────
      // 📶 MEASURED, and it decided the gate: a media element that plays AT ALL
      // buffers megabytes immediately. On a phone the load-time ask is not merely
      // useless, it is expensive — Chrome optimistically resolves play() before
      // the audio track lands, grabs ~4MB of buffer, THEN applies the policy and
      // pauses. The patient hears 0.4s or nothing, and pays 3862 KB for it.
      // On a desktop that permits autoplay the same call simply works and the
      // music is playing before the first beat is read — worth every byte.
      // Coarse pointer = the touch devices this page is really for = wait for
      // contact. Anything else may ask outright.
      if (coarse) arm();
      else a.play().catch(function () { arm(); });

      // ── the graph ────────────────────────────────────────────────────────
      // Built on the FIRST GESTURE, never before: routing an element through a
      // SUSPENDED AudioContext plays silence, so the plain element owns playback
      // until a gesture exists to resume a context with.
      var ctx = null, an = null, bins = null, wave = null;
      function graph() {
        try {
          if (!ctx) {
            var AC = window.AudioContext || window.webkitAudioContext;
            if (!AC) return;
            ctx = new AC();
            an = ctx.createAnalyser();
            an.fftSize = 2048;
            an.smoothingTimeConstant = 0.8;
            ctx.createMediaElementSource(a).connect(an);
            an.connect(ctx.destination);
            bins = new Uint8Array(an.frequencyBinCount);
            // PEAK, RMS and CREST come from the WAVEFORM, not the spectrum —
            // 128 is silence in a byte-domain buffer. Same source the desk uses.
            wave = new Uint8Array(an.fftSize);
          }
          if (ctx.state === 'suspended') ctx.resume();
        } catch (e) { ctx = null; an = null; }
      }
      D.addEventListener('pointerdown', graph, { capture: true, passive: true });
      // 🔌 COMING BACK. iOS moves an AudioContext to 'interrupted'/'suspended' on
      // a lock, a tab switch or a phone call (WebKit 237878 / 261554 / 263627) and
      // does NOT restore it on return — the music would come back to a wall that
      // draws a dead flat line. Returning to the page is itself the activation.
      D.addEventListener('visibilitychange', function () {
        if (!D.hidden && ctx && ctx.state !== 'running') { try { ctx.resume(); } catch (e) {} }
      });

      function read() { if (an && bins) { an.getByteFrequencyData(bins); return true; } return false; }
      /** Flat loudness this frame — drives the ambient wash's strength. */
      function level() {
        if (!bins) return 0;
        var s = 0;
        for (var i = 0; i < bins.length; i++) s += bins[i];
        return s / (bins.length * 255);
      }
      /** THE SPECTRAL CENTROID — the "centre of mass" of the sound in Hz, i.e.
       *  where the energy actually sits right now. The wash is tinted by THIS and
       *  not by an average, so a bright passage washes the room violet and a bassy
       *  one washes it red, exactly like the wall's own hue law. */
      function centroid() {
        if (!bins) return 200;
        var nyq = (ctx ? ctx.sampleRate : 44100) / 2, per = nyq / bins.length, num = 0, den = 0;
        for (var i = 0; i < bins.length; i++) { num += i * per * bins[i]; den += bins[i]; }
        return den > 0 ? num / den : 200;
      }
      function energy(lo, hi) {
        if (!bins) return 0;
        var nyq = (ctx ? ctx.sampleRate : 44100) / 2, per = nyq / bins.length, v = 0;
        var i0 = Math.max(0, Math.floor(lo / per)), i1 = Math.min(bins.length - 1, Math.ceil(hi / per));
        for (var i = i0; i <= i1; i++) if (bins[i] > v) v = bins[i];
        return v / 255;
      }

      // ── the dock's three bars — the CHEAP loop, the only one that runs when
      //    the room is closed. ~20fps, three numbers, no canvas.
      var eq = dock.querySelectorAll('.tx-eq i'), cheapOn = false, last = 0;
      function cheap() {
        if (cheapOn) return;
        cheapOn = true;
        (function tick(t) {
          if (!cheapOn) return;
          requestAnimationFrame(tick);
          if (t - last < 50) return;
          last = t;
          var lit = read() && !a.paused;
          var v = [lit ? energy(40, 160) : 0.18, lit ? energy(300, 2000) : 0.3, lit ? energy(3000, 12000) : 0.22];
          for (var i = 0; i < eq.length; i++) {
            eq[i].style.height = (reduce ? (3 + v[i] * 6) : (3 + Math.min(1, v[i] * 1.25) * 12)).toFixed(1) + 'px';
          }
        })(0);
      }

      // ── the wall ─────────────────────────────────────────────────────────
      // A lean transcription of Spectrum.web.tsx: log-spaced bars across the band
      // that actually carries signal, a gamma curve, a rolling AGC ceiling with
      // fast attack / slow release, the red→violet hue law, white peak caps, and
      // the faint mirrored reflection under the gold baseline.
      var BARS = 96, MIN_HZ = 24, MAX_HZ = 18000, CEIL = 0.7, AGC_T = 0.92, AGC_F = 0.22;
      var cv = D.getElementById('tx-spec'), c2 = cv.getContext('2d');
      var peaks = new Array(BARS).fill(0), agc = AGC_F, raf = 0;

      function draw() {
        raf = requestAnimationFrame(draw);
        var dpr = Math.min(2, window.devicePixelRatio || 1);
        var w = cv.clientWidth, h = cv.clientHeight;
        if (cv.width !== (w * dpr | 0)) { cv.width = w * dpr | 0; cv.height = h * dpr | 0; }
        c2.setTransform(dpr, 0, 0, dpr, 0, 0);
        c2.clearRect(0, 0, w, h);

        var lit = read() && !a.paused && !reduce;
        // 🌄 THE HEADROOM TERM. The canvas is taller than the box it sits in; the
        // extra height is pure sky ABOVE the instrument, for the shafts to climb
        // into. Everything that positions the instrument is measured from the BOX
        // (h - head), so the baseline, the bar ceiling and the reflection are
        // pixel-for-pixel what they were before the canvas grew. Derived from the
        // wrapper rather than hardcoded, so the CSS stays the single source.
        var head = Math.max(0, h - (cv.parentNode ? cv.parentNode.clientHeight : h));
        var ih = h - head;
        var baseline = head + ih * 0.86;
        var maxBar = (baseline - head - 6) * CEIL, mirrorMax = h - baseline - 2;
        var nyq = (ctx ? ctx.sampleRate : 44100) / 2, per = bins ? nyq / bins.length : 21.5;
        var norm = AGC_T / Math.max(AGC_F, agc), frameMax = 0;
        var bass = lit ? energy(30, 140) : 0.22;
        var bw = w / BARS, gap = Math.min(2, bw * 0.28);

        for (var i = 0; i < BARS; i++) {
          var v = 0;
          if (lit) {
            var f = function (t) { return MIN_HZ * Math.pow(MAX_HZ / MIN_HZ, t); };
            var lo = Math.max(0, Math.floor(f(i / BARS) / per)), hi = Math.max(lo + 1, Math.floor(f((i + 1) / BARS) / per));
            for (var k = lo; k < hi && k < bins.length; k++) if (bins[k] > v) v = bins[k];
            v /= 255;
            v = Math.pow(v, 0.72);
            // THE TILT — music puts its energy in the low mids, so an untilted
            // display draws a mountain on the left and a plain on the right.
            v *= 1 + (i / BARS) * 1.15;
            if (v > frameMax) frameMax = v;
            v = Math.min(1, v * norm);
          } else {
            // Reduced motion (or silence): a pleasant, still skyline.
            v = 0.16 + 0.34 * Math.pow(Math.sin((i / BARS) * Math.PI), 1.4);
          }

          peaks[i] = v > peaks[i] ? v : Math.max(0, peaks[i] - (reduce ? 0 : 0.012));
          var hue = ((i / BARS) * 290 + bass * 10) % 360;
          var light = 46 + v * 26, bleed = v * 22;
          var x = i * bw, bwid = Math.max(1, bw - gap), top = baseline - v * maxBar;

          var g = c2.createLinearGradient(0, top, 0, baseline);
          g.addColorStop(0, 'hsla(' + (hue + bleed) + ',100%,' + Math.min(92, light + 30) + '%,1)');
          g.addColorStop(0.35, 'hsla(' + (hue + bleed * 0.5) + ',98%,' + (light + 12) + '%,.98)');
          g.addColorStop(1, 'hsla(' + (hue - 12) + ',88%,' + Math.max(24, light - 18) + '%,.9)');
          c2.shadowBlur = 6 + bass * 26;
          c2.shadowColor = 'hsla(' + hue + ',100%,' + (62 + v * 20) + '%,' + (0.3 + bass * 0.4) + ')';
          c2.fillStyle = g;
          c2.fillRect(x, top, bwid, baseline - top);
          c2.shadowBlur = 0;

          // the reflection — scaled to ITS OWN ceiling, so the ratio is exact
          var mh = v * mirrorMax;
          if (mh > 0.5) {
            var mg = c2.createLinearGradient(0, baseline, 0, baseline + mh);
            mg.addColorStop(0, 'hsla(' + (hue + bleed) + ',96%,' + (light + 8) + '%,' + (0.3 + bass * 0.26) + ')');
            mg.addColorStop(1, 'hsla(' + (hue + bleed) + ',96%,' + light + '%,0)');
            c2.fillStyle = mg;
            c2.fillRect(x, baseline, bwid, mh);
          }

          // the cap — a transient stays visible after the bar has fallen back
          var cy = baseline - peaks[i] * maxBar;
          c2.fillStyle = 'hsla(' + (hue + bleed) + ',100%,88%,.92)';
          c2.fillRect(x + bw * 0.16, cy - 1.5, bw * 0.68, 1.5);
        }

        // ✨ THE RAYS — the tall hue-matched shafts standing above every peak.
        // Transcribed from Spectrum.web.tsx: they ride the HELD PEAK (peaks[i]),
        // not the live value, which is why a shaft lingers and towers after the
        // bar under it has already dropped. Drawn 'lighter' (additive) and much
        // WIDER than the bar — 2.4 bar-widths, offset back by 0.7 — so where bars
        // crowd, the light POOLS instead of stacking into a stripe.
        // Alpha stays deliberately low: the room's text sits on top of this wall,
        // and a ray bright enough to be pretty alone is bright enough to make a
        // sentence unreadable. Legibility is not what gets sacrificed for light.
        c2.globalCompositeOperation = 'lighter';
        for (var r2 = 0; r2 < BARS; r2++) {
          var pv = peaks[r2];
          if (pv < 0.06) continue;
          var rhue = ((r2 / BARS) * 290 + bass * 10) % 360;
          var rtop = baseline - pv * maxBar;
          // Bounded by rtop so a shaft can never leave the canvas — but rtop is
          // far below the top edge, so a tall bar's light finally has somewhere
          // to travel. That headroom is the whole reason BAR_CEIL is 0.70.
          var reach = Math.min(rtop, pv * maxBar * 2.4);
          if (reach <= 0) continue;
          var ray = c2.createLinearGradient(0, rtop, 0, rtop - reach);
          ray.addColorStop(0, 'hsla(' + (rhue + 46 * pv) + ',100%,66%,' + (0.05 + pv * 0.09) + ')');
          ray.addColorStop(1, 'hsla(' + (rhue + 60) + ',100%,70%,0)');
          c2.fillStyle = ray;
          c2.fillRect(r2 * bw - bw * 0.7, rtop - reach, bw * 2.4, reach);
        }

        // …and one ambient wash for the room itself, tinted by where the energy
        // actually IS this frame (the spectral centroid), never by a flat average.
        var cHue = lit ? (Math.log(Math.max(24, centroid()) / 24) / Math.log(MAX_HZ / 24)) * 290 % 360 : 200;
        var wash = c2.createRadialGradient(w / 2, baseline, 0, w / 2, baseline, Math.max(w, h) * 0.9);
        wash.addColorStop(0, 'hsla(' + cHue + ',100%,60%,' + (0.03 + level() * 0.09) + ')');
        wash.addColorStop(1, 'hsla(' + cHue + ',100%,50%,0)');
        c2.fillStyle = wash;
        c2.fillRect(0, 0, w, h);
        c2.globalCompositeOperation = 'source-over';

        // the gold baseline the whole instrument stands on
        c2.fillStyle = 'rgba(184,147,46,.34)';
        c2.fillRect(0, baseline, w, 1);

        // 🫥 UNBOX IT — the one thing that survives the full-bleed experiment.
        // Nothing here is framed in CSS; what read as a box was the canvas RECT
        // itself, because the wash tints out to all four edges and a tinted
        // rectangle on a black page has visible sides. So the edges are ERASED
        // back to transparency (destination-out) and the instrument dissolves
        // into the stage instead of stopping at a border.
        // The top band now lives at the HEADROOM's own boundary — the shafts fade
        // out inside the sky rather than at the canvas edge, which is what stops
        // the instrument reading as a box while still letting the hue climb.
        // Falls back to the old 0.26h if there is no headroom to work with.
        var fadeH = head > 0 ? head * 0.62 : h * 0.26;
        c2.globalCompositeOperation = 'destination-out';
        var fadeT = c2.createLinearGradient(0, 0, 0, fadeH);
        fadeT.addColorStop(0, 'rgba(0,0,0,1)'); fadeT.addColorStop(1, 'rgba(0,0,0,0)');
        c2.fillStyle = fadeT; c2.fillRect(0, 0, w, fadeH);
        var fadeL = c2.createLinearGradient(0, 0, w * 0.06, 0);
        fadeL.addColorStop(0, 'rgba(0,0,0,1)'); fadeL.addColorStop(1, 'rgba(0,0,0,0)');
        c2.fillStyle = fadeL; c2.fillRect(0, 0, w * 0.06, h);
        var fadeR = c2.createLinearGradient(w, 0, w - w * 0.06, 0);
        fadeR.addColorStop(0, 'rgba(0,0,0,1)'); fadeR.addColorStop(1, 'rgba(0,0,0,0)');
        c2.fillStyle = fadeR; c2.fillRect(w - w * 0.06, 0, w * 0.06, h);
        var fadeB = c2.createLinearGradient(0, h, 0, h - h * 0.05);
        fadeB.addColorStop(0, 'rgba(0,0,0,1)'); fadeB.addColorStop(1, 'rgba(0,0,0,0)');
        c2.fillStyle = fadeB; c2.fillRect(0, h - h * 0.05, w, h * 0.05);
        c2.globalCompositeOperation = 'source-over';
        orb();

        // fast attack, slow release — a hit can never clip, a quiet passage
        // re-expands within a few seconds instead of pumping between beats
        agc = frameMax > agc ? frameMax : agc * 0.9965;
        bands(lit);
      }

      // the eight bands a mixing desk actually splits on, each carrying its hue
      // from the SAME red→violet law as the wall above it
      var BANDS = [['SUB','20–60',20,60],['BASS','60–160',60,160],['LOW-MID','160–500',160,500],['MID','0.5–1k',500,1000],['UPPER','1–2.5k',1000,2500],['PRES\u200BENCE','2.5–5k',2500,5000],['BRILLI\u200BANCE','5–10k',5000,10000],['AIR','10–18k',10000,18000]];
      var bandEls = [];
      (function () {
        var wrap = D.getElementById('tx-bands'), html = '';
        for (var i = 0; i < BANDS.length; i++) {
          var hue = (i / BANDS.length) * 290;
          html += '<div class="tx-b"><div class="tx-bm"><div class="tx-bf" style="background:linear-gradient(180deg,hsl(' + (hue + 40) + ' 100% 74%),hsl(' + hue + ' 96% 52%))"></div></div>' +
                  '<div class="tx-bn">' + BANDS[i][0] + '</div><div class="tx-bz">' + BANDS[i][1] + '</div></div>';
        }
        wrap.innerHTML = html;
        bandEls = wrap.querySelectorAll('.tx-bf');
      })();
      function bands(lit) {
        for (var i = 0; i < bandEls.length; i++) {
          var v = lit ? energy(BANDS[i][2], BANDS[i][3]) : 0.24 + (i % 3) * 0.08;
          var hue = (i / BANDS.length) * 290;
          bandEls[i].style.height = Math.min(100, v * 118) + '%';
          bandEls[i].parentNode.style.boxShadow = v > 0.04 ? '0 0 ' + (6 + v * 16) + 'px hsla(' + hue + ',100%,60%,' + (0.18 + v * 0.45) + ')' : 'none';
        }
      }

      // ── 🔬 THE AUDIOPHILE READOUT ────────────────────────────────────────
      // Every live number below is transcribed from the desk's own analyser —
      // src/components/desk/audioSpectrum.ts read() and Spectrum.web.tsx — so the
      // room reports the same quantities the /honour panel does, computed the
      // same way, rather than plausible-looking numbers invented to fill a table.
      // It runs ONLY while the expander is open, at a calm ~5 Hz: this is a thing
      // to read, not a thing to watch flicker.
      var dB = function (x) { return x <= 0 ? -Infinity : 20 * Math.log10(x); };
      var NOTES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
      /** Nearest note, A4 = 440, twelve equal steps to the octave. The cents
       *  offset is the honest part — it says how close the reading really is. */
      function noteOf(hz) {
        if (!hz || hz < 16) return '—';
        var semis = 12 * Math.log(hz / 440) / Math.LN2;
        var nearest = Math.round(semis);
        var cents = Math.round((semis - nearest) * 100);
        var idx = ((nearest + 9) % 12 + 12) % 12;
        var octave = 4 + Math.floor((nearest + 9) / 12);
        return NOTES[idx] + octave + '  ' + (cents >= 0 ? '+' : '') + cents + '¢';
      }

      function metrics() {
        if (!an || !bins || !wave || a.paused) return null;
        an.getByteFrequencyData(bins);
        an.getByteTimeDomainData(wave);
        var n = bins.length, per = (ctx.sampleRate / 2) / n;

        // peak + RMS from the waveform
        var peak = 0, sq = 0;
        for (var i = 0; i < wave.length; i++) {
          var v = (wave[i] - 128) / 128, ab = v < 0 ? -v : v;
          if (ab > peak) peak = ab;
          sq += v * v;
        }
        var rms = Math.sqrt(sq / wave.length);

        // where the energy is, and where it stops
        var domBin = 0, domVal = -1, rolloff = 0;
        for (var j = 0; j < n; j++) {
          if (bins[j] > domVal) { domVal = bins[j]; domBin = j; }
          if (bins[j] > 12) rolloff = j;   // last bin carrying real signal
        }

        // centroid + flatness in one pass. Flatness is the geometric mean over
        // the arithmetic mean — 1 for noise, ~0 for a tone — taken in the LOG
        // domain so one silent bin cannot zero the whole product.
        var wsum = 0, msum = 0, logSum = 0, counted = 0;
        for (var k = 1; k < n; k++) {
          var mg = bins[k] / 255;
          if (mg <= 0) continue;
          wsum += k * per * mg; msum += mg; logSum += Math.log(mg); counted++;
        }
        var centroidHz = msum > 0 ? wsum / msum : 0;
        var flatness = counted > 0 && msum > 0
          ? Math.min(1, Math.exp(logSum / counted) / (msum / counted)) : 0;

        var bassEnd = Math.max(1, Math.round(160 / per)), bassSum = 0;
        for (var b = 0; b < bassEnd && b < n; b++) bassSum += bins[b];

        return {
          peakDb: dB(peak), rmsDb: dB(rms),
          crestDb: peak > 0 && rms > 0 ? dB(peak) - dB(rms) : 0,
          dominantHz: Math.round(domBin * per), rolloffHz: Math.round(rolloff * per),
          centroidHz: Math.round(centroidHz), flatness: flatness,
          bass: bassSum / (bassEnd * 255),
        };
      }

      var statsEl = D.getElementById('tx-stats'), au = D.querySelector('.tx-au'), statsTimer = 0;
      var dash = function (v) { return v; };
      function paintStats() {
        var m = metrics();
        var num = function (x) { return x.toLocaleString(); };
        var d = function (x) { return Number.isFinite(x) ? x.toFixed(1) + ' dB' : '−∞ dB'; };
        // OUR real analyser config, read from the live context — never copied.
        var sp = an && ctx ? an.frequencyBinCount + ' bands · ' + (ctx.sampleRate / 1000).toFixed(1) + ' kHz · FFT ' + an.fftSize : '—';
        var rows = [
          ['FORMAT', 'AAC-LC · 192 kbps · 44.1 kHz · stereo'],
          ['LOUDNESS', 'EBU R128 · −16 LUFS · TP −1.5'],
          ['PEAK', m ? d(m.peakDb) : '—'],
          ['RMS', m ? d(m.rmsDb) : '—'],
          ['DOMINANT', m && m.dominantHz ? num(m.dominantHz) + ' Hz' : '—'],
          ['ROLL-OFF', m && m.rolloffHz ? (m.rolloffHz / 1000).toFixed(1) + ' kHz' : '—'],
          ['CREST', m && m.crestDb ? m.crestDb.toFixed(1) + ' dB' : '—'],
          ['BRIGHTNESS', m && m.centroidHz ? num(m.centroidHz) + ' Hz' : '—'],
          ['TEXTURE', m ? Math.round(m.flatness * 100) + '% noise · ' + Math.round((1 - m.flatness) * 100) + '% tone' : '—'],
          ['HEADROOM', m && Number.isFinite(m.peakDb) ? Math.abs(m.peakDb).toFixed(1) + ' dB to clip' : '—'],
          ['BASS ENERGY', m ? Math.round(m.bass * 100) + '% · <160 Hz' : '—'],
          ['SPREAD', m && m.rolloffHz ? (m.rolloffHz / 1000).toFixed(1) + ' kHz usable band' : '—'],
          ['NOTE', m && m.dominantHz ? noteOf(m.dominantHz) : '—'],
          ['ANALYSER', sp],
        ];
        var html = '';
        for (var i = 0; i < rows.length; i++) {
          html += '<div class="tx-row"><span class="tx-k">' + rows[i][0] +
                  '</span><span class="tx-v">' + dash(rows[i][1]) + '</span></div>';
        }
        statsEl.innerHTML = html;
      }
      function statsOn() {
        if (statsTimer) return;
        graph();                      // opening the panel is a gesture too
        paintStats();
        statsTimer = setInterval(paintStats, 200);   // ~5 Hz, calm to read
      }
      function statsOff() { clearInterval(statsTimer); statsTimer = 0; }
      au.addEventListener('toggle', function () { au.open ? statsOn() : statsOff(); });

      // ── the thought stream ───────────────────────────────────────────────
      // A shuffle DECK, not a redraw: all of them, then a new deal — so a line
      // cannot come round twice before the round is over.
      var THOUGHTS = [
      // ── THE VOICE (2026-08-14, re-cut to the /honour stream's taste — Jarich:
      //    "its meditative and its cute i want that taste"): lowercase, short, no
      //    full stop unless it earns one. It NOTICES rather than instructs. Where
      //    it asks, it asks something tiny and then WAITS WITH THEM. The joke is
      //    always on the room, the objects or the job — never on the patient.
      //    144 deep ("make it 144 <3"), pinned by check. ──
      // ── settle in — notice, ask small, stay with them ──
        'unclench your jaw. yes, that one. I’ll wait',
        'drop your shoulders. they have been up by your ears all day',
        'breathe in… hold… out. the song will wait for you',
        'let your hands rest open for one song',
        'notice your feet on the floor. they carried you here',
        'nothing is asking anything of you right now. I checked',
        'the breath you just took was free. take another',
        'wherever your mind wandered, walk it back gently. no scolding',
        'you are allowed to sit a minute longer. nobody is rushing you',
        'stillness counts as doing something',
        'this minute has no homework',
        'let the song carry the heavy things for a while',
        'the present moment has excellent seating. you are in it',
        'peace is about one slow breath from here',
        'old worries drift by like clouds. wave. let them pass',
        'the tide comes in, the tide goes out. your breath knows the tune',
        'soften your face. it has been holding a lot today',
        'there is nowhere else you need to be. imagine that',
        'slow is still forward',
        'rest is also part of healing',
      // ── heart flutter · appreciated ──
        'your smile has a fan club now. we are all in it',
        'somewhere in the clinic, someone is glad you came in today',
        'you were brave in that chair. we noticed',
        'whatever you were worried about walking in — you did it anyway',
        'a whole team here remembers your name. that is not a small thing',
        'you made a room full of people happy just by showing up',
        'your heart did a little flutter just now. the song felt it too',
        'you are somebody’s favourite patient. we are not allowed to say whose',
        'your future self already sent a thank-you. it arrived early',
        'a room of strangers wished you well today and never mentioned it',
        'we will keep the good chair for you',
        'you showed up. half of everything good starts exactly there',
        'somebody practised for years so today would feel easy for you',
        'the best sound in this clinic is a patient laughing on the way out',
        'you are the calm the waiting room needed today',
        'your name is said kindly in this building more than you know',
        'today you were the good news in somebody’s shift',
        'thank you for trusting us. truly, thank you',
      // ── cute · a soft laugh ──
        'somewhere a toothbrush is extremely proud of you',
        'your teeth are having a very good day',
        'the chair misses you already. it said so',
        'the little mirror saw your smile first. it is still talking about it',
        'a small dog would be very impressed by how you sat today',
        'the kettle at home remembers you. go and see it later',
        'somewhere your favourite song is queued up, waiting for you',
        'the plant by the window watched you leave smiling. its whole week is made',
        'the cotton rolls did their best work for you today. model workers',
        'you said ah beautifully. a natural',
        'the suction makes that noise on purpose. it is showing off',
        '“small bite” — you nailed it. years of practice',
        'your umbrella waited faithfully by the door. reunited at last',
        'a kid in the waiting room decided dentists are not scary. you helped',
      // ── self-love · gentle ──
        'hi. you’re doing better than you think',
        'you are allowed to be proud of an ordinary day',
        'be as gentle with yourself as we were with you',
        'you can be tired and still be doing wonderfully. both are true',
        'you would tell a friend to rest. be that friend to yourself tonight',
        'the version of you from a year ago would be proud right now',
        'if nobody has said it today: you are doing enough',
        'you are more than your busiest day',
        'drink some water. you are mostly ocean',
        'hydrate. stretch. be a little proud of yourself',
        'take the long way home. the music travels with you',
        'go home and be a person for a while. gently',
        'let the day be easy from here. you have earned an easy afternoon',
        'your smile goes with everything. wear it out',
      // ── peace · lovely ──
        'the light outside will still be there when this song finishes',
        'the light at this hour is doing something quietly beautiful',
        'this song has no ending worth hurrying towards',
        'small kindnesses, quietly done. that is the whole job',
        'kindness travels. take some with you on the way out',
        'smile at a stranger later. pass this feeling forward',
        'little joys count double when you notice them. this is one',
        'some medicine is a song in a quiet room. take the full dose',
        'the room is warm, the song is honest, the hour will pass',
        'nothing to do in here. that is rather the point',
        'come back soon. the good chair remembers you',
      // ── humor — the joke is on the room, the objects, the job. never on them ──
        'the aircon has two settings: arctic, and rumour of aircon',
        'the wall clock is four minutes fast. everybody knows. nobody will fix it',
        'the waiting room chairs have heard every flossing excuse. they keep secrets',
        '“i brush twice a day” — the chair says nothing. the chair knows',
        'the drill sounds worse than it is. it is mostly gossip',
        'the door says push. everyone pulls. every single time',
        'the tiny sink is the most famous sink in your life. admit it',
        'gargle, swirl, elegant spit. you have done this before',
        'the bib clip held on all day. dedication',
        'the x-ray vest is just a weighted blanket with a job',
        'the numbing wears off. the bragging rights do not',
        'you may now eat on the other side. the other side has been waiting',
        'the toothbrush aisle will feel different now. you walk it as a champion',
        'somebody said wala akong takot sa dentista while gripping the armrest. legend',
        'ang bilis pala — forty minutes ago you doubted. take the win',
        'the jeepney home will not know how brave you just were. we know',
        'pasalubong counts as self-care today. doctor’s orders. well, almost',
        'the receipt in your pocket brought you here. give it a little credit',
        'your phone missed you for one whole hour. it survived',
        'the elevator music wishes it were this song',
        'somewhere a dentist is humming this exact tune. probably off-key',
        'the mirror at home is about to get a show',
        'tonight, floss like somebody is watching. nobody is. that is the trick',
        'the good chair creaked hello when you sat. it does not do that for everyone',
        'the goodbye wave at the door is a clinic tradition. you did it perfectly',
      // ── more flutter · appreciated ──
        'the front desk still talks about how polite you were. it travels',
        'you left the room lighter than you found it',
        'somebody exhaled in relief today because you smiled first',
        'the team counted today in smiles. yours made the total',
        'you trusted us with the thing people guard most. we do not forget that',
        'your visit was somebody’s favourite part of the shift',
        'we kept your seat warm in our books. it has your name on it',
        'a stranger will get gentler care because you were patient today',
        'the whole clinic runs on moments like the one you just gave us',
        'you arrived nervous and left humming. that is the whole point of us',
      // ── more settle in ──
        'count four things you can hear. the song is allowed to be all four',
        'let your tongue rest from the roof of your mouth. instant quiet',
        'blink slowly once. the room will keep',
        'your heartbeat has kept time all day. let it lead for a minute',
        'put both feet flat. the ground has you. it always did',
        'the next breath needs no instructions. watch it go anyway',
        'lean back one inch. the chair was built for exactly this',
        'the quiet between notes is also music. you are in one now',
        'nothing in this room is keeping score',
        'you have nowhere to be that this song cannot wait for',
        'let your eyes soften. the screen will forgive you',
        'one slow breath is a small holiday. take two',
        'the day can knock. it can also wait',
        'your shoulders just dropped an inch. the song noticed',
        'somewhere inside you it is already evening. sit there a while',
      // ── more cute ──
        'your molars are telling the others about today. good reviews',
        'the tooth fairy keeps a file on you. glowing',
        'somewhere a chart has a little star next to your name',
        'your smile arrived before you did and stayed after you left',
        'the clinic plant grew a new leaf today. coincidence? it thinks not',
        'a baby tooth somewhere is excited to meet you one day',
        'your reflection has been waiting all day for this version of you',
        'the song picked you today. it has good taste',
        'clean teeth walk differently. notice the walk',
        'the little cup of water was an honour to serve you',
      // ── more peace · lovely ──
        'the hour is soft. let it be soft',
        'today already forgave you for everything you meant to do',
        'evening will come gently if you let the afternoon go first',
        'a good day is mostly small mercies counted honestly',
        'you are a quiet victory walking around in daylight',
        'may the traffic part kindly and the rice be perfectly cooked',
        'stay as long as you like. the song does not mind repeating',
      ];
      // 🌱 /careers THOUGHTS (2026-08-28 — Jarich: "make the thought stream there generally
      // good for all patients and applicants and all alike"). Same voice, no names, no
      // dashes; lines an applicant and a patient can both take home.
      if (location.pathname.indexOf('/careers') !== -1 || location.pathname.indexOf('/growth-partner') !== -1) THOUGHTS = [
        'you came here curious. that is already the first step',
        'the best in any room is still learning. so are we',
        'a good day is built one careful hour at a time',
        'breathe. nobody here is in a hurry to judge you',
        'what you do not know yet is not a flaw. it is a direction',
        'every smile we have cared for taught us something',
        'the quiet ones often do the most careful work',
        'showing up honest is worth more than showing up perfect',
        'precision is patience, practiced',
        'we grew branch by branch, chair by chair. slowly is fine',
        'rest is part of the work',
        'the hands that do good work were shaky once too',
        'ask the question. the good ones always do',
        'kindness at the front desk is dentistry too',
        'your first day somewhere is never your best day. it is your bravest',
        'learning never ends here. neither does gratitude',
        'look after your own teeth tonight. you deserve the care you give',
        'we remember names. it changes everything',
        'the more we learn, the gentler we get',
        'a clinic is people who chose each other',
        'you are allowed to be new',
        'small steady improvements outrun big loud ones',
        'the person in the chair is the whole world to someone. so are you',
        'listen first. the mouth tells you before the x-ray does',
        'clean hands, clear head, calm voice',
        'whatever brought you here, we are glad it did',
        'growth is quiet. you only notice it later',
        'the crown on our logo is for the patient, not for us',
        'good work stays humble. great work stays curious',
        'you can take this breath with you',
        'sixty four thousand smiles, one at a time',
        'unclench your jaw. we mean it',
        'the you of next year is being trained right now',
        'the calm you feel here is on purpose',
        'nobody stops growing here. not the newest, not the oldest',
        'thank you for reading this far. that is the kind of person we look for',
        'you do not need to be ready. you need to be willing',
        'the scanner is new. the kindness is old',
        'a steady hand starts with a steady breath',
        'the first patient you ever help will remember you longer than you remember them',
        'nobody was born knowing this. everybody here was taught',
        'tools change every year. care does not',
        'the chair goes up and down. respect stays level',
        'you will make mistakes. make them once, and out loud',
        'a clean room is a quiet kind of love',
        'the day gets lighter when the team carries it together',
        'a good question is the beginning of good work',
        'the showroom is big. the people in it are what matter',
        'we teach what we know and learn what we do not. every single day',
        'your voice at the front desk is the first medicine',
        'speak simply. patients remember the words they understood',
        'fix the chair, and you have fixed a whole afternoon for someone',
        'the machine only knows what a careful person tells it',
        'growth is not loud. it is the same small thing done a little better',
        'no one here is finished. that is the good news',
        'if you are nervous, you care. keep that',
        'learn the basics so well they look like magic to everyone else',
        'the smile you give is the one they take home',
        'be the person you would want at the chair of your own family',
        'sixty four thousand smiles began with one person saying yes',
        'the light on the chair is bright. so is the road ahead of you',
        'you are not applying to a job. you are joining a family that studies',
        'our doors open to walk-ins. our arms open to learners',
        'tonight, rest. tomorrow, ask us anything',
        'the best interview answer is the true one',
        'we would rather teach an honest beginner than manage a hidden expert',
        'the crown on the logo is heavy on purpose. it reminds us who we serve',
        'the form below is shorter than the courage it took to open it',
        'somewhere in this clinic is a chair with your name on it. metaphorically. for now',
        'your resume is a list of dates. your answers will be the real you',
        'apply on the day you find us. perfect timing is a myth',
        'the person reading your application was once exactly this nervous',
        'we have hired people whose hands shook at the interview. they teach others now',
        'come as you are. we will build the rest together',
        'a short resume with true lines beats a long one with borrowed ones',
        'the seat you are afraid to ask for is empty and waiting',
        'careers are built one honest yes at a time',
        'mastery is just patience wearing work clothes',
        'the tools are new every year. the discipline is ancient',
        'watch the seniors wash their hands. that is the first lecture',
        'a well set tray is a promise kept before the patient arrives',
        'slow is smooth. smooth is fast. fast is gentle',
        'excellence here is a habit with a hairnet',
        'the person who sharpened their basics never fears the advanced',
        'repetition is not boring. repetition is how hands learn to think',
        'every expert you admire kept a notebook once. start yours tonight',
        'small hands steady large machines',
        'good assistants see the next instrument before the dentist asks',
        'the quiet competence in this room took years. it will share itself with you',
        'learn the why behind every step and no step will ever feel small',
        'curiosity is the only prerequisite we cannot teach',
        'the day you stop asking questions is the day to worry',
        'the break room laughter is part of the training',
        'we celebrate small wins loudly and big wins together',
        'here, seniors lift juniors. that is the whole org chart',
        'the newest person at the table changes the table',
        'you will be corrected gently and often. that is what care sounds like',
        'no one eats lunch alone on their first week. house rule',
        'the family grew one brave application at a time. yours could be next',
        'we keep the standards high and the doorway low',
        'your accent, your school, your city. all welcome. bring the work ethic',
        'people stay here for years. ask them why at the interview',
        'a room full of dentists taking notes is a beautiful thing to build',
        'teaching is the fastest way to learn something twice',
        'your cases deserve a bigger classroom',
        'the best lecture is a demonstration with the sleeves rolled up',
        'a study group is a promise that nobody learns alone',
        'the big screen at the front is waiting for your slides',
        'every hands-on you run plants skills in someone elses city',
        'speakers are made one nervous first talk at a time',
        'your knowledge, organized, becomes a curriculum. we can help with the organizing',
        'the room remembers a generous teacher long after the course ends',
        'teach what you wish someone had taught you sooner',
        'a good course outline is a gift to your future students',
        'the questions your students ask will sharpen your own practice',
        'demonstrate once, supervise twice, celebrate every attempt',
        'a teacher with humility raises colleagues, not followers',
        'the chairs, the scanners, the screens. the venue is solved. bring the wisdom',
        'course directors start as the person who explains things at lunch',
        'your study group could meet somewhere built for exactly that',
        'what you learned abroad becomes priceless the day you teach it here',
        'a whole batch of dentists will someday say they started in your class',
        'the profession grows when knowledge refuses to stay private',
        'dentistry is a craft passed hand to hand. yours are next',
        'somewhere a patient will be safer because you trained properly',
        'the license is paper. the learning is muscle',
        'each generation of dentists stands on borrowed patience. repay it forward',
        'clinics are temporary. what you teach people lasts',
        'skill without kindness is only technique',
        'the best investment in this building is the people learning in it',
        'a career in dentistry is thousands of small mercies, delivered on time',
        'we measure success in steady hands and returning patients',
        'read one more thought. then go press the button',
        'the future you is already grateful you stayed on this page',
        'doors like this one do not stay unnoticed for long',
        'take the breath. fill the form. we will take it from there',
        'whatever happens next, thank you for considering us',
        'when you look back, this scroll might be the start of everything',
        'the stars behind this text are fake. the opportunity is not',
        'somewhere between these lines you already decided. trust that',
        'we saved you a spot in the story. claim it below',
        'come teach. come learn. come build with us',
        'this page ends. the invitation does not',
        'bring a friend when you come. good things are better shared',
      ];
      var slots = D.querySelectorAll('#tx-th span'), act = 0, deck = [], prevIdx = -1, thTimer = 0;
      function deal() {
        var d = [];
        for (var i = 0; i < THOUGHTS.length; i++) d.push(i);
        for (var j = d.length - 1; j > 0; j--) { var k = Math.floor(Math.random() * (j + 1)), t = d[j]; d[j] = d[k]; d[k] = t; }
        if (d.length > 1 && d[0] === prevIdx) { var s = d[0]; d[0] = d[d.length - 1]; d[d.length - 1] = s; }
        return d;
      }
      function nextThought() {
        if (!deck.length) deck = deal();
        prevIdx = deck.shift();
        // double-buffer: write to the hidden span, then cross-fade — the text
        // of a visible node is never touched (the iPhone ghosting fix).
        var cur = slots[act], nxt = slots[1 - act];
        nxt.textContent = THOUGHTS[prevIdx];
        // two lines, never three: step the size down until this thought fits
        var fs = 17; nxt.style.fontSize = fs + 'px';
        while (fs > 11 && nxt.scrollHeight > fs * 1.4 * 2 + 4) { fs -= 0.5; nxt.style.fontSize = fs + 'px'; }
        cur.classList.remove('on');
        nxt.classList.add('on');
        act = 1 - act;
        thTimer = setTimeout(nextThought, 7000);
      }

      // ── THE BREATH ───────────────────────────────────────────────────────
      // Real timings per mode. A 4-7-8 that is not actually 4-7-8 is worse than
      // no timer at all, so every phase length below is the canonical one and the
      // clock is read from performance.now(), never from an accumulating
      // setInterval that would drift over a few minutes of breathing.
      //
      // The catalogue: the four the reference page ships (4-2-4, 4-7-8, Box, HRV
      // — it names them but publishes no timings, so these are the canonical
      // ones), plus the standard patterns it omits.
      // Each entry: [name, inhale, hold-in, exhale, hold-out, note, benefit]
      // The BENEFIT slot (2026-08-14 — Jarich: "the descriptions make it sound
      // helpful for an individual… 1 minute of this can then give benefits…
      // dont mention daily life") speaks straight to the one person reading —
      // what a minute of this does FOR YOU, no label in front of it. Kept
      // gentle on purpose — "helps", "settles", never a medical promise; this
      // is a dental clinic's page.
      var MODES = [
        ['Coherent', 5.5, 0, 5.5, 0, 'Six breaths a minute — the pace the heart settles into.',
          'One minute of this settles the heartbeat into an easy rhythm — the quickest way to clear a busy head between tasks.'],
        ['HRV', 4, 0, 6, 0, 'Four in, six out. The one the biofeedback people build on.',
          'A few rounds build a calm you can feel in the chest. Lovely before a hard conversation, a big decision, or a long drive.'],
        ['Box', 4, 4, 4, 4, 'Four square sides. What people reach for when the day is loud.',
          'Four steady sides hold you when pressure rises — traffic, deadlines, a phone that will not stop. The noise steps back.'],
        ['4-7-8', 4, 7, 8, 0, 'The long way down. Worth saving for the end of the night.',
          'The long exhale tells the body the day is over, even when the mind has not agreed yet. Two rounds and sleep comes closer.'],
        ['4-2-4', 4, 2, 4, 0, 'Small and easy, with one short pause. A good place to begin.',
          'The gentle first step. One minute loosens the shoulders — a kind place to start if breathing exercises are new to you.'],
        ['Equal', 4, 0, 4, 0, 'Same in, same out. Nothing at all to remember.',
          'Nothing to count, nothing to hold. A minute of it steadies you anywhere — walking, queuing, waiting for your name.'],
        ['Triangle', 4, 4, 4, 0, 'Three sides — in, hold, out. Steady as a metronome.',
          'The short hold sharpens attention. A minute before study or careful work, and the hands come back steadier.'],
        ['Long Exhale', 4, 0, 8, 0, 'Out for twice as long as in. The unhurried one.',
          'The quickest way to tell the body the rush is over — after work, after a fright, before anything that needs you calm.']
      ];
      var LABELS = ['Breathe in', 'Hold', 'Breathe out', 'Rest'];
      var mode = 0, cycleT0 = 0;
      var orbCv = D.getElementById('tx-orb'), orbC2 = orbCv.getContext('2d');
      var phEl = D.getElementById('tx-ph'), cdEl = D.getElementById('tx-cd');
      var capEl = D.getElementById('tx-cap');
      var sheet = D.getElementById('tx-sheet'), scrim = D.getElementById('tx-scrim');
      var list = D.getElementById('tx-sh-list');

      /** The pattern the way a person says it — zero-length phases dropped. */
      function sig(m) {
        var out = [m[1]];
        if (m[2] > 0) out.push(m[2]);
        out.push(m[3]);
        if (m[4] > 0) out.push(m[4]);
        return out.join(' · ');
      }

      (function buildModes() {
        var h = '';
        for (var i = 0; i < MODES.length; i++) {
          var m = MODES[i];
          h += '<button class="tx-mode' + (i === 0 ? ' sel' : '') + '" type="button" role="option" data-i="' + i +
               '" aria-selected="' + (i === 0) + '"><span class="tx-mn">' + m[0] +
               '<span class="tx-mp">' + sig(m) + '</span></span><span class="tx-md">' + m[5] + '</span>' +
               '<span class="tx-mb">' + m[6] + '</span></button>';
        }
        list.innerHTML = h;
      })();

      function paintCap() {
        capEl.innerHTML = '<b>' + MODES[mode][0] + '</b> · tap to change';
      }
      paintCap();

      // ── ◷ one quiet minute → ✨ the afterglow ──────────────────────────
      // The countdown reads performance.now(), same law as the breath clock —
      // a minute that is not a minute would be a small lie in a room built on
      // honesty. While it runs the pill is a BARE CLOCK (Jarich: "it will just
      // turn to clock no word") — the words come after, when they are earned.
      // At zero the AFTERGLOW blooms: what this exact pattern may have done,
      // what actually happened inside, and what the clarity is now FOR. Eight
      // patterns, eight different cards. Tapping mid-run cancels quietly.
      // No sound, ever — the reward for a quiet minute is never a loud thing.
      var minEl = D.getElementById('tx-min'), afEl = D.getElementById('tx-after');
      var MIN_IDLE = '◷  one quiet minute';
      var minT0 = 0, minTick = 0;
      // ── the eight afterglows: [feel, happened, spend] under a foil headline.
      // The science is real and the voice stays gentle — "may", "often", never
      // a promise. Each card ends on the same quiet full stop of a footer.
      var AFTER = [
        { h: 'Your heart and lungs just found the same rhythm',
          feel: 'warm hands, a slower steady pulse, more room in your head. some people feel a soft hum in the chest — that is a good sign',
          sci: 'six breaths a minute is the pace where your breathing wave and your blood-pressure wave lock in step — the baroreflex, the heart’s own thermostat, swinging in full arcs. heart-rate variability, the number longevity researchers watch, rises toward its peak at exactly this rhythm. you tuned an instrument you did not know you carried',
          spend: 'the message you have been avoiding · walking back into a loud room · one clear decision. the next half hour is the steadiest your focus will be today' },
        { h: 'You just pressed a brake only your body knows about',
          feel: 'the chest loosens, the jaw lets go on its own, sounds seem a step further away',
          sci: 'every long exhale leans on the vagus nerve — the body’s rest-and-digest line — and the heart genuinely slows on each out-breath. four in, six out keeps you on the calming side of every breath you take, which is why the biofeedback clinics built their whole method on it',
          spend: 'a hard conversation held kindly · a decision that needs a cool head · the long drive home' },
        { h: 'Four walls went up, and the noise stayed outside',
          feel: 'steadier hands, a flatter pulse, the feeling of standing one step back from the day',
          sci: 'equal sides hold the co₂ in your blood perfectly steady and give attention one simple anchor to hold. this exact square is what pilots, surgeons and first responders are drilled on before high-stakes work — you just ran the same drill in a music room',
          spend: 'the deadline hour · speaking in front of people · traffic that wants a reaction from you' },
        { h: 'You just brewed your own sleeping draught',
          feel: 'heavier eyelids, a warm slow weight in the arms, thoughts arriving with more space between them',
          sci: 'the seven-count hold lets co₂ rise just enough to whisper “safe” to the nervous system, and the eight-count exhale doubles the vagal brake on the heart. done at the bedside, two or three rounds often outrun a racing mind — no draught, no cost, no morning after',
          spend: 'closing the day on purpose · putting the phone face-down · lying back and letting the ceiling be enough' },
        { h: 'A small kindness, quietly banked',
          feel: 'looser shoulders, an easier jaw, one honest notch calmer than a minute ago',
          sci: 'the two-count pause smooths the turn between in and out so the breath stops snagging — gentle enough to repeat many times a day, and repetition is exactly how a nervous system learns a new resting point. small deposits, real interest',
          spend: 'between errands · before you eat · the first minute after waking, before the phone wins' },
        { h: 'You just evened the scales',
          feel: 'balanced, level, strangely tidy — like a desk cleared without moving anything on it',
          sci: 'same in, same out roughly halves your usual breathing rate and holds the push and the rest of your nervous system in equal measure. the old schools call it sama vritti — equal motion. you just practised it in a dental clinic, which they did not see coming',
          spend: 'walking anywhere · queues and waiting rooms · any moment that needs you present but not braced' },
        { h: 'You sharpened a tool you carry everywhere',
          feel: 'a clean, pointed alertness — calm, but with all the lights on',
          sci: 'the hold at the top trains your tolerance for co₂ — and a touch more co₂ actually helps oxygen leave the blood and reach the brain. the bohr effect: the pause you were taught to fear is the part that feeds your head. attention gets a metronome; the mind stops changing tabs',
          spend: 'studying · careful, precise work · writing the thing that needs your whole mind' },
        { h: 'You just told every muscle the chase is over',
          feel: 'shoulders that finally sink, an exhale that keeps paying out, the floor holding more of you',
          sci: 'breathing out for twice as long keeps the heart on its slow beat for most of every cycle — the strongest calming lean a breath can give without lying down. the body reads the long exhale as one plain sentence: the running is done',
          spend: 'the moment you get home · after a fright or a hard hour · the last thing before sleep' }
      ];
      function afHide() { afEl.hidden = true; }
      function afShow() {
        var a = AFTER[mode] || AFTER[0];
        // Static strings from THIS script — nothing user-supplied ever lands here.
        afEl.innerHTML =
          '<p class="tx-af-h">' + a.h + '</p>' +
          '<p class="tx-af-k">YOU MAY FEEL</p><p class="tx-af-p">' + a.feel + '</p>' +
          '<p class="tx-af-k">WHAT JUST HAPPENED</p><p class="tx-af-p">' + a.sci + '</p>' +
          '<p class="tx-af-k">SPEND THIS CLARITY ON</p><p class="tx-af-p">' + a.spend + '</p>' +
          '<p class="tx-af-f">that was a minute. well done — tap to keep breathing</p>';
        afEl.hidden = false;
        afEl.focus({ preventScroll: true });
      }
      afEl.addEventListener('click', afHide);
      afEl.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); afHide(); } });
      function minReset() {
        clearInterval(minTick); minTick = 0; minT0 = 0;
        minEl.classList.remove('run');
        minEl.textContent = MIN_IDLE;
        minEl.setAttribute('aria-label', 'Breathe with the orb for one quiet minute');
      }
      function minPaint() {
        var left = Math.max(0, 60 - Math.floor((performance.now() - minT0) / 1000));
        if (left > 0) {
          // the bare clock — no words while counting; 60 introduces itself as 1:00
          var mm = Math.floor(left / 60), ss = left % 60;
          minEl.textContent = '◷  ' + mm + ':' + (ss < 10 ? '0' : '') + ss;
          return;
        }
        minReset();
        afShow();
      }
      minEl.addEventListener('click', function () {
        graph();                               // a tap is a gesture; feed the audio graph
        if (minTick) { minReset(); return; }   // tapping the clock cancels, quietly
        afHide();                              // a fresh minute clears the old card
        minT0 = performance.now();
        minEl.classList.add('run');
        minEl.setAttribute('aria-label', 'Counting down one quiet minute. Tap again to stop early.');
        minPaint();
        minTick = setInterval(minPaint, 250);  // repaint fast enough that no shown second is stale
      });

      function selectMode(i) {
        if (i < 0 || i >= MODES.length) return;
        mode = i;
        cycleT0 = 0; // restart the cycle so the new pattern begins at its inhale
        var cards = list.children;
        for (var k = 0; k < cards.length; k++) {
          var on = k === i;
          cards[k].classList.toggle('sel', on);
          cards[k].setAttribute('aria-selected', String(on));
        }
        paintCap();
        afHide();   // a card describes the breath that EARNED it — never the next one
      }

      // ── the sheet ──
      // Tapping the orb asks the question; choosing answers it and gets out of
      // the way. Closing by ✕ or by tapping outside changes NOTHING.
      var sheetOpen = false;
      function openSheet() {
        if (sheetOpen) return;
        sheetOpen = true;
        scrim.hidden = false; sheet.hidden = false;
        var sel = list.querySelector('.tx-mode.sel');
        if (sel) sel.scrollIntoView({ block: 'nearest' });
        D.getElementById('tx-sh-x').focus();
      }
      function closeSheet() {
        if (!sheetOpen) return;
        sheetOpen = false;
        scrim.hidden = true; sheet.hidden = true;
        orbCv.focus();
      }
      orbCv.addEventListener('click', openSheet);
      orbCv.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openSheet(); }
      });
      D.getElementById('tx-sh-x').addEventListener('click', closeSheet);
      scrim.addEventListener('click', closeSheet);
      list.addEventListener('click', function (e) {
        var card = e.target.closest ? e.target.closest('.tx-mode') : null;
        if (!card) return;
        selectMode(+card.getAttribute('data-i'));
        closeSheet();
      });

      /** Smooth, lung-shaped easing — no corners at the turn of the breath. */
      function ease(t) { return t * t * (3 - 2 * t); }

      /** Drawn every frame by the wall's own loop, so the breath and the music
       *  are one instrument. Returns nothing; reads the clock itself. */
      function orb() {
        var now = performance.now();
        if (!cycleT0) cycleT0 = now;
        var m = MODES[mode];
        var segs = [m[1], m[2], m[3], m[4]];
        var total = segs[0] + segs[1] + segs[2] + segs[3];
        var t = ((now - cycleT0) / 1000) % total;
        // Which phase, how far through it, and what the lungs are doing.
        var phase = 0, acc = 0, k;
        for (k = 0; k < 4; k++) { if (t < acc + segs[k] && segs[k] > 0) { phase = k; break; } acc += segs[k]; }
        if (k === 4) { phase = 0; acc = 0; }
        var into = t - acc, left = Math.max(0, segs[phase] - into);
        var p = segs[phase] > 0 ? into / segs[phase] : 0;
        var amp = phase === 0 ? ease(p) : phase === 1 ? 1 : phase === 2 ? 1 - ease(p) : 0;

        if (phEl.textContent !== LABELS[phase]) {
          phEl.textContent = LABELS[phase];
          // The phase tints the words: gold rising, cream held, soft blue falling.
          phEl.style.color = phase === 0 ? 'rgba(230,199,106,.92)'
            : phase === 2 ? 'rgba(150,205,235,.85)' : 'rgba(246,239,221,.8)';
        }
        cdEl.textContent = Math.ceil(left) + '';

        var W = orbCv.clientWidth, H = orbCv.clientHeight;
        var dpr = Math.min(2, window.devicePixelRatio || 1);
        if (orbCv.width !== (W * dpr | 0)) { orbCv.width = W * dpr | 0; orbCv.height = H * dpr | 0; }
        orbC2.setTransform(dpr, 0, 0, dpr, 0, 0);
        orbC2.clearRect(0, 0, W, H);
        var cx = W / 2, cy = H / 2, maxR = Math.min(W, H) / 2 - 6;

        // THE SAME HUE LAW AS THE WALL: the orb travels the red→violet sweep
        // across one whole breath, so the colour of the breath and the colour of
        // the music are the same alphabet. Bass nudges it, exactly like the bars.
        var bassNow = (read() && !a.paused) ? energy(30, 140) : 0.2;
        var hue = ((t / total) * 290 + bassNow * 10) % 360;

        if (reduce) {
          // Reduced motion: no growing, just a slow breath of OPACITY.
          orbC2.globalAlpha = 0.35 + amp * 0.4;
          var flat = orbC2.createRadialGradient(cx, cy, 0, cx, cy, maxR * 0.8);
          flat.addColorStop(0, 'hsla(' + hue + ',90%,70%,.5)');
          flat.addColorStop(1, 'hsla(' + hue + ',90%,55%,0)');
          orbC2.fillStyle = flat;
          orbC2.beginPath(); orbC2.arc(cx, cy, maxR * 0.8, 0, 6.2832); orbC2.fill();
          orbC2.globalAlpha = 1;
          return;
        }

        var r = maxR * (0.42 + 0.58 * amp);
        // The outer bloom — additive, so it pools into the room rather than
        // sitting on top of it like a sticker.
        orbC2.globalCompositeOperation = 'lighter';
        var glow = orbC2.createRadialGradient(cx, cy, r * 0.2, cx, cy, maxR);
        glow.addColorStop(0, 'hsla(' + hue + ',100%,68%,' + (0.16 + amp * 0.2) + ')');
        glow.addColorStop(0.55, 'hsla(' + (hue + 26) + ',100%,62%,' + (0.06 + amp * 0.1) + ')');
        glow.addColorStop(1, 'hsla(' + (hue + 40) + ',100%,60%,0)');
        orbC2.fillStyle = glow;
        orbC2.fillRect(0, 0, W, H);

        // The body of the orb.
        var body = orbC2.createRadialGradient(cx - r * 0.25, cy - r * 0.3, r * 0.08, cx, cy, r);
        body.addColorStop(0, 'hsla(' + (hue + 34) + ',100%,86%,' + (0.5 + amp * 0.3) + ')');
        body.addColorStop(0.6, 'hsla(' + hue + ',96%,62%,' + (0.24 + amp * 0.22) + ')');
        body.addColorStop(1, 'hsla(' + (hue - 14) + ',92%,48%,0)');
        orbC2.fillStyle = body;
        orbC2.beginPath(); orbC2.arc(cx, cy, r, 0, 6.2832); orbC2.fill();
        orbC2.globalCompositeOperation = 'source-over';

        // The rim, and one ring travelling outward on the inhale / inward on the
        // exhale — the thing the eye actually follows without being told to.
        orbC2.strokeStyle = 'hsla(' + (hue + 30) + ',100%,84%,' + (0.3 + amp * 0.45) + ')';
        orbC2.lineWidth = 1.4;
        orbC2.beginPath(); orbC2.arc(cx, cy, r, 0, 6.2832); orbC2.stroke();
        if (phase === 0 || phase === 2) {
          var rp = phase === 0 ? p : 1 - p;
          orbC2.strokeStyle = 'hsla(' + (hue + 50) + ',100%,80%,' + (0.3 * (1 - Math.abs(rp * 2 - 1))) + ')';
          orbC2.lineWidth = 1;
          orbC2.beginPath(); orbC2.arc(cx, cy, maxR * (0.42 + 0.58 * rp), 0, 6.2832); orbC2.stroke();
        }
      }

      // ── open / close ─────────────────────────────────────────────────────
      // Tapping the dock ANYWHERE opens the room. It never pauses the music —
      // the pause pill is the door, not the switch.
      function open() {
        // Opening the room is itself a gesture, so the graph is safe to build
        // here — and it MUST be built here: autoplay can succeed with no
        // pointerdown at all, in which case the analyser would otherwise not
        // exist yet and the wall would draw its idle skyline over live music.
        graph();
        room.classList.add('on');
        room.setAttribute('aria-hidden', 'false');
        D.documentElement.style.overflow = 'hidden';
        // Makes "the dock can never collide with the ✕" a guarantee rather than
        // a happy consequence of the room being opaque.
        D.documentElement.classList.add('tx-open');
        if (!raf) draw();
        nextThought();
        cycleT0 = 0; // every visit starts on an inhale
        D.getElementById('tx-x').focus();
      }
      function close() {
        room.classList.remove('on');
        room.setAttribute('aria-hidden', 'true');
        D.documentElement.style.overflow = '';
        D.documentElement.classList.remove('tx-open');
        // The expensive loop stops with the room — and it is the ONLY thing
        // driving the wall AND the orb, so closing the room really does stop
        // both. The dock keeps its cheap three bars.
        if (raf) { cancelAnimationFrame(raf); raf = 0; }
        clearTimeout(thTimer);
        statsOff();          // the readout is the room's, and the room is shut
        closeSheet();
        dock.focus();
      }
      // The tap IS the gesture, so it both starts the music and opens the room —
      // which is the whole point of the dock existing before playback does.
      function dockTap() { kick(); open(); }
      dock.addEventListener('click', dockTap);
      dock.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); dockTap(); } });
      D.getElementById('tx-x').addEventListener('click', close);
      // 🌗 the room's mode switch. On the cinema pages the REAL switch
      // (#theme-switch, theme.js) owns the sky engine + storage — clicking it
      // by proxy keeps one source of truth. Everywhere else (/checkin) we
      // stamp + persist + announce, and the page's own listeners re-ink.
      (function () {
        var th = D.getElementById('tx-theme');
        if (!th) return;
        var paint = function () {
          th.textContent = D.documentElement.getAttribute('data-theme') === 'dark' ? '☀' : '☾';
        };
        th.addEventListener('click', function () {
          var sw = D.getElementById('theme-switch');
          if (sw) { sw.click(); paint(); return; }
          var next = D.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
          D.documentElement.setAttribute('data-theme', next);
          try { localStorage.setItem('dsd:lounge-theme', next); } catch (e) {}
          try { window.dispatchEvent(new CustomEvent('ffc:theme-flip', { detail: { dark: next === 'dark' } })); } catch (e) {}
          paint();
        });
        paint();
      })();
      // Escape peels ONE layer at a time: the sheet first, the room only once
      // there is no sheet left to dismiss.
      D.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape' || !room.classList.contains('on')) return;
        if (sheetOpen) closeSheet(); else close();
      });

      // ── 📖 THE CHAPTER RAIL ──────────────────────────────────────────────
      var CH = [[0,"Soulful Sax"],[170,"Soulful Trumpet"],[388,"Midnight Keys"],[558,"Evening Breeze"],[1160,"Velvet Reeds"],[1347,"Twilight Tune"],[1960,"Velvet Groove"],[2140,"Smooth Drift","heart"],[2706,"Night Groove"],[2935,"Golden Hour"],[3110,"Amber Lights"],[3310,"Bright Horn"],[3506,"Slow Rain"],[3689,"Last Light"]], DUR = 3896;
      var chEl = D.getElementById('tx-ch'), chBar = D.getElementById('tx-chb'),
          chWrap = D.getElementById('tx-cwrap'), chT = D.getElementById('tx-cht'),
          chN = D.getElementById('tx-chn');
      var segs = [], dots = [], dotBase = [], curCh = -1;
      // 💛 The marker shapes. A chapter names one in its third slot; everything
      // without one gets the plain circle. Adding a shape is a key here plus its
      // CSS — the rail below never learns the difference.
      var MARKS = {
        heart: { cls: ' tx-heart',
          svg: '<svg viewBox="0 0 24 22" aria-hidden="true" focusable="false">' +
               '<path d="M12 21C12 21 2.6 15.1 2.6 8.9A5 5 0 0 1 12 6.2 5 5 0 0 1 21.4 8.9C21.4 15.1 12 21 12 21Z"/></svg>' }
      };
      // GAP is a percentage of the whole bar, so the visual gap between chapters
      // stays even at any width instead of growing on the long ones.
      var GAP = 0.7;
      for (var ci = 0; ci < CH.length; ci++) {
        var a0 = CH[ci][0], a1 = ci + 1 < CH.length ? CH[ci + 1][0] : DUR;
        var L = (a0 / DUR) * 100, W = ((a1 - a0) / DUR) * 100 - GAP;
        var s = D.createElement('div');
        s.className = 'tx-cs'; s.style.left = L + '%'; s.style.width = Math.max(W, 0.6) + '%';
        s.appendChild(D.createElement('i'));
        chWrap.appendChild(s); segs.push(s);
        var dt = D.createElement('span'), mk = MARKS[CH[ci][2]];
        // The base class is REMEMBERED, because paintCh() rewrites className every
        // time the chapter changes — writing 'tx-cdot' flat there would quietly
        // strip the heart off the rail the first time the playhead moved.
        dotBase[ci] = 'tx-cdot' + (mk ? mk.cls : '');
        dt.className = dotBase[ci]; dt.style.left = L + '%';
        if (mk) dt.innerHTML = mk.svg;
        // aria-hidden: 14 markers would be 14 tab stops in front of the room's
        // real controls. The bar itself is the focusable, arrow-seekable slider.
        dt.setAttribute('aria-hidden', 'true');
        chWrap.appendChild(dt); dots.push(dt);
      }
      function clock(t) {
        t = Math.max(0, Math.floor(t));
        var h = Math.floor(t / 3600), m = Math.floor((t % 3600) / 60), s2 = t % 60;
        return (h ? h + ':' + (m < 10 ? '0' : '') + m : '' + m) + ':' + (s2 < 10 ? '0' : '') + s2;
      }
      function chapterAt(t) {
        var i = 0;
        for (var j = 0; j < CH.length; j++) if (t >= CH[j][0]) i = j;
        return i;
      }
      function paintCh() {
        var t = a.currentTime || 0, i = chapterAt(t);
        for (var j = 0; j < segs.length; j++) {
          var b0 = CH[j][0], b1 = j + 1 < CH.length ? CH[j + 1][0] : DUR;
          var k = t <= b0 ? 0 : t >= b1 ? 1 : (t - b0) / (b1 - b0);
          segs[j].firstChild.style.width = (k * 100) + '%';
        }
        if (i !== curCh) {
          curCh = i;
          chT.textContent = CH[i][1];
          for (var d = 0; d < dots.length; d++) dots[d].className = dotBase[d] + (d === i ? ' on' : '');
          for (var e2 = 0; e2 < segs.length; e2++) segs[e2].className = 'tx-cs' + (e2 === i ? ' on' : '');
          chBar.setAttribute('aria-valuetext', CH[i][1]);
        }
        chN.textContent = clock(t) + ' / ' + clock(DUR);
        chBar.setAttribute('aria-valuenow', Math.floor(t));
      }
      // 'timeupdate' fires ~4x a second, which is plenty for a 65-minute bar and
      // costs nothing next to putting this in the wall's rAF loop.
      a.addEventListener('timeupdate', paintCh);
      a.addEventListener('seeked', paintCh);

      /** Seek, and treat the tap as what it also is: a GESTURE. Tapping a chapter
       *  on a page whose sound the platform has refused should both move the
       *  playhead AND make the ask — kick() owns the un-mute/play decision, so a
       *  refused one still falls back cleanly and the dock stays honest. */
      function seekTo(t) {
        try { a.currentTime = Math.max(0, Math.min(DUR - 1, t)); } catch (e) {}
        paintCh();
        kick();
      }
      // Tap anywhere = seek proportionally; tap near a circle = open that chapter
      // at its first note. SNAP is in pixels, so the "near" zone feels the same
      // whatever the screen width.
      var SNAP = 13;
      chBar.addEventListener('click', function (ev) {
        var r = chWrap.getBoundingClientRect();
        if (!r.width) return;
        var x = ev.clientX - r.left, frac = Math.max(0, Math.min(1, x / r.width));
        var best = -1, bestPx = 1e9;
        for (var j = 0; j < CH.length; j++) {
          var px = Math.abs((CH[j][0] / DUR) * r.width - x);
          if (px < bestPx) { bestPx = px; best = j; }
        }
        seekTo(bestPx <= SNAP ? CH[best][0] : frac * DUR);
        show();
      });
      chBar.addEventListener('keydown', function (ev) {
        var k = ev.key, i = chapterAt(a.currentTime || 0);
        if (k === 'ArrowRight') seekTo((a.currentTime || 0) + 30);
        else if (k === 'ArrowLeft') seekTo((a.currentTime || 0) - 30);
        else if (k === 'PageDown') seekTo(CH[Math.min(CH.length - 1, i + 1)][0]);
        else if (k === 'PageUp') seekTo(CH[Math.max(0, i - 1)][0]);
        else if (k === 'Home') seekTo(0);
        else return;
        ev.preventDefault(); show();
      });

      // ── the 2-second auto-hide ───────────────────────────────────────────
      // "auto hide it if the user did not touch any in it for 2 seconds."
      var hideT = 0;
      function show() {
        chEl.classList.remove('tx-hid');
        clearTimeout(hideT);
        hideT = setTimeout(function () { chEl.classList.add('tx-hid'); }, 2000);
      }
      // Any contact with the room brings it back — including a plain pointermove,
      // so on a desktop it reappears under the cursor without a click.
      var wake = ['pointermove', 'pointerdown', 'touchstart', 'wheel', 'scroll', 'keydown'];
      for (var wi = 0; wi < wake.length; wi++) {
        room.addEventListener(wake[wi], show, { capture: true, passive: true });
      }
      paintCh();

      // ── ▶ THE TRANSPORT ─────────────────────────────────────────────────
      // The one play/pause control, now living on the rail instead of standing
      // alone above the wall. The LOGIC below is untouched from the ring it
      // replaces — same intent flag, same kick(), same dock mirroring — because
      // that logic is what keeps a refused platform ask honest.
      var pp = D.getElementById('tx-play');
      function paint() {
        var p = a.paused;
        pp.textContent = p ? '▶' : '❙❙';
        pp.setAttribute('aria-label', p ? 'Play the music' : 'Pause the music');
        dock.querySelector('.tx-dp').textContent = p ? '▶' : '❙❙';
      }
      pp.addEventListener('click', function () {
        graph();
        // Pressing it counts as touching the rail, so the bar stays up for
        // another 2s instead of fading out from under the finger.
        show();
        // Record the INTENT, so the revocation handler can tell the patient's own
        // ❙❙ apart from the platform yanking the sound away.
        if (a.paused) { userPaused = false; kick(); } else { userPaused = true; a.pause(); }
      });
      // 🎼 THE LENS BRIDGE (2026-08-17, Jarich: "mute all the videos … just play our
      // music room if ever they muted it earlier so theres still bg music"). The dd
      // gallery's lens (cinema bundle) calls this on a card tap — a real user
      // gesture — to bring the sermon back if the patient had paused it. Same
      // resume path as the patient's own ▶: intent recorded, kick() rides.
      window.__txEnsurePlay = function () {
        try { if (a.paused) { userPaused = false; kick(); } } catch (e) {}
      };
      // 🎬 THE HUSH BRIDGE (2026-09-01, Jarich: "when user press a video our thank
      // you mp3 player should mute so only one audio playing"). The growth-partner
      // lens calls this when a reel opens WITH SOUND; rides the same userPaused
      // seam as the patient's own ❙❙ so the revocation handler stays quiet.
      window.__txHush = function () {
        try { if (!a.paused) { userPaused = true; a.pause(); return true; } } catch (e) {}
        return false;
      };
      a.addEventListener('play', paint);
      a.addEventListener('pause', paint);
      paint();
    })();
