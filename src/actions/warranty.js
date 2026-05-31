'use server';

import prisma from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { isAdminEmail } from '@/lib/admin';
import { revalidatePath } from 'next/cache';

// Build a short, URL-safe public code from the product name + a random suffix.
function slugCode(product) {
  const base = (product || 'dsd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 12);
  const rand = Math.random().toString(36).slice(2, 6);
  return `${base}-${rand}`;
}

export async function createWarranty(formData) {
  // Owner-only — same guard as the rest of /admin.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isAdminEmail(user.email)) return { error: 'Not authorized.' };

  const clinicName = formData.get('clinicName')?.trim();
  const productName = formData.get('productName')?.trim();
  const warrantyStart = formData.get('warrantyStart');
  const warrantyEnd = formData.get('warrantyEnd');

  if (!clinicName || !productName || !warrantyStart || !warrantyEnd) {
    return { error: 'Clinic, product, and both warranty dates are required.' };
  }

  const code = (formData.get('code') || '').trim() || slugCode(productName);

  try {
    await prisma.warranty.create({
      data: {
        code,
        clinicName,
        contactName: formData.get('contactName')?.trim() || null,
        productName,
        serialNumber: formData.get('serialNumber')?.trim() || null,
        purchaseDate: formData.get('purchaseDate') ? new Date(formData.get('purchaseDate')) : null,
        warrantyStart: new Date(warrantyStart),
        warrantyEnd: new Date(warrantyEnd),
        coverage: formData.get('coverage')?.trim() || null,
      },
    });
    revalidatePath('/admin/warranties');
    return { success: true, code };
  } catch {
    return { error: 'Could not save — that link code may already be taken. Try a different one.' };
  }
}
