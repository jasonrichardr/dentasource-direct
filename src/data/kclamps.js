// src/data/kclamps.js
//
// Source of truth for /k-clamps — the K-Clamp rubber dam clamp line by Shinhung (Korea),
// distributed exclusively in the Philippines by DentaSource Direct.
//
// Photos: the DSD console's product photos (public/images/kclamps/c-<id>.jpg, native ~340–470 px,
// plus a -2x upscale for the detail sheet). Every clamp carries the FDI tooth numbers it is
// designed for, so the page can light the arch when a clamp is picked and list clamps when a
// tooth is picked. Indications follow the classic Ivory-style numbering that K-Clamp shares
// (00/0/1/2/2A/4/5/7/8/8A/10/11/12A/13A/14/14A/26/28/56, the W wingless and T tiger variants),
// the Hu-Friedy selection guide for the 200-series specials, the DSD console catalogue sheet for
// group membership (MOLAR / MT / PM / ANT / KIDS), and FDI primary-tooth numbering for the
// deciduous series (D54 = upper right first primary molar, E55 = upper right second, and so on).
// No prices on this page (DSD law: pricing on reply).

const U_MOLARS_R = [16, 17, 18];
const U_MOLARS_L = [26, 27, 28];
const L_MOLARS_R = [46, 47, 48];
const L_MOLARS_L = [36, 37, 38];
const U_MOLARS = [...U_MOLARS_R, ...U_MOLARS_L];
const L_MOLARS = [...L_MOLARS_R, ...L_MOLARS_L];
const MOLARS = [...U_MOLARS, ...L_MOLARS];
const THIRD_MOLARS = [18, 28, 38, 48];
const U_PREMOLARS = [14, 15, 24, 25];
const L_PREMOLARS = [34, 35, 44, 45];
const PREMOLARS = [...U_PREMOLARS, ...L_PREMOLARS];
const U_ANTERIORS = [11, 12, 13, 21, 22, 23];
const L_ANTERIORS = [31, 32, 33, 41, 42, 43];
const ANTERIORS = [...U_ANTERIORS, ...L_ANTERIORS];
const PRIMARY_MOLARS = [54, 55, 64, 65, 74, 75, 84, 85];

export const GROUPS = {
  molar: { label: 'Molar', short: 'Molar', color: '#6ee7ff', blurb: 'Upper and lower molars, from small round uppers to the big lower seconds.' },
  tiger: { label: 'Partially erupted', short: 'Erupting', color: '#a78bfa', blurb: 'Third molars and half-erupted teeth: deep four-point jaws, and the serrated Tiger jaws that bite below the bulge.' },
  premolar: { label: 'Premolar', short: 'Premolar', color: '#34d399', blurb: 'Flat-jawed clamps for bicuspids, with wide-neck and wingless options.' },
  anterior: { label: 'Anterior', short: 'Anterior', color: '#fbbf24', blurb: 'Incisors and canines, including the double-bow labial clamps for cervical work.' },
  kids: { label: 'Kids', short: 'Kids', color: '#fb7185', blurb: 'Primary molars, numbered the way the tooth is: D54 fits tooth 54.' },
};

export const GROUP_ORDER = ['molar', 'tiger', 'premolar', 'anterior', 'kids'];

const img = (id) => ({ photo: `/images/kclamps/c-${id}.jpg`, photo2x: `/images/kclamps/c-${id}-2x.jpg` });

