// ── THE BREATH ──────────────────────────────────────────────────────────────
// The catalogue and the afterglow cards, ported from the FFC room.
//
// Real timings per mode. A 4-7-8 that is not actually 4-7-8 is worse than no
// timer at all, so every phase length below is the canonical one and the clock
// is read from performance.now(), never from an accumulating setInterval that
// would drift over a few minutes of breathing.
//
// Each entry: [name, inhale, hold-in, exhale, hold-out, note, benefit]
// The BENEFIT slot speaks straight to the one person reading: what a minute of
// this does FOR YOU, no label in front of it. Kept gentle on purpose. It says
// "helps" and "settles", never a medical promise.
//
// The only edit against the source is punctuation: the house rule for public
// copy on this domain is periods and commas, never dashes, so every em dash in
// the notes, the benefits and the afterglow cards became a full stop, a comma
// or a colon. Not one word of the meaning moved.

export const MODES = [
  ['Coherent', 5.5, 0, 5.5, 0,
    'Six breaths a minute. The pace the heart settles into.',
    'One minute of this settles the heartbeat into an easy rhythm. The quickest way to clear a busy head between tasks.'],
  ['HRV', 4, 0, 6, 0,
    'Four in, six out. The one the biofeedback people build on.',
    'A few rounds build a calm you can feel in the chest. Lovely before a hard conversation, a big decision, or a long drive.'],
  ['Box', 4, 4, 4, 4,
    'Four square sides. What people reach for when the day is loud.',
    'Four steady sides hold you when pressure rises: traffic, deadlines, a phone that will not stop. The noise steps back.'],
  ['4-7-8', 4, 7, 8, 0,
    'The long way down. Worth saving for the end of the night.',
    'The long exhale tells the body the day is over, even when the mind has not agreed yet. Two rounds and sleep comes closer.'],
  ['4-2-4', 4, 2, 4, 0,
    'Small and easy, with one short pause. A good place to begin.',
    'The gentle first step. One minute loosens the shoulders. A kind place to start if breathing exercises are new to you.'],
  ['Equal', 4, 0, 4, 0,
    'Same in, same out. Nothing at all to remember.',
    'Nothing to count, nothing to hold. A minute of it steadies you anywhere: walking, queuing, waiting for your name.'],
  ['Triangle', 4, 4, 4, 0,
    'Three sides. In, hold, out. Steady as a metronome.',
    'The short hold sharpens attention. A minute before study or careful work, and the hands come back steadier.'],
  ['Long Exhale', 4, 0, 8, 0,
    'Out for twice as long as in. The unhurried one.',
    'The quickest way to tell the body the rush is over: after work, after a fright, before anything that needs you calm.'],
];

export const LABELS = ['Breathe in', 'Hold', 'Breathe out', 'Rest'];

/** The pattern the way a person says it. Zero-length phases are dropped. */
export function sig(m) {
  const out = [m[1]];
  if (m[2] > 0) out.push(m[2]);
  out.push(m[3]);
  if (m[4] > 0) out.push(m[4]);
  return out.join(' · ');
}

// ── the eight afterglows ────────────────────────────────────────────────────
// When the quiet minute reaches zero the pill does not announce anything: a
// card blooms in its place with a foil headline and three small chapters.
// You may feel · what just happened · spend this clarity on. Eight patterns,
// eight different cards. The science is real and the voice stays gentle:
// "may", "often", never a promise.
export const AFTER = [
  {
    h: 'Your heart and lungs just found the same rhythm',
    feel: 'warm hands, a slower steady pulse, more room in your head. some people feel a soft hum in the chest, and that is a good sign',
    sci: 'six breaths a minute is the pace where your breathing wave and your blood-pressure wave lock in step, the baroreflex, the heart’s own thermostat, swinging in full arcs. heart-rate variability, the number longevity researchers watch, rises toward its peak at exactly this rhythm. you tuned an instrument you did not know you carried',
    spend: 'the message you have been avoiding · walking back into a loud room · one clear decision. the next half hour is the steadiest your focus will be today',
  },
  {
    h: 'You just pressed a brake only your body knows about',
    feel: 'the chest loosens, the jaw lets go on its own, sounds seem a step further away',
    sci: 'every long exhale leans on the vagus nerve, the body’s rest and digest line, and the heart genuinely slows on each out breath. four in, six out keeps you on the calming side of every breath you take, which is why the biofeedback clinics built their whole method on it',
    spend: 'a hard conversation held kindly · a decision that needs a cool head · the long drive home',
  },
  {
    h: 'Four walls went up, and the noise stayed outside',
    feel: 'steadier hands, a flatter pulse, the feeling of standing one step back from the day',
    sci: 'equal sides hold the co₂ in your blood perfectly steady and give attention one simple anchor to hold. this exact square is what pilots, surgeons and first responders are drilled on before high stakes work. you just ran the same drill in a music room',
    spend: 'the deadline hour · speaking in front of people · traffic that wants a reaction from you',
  },
  {
    h: 'You just brewed your own sleeping draught',
    feel: 'heavier eyelids, a warm slow weight in the arms, thoughts arriving with more space between them',
    sci: 'the seven-count hold lets co₂ rise just enough to whisper “safe” to the nervous system, and the eight-count exhale doubles the vagal brake on the heart. done at the bedside, two or three rounds often outrun a racing mind. no draught, no cost, no morning after',
    spend: 'closing the day on purpose · putting the phone face-down · lying back and letting the ceiling be enough',
  },
  {
    h: 'A small kindness, quietly banked',
    feel: 'looser shoulders, an easier jaw, one honest notch calmer than a minute ago',
    sci: 'the two-count pause smooths the turn between in and out so the breath stops snagging. gentle enough to repeat many times a day, and repetition is exactly how a nervous system learns a new resting point. small deposits, real interest',
    spend: 'between errands · before you eat · the first minute after waking, before the phone wins',
  },
  {
    h: 'You just evened the scales',
    feel: 'balanced, level, strangely tidy, like a desk cleared without moving anything on it',
    sci: 'same in, same out roughly halves your usual breathing rate and holds the push and the rest of your nervous system in equal measure. the old schools call it sama vritti, equal motion. you just practised it on a dental equipment website, which they did not see coming',
    spend: 'walking anywhere · queues and waiting rooms · any moment that needs you present but not braced',
  },
  {
    h: 'You sharpened a tool you carry everywhere',
    feel: 'a clean, pointed alertness. calm, but with all the lights on',
    sci: 'the hold at the top trains your tolerance for co₂, and a touch more co₂ actually helps oxygen leave the blood and reach the brain. the bohr effect: the pause you were taught to fear is the part that feeds your head. attention gets a metronome; the mind stops changing tabs',
    spend: 'studying · careful, precise work · writing the thing that needs your whole mind',
  },
  {
    h: 'You just told every muscle the chase is over',
    feel: 'shoulders that finally sink, an exhale that keeps paying out, the floor holding more of you',
    sci: 'breathing out for twice as long keeps the heart on its slow beat for most of every cycle. the strongest calming lean a breath can give without lying down. the body reads the long exhale as one plain sentence: the running is done',
    spend: 'the moment you get home · after a fright or a hard hour · the last thing before sleep',
  },
];

export const AFTER_FOOTER = 'that was a minute. well done. tap to keep breathing';
