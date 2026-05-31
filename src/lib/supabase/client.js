import { createBrowserClient } from '@supabase/ssr';

// Browser-side Supabase client (Client Components). Used to kick off the
// Google OAuth flow from the admin login screen.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
