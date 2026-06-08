import type { User } from '@supabase/supabase-js';

import { createSupabaseServerClient } from '@/lib/supabase/server';

import { SiteHeaderClient, type NavRole } from './site-header-client';

function getNavRole(user: User | null): NavRole {
  if (!user) {
    return 'guest';
  }

  const metadata = user.app_metadata as Record<string, unknown>;
  const role = metadata.role;
  const roles = metadata.roles;

  if (role === 'admin' || (Array.isArray(roles) && roles.includes('admin'))) {
    return 'admin';
  }

  return 'user';
}

export async function SiteHeader() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <SiteHeaderClient role={getNavRole(user)} userEmail={user?.email ?? null} />;
}
