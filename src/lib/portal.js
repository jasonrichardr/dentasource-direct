import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

// Any signed-in Supabase user is a customer. Returns the user or bounces to /login.
export async function requireUser(next = '/portal') {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(next)}`);
  return user;
}
