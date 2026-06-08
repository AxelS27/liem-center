// Mock profile for the frontend build. Pinned products reference catalog slugs.

export type ProfileStat = { label: string; value: number };
export type Badge = { code: string; label: string };
export type ActivityEvent = { id: string; text: string; date: string };

export type Profile = {
  displayName: string;
  username: string;
  initial: string;
  joined: string;
  founderNumber?: number;
  tier: string;
  nextTier?: string;
  lifetimeSpendIdr: number;
  tierProgressPercent: number;
  stats: ProfileStat[];
  badges: Badge[];
  pinnedSlugs: string[];
  activity: ActivityEvent[];
};

const profile: Profile = {
  displayName: 'Farrell Axel',
  username: 'farrellaxel',
  initial: 'F',
  joined: 'June 2026',
  founderNumber: 1,
  tier: 'Diamond',
  nextTier: 'Legendary',
  lifetimeSpendIdr: 6200000,
  tierProgressPercent: 62,
  stats: [
    { label: 'Owned', value: 4 },
    { label: 'Purchased', value: 2 },
    { label: 'Claimed', value: 1 },
    { label: 'Redeemed', value: 1 },
    { label: 'Wishlist', value: 3 },
    { label: 'Reviews', value: 1 },
  ],
  badges: [
    { code: 'founding', label: 'Founding Member' },
    { code: 'diamond', label: 'Diamond Member' },
    { code: 'early', label: 'Early Adopter' },
    { code: 'gift', label: 'Gift Giver' },
  ],
  pinnedSlugs: ['liem-monorepo', 'liem-ai-plugin', 'liem-ui-kit'],
  activity: [
    { id: 'a1', text: 'Reached Diamond tier', date: 'June 2026' },
    { id: 'a2', text: 'Purchased Liem AI Plugin', date: 'May 2026' },
    { id: 'a3', text: 'Purchased Liem Monorepo', date: 'May 2026' },
    { id: 'a4', text: 'Earned the Founding Member badge', date: 'May 2026' },
    { id: 'a5', text: 'Claimed Liem Starter Docs', date: 'April 2026' },
  ],
};

export function getProfile(): Profile {
  return profile;
}
