// sky/skyConfig.js — the dials the night sky and the particle cloud read. These are the
// values tuned on the FFC cinema and shipped there; they are constants here (no tuner,
// no storage), so the sky is identical on every device that opens it.

export const CFG = {
  // the particle cloud
  dotSize: 23,        // base point size, all beats
  heartSwell: 1.55,   // how much every dot grows on the heart beat

  // the motes that ride the scroll (the near layer)
  moteCount: 85,
  moteSize: 1.0,
  moteRise: 19.5,
  moteTwinkle: 3.0,

  // shooting stars
  shootEvery: 7,      // seconds between
  shootSpeed: 0.55,
  shootLen: 1.7,
  shootGlow: 2.3,

  // the moon (Mercury's map: a real cratered airless world reads as photographed)
  moonSize: 0.060,
  moonX: 0.81,
  moonY: 0.11,
  moonGlow: 1.0,
  moonPar: 0.036,     // its own parallax factor

  // the sun, seen from very far out
  sunSize: 0.015,
  sunGlow: 1.0,
  sunX: 0.50,
  sunY: 0.52,

  // the deep sky
  galaxy: 2.25,
  nebula: 1.25,
  farCount: 2800,
  midCount: 1600,
  consAlpha: 3.0,
  skyLift: 1.0,       // dark versus BLACK

  // motion
  speed: 0.5,
  parallax: 1.0,
  drift: 1.0,
};

// Where the moon texture lives in /public.
export const SKY_ASSET_BASE = "/cinema/";