export const clamps = [
  // ===================== MOLAR =====================
  { id: '4', label: '4', group: 'molar', winged: true, arch: 'upper', jaws: 'Narrow jaws', teeth: U_MOLARS,
    use: 'Small upper molars. The narrow jaws adapt to round teeth.', ...img('4') },
  { id: '5', label: '5', group: 'molar', winged: true, arch: 'upper', jaws: 'Deeply festooned', teeth: U_MOLARS,
    use: 'Large upper molars. Deeply festooned jaws follow the curve of the gum line.', ...img('5') },
  { id: '7', label: '7', group: 'molar', winged: true, arch: 'lower', jaws: 'Flat, medium bow', teeth: L_MOLARS,
    use: 'The general-purpose lower molar clamp. Flat jaws sit on teeth that tend to be flat at the neck.', ...img('7') },
  { id: '8', label: '8', group: 'molar', winged: true, arch: 'upper', jaws: 'Four-point', teeth: U_MOLARS,
    use: 'The general-purpose upper molar clamp.', ...img('8') },
  { id: '8a', label: '8A', group: 'molar', winged: true, arch: 'both', jaws: 'Four-point, deeply festooned', teeth: MOLARS,
    use: 'Upper and lower molar roots. Four-point jaws grasp the root at its corners and seat the dam below the gum line when released.', ...img('8a') },
  { id: 'w8a', label: 'W8A', group: 'molar', winged: false, arch: 'both', jaws: 'Four-point, wingless', teeth: MOLARS,
    use: 'The wingless 8A. Same root-grasping four-point jaws, no wings, for the dam-first technique.', ...img('w8a') },
  { id: '10', label: '10', group: 'molar', winged: true, arch: 'both', jaws: 'Buccal jaw broader', teeth: [...U_MOLARS_L, ...L_MOLARS_R],
    use: 'Small upper-left and lower-right molars with short crowns. The buccal jaw is broader than the lingual.', ...img('10') },
  { id: '11', label: '11', group: 'molar', winged: true, arch: 'both', jaws: 'Buccal jaw broader', teeth: [...U_MOLARS_R, ...L_MOLARS_L],
    use: 'Small upper-right and lower-left molars with short crowns. The mirror of the 10.', ...img('11') },
  { id: '26', label: '26', group: 'molar', winged: true, arch: 'upper', jaws: 'Festooned', teeth: U_MOLARS,
    use: 'The universal upper molar clamp, with festooned jaws.', ...img('26') },
  { id: '28', label: '28', group: 'molar', winged: true, arch: 'lower', jaws: 'Four-point', teeth: L_MOLARS,
    use: 'General-purpose lower molar clamp with four-point jaws.', ...img('28') },
  { id: '56', label: '56', group: 'molar', winged: true, arch: 'both', jaws: 'Universal', teeth: MOLARS,
    use: 'All large upper and lower molars. If a clinic keeps one molar clamp, it is usually this one.', ...img('56') },
  { id: '201', label: '201', group: 'molar', winged: false, arch: 'upper', jaws: 'Offset', teeth: U_MOLARS,
    use: 'Upper molars with buccal caries. The offset jaws leave the buccal cervical area clear for the restoration.', ...img('201') },
  { id: '202', label: '202', group: 'molar', winged: false, arch: 'both', jaws: 'Wingless molar', teeth: MOLARS,
    use: 'Wingless molar clamp from the 200 series. Low profile, for the technique where the dam goes on first and the clamp follows.', ...img('202') },
  { id: '203', label: '203', group: 'molar', winged: false, arch: 'both', jaws: 'Wingless molar', teeth: MOLARS,
    use: 'Wingless molar clamp, a size step from the 202. Same low profile, for the dam-first technique.', ...img('203') },
  { id: '204', label: '204', group: 'molar', winged: true, arch: 'both', jaws: 'Winged molar', teeth: MOLARS,
    use: 'Winged molar clamp from the 200 series, for the clamp-and-dam-together technique with plenty of wing to hold the sheet.', ...img('204') },
  { id: '205', label: '205', group: 'molar', winged: true, arch: 'upper', jaws: 'Offset', teeth: U_MOLARS,
    use: 'Upper molars with lingual caries. The offset jaws keep the lingual cervical area clear.', ...img('205') },

  // ===================== PARTIALLY ERUPTED / TIGER =====================
  { id: '12a', label: '12A', group: 'tiger', winged: true, arch: 'lower', jaws: 'Four-point, deep', teeth: L_MOLARS_R,
    use: 'All lower-right molars, especially third molars and partially erupted teeth.', ...img('12a') },
  { id: '13a', label: '13A', group: 'tiger', winged: true, arch: 'lower', jaws: 'Four-point, deep', teeth: L_MOLARS_L,
    use: 'All lower-left molars, especially third molars and partially erupted teeth. The mirror of the 12A.', ...img('13a') },
  { id: '14', label: '14', group: 'tiger', winged: true, arch: 'both', jaws: 'Deeply festooned four-point', teeth: MOLARS,
    use: 'Partially erupted, round or irregular upper and lower molars. The most-used clamp in the box.', ...img('14') },
  { id: '14a', label: '14A', group: 'tiger', winged: true, arch: 'both', jaws: 'Deeply festooned, larger', teeth: MOLARS,
    use: 'The 14, larger in every dimension, for large and partially erupted molars.', ...img('14a') },
  { id: '14t', label: '14T', group: 'tiger', winged: true, arch: 'both', jaws: 'Serrated Tiger jaws', teeth: [...MOLARS],
    use: 'The Tiger 14: serrated jaw tips that bite into the tooth below the height of contour, for molars that push a smooth clamp off.', ...img('14t') },
  { id: '56t', label: '56T', group: 'tiger', winged: true, arch: 'both', jaws: 'Serrated Tiger jaws', teeth: MOLARS,
    use: 'The Tiger 56: the universal large-molar clamp with serrated jaws for extra grip on short or broken-down crowns.', ...img('56t') },

  // ===================== PREMOLAR =====================
  { id: '00', label: '00', group: 'premolar', winged: true, arch: 'both', jaws: 'High bow, narrow', teeth: [...L_PREMOLARS, 33, 43, ...U_PREMOLARS],
    use: 'Small lower canines and premolars, and teeth set irregularly in the arch. The high bow and narrow jaws sit where a standard premolar clamp will not.', ...img('00') },
  { id: '0', label: '0', group: 'premolar', winged: true, arch: 'both', jaws: 'Flat, small', teeth: PREMOLARS,
    use: 'Small or elongated premolars with a narrow neck.', ...img('0') },
  { id: '1', label: '1', group: 'premolar', winged: true, arch: 'upper', jaws: 'Flat', teeth: U_PREMOLARS,
    use: 'The general-purpose upper premolar clamp.', ...img('1') },
  { id: '2', label: '2', group: 'premolar', winged: true, arch: 'lower', jaws: 'Flat', teeth: L_PREMOLARS,
    use: 'The general-purpose lower premolar clamp. Flat jaws so the clamp does not rock on a flat neck.', ...img('2') },
  { id: '2a', label: '2A', group: 'premolar', winged: true, arch: 'both', jaws: 'Extended flat', teeth: PREMOLARS,
    use: 'Upper and lower premolars with large necks. The 2 with a wider reach.', ...img('2a') },
  { id: 'w2a', label: 'W2A', group: 'premolar', winged: false, arch: 'both', jaws: 'Extended flat, wingless', teeth: PREMOLARS,
    use: 'The wingless 2A, for large-neck premolars with the dam-first technique.', ...img('w2a') },
  { id: '206', label: '206', group: 'premolar', winged: false, arch: 'both', jaws: 'Wingless premolar', teeth: PREMOLARS,
    use: 'Wingless premolar clamp from the 200 series, the small size.', ...img('206') },
  { id: '207', label: '207', group: 'premolar', winged: false, arch: 'both', jaws: 'Wingless premolar', teeth: PREMOLARS,
    use: 'Wingless premolar clamp from the 200 series, a size up from the 206.', ...img('207') },
  { id: '208', label: '208', group: 'premolar', winged: true, arch: 'both', jaws: 'Winged premolar', teeth: PREMOLARS,
    use: 'Winged premolar clamp from the 200 series, for the clamp-and-dam-together technique.', ...img('208') },
  { id: '209', label: '209', group: 'premolar', winged: true, arch: 'both', jaws: 'Offset', teeth: PREMOLARS,
    use: 'Premolars with buccal caries. Offset jaws keep the buccal cervical area open for the restoration.', ...img('209') },

  // ===================== ANTERIOR =====================
  { id: '210', label: '210', group: 'anterior', winged: false, arch: 'both', jaws: 'Anterior, curved bow', teeth: ANTERIORS,
    use: 'Upper and lower incisors and canines. The bow curves away from the labial face so it stays out of the field.', ...img('210') },
  { id: '211', label: '211', group: 'anterior', winged: false, arch: 'both', jaws: 'Anterior, curved bow', teeth: ANTERIORS,
    use: 'The 210 in the next size, for larger anteriors and canines.', ...img('211') },
  { id: '212', label: '212', group: 'anterior', winged: false, arch: 'both', jaws: 'Double bow, labial', teeth: ANTERIORS,
    use: 'Labial cervical caries on anterior teeth. The double bow lets the lingual jaw hold while the labial jaw retracts gum and dam below the lesion. Usually stabilised with compound.', ...img('212') },
  { id: '44', label: '44', group: 'anterior', winged: false, arch: 'both', jaws: 'Butterfly', teeth: ANTERIORS,
    use: 'Butterfly-pattern anterior clamp. Wide, thin jaws for incisors and canines when the 212 is too much clamp for the tooth.', ...img('44') },

  // ===================== KIDS =====================
  { id: 'p1', label: 'P1', group: 'kids', winged: true, arch: 'both', jaws: 'Small four-point', teeth: PRIMARY_MOLARS,
    use: 'Pediatric clamp for primary molars, the smaller of the two P sizes.', ...img('p1') },
  { id: 'p2', label: 'P2', group: 'kids', winged: true, arch: 'both', jaws: 'Small four-point, larger', teeth: PRIMARY_MOLARS,
    use: 'Pediatric clamp for primary molars, the larger P size.', ...img('p2') },
  { id: '54', label: 'D54', group: 'kids', winged: true, arch: 'upper', jaws: 'Primary molar', teeth: [54],
    use: 'Made for tooth 54, the upper-right first primary molar.', ...img('54') },
  { id: '55', label: 'E55', group: 'kids', winged: true, arch: 'upper', jaws: 'Primary molar', teeth: [55],
    use: 'Made for tooth 55, the upper-right second primary molar.', ...img('55') },
  { id: '64', label: 'D64', group: 'kids', winged: true, arch: 'upper', jaws: 'Primary molar', teeth: [64],
    use: 'Made for tooth 64, the upper-left first primary molar.', ...img('64') },
  { id: '65', label: 'E65', group: 'kids', winged: true, arch: 'upper', jaws: 'Primary molar', teeth: [65],
    use: 'Made for tooth 65, the upper-left second primary molar.', ...img('65') },
  { id: '74', label: 'D74', group: 'kids', winged: true, arch: 'lower', jaws: 'Primary molar', teeth: [74],
    use: 'Made for tooth 74, the lower-left first primary molar.', ...img('74') },
  { id: '75', label: 'E75', group: 'kids', winged: true, arch: 'lower', jaws: 'Primary molar', teeth: [75],
    use: 'Made for tooth 75, the lower-left second primary molar.', ...img('75') },
  { id: '84', label: 'D84', group: 'kids', winged: true, arch: 'lower', jaws: 'Primary molar', teeth: [84],
    use: 'Made for tooth 84, the lower-right first primary molar.', ...img('84') },
  { id: '85', label: 'E85', group: 'kids', winged: true, arch: 'lower', jaws: 'Primary molar', teeth: [85],
    use: 'Made for tooth 85, the lower-right second primary molar.', ...img('85') },
];

