'use server';

import prisma from '@/lib/prisma';
import { cookies, headers } from 'next/headers';
import {
  DESK_COOKIE, REHEARSAL_COOKIE, tokenFor, isDeskCookie, isRehearsalCookie,
  pinLocked, pinFailed, pinSucceeded, pinMatches, qrTokenFor, codeFromQrToken,
} from '@/lib/spin/tokens';
import { PRIZES, PRIZE_BY_ID, pickPrize, wedgeIndexFor, effectivePrizes, effectiveChances } from '@/lib/spin/prizes';
import {
  INTEREST_REAL, INTEREST_TEST, INTEREST_PRE, INTEREST_PRE_TEST, normalizePhone, splitName, makeCode, isValidCode,
  isValidEmail, eventStatus, prizePrefix, messageFor, parseMessage, claimedMessage, manilaStamp, reservedMessage, parseReserved,
} from '@/lib/spin/format';
import { callConvex, normalizeSocial } from '@/lib/spin/console';

const BOOTH_INTERESTS = [INTEREST_REAL, INTEREST_TEST];
const PRE_INTERESTS = [INTEREST_PRE, INTEREST_PRE_TEST];
const ALL_INTERESTS = [...BOOTH_INTERESTS, ...PRE_INTERESTS];
const CONSOLE_KEY = () => process.env.NADTI_INTAKE_KEY || '';

// The console handoff never blocks the visitor: any failure is logged and swallowed.
async function intakeSafe(payload) {
  if (!CONSOLE_KEY()) return null;
  try {
    return await callConvex('mutation', 'consoleNadti:intake', { key: CONSOLE_KEY(), ...payload }, { timeoutMs: 5000 });
  } catch (e) {
    console.error('[spin] console intake failed:', e?.message || e);
    return null;
  }
}

const cookieOpts = (maxAge) => ({
  httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/spin', maxAge,
});

async function isRehearsal() {
  const c = await cookies();
  return isRehearsalCookie(c.get(REHEARSAL_COOKIE)?.value);
}

async function clientIp() {
  const h = await headers();
  return (h.get('x-forwarded-for') || h.get('x-real-ip') || 'local').split(',')[0].trim();
}

// Shared PIN check with a per-IP failure counter and a slow path on failure.
// which = 'desk' (SPIN_DESK_PIN) | 'rehearsal' (SPIN_REHEARSAL_PIN, falls back to the desk PIN).
async function checkPin(pin, which = 'desk') {
  const ip = await clientIp();
  if (pinLocked(ip)) return { error: 'Too many attempts. Try again in 15 minutes.' };
  if (!process.env.SPIN_DESK_PIN) return { error: 'Desk PIN is not configured on the server.' };
  const expected = which === 'rehearsal' ? (process.env.SPIN_REHEARSAL_PIN || process.env.SPIN_DESK_PIN) : process.env.SPIN_DESK_PIN;
  if (!pinMatches(pin, expected)) {
    pinFailed(ip);
    await new Promise((r) => setTimeout(r, 700));
    return { error: 'Wrong PIN.' };
  }
  pinSucceeded(ip);
  return { ok: true };
}

async function currentInterest() {
  return (await isRehearsal()) ? INTEREST_TEST : INTEREST_REAL;
}

async function status() {
  return eventStatus({ override: process.env.SPIN_STATUS || 'auto', rehearsal: await isRehearsal() });
}

function shapeLead(lead) {
  const reserved = PRE_INTERESTS.includes(lead.interest) ? parseReserved(lead.message) : null;
  const parsed = reserved
    ? { prizeLabel: 'Reserved spin', code: reserved.code, claimed: null }
    : (parseMessage(lead.message) || { prizeLabel: '', code: '', claimed: null });
  const prize = PRIZES.find((p) => p.label === parsed.prizeLabel) || null;
  return {
    leadId: lead.id,
    name: `${lead.firstName} ${lead.lastName}`.replace(/ -$/, ''),
    clinic: lead.clinicName || '',
    phone: lead.phone,
    email: lead.email,
    prizeId: prize?.id || null,
    prizeLabel: parsed.prizeLabel,
    code: parsed.code,
    claimed: parsed.claimed,
    reserved: !!reserved,
    test: lead.interest === INTEREST_TEST || lead.interest === INTEREST_PRE_TEST,
    createdAt: lead.createdAt instanceof Date ? lead.createdAt.toISOString() : String(lead.createdAt),
  };
}

