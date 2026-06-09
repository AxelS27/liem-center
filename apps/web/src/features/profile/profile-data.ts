import type { UserProfile } from '@repo/types';

export type { UserProfile } from '@repo/types';

export function getProfileInitial(profile: Pick<UserProfile, 'displayName' | 'username'>) {
  return (profile.displayName || profile.username).slice(0, 1).toUpperCase();
}