export const kits = [
  {
    id: 'adult-kit',
    name: 'K-Clamp Adult Kit',
    count: '12 clamps + 3 instruments',
    body: 'The starter box. Six molar clamps (14, 201, 202, 203, 204, 205), four premolar clamps (206, 207, 208, 209), two anterior clamps (210, 211), plus the K-Clamp punch, the K-Clamp forceps and the adult frame.',
    items: ['14', '201', '202', '203', '204', '205', '206', '207', '208', '209', '210', '211'],
  },
  {
    id: 'full-set',
    name: 'K-Clamp 46-Piece Set',
    count: '46 clamps',
    body: 'Every adult size on this page in one tray, matte or glossy: the classic numbers, the 200 series, the wingless W sizes and the serrated Tigers. For the clinic that does not want to send anyone out for a clamp mid-procedure.',
    items: [],
  },
  {
    id: 'deciduous-kit',
    name: 'K-Clamp Deciduous Kit',
    count: '8 primary-molar sizes',
    body: 'Clamps made for baby teeth, one for each primary molar, numbered after the tooth: D54, E55, D64, E65, D74, E75, D84, E85. Matte or glossy.',
    items: ['54', '55', '64', '65', '74', '75', '84', '85'],
  },
  {
    id: 'refills',
    name: 'Single clamps',
    count: 'Any size, per piece',
    body: 'Every size sold one at a time, so the clamp you bend or lose is the only one you replace. Matte and glossy finishes are stocked at the Pasig showroom.',
    items: [],
  },
];

