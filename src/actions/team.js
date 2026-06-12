'use server';

import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { teamLogin, teamLogout, loginRateLimited } from '@/lib/team';

const COOKIE = 'dsd_team';
const SESSION_DAYS = 30;
const MAX_AGE = SESSION_DAYS * 24 * 60 * 60;

async function clientKey() {
  const h = await headers();
  const xff = h.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return h.get('x-nf-client-connection-ip') || 'unknown';
}

export async function teamSignIn(formData) {
  if (loginRateLimited(await clientKey())) {
    return { error: 'Too many tries. Wait a few minutes and try again.' };
  }

  const code = (formData.get('code') || '').toString().trim().toUpperCase();
  if (!code) return { error: 'Enter your access code.' };

  const result = await teamLogin(code);
  if (!result) return { error: 'That code did not work. Check it and try again.' };

  const store = await cookies();
  store.set(COOKIE, result.token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE,
  });

  redirect('/team');
}

export async function teamSignOut() {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  await teamLogout(token);
  store.delete(COOKIE);
  redirect('/team/login');
}
