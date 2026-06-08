// Admin allowlist. Until roles are stored in Supabase app_metadata, these emails are treated as
// admins by the middleware, the header nav, and the profile badge. Keep this list short and
// move to a real role claim when the backend lands.
export const ADMIN_EMAILS = ['farrellaxel2006@gmail.com'];

export function isAdminEmail(email: string | null | undefined): boolean {
  return typeof email === 'string' && ADMIN_EMAILS.includes(email.toLowerCase());
}
