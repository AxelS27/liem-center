import type { User } from '@supabase/supabase-js';
import type { Context } from 'hono';

import { ApiError } from './errors';
import { createSupabaseServiceClient } from './supabase';

const ADMIN_EMAILS = ['farrellaxel2006@gmail.com'];

function getBearerToken(c: Context) {
  const header = c.req.header('authorization');

  if (!header?.startsWith('Bearer ')) {
    return null;
  }

  return header.slice('Bearer '.length).trim();
}

export async function requireUser(c: Context): Promise<User> {
  const token = getBearerToken(c);

  if (!token) {
    throw new ApiError('UNAUTHENTICATED', 'Sign in is required for this request.');
  }

  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    throw new ApiError('UNAUTHENTICATED', 'Your session is no longer valid.');
  }

  return data.user;
}

export function isAdmin(user: User) {
  const metadata = user.app_metadata as Record<string, unknown>;
  const role = metadata.role;
  const roles = metadata.roles;

  return (
    role === 'admin' ||
    (Array.isArray(roles) && roles.includes('admin')) ||
    (typeof user.email === 'string' && ADMIN_EMAILS.includes(user.email.toLowerCase()))
  );
}

export async function requireAdmin(c: Context): Promise<User> {
  const user = await requireUser(c);

  if (!isAdmin(user)) {
    throw new ApiError('UNAUTHORIZED', 'Admin access is required for this request.');
  }

  return user;
}
