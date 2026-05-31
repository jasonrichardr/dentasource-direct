// Owner allow-list for admin surfaces (e.g. /admin/leads).
//
// Supabase Auth (Google) proves "this is a real signed-in user". This list then
// restricts access to specific owner emails — so even a valid Google account
// that isn't yours cannot read the leads. Configure ADMIN_EMAILS (comma-separated)
// in the environment; the defaults are the DSD owner inboxes.
const DEFAULT_ADMIN_EMAILS = 'jasonrichardr@gmail.com,dentasourcedirect@gmail.com';

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || DEFAULT_ADMIN_EMAILS)
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export function isAdminEmail(email) {
  return Boolean(email) && ADMIN_EMAILS.includes(email.toLowerCase());
}
