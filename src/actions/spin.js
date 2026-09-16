'use server';

import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { PRIZES, PRIZE_BY_ID, pickPrize, wedgeIndexFor } from '@/lib/spin/prizes';
import {
  INTEREST_REAL, INTEREST_TEST, normalizePhone, splitName, makeCode, isValidCode,
  isValidEmail, eventStatus, prizePrefix, messageFor, parseMessage, claimedMessage, manilaStamp,
} from '@/lib/spin/format';

const DESK_COOKIE = 'spin_desk';
const REHEARSAL_COOKIE = 'spin_rehearsal';
const BOOTH_INTERESTS = [INTEREST_REAL, INTEREST_TEST];

const cookieOpts = (maxAge) => ({
  httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/spin', maxAge,
});

async function isRehearsal() {
  const c = await cookies();
  return c.get(REHEARSAL_COOKIE)?.value === '1';
}

async function currentInterest() {
  return (await isRehearsal()) ? INTEREST_TEST : INTEREST_REAL;
}

async function status() {
  return eventStatus({ override: process.env.SPIN_STATUS || 'auto', rehearsal: await isRehearsal() });
}

function shapeLead(lead) {
  const parsed = parseMessage(lead.message) || { prizeLabel: '', code: '', claimed: null };
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
    test: lead.interest === INTEREST_TEST,
    createdAt: lead.createdAt instanceof Date ? lead.createdAt.toISOString() : String(lead.createdAt),
  };
}

async function prizeCounts(interest) {
  const capped = PRIZES.filter((p) => p.cap != null);
  const nums = await Promise.all(capped.map((p) =>
    prisma.lead.count({ where: { interest, message: { startsWith: prizePrefix(p.label) } } })));
  return Object.fromEntries(capped.map((p, i) => [p.id, nums[i]]));
}

async function uniqueCode() {
  for (let i = 0; i < 25; i++) {
    const code = makeCode();
    const hit = await prisma.lead.findFirst({
      where: { interest: { in: BOOTH_INTERESTS }, message: { contains: `Code: ${code}` } },
      select: { id: true },
    });
    if (!hit) return code;
  }
  throw new Error('Could not allocate a claim code');
}

// ───────────── visitor ─────────────

export async function submitSpin(formData) {
  const name = String(formData.get('name') || '').trim();
  const clinic = String(formData.get('clinic') || '').trim();
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const phoneRaw = String(formData.get('phone') || '').trim();
  const consent = formData.get('consent') === 'on';

  const fields = {};
  if (name.length < 2) fields.name = 'Please enter your full name.';
  if (clinic.length < 2) fields.clinic = 'Please enter your dental clinic.';
  if (!isValidEmail(email)) fields.email = 'Please enter a valid email address.';
  const phone = normalizePhone(phoneRaw);
  if (!phone) fields.phone = 'Please enter a Philippine mobile number, like 0917 123 4567.';
  if (!consent) fields.consent = 'Please tick the box so we can contact you.';
  if (Object.keys(fields).length) return { error: 'Please check the form.', fields };

  if ((await status()) === 'closed') return { closed: true };

  const interest = await currentInterest();

  const existing = await prisma.lead.findFirst({
    where: { phone, interest: { in: BOOTH_INTERESTS } },
    orderBy: { createdAt: 'desc' },
  });
  if (existing) {
    const s = shapeLead(existing);
    return { already: true, leadId: s.leadId, prizeId: s.prizeId, code: s.code, wedgeIndex: s.prizeId ? wedgeIndexFor(s.prizeId) : 0 };
  }

  const counts = await prizeCounts(interest);
  const pick = pickPrize({ counts });
  const prize = PRIZE_BY_ID[pick.id];
  const code = await uniqueCode();
  const { firstName, lastName } = splitName(name);

  const lead = await prisma.lead.create({
    data: {
      firstName, lastName, email, phone,
      clinicName: clinic,
      interest,
      message: messageFor({ label: prize.label, code }),
      status: 'NEW',
    },
  });

  return { ok: true, leadId: lead.id, prizeId: pick.id, code, wedgeIndex: pick.wedgeIndex };
}

