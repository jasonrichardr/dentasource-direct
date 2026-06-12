'use server';

import prisma from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { isAdminEmail } from '@/lib/admin';
import { revalidatePath } from 'next/cache';

async function currentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

async function notifyDsd(email, body) {
  try {
    await fetch('https://formsubmit.co/ajax/dentasourcedirect@gmail.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ _subject: `New portal message from ${email}`, From: email, Message: body }),
    });
  } catch {
    // notification is best-effort; the message is already saved.
  }
}

// A signed-in customer sends a message — finds or creates their single thread.
export async function sendCustomerMessage(formData) {
  const user = await currentUser();
  if (!user) return { error: 'Please sign in first.' };
  const body = (formData.get('body') || '').toString().trim();
  if (!body) return { error: 'Write a message first.' };

  const email = user.email.toLowerCase();
  let thread = await prisma.thread.findFirst({ where: { customerEmail: email }, orderBy: { createdAt: 'desc' } });
  if (!thread) {
    thread = await prisma.thread.create({
      data: { customerEmail: email, customerName: user.user_metadata?.full_name || null },
    });
  }
  await prisma.message.create({ data: { threadId: thread.id, sender: 'CUSTOMER', body } });
  await prisma.thread.update({ where: { id: thread.id }, data: { status: 'OPEN', lastMessageAt: new Date() } });

  await notifyDsd(email, body);
  revalidatePath('/portal');
  revalidatePath('/admin/inbox');
  return { success: true };
}

// DSD (owner) replies to a thread.
export async function sendAdminReply(formData) {
  const user = await currentUser();
  if (!user || !isAdminEmail(user.email)) return { error: 'Not authorized.' };
  const threadId = (formData.get('threadId') || '').toString();
  const body = (formData.get('body') || '').toString().trim();
  if (!threadId || !body) return { error: 'Missing message.' };

  await prisma.message.create({ data: { threadId, sender: 'DSD', body } });
  await prisma.thread.update({ where: { id: threadId }, data: { status: 'ANSWERED', lastMessageAt: new Date() } });
  revalidatePath('/admin/inbox');
  revalidatePath('/portal');
  return { success: true };
}

const THREAD_STATUSES = ['OPEN', 'ANSWERED', 'RESOLVED'];

// DSD (owner) changes a thread's status from the inbox header.
export async function setThreadStatus(threadId, status) {
  const user = await currentUser();
  if (!user || !isAdminEmail(user.email)) return { error: 'Not authorized.' };
  if (!threadId || !THREAD_STATUSES.includes(status)) return { error: 'Invalid status.' };

  await prisma.thread.update({ where: { id: threadId }, data: { status } });
  revalidatePath('/admin/inbox');
  revalidatePath('/portal');
  return { success: true };
}