async function prizeCounts(interest, overrides = {}) {
  const capped = effectivePrizes(overrides).filter((p) => p.cap != null);
  const nums = await Promise.all(capped.map((p) =>
    prisma.lead.count({ where: { interest, message: { startsWith: prizePrefix(p.label) } } })));
  return Object.fromEntries(capped.map((p, i) => [p.id, nums[i]]));
}

async function uniqueCode() {
  for (let i = 0; i < 25; i++) {
    const code = makeCode();
    const hit = await prisma.lead.findFirst({
      where: { interest: { in: ALL_INTERESTS }, message: { contains: `Code: ${code}` } },
      select: { id: true },
    });
    if (!hit) return code;
  }
  throw new Error('Could not allocate a claim code');
}

// ───────────── live booth controls (BoothSetting) ─────────────

const CONFIG_KEY = 'prizes';

/** { [prizeId]: { active?, weight?, cap? } } as saved from the desk. Empty when untouched. */
async function loadOverrides() {
  try {
    const row = await prisma.boothSetting.findUnique({ where: { key: CONFIG_KEY } });
    const o = row ? JSON.parse(row.value) : {};
    return o && typeof o === 'object' ? o : {};
  } catch (e) {
    console.error('[spin] loadOverrides failed:', e?.message || e);
    return {};
  }
}

async function saveOverrides(overrides) {
  const value = JSON.stringify(overrides);
  await prisma.boothSetting.upsert({ where: { key: CONFIG_KEY }, update: { value }, create: { key: CONFIG_KEY, value } });
}

// ───────────── visitor ─────────────

