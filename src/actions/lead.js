'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function submitLead(formData) {
  try {
    // Extract data from the incoming FormData object
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const clinicName = formData.get('clinicName');
    const interest = formData.get('interest');
    const message = formData.get('message');

    // Basic server-side validation
    if (!firstName || !lastName || !email || !phone || !interest) {
      return { error: 'Please fill out all required fields.' };
    }

    // Insert into the PostgreSQL database via Prisma
    await prisma.lead.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        clinicName: clinicName || null,
        interest,
        message: message || '',
        status: 'NEW', // Default enum from our schema
      },
    });

    // Send email notification to the team
    try {
      await fetch('https://formsubmit.co/ajax/dentasourcedirect@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `New Lead: ${firstName} ${lastName}${interest ? ` — ${interest}` : ''}`,
          Name: `${firstName} ${lastName}`,
          Email: email,
          Phone: phone,
          Clinic: clinicName || 'Not provided',
          Interest: interest,
          Message: message || 'No message',
        }),
      });
    } catch (emailError) {
      // Don't fail the submission if email fails — lead is already saved in DB
      console.error('Email notification failed:', emailError);
    }

    // Revalidate the admin dashboard path if you build one later
    revalidatePath('/admin/leads');

    return { success: true };
  } catch (error) {
    console.error('Lead Capture Error:', error);
    return { error: 'Something went wrong. Please try again or call us directly.' };
  }
}