export async function respin(leadId, code) {
  const lead = await prisma.lead.findUnique({ where: { id: String(leadId) } });
  if (!lead || !BOOTH_INTERESTS.includes(lead.interest)) return { error: 'Spin not found.' };
  const parsed = parseMessage(lead.message);
  if (!parsed || parsed.code !== String(code).toUpperCase() || parsed.prizeLabel !== 'Spin again') {
    return { error: 'This spin cannot be repeated.' };
  }
  const counts = await prizeCounts(lead.interest);
  const pick = pickPrize({ counts, excludeSpinAgain: true });
  const prize = PRIZE_BY_ID[pick.id];
  await prisma.lead.update({
    where: { id: lead.id },
    data: { message: messageFor({ label: prize.label, code: parsed.code }) },
  });
  return { ok: true, leadId: lead.id, prizeId: pick.id, code: parsed.code, wedgeIndex: pick.wedgeIndex };
}

export async function enterRehearsal(pin) {
  if (!process.env.SPIN_DESK_PIN || String(pin) !== process.env.SPIN_DESK_PIN) return { error: 'Wrong PIN.' };
  const c = await cookies();
  c.set(REHEARSAL_COOKIE, '1', cookieOpts(60 * 60 * 24));
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
  if (c.get(DESK_COOKIE)?.value !== '1') throw new Error('Unauthorized');
}

export async function deskLogin(pin) {
  if (!process.env.SPIN_DESK_PIN) return { error: 'Desk PIN is not configured on the server.' };
  if (String(pin) !== process.env.SPIN_DESK_PIN) return { error: 'Wrong PIN.' };
  const c = await cookies();
  c.set(DESK_COOKIE, '1', cookieOpts(60 * 60 * 12));
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
  const [total, today, testCount, ...per] = await Promise.all([
    prisma.lead.count({ where: { interest: INTEREST_REAL } }),
    prisma.lead.count({ where: { interest: INTEREST_REAL, createdAt: { gte: dayStart } } }),
    prisma.lead.count({ where: { interest: INTEREST_TEST } }),
    ...PRIZES.map((p) => prisma.lead.count({ where: { interest: INTEREST_REAL, message: { startsWith: prizePrefix(p.label) } } })),
  ]);
  const byPrize = Object.fromEntries(PRIZES.map((p, i) => [p.id, { count: per[i], cap: p.cap, label: p.label }]));
  return {
    total, today, testCount, byPrize,
    status: await status(),
    rehearsal: await isRehearsal(),
    override: process.env.SPIN_STATUS || 'auto',
  };
}

export async function deskSearch(q) {
  await requireDesk();
  const raw = String(q || '').trim();
  let where = { interest: { in: BOOTH_INTERESTS } };
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
  return rows.map(shapeLead);
}

export async function deskClaim(leadId) {
  await requireDesk();
  const lead = await prisma.lead.findUnique({ where: { id: String(leadId) } });
  if (!lead || !BOOTH_INTERESTS.includes(lead.interest)) return { error: 'Spin not found.' };
  const parsed = parseMessage(lead.message);
  if (!parsed) return { error: 'Row is not a spin.' };
  if (parsed.claimed) return { error: `Already claimed ${parsed.claimed}.` };
  if (parsed.prizeLabel === 'Spin again') return { error: 'Visitor still has to spin again.' };
  const updated = await prisma.lead.update({
    where: { id: lead.id },
    data: { message: claimedMessage(lead.message, manilaStamp()) },
  });
  return { ok: true, row: shapeLead(updated) };
}

export async function deskDeleteTests(confirm) {
  await requireDesk();
  const count = await prisma.lead.count({ where: { interest: INTEREST_TEST } });
  if (!confirm) return { count };
  const res = await prisma.lead.deleteMany({ where: { interest: INTEREST_TEST } });
  return { deleted: res.count };
}

export async function deskRehearsal(on) {
  await requireDesk();
  const c = await cookies();
  c.set(REHEARSAL_COOKIE, on ? '1' : '', cookieOpts(on ? 60 * 60 * 24 : 0));
  return { ok: true };
}
