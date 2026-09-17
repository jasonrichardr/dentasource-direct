'use server';

import prisma from '@/lib/prisma';
import { normalizePhone, splitName, isValidEmail, makeCode } from '@/lib/spin/format';
import { callConvex, normalizeSocial } from '@/lib/spin/console';

const INTEREST = 'Speaker 2026';
const KEY = () => process.env.NADTI_INTAKE_KEY || '';

/** "Teach with us" on /growth-partner: Lead row + a COLD console prospect tagged Speaker 2026 (reviewed by Jarich and the study groups). */
export async function applySpeaker(formData) {
  const name = String(formData.get('name') || '').trim();
  const group = String(formData.get('group') || '').trim();
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const phone = normalizePhone(String(formData.get('phone') || ''));
  const topic = String(formData.get('topic') || '').trim();
  const linkRaw = String(formData.get('link') || '').trim();
  const rules = formData.get('rules') === 'on';
  const consent = formData.get('consent') === 'on';

  const fields = {};
  if (name.length < 2) fields.name = 'Please enter your full name.';
  if (group.length < 2) fields.group = 'Your study group, clinic or school.';
  if (!isValidEmail(email)) fields.email = 'Please enter a valid email address.';
  if (!phone) fields.phone = 'Please enter a Philippine mobile number, like 0917 123 4567.';
  if (topic.length < 4) fields.topic = 'Tell us what you want to teach.';
  if (!rules) fields.rules = 'Please read the rules and tick the box. It matters here.';
  if (!consent) fields.consent = 'Please tick the box so we can reach you.';
  if (Object.keys(fields).length) return { error: 'Please check the form.', fields };

  const link = linkRaw ? (normalizeSocial('facebook', linkRaw) || (/^https?:/.test(linkRaw) ? linkRaw : `https://${linkRaw}`)) : '';
  const existing = await prisma.lead.findFirst({ where: { phone, interest: INTEREST }, orderBy: { createdAt: 'desc' } });
  const ref = existing ? (/Ref: ([A-Z0-9]{4,8})/.exec(existing.message || '')?.[1] || makeCode()) : makeCode();
  const { firstName, lastName } = splitName(name);
  const message = `Teach: ${topic.slice(0, 300)} · Link: ${link || 'none'} · Ref: ${ref}`;
  if (existing) await prisma.lead.update({ where: { id: existing.id }, data: { firstName, lastName, email, clinicName: group, message } });
  else await prisma.lead.create({ data: { firstName, lastName, email, phone, clinicName: group, interest: INTEREST, message, status: 'NEW' } });

  if (KEY()) {
    try {
      await callConvex('mutation', 'consoleNadti:intake', {
        key: KEY(), contactName: name, clinic: group, email, phone,
        prizeLabel: `wants to teach: ${topic.slice(0, 120)}${link ? ` · ${link}` : ''}`, code: ref, test: false, kind: 'prereg', tag: 'Speaker 2026',
      }, { timeoutMs: 5000 });
    } catch (e) { console.error('[speaker] console intake failed:', e?.message || e); }
  }
  return { ok: true, ref };
}
