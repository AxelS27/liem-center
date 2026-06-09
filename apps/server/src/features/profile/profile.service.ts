/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ProfileUpdateRequest } from '@repo/types';

import { ApiError, assertFound } from '../../lib/errors';
import { createSupabaseServiceClient } from '../../lib/supabase';

function mapProfile(row: any) {
  return {
    id: row.id,
    username: row.username,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
    bannerUrl: row.banner_url,
    country: row.country,
    countryPublic: Boolean(row.country_public),
    bio: row.bio,
    tier: row.tier,
    lifetimeSpendIdr: Number(row.lifetime_spend_idr ?? 0),
    timelinePublic: Boolean(row.timeline_public),
    createdAt: row.created_at,
  };
}

export async function getProfileByUserId(userId: string) {
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();

  if (error) {
    throw new ApiError('SERVER_ERROR', 'Unable to load your profile.');
  }

  return mapProfile(assertFound(data, 'No profile was found for this user.'));
}

export async function getProfileByUsername(username: string) {
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .maybeSingle();

  if (error) {
    throw new ApiError('SERVER_ERROR', 'Unable to load this profile.');
  }

  return mapProfile(assertFound(data, 'No profile was found for this username.'));
}

export async function updateProfile(userId: string, input: ProfileUpdateRequest) {
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };

  if (input.displayName !== undefined) patch.display_name = input.displayName;
  if (input.username !== undefined) patch.username = input.username;
  if (input.country !== undefined) patch.country = input.country;
  if (input.countryPublic !== undefined) patch.country_public = input.countryPublic;
  if (input.bio !== undefined) patch.bio = input.bio;
  if (input.timelinePublic !== undefined) patch.timeline_public = input.timelinePublic;

  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from('profiles')
    .update(patch)
    .eq('id', userId)
    .select('*')
    .single();

  if (error) {
    if ((error as any).code === '23505') {
      throw new ApiError('CONFLICT', 'That username is already taken.');
    }
    throw new ApiError('SERVER_ERROR', 'Unable to update your profile.');
  }

  return mapProfile(data);
}
