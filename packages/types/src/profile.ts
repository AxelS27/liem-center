import { z } from 'zod';

export const userProfileSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  displayName: z.string(),
  avatarUrl: z.string().nullable(),
  bannerUrl: z.string().nullable(),
  country: z.string().nullable(),
  countryPublic: z.boolean(),
  bio: z.string().nullable(),
  tier: z.string(),
  lifetimeSpendIdr: z.number().int().nonnegative(),
  timelinePublic: z.boolean(),
  createdAt: z.string(),
});

export const userProfileResponseSchema = z.object({
  data: userProfileSchema,
});

export type UserProfile = z.infer<typeof userProfileSchema>;
