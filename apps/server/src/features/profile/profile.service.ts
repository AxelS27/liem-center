/* eslint-disable @typescript-eslint/no-explicit-any */
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
