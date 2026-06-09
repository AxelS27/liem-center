import { z } from 'zod';

import { productSchema } from './catalog';

export const wishlistResponseSchema = z.object({
  data: z.object({
    items: z.array(productSchema),
  }),
});

export const wishlistRequestSchema = z.object({
  productSlug: z.string().min(1),
});

export type WishlistResponse = z.infer<typeof wishlistResponseSchema>;
