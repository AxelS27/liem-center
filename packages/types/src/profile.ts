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

export const profileUpdateRequestSchema = z.object({
  displayName: z.string().min(1).max(80).optional(),
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-z0-9_]+$/, 'Use lowercase letters, numbers, or underscores.')
    .optional(),
  country: z.string().max(60).nullable().optional(),
  countryPublic: z.boolean().optional(),
  bio: z.string().max(500).nullable().optional(),
  timelinePublic: z.boolean().optional(),
});

export type UserProfile = z.infer<typeof userProfileSchema>;
export type ProfileUpdateRequest = z.infer<typeof profileUpdateRequestSchema>;
