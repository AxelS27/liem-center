import { z } from 'zod';

import { productSchema } from './catalog';

export const entitlementSourceSchema = z.enum([
  'purchase',
  'gift',
  'redeem',
  'free_claim',
  'admin_grant',
]);
export const inviteStatusSchema = z.enum(['pending', 'invited', 'accepted', 'failed', 'revoked']);

export const entitlementSchema = z.object({
  id: z.string().uuid(),
  source: entitlementSourceSchema,
  ownedSince: z.string(),
  access: z.enum(['active', 'revoked']),
  invite: inviteStatusSchema.nullable(),
  product: productSchema.pick({
    id: true,
    slug: true,
    name: true,
    tagline: true,
    type: true,
    category: true,
    priceIdr: true,
    version: true,
    coverUrl: true,
    githubRepo: true,
  }),
});

export const libraryResponseSchema = z.object({
  data: z.object({
    items: z.array(entitlementSchema),
  }),
});

export const claimResponseSchema = z.object({
  data: entitlementSchema,
});

export type EntitlementSource = z.infer<typeof entitlementSourceSchema>;
export type InviteStatus = z.infer<typeof inviteStatusSchema>;
export type Entitlement = z.infer<typeof entitlementSchema>;
export type LibraryResponse = z.infer<typeof libraryResponseSchema>;