export async function submitSpin(formData) {
  const name = String(formData.get('name') || '').trim();
  const clinic = String(formData.get('clinic') || '').trim();
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const phoneRaw = String(formData.get('phone') || '').trim();
  const consent = formData.get('consent') === 'on';
  const placeId = String(formData.get('placeId') || '').trim() || null;
  const placeName = String(formData.get('placeName') || '').trim() || null;
  const placeAddress = String(formData.get('placeAddress') || '').trim() || null;
  const placeLat = Number(formData.get('placeLat'));
  const placeLng = Number(formData.get('placeLng'));
  const hasGeo = placeId && Number.isFinite(placeLat) && Number.isFinite(placeLng) && (placeLat !== 0 || placeLng !== 0);

  const fields = {};
  const phone = normalizePhone(phoneRaw);
  if (!phone) fields.phone = 'Please enter a Philippine mobile number, like 0917 123 4567.';
  if (Object.keys(fields).length) return { error: 'Please check the form.', fields };

  // Pre-registered before the event: their reserved row fills whatever the form left blank
  // (the welcome-back path sends the number only), and their consent was given at registration.
  const pre = await prisma.lead.findFirst({ where: { phone, interest: { in: PRE_INTERESTS } }, orderBy: { createdAt: 'desc' } });
  const preName = pre ? `${pre.firstName} ${pre.lastName}`.replace(/ -$/, '') : '';
  const fullName = name || preName;
  const fullClinic = clinic || pre?.clinicName || '';
  const fullEmail = email || (pre?.email || '').toLowerCase();
  if (fullName.length < 2) fields.name = 'Please enter your full name.';
  if (fullClinic.length < 2) fields.clinic = 'Please enter your dental clinic.';
  if (!isValidEmail(fullEmail)) fields.email = 'Please enter a valid email address.';
  if (!consent && !pre) fields.consent = 'Please tick the box so we can contact you.';
  if (Object.keys(fields).length) return { error: 'Please check the form.', fields };

  if ((await status()) === 'closed') return { closed: true };

  const interest = await currentInterest();

  const existing = await prisma.lead.findFirst({
    where: { phone, interest: { in: BOOTH_INTERESTS } },
    orderBy: { createdAt: 'desc' },
  });
  if (existing) {
    const s = shapeLead(existing);
    return { already: true, leadId: s.leadId, prizeId: s.prizeId, code: s.code, qr: qrTokenFor(s.code), wedgeIndex: s.prizeId ? wedgeIndexFor(s.prizeId) : 0 };
  }

  const overrides = await loadOverrides();
  const counts = await prizeCounts(interest, overrides);
  const pick = pickPrize({ counts, overrides });
  const prize = PRIZE_BY_ID[pick.id];
  const { firstName, lastName } = splitName(fullName);
  const reservedCode = pre ? parseReserved(pre.message)?.code : null;
  const code = reservedCode || await uniqueCode();

  // A reserved row becomes the spin row: same code, so the console pin upgrades in place.
  const lead = pre
    ? await prisma.lead.update({
      where: { id: pre.id },
      data: { firstName, lastName, email: fullEmail, clinicName: fullClinic, interest, message: messageFor({ label: prize.label, code }) },
    })
    : await prisma.lead.create({
      data: {
        firstName, lastName, email: fullEmail, phone,
        clinicName: fullClinic,
        interest,
        message: messageFor({ label: prize.label, code }),
        status: 'NEW',
      },
    });

  if (interest === INTEREST_REAL) {
    await intakeSafe({
      contactName: fullName, clinic: fullClinic, email: fullEmail, phone,
      ...(hasGeo ? { placeId, placeName: placeName || undefined, address: placeAddress || undefined, lat: placeLat, lng: placeLng } : {}),
      prizeLabel: prize.label, code, test: false,
    });
  }

  return { ok: true, leadId: lead.id, prizeId: pick.id, code, qr: qrTokenFor(code), wedgeIndex: pick.wedgeIndex, placeId: hasGeo ? placeId : null, clinic: fullClinic, reserved: !!pre };
}

/**
 * Pre-registration before the wheel opens: same four fields, a reserved spin with its own code and
 * backup QR. Rehearsal devices write TEST rows that never reach the console. Once the wheel is open
 * (and this is not a rehearsal preview) the visitor is sent to the live gate instead.
 */
export async function preRegister(formData) {
  const name = String(formData.get('name') || '').trim();
  const clinic = String(formData.get('clinic') || '').trim();
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const phoneRaw = String(formData.get('phone') || '').trim();
  const consent = formData.get('consent') === 'on';
  const placeId = String(formData.get('placeId') || '').trim() || null;
  const placeName = String(formData.get('placeName') || '').trim() || null;
  const placeAddress = String(formData.get('placeAddress') || '').trim() || null;
  const placeLat = Number(formData.get('placeLat'));
  const placeLng = Number(formData.get('placeLng'));
  const hasGeo = placeId && Number.isFinite(placeLat) && Number.isFinite(placeLng) && (placeLat !== 0 || placeLng !== 0);

  const fields = {};
  if (name.length < 2) fields.name = 'Please enter your full name.';
  if (clinic.length < 2) fields.clinic = 'Please enter your dental clinic.';
  if (!isValidEmail(email)) fields.email = 'Please enter a valid email address.';
  const phone = normalizePhone(phoneRaw);
  if (!phone) fields.phone = 'Please enter a Philippine mobile number, like 0917 123 4567.';
  if (!consent) fields.consent = 'Please tick the box so we can contact you.';
  if (Object.keys(fields).length) return { error: 'Please check the form.', fields };

  const rehearsal = await isRehearsal();
  if (!rehearsal && (await status()) === 'open') return { open: true };
  const interest = rehearsal ? INTEREST_PRE_TEST : INTEREST_PRE;

  const spun = await prisma.lead.findFirst({ where: { phone, interest: { in: BOOTH_INTERESTS } }, select: { id: true } });
  if (spun) return { error: 'This number already spun the wheel.' };
  const existing = await prisma.lead.findFirst({ where: { phone, interest: { in: PRE_INTERESTS } }, orderBy: { createdAt: 'desc' } });
  if (existing) {
    const s = shapeLead(existing);
    return { ok: true, already: true, leadId: s.leadId, code: s.code, qr: qrTokenFor(s.code), firstName: existing.firstName, name: s.name, clinic: s.clinic, email: s.email, phone };
  }

  const code = await uniqueCode();
  const { firstName, lastName } = splitName(name);
  const lead = await prisma.lead.create({
    data: { firstName, lastName, email, phone, clinicName: clinic, interest, message: reservedMessage(code), status: 'NEW' },
  });

  if (interest === INTEREST_PRE) {
    await intakeSafe({
      contactName: name, clinic, email, phone,
      ...(hasGeo ? { placeId, placeName: placeName || undefined, address: placeAddress || undefined, lat: placeLat, lng: placeLng } : {}),
      prizeLabel: 'reserved spin', code, test: false, kind: 'prereg',
    });
  }

  return { ok: true, leadId: lead.id, code, qr: qrTokenFor(code), firstName, name, clinic, email, phone };
}

