// Team identity helper. A code is never stored — only its SHA-256 hex hash.
// Login mints a DB-backed session (32-byte token in an httpOnly `dsd_team`
// cookie). Read-time identity always comes from that cookie token, never params.
import crypto from 'node:crypto';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

const COOKIE = 'dsd_team';
const SESSION_DAYS = 30;

export function hashCode(code) {
  return crypto.createHash('sha256').update(code).digest('hex');
}

// Identity from the cookie token only. Returns { id, name } or null.
export async function getTeamMember() {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.teamSession.findUnique({
    where: { token },
    include: { teamMember: true },
  });
  if (!session) return null;

  const expired = session.expiresAt.getTime() < Date.now();
  if (expired || !session.teamMember?.active) {
    // Best-effort cleanup of a dead session row.
    try {
      await prisma.teamSession.delete({ where: { id: session.id } });
    } catch {
      // ignore — another request may have removed it.
    }
    return null;
  }

  return { id: session.teamMember.id, name: session.teamMember.name };
}

// Exchange an access code for a session. Returns { token, expiresAt, name } or null.
// Caller uppercases+trims; we hash and look up by unique hash (constant work pattern).
export async function teamLogin(code) {
  const codeHash = hashCode(code);
  const member = await prisma.teamMember.findUnique({ where: { codeHash } });
  if (!member || !member.active) return null;

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await prisma.teamSession.create({ data: { token, teamMemberId: member.id, expiresAt } });
  await prisma.teamMember.update({ where: { id: member.id }, data: { lastUsedAt: new Date() } });

  return { token, expiresAt, name: member.name };
}

export async function teamLogout(token) {
  if (!token) return;
  try {
    await prisma.teamSession.delete({ where: { token } });
  } catch {
    // already gone — fine.
  }
}

// Best-effort in-memory rate limit (same pattern as /api/leads). Resets per
// instance on ephemeral functions — a speed bump. Max 10 tries / 10 min per key.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 10;
const hits = new Map(); // key -> number[] (timestamps)

export function loginRateLimited(key) {
  const now = Date.now();
  const recent = (hits.get(key) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > MAX_PER_WINDOW;
}