export const features = [
  { title: 'Outstanding elasticity', body: 'The steel springs back. A K-Clamp survives the forceps, the tooth and the autoclave without opening up, so the fit you had on day one is the fit you have a year later.' },
  { title: 'Soft-processed edges', body: 'Every jaw edge is soft-processed at the factory. Shinhung’s own line for it is superior comfort for the patient, prevents unwanted trauma. In the mouth, the difference between a clamp that seats and one that scars the gingiva.' },
  { title: 'Matte or glossy', body: 'The matte finish kills the glare under the operatory light; the glossy finish is the classic mirror steel. Both are the same clamp underneath.' },
  { title: 'Autoclavable to 121°C', body: 'Stainless steel, fabricated to resist corrosion in the intraoral and autoclave conditions. Fully autoclavable at 121°C, with no coating to flake. Sterilize it the way you sterilize everything else.' },
];

export const faqs = [
  { q: 'Which K-Clamp do I use for a lower molar root canal?', a: 'Start with the 56 for a large lower molar, the 7 for a general lower molar, or the 14 if the tooth is partially erupted or short. If a smooth clamp keeps slipping off a broken-down crown, the serrated 14T or 56T Tiger holds where the others will not.' },
  { q: 'What is the difference between winged and wingless?', a: 'Winged clamps (the classic numbers and the 204, 208) carry the dam with them: you stretch the sheet over the wings, place the clamp and tooth and dam go on together. Wingless clamps (the W sizes, and the 202, 203, 206, 207) go on the tooth first and the dam is stretched over them after, which gives you a clear view of the seat. Most dentists keep both.' },
  { q: 'Are the deciduous clamps really one per tooth?', a: 'Yes. The K-Clamp deciduous kit is eight clamps numbered after the FDI primary molars: D54 for tooth 54, E55 for tooth 55, and so on around the mouth. The P1 and P2 are the two general pediatric sizes if you would rather carry two than eight.' },
  { q: 'Matte or glossy?', a: 'Matte is the one most of our clinics choose now: no reflection under the light or in photographs. Glossy is the traditional finish. Both are the same stainless steel and the same jaw geometry, and both are stocked in Pasig.' },
  { q: 'Is DentaSource Direct the official K-Clamp distributor in the Philippines?', a: 'Yes. DSD is the exclusive Philippine distributor for the K-Clamp line by Shinhung of Korea, the same way it is for ROSON chairs and Denjoy endodontics. Kits and single clamps ship from the Pasig showroom, and a clinic can handle and compare every size there before buying.' },
];

export function clampsForTooth(fdi) {
  return clamps.filter((c) => c.teeth.includes(fdi));
}

export function clampById(id) {
  return clamps.find((c) => c.id === id) || null;
}

export const PRIMARY_TEETH = [55, 54, 53, 52, 51, 61, 62, 63, 64, 65, 85, 84, 83, 82, 81, 71, 72, 73, 74, 75];
export const ADULT_TEETH = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28, 48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];