/** "Pre-registered? Enter your number": first name + clinic only, so the welcome-back card can greet them. */
export async function lookupReservation(phoneRaw) {
  const phone = normalizePhone(phoneRaw);
  if (!phone) return { error: 'Please enter a Philippine mobile number, like 0917 123 4567.' };
  const spun = await prisma.lead.findFirst({ where: { phone, interest: { in: BOOTH_INTERESTS } }, select: { id: true } });
  if (spun) return { spun: true };
  const pre = await prisma.lead.findFirst({ where: { phone, interest: { in: PRE_INTERESTS } }, orderBy: { createdAt: 'desc' } });
  if (!pre) return { found: false };
  return { found: true, firstName: pre.firstName, clinic: pre.clinicName || '', phone };
}

/** Google Places matches for the clinic the visitor typed. Empty on any failure. */
export async function lookupClinic(q) {
  const query = String(q || '').trim();
  if (query.length < 3 || !CONSOLE_KEY()) return [];
  try {
    const rows = await callConvex('action', 'consoleNadti:searchClinic', { key: CONSOLE_KEY(), q: query }, { timeoutMs: 6000 });
    return Array.isArray(rows) ? rows.slice(0, 3) : [];
  } catch (e) {
    console.error('[spin] lookupClinic failed:', e?.message || e);
    return [];
  }
}

/** Saves a social link on the visitor's console prospect. Rehearsal spins report ok without touching the console. */
export async function linkClinicSocial(leadId, code, platform, value) {
  const lead = await prisma.lead.findUnique({ where: { id: String(leadId) } });
  if (!lead || !BOOTH_INTERESTS.includes(lead.interest)) return { error: 'Spin not found.' };
  const parsed = parseMessage(lead.message);
  if (!parsed || parsed.code !== String(code).toUpperCase()) return { error: 'Spin not found.' };
  const url = normalizeSocial(platform, value);
  if (!url) return { error: platform === 'google' ? 'Paste a Google Maps link.' : 'Paste your page link or type your @handle.' };
  if (lead.interest === INTEREST_TEST) return { ok: true, url, skipped: 'test' };
  if (!CONSOLE_KEY()) return { ok: true, url, skipped: 'nokey' };
  try {
    const r = await callConvex('mutation', 'consoleNadti:linkSocial', { key: CONSOLE_KEY(), code: parsed.code, platform, value }, { timeoutMs: 5000 });
    if (r?.ok) return { ok: true, url: r.url };
    if (r?.reason === 'no_prospect') return { ok: true, url, skipped: 'no_prospect' };
    return { error: 'That link does not look right.' };
  } catch (e) {
    console.error('[spin] linkClinicSocial failed:', e?.message || e);
    return { ok: true, url, skipped: 'offline' };
  }
}

