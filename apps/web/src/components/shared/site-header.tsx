import type { User } from '@supabase/supabase-js';

import { isAdminEmail } from '@/config/admin';
import { createSupabaseServerClient } from '@/lib/supabase/server';

import { SiteHeaderClient, type NavRole } from './site-header-client';

function getNavRole(user: User | null): NavRole {
  if (!user) {
    return 'guest';
  }

  const metadata = user.app_metadata as Record<string, unknown>;
  const role = metadata.role;
  const roles = metadata.roles;

  if (
    role === 'admin' ||
    (Array.isArray(roles) && roles.includes('admin')) ||
    isAdminEmail(user.email)
  ) {
    return 'admin';
  }

  return 'user';
}

// Prefer a friendly name over the raw email: GitHub username, then a first name from Google's
// full name, then the email local-part as a last resort.
function getDisplayName(user: User | null): string | null {
  if (!user) {
    return null;
  }

  const metadata = (user.user_metadata ?? {}) as Record<string, unknown>;
  const githubUsername = metadata.user_name ?? metadata.preferred_username;

  if (typeof githubUsername === 'string' && githubUsername.trim()) {
    return githubUsername.trim();
  }

  const fullName = metadata.full_name ?? metadata.name;

  if (typeof fullName === 'string' && fullName.trim()) {
    return fullName.trim().split(/\s+/)[0] ?? fullName.trim();
  }

  if (user.email) {
    return user.email.split('@')[0] ?? null;
  }

  return null;
}

export async function SiteHeader() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <SiteHeaderClient role={getNavRole(user)} userName={getDisplayName(user)} />;
}
