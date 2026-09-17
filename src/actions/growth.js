'use server';

import prisma from '@/lib/prisma';
import { normalizePhone, splitName, isValidEmail, makeCode } from '@/lib/spin/format';
import { callConvex } from '@/lib/spin/console';
import { TRACKS } from '@/data/growth';
import { JDEV_MODULES } from '@/data/jdev';

const INTEREST = 'Training interest 2026';
const KEY = () => process.env.NADTI_INTAKE_KEY || '';

/** Reserve interest from /growth-partner: Lead row + console prospect tagged Training 2026. */
export async function reserveSeat(formData) {
  const name = String(formData.get('name') || '').trim();
  const clinic = String(formData.get('clinic') || '').trim();
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const phone = normalizePhone(String(formData.get('phone') || ''));
  const consent = formData.get('consent') === 'on';
  const picked = [
    ...TRACKS.filter((t) => formData.get(`track_${t.id}`) === 'on').map((t) => t.label),
    ...JDEV_MODULES.filter((m) => formData.get(`jdev_${m.id}`) === 'on').map((m) => `JDev: ${m.label}`),
  ];

  const fields = {};
  if (name.length < 2) fields.name = 'Please enter your full name.';
  if (clinic.length < 2) fields.clinic = 'Please enter your dental clinic.';
  if (!isValidEmail(email)) fields.email = 'Please enter a valid email address.';
  if (!phone) fields.phone = 'Please enter a Philippine mobile number, like 0917 123 4567.';
  if (picked.length === 0) fields.tracks = 'Pick at least one track.';
  if (!consent) fields.consent = 'Please tick the box so we can reach you.';
  if (Object.keys(fields).length) return { error: 'Please check the form.', fields };

  const existing = await prisma.lead.findFirst({ where: { phone, interest: INTEREST }, orderBy: { createdAt: 'desc' } });
  const ref = existing ? (/Ref: ([A-Z0-9]{4,8})/.exec(existing.message || '')?.[1] || makeCode()) : makeCode();
  const { firstName, lastName } = splitName(name);
  const message = `Tracks: ${picked.join(', ')} · Ref: ${ref}`;

  if (existing) {
    await prisma.lead.update({ where: { id: existing.id }, data: { firstName, lastName, email, clinicName: clinic, message } });
  } else {
    await prisma.lead.create({ data: { firstName, lastName, email, phone, clinicName: clinic, interest: INTEREST, message, status: 'NEW' } });
  }

  if (KEY()) {
    try {
      await callConvex('mutation', 'consoleNadti:intake', {
        key: KEY(), contactName: name, clinic, email, phone,
        prizeLabel: picked.join(', '), code: ref, test: false, tag: 'Training 2026', kind: 'training',
      }, { timeoutMs: 5000 });
    } catch (e) {
      console.error('[growth] console intake failed:', e?.message || e);
    }
  }
  return { ok: true, ref, tracks: picked };
}