export async function respin(leadId, code) {
  const lead = await prisma.lead.findUnique({ where: { id: String(leadId) } });
  if (!lead || !BOOTH_INTERESTS.includes(lead.interest)) return { error: 'Spin not found.' };
  const parsed = parseMessage(lead.message);
  if (!parsed || parsed.code !== String(code).toUpperCase() || parsed.prizeLabel !== 'Spin again') {
    return { error: 'This spin cannot be repeated.' };
  }
  const overrides = await loadOverrides();
  const counts = await prizeCounts(lead.interest, overrides);
  const pick = pickPrize({ counts, excludeSpinAgain: true, overrides });
  const prize = PRIZE_BY_ID[pick.id];
  await prisma.lead.update({
    where: { id: lead.id },
    data: { message: messageFor({ label: prize.label, code: parsed.code }) },
  });
  return { ok: true, leadId: lead.id, prizeId: pick.id, code: parsed.code, qr: qrTokenFor(parsed.code), wedgeIndex: pick.wedgeIndex };
}

export async function enterRehearsal(pin) {
  const r = await checkPin(pin, 'rehearsal');
  if (r.error) return r;
  const c = await cookies();
  c.set(REHEARSAL_COOKIE, tokenFor('rehearsal'), cookieOpts(60 * 60 * 24));
  return { ok: true };
}

export async function leaveRehearsal() {
  const c = await cookies();
  c.set(REHEARSAL_COOKIE, '', cookieOpts(0));
  return { ok: true };
}

// ───────────── desk ─────────────

async function requireDesk() {
  const c = await cookies();
  if (!isDeskCookie(c.get(DESK_COOKIE)?.value)) throw new Error('Unauthorized');
}

export async function deskLogin(pin) {
  const r = await checkPin(pin);
  if (r.error) return r;
  const c = await cookies();
  c.set(DESK_COOKIE, tokenFor('desk'), cookieOpts(60 * 60 * 12));
  return { ok: true };
}

export async function deskLogout() {
  const c = await cookies();
  c.set(DESK_COOKIE, '', cookieOpts(0));
  return { ok: true };
}

export async function deskTally() {
  await requireDesk();
  const todayYmd = manilaStamp().slice(0, 10);
  const dayStart = new Date(`${todayYmd}T00:00:00+08:00`);
  const [total, today, testCount, claimedTotal, reserved, ...per] = await Promise.all([
    prisma.lead.count({ where: { interest: INTEREST_REAL } }),
    prisma.lead.count({ where: { interest: INTEREST_REAL, createdAt: { gte: dayStart } } }),
    prisma.lead.count({ where: { interest: { in: [INTEREST_TEST, INTEREST_PRE_TEST] } } }),
    prisma.lead.count({ where: { interest: INTEREST_REAL, message: { startsWith: 'Prize: ' }, NOT: { message: { contains: 'Claimed: no' } } } }),
    prisma.lead.count({ where: { interest: INTEREST_PRE } }),
    ...PRIZES.map((p) => prisma.lead.count({ where: { interest: INTEREST_REAL, message: { startsWith: prizePrefix(p.label) } } })),
    ...PRIZES.map((p) => prisma.lead.count({ where: { interest: INTEREST_REAL, message: { startsWith: prizePrefix(p.label) }, NOT: { message: { contains: 'Claimed: no' } } } })),
  ]);
  const n = PRIZES.length;
  const overrides = await loadOverrides();
  const eff = effectivePrizes(overrides);
  const countsReal = Object.fromEntries(PRIZES.map((p, i) => [p.id, per[i]]));
  const chances = effectiveChances(countsReal, overrides);
  const byPrize = Object.fromEntries(eff.map((p, i) => [p.id, { count: per[i], claimed: per[n + i], cap: p.cap, label: p.label, active: p.active, weight: p.weight, defaultWeight: PRIZES[i].weight, defaultCap: PRIZES[i].cap, chance: chances[p.id] ?? 0, kind: p.kind }]));
  return {
    total, today, testCount, claimedTotal, reserved, byPrize,
    status: await status(),
    rehearsal: await isRehearsal(),
    override: process.env.SPIN_STATUS || 'auto',
  };
}

export async function deskSearch(q) {
  await requireDesk();
  const raw = String(q || '').trim();
  let where = { interest: { in: ALL_INTERESTS } };
  if (raw) {
    const up = raw.toUpperCase();
    const phone = normalizePhone(raw);
    if (isValidCode(up)) where = { ...where, message: { contains: `Code: ${up}` } };
    else if (phone) where = { ...where, phone };
    else where = {
      ...where,
      OR: [
        { firstName: { contains: raw, mode: 'insensitive' } },
        { lastName: { contains: raw, mode: 'insensitive' } },
        { clinicName: { contains: raw, mode: 'insensitive' } },
      ],
    };
  }
  const rows = await prisma.lead.findMany({ where, orderBy: { createdAt: 'desc' }, take: 50 });
  const shaped = rows.map(shapeLead);
  const socials = await consoleSocials(shaped.filter((r) => !r.test && r.code).map((r) => r.code));
  return shaped.map((r) => ({ ...r, socials: socials[r.code] || null }));
}

async function claimLead(lead) {
  if (PRE_INTERESTS.includes(lead.interest)) return { error: 'Reserved spin, not spun yet. Ask them to open dentasourcedirect.com/spin on their phone.', row: shapeLead(lead), reserved: true };
  const parsed = parseMessage(lead.message);
  if (!parsed) return { error: 'Row is not a spin.' };
  if (parsed.claimed) return { error: `Already claimed ${parsed.claimed}.`, row: shapeLead(lead), already: true };
  if (parsed.prizeLabel === 'Spin again') return { error: 'Visitor still has to spin again.', row: shapeLead(lead) };
  const updated = await prisma.lead.update({
    where: { id: lead.id },
    data: { message: claimedMessage(lead.message, manilaStamp()) },
  });
  return { ok: true, row: shapeLead(updated) };
}

export async function deskClaim(leadId) {
  await requireDesk();
  const lead = await prisma.lead.findUnique({ where: { id: String(leadId) } });
  if (!lead || !BOOTH_INTERESTS.includes(lead.interest)) return { error: 'Spin not found.' };
  return claimLead(lead);
}

/** Typed code fallback for a desk tablet without a camera. Desk-only, same claim path. */
export async function deskClaimByCode(code) {
  await requireDesk();
  const c = String(code || '').trim().toUpperCase();
  if (!isValidCode(c)) return { error: 'That is not a claim code.' };
  const lead = await prisma.lead.findFirst({ where: { interest: { in: ALL_INTERESTS }, message: { contains: `Code: ${c} ` } } });
  if (!lead) return { error: `No spin found for ${c}.` };
  return claimLead(lead);
}

/** Scanned QR → verify the signature → claim. Only the desk can call it; a forged or screenshotted QR from another phone still carries a valid token, which is why the desk also sees the name. */
export async function deskClaimByQr(token) {
  await requireDesk();
  const code = codeFromQrToken(token);
  if (!code) return { error: 'Not a DentaSource booth QR.' };
  const lead = await prisma.lead.findFirst({ where: { interest: { in: ALL_INTERESTS }, message: { contains: `Code: ${code} ` } } });
  if (!lead) return { error: `No spin found for ${code}.` };
  return claimLead(lead);
}

export async function deskDeleteTests(confirm) {
  await requireDesk();
  const count = await prisma.lead.count({ where: { interest: { in: [INTEREST_TEST, INTEREST_PRE_TEST] } } });
  if (!confirm) return { count };
  const res = await prisma.lead.deleteMany({ where: { interest: { in: [INTEREST_TEST, INTEREST_PRE_TEST] } } });
  return { deleted: res.count };
}

/** Live prize control from the desk: on/off, chance weight, cap. Takes effect on the next spin. */
export async function deskSetPrize(id, patch) {
  await requireDesk();
  if (!PRIZE_BY_ID[id]) return { error: 'Unknown prize.' };
  const overrides = await loadOverrides();
  const cur = overrides[id] || {};
  const next = { ...cur };
  if (typeof patch?.active === 'boolean') next.active = patch.active;
  if (patch?.weight !== undefined) {
    const w = Number(patch.weight);
    if (!Number.isFinite(w) || w < 0 || w > 1000) return { error: 'Chance must be a number from 0 to 1000.' };
    next.weight = w;
  }
  if (patch?.cap !== undefined) {
    if (patch.cap === null || patch.cap === '') next.cap = null;
    else {
      const c = Math.floor(Number(patch.cap));
      if (!Number.isFinite(c) || c < 0) return { error: 'Cap must be 0 or more.' };
      next.cap = c;
    }
  }
  overrides[id] = next;
  await saveOverrides(overrides);
  return { ok: true, overrides };
}

export async function deskResetPrizes() {
  await requireDesk();
  await saveOverrides({});
  return { ok: true };
}

const consoleKey = () => process.env.NADTI_INTAKE_KEY || '';

/** Socials + console note for a list of claim codes (desk rows). Never throws. */
async function consoleSocials(codes) {
  if (!consoleKey() || !codes.length) return {};
  try {
    return (await callConvex('query', 'consoleNadti:byCodes', { key: consoleKey(), codes }, { timeoutMs: 5000 })) || {};
  } catch (e) {
    console.error('[spin] consoleSocials failed:', e?.message || e);
    return {};
  }
}

/** Desk staff link a visitor's social from the booth. TEST rows never touch the console. */
export async function deskLinkSocial(leadId, platform, value) {
  await requireDesk();
  const lead = await prisma.lead.findUnique({ where: { id: String(leadId) } });
  if (!lead || !BOOTH_INTERESTS.includes(lead.interest)) return { error: 'Spin not found.' };
  const parsed = parseMessage(lead.message);
  if (!parsed) return { error: 'Row is not a spin.' };
  const url = normalizeSocial(platform, value);
  if (!url) return { error: platform === 'google' ? 'Paste a Google Maps link.' : 'Paste the page link or type the @handle.' };
  if (lead.interest === INTEREST_TEST || !consoleKey()) return { ok: true, url, skipped: true };
  try {
    const r = await callConvex('mutation', 'consoleNadti:linkSocial', { key: consoleKey(), code: parsed.code, platform, value }, { timeoutMs: 5000 });
    return r?.ok ? { ok: true, url: r.url } : { error: r?.reason === 'no_prospect' ? 'This visitor is not in the console yet.' : 'That link does not look right.' };
  } catch (e) {
    console.error('[spin] deskLinkSocial failed:', e?.message || e);
    return { error: 'Console did not answer. Try again.' };
  }
}

/** Desk staff add a note line to the visitor's console prospect. */
export async function deskNote(leadId, line) {
  await requireDesk();
  const lead = await prisma.lead.findUnique({ where: { id: String(leadId) } });
  if (!lead || !BOOTH_INTERESTS.includes(lead.interest)) return { error: 'Spin not found.' };
  const parsed = parseMessage(lead.message);
  const text = String(line || '').trim();
  if (!parsed || !text) return { error: 'Write something first.' };
  if (lead.interest === INTEREST_TEST || !consoleKey()) return { ok: true, skipped: true };
  try {
    const r = await callConvex('mutation', 'consoleNadti:appendNote', { key: consoleKey(), code: parsed.code, line: text, by: 'booth desk' }, { timeoutMs: 5000 });
    return r?.ok ? { ok: true } : { error: 'This visitor is not in the console yet.' };
  } catch (e) {
    console.error('[spin] deskNote failed:', e?.message || e);
    return { error: 'Console did not answer. Try again.' };
  }
}

export async function deskRehearsal(on) {
  await requireDesk();
  const c = await cookies();
  c.set(REHEARSAL_COOKIE, on ? tokenFor('rehearsal') : '', cookieOpts(on ? 60 * 60 * 24 : 0));
  return { ok: true };
}
