import { wishlistRequestSchema, wishlistResponseSchema } from '@repo/types';
import { Hono } from 'hono';

import { requireUser } from '../../lib/auth';
import { errorResponse } from '../../lib/errors';
import { addWishlistItem, listWishlist, removeWishlistItem } from './wishlist.service';

export const wishlistRoutes = new Hono();

wishlistRoutes.get('/wishlist', async (c) => {
  try {
    const user = await requireUser(c);
    const items = await listWishlist(user.id);

    return c.json(wishlistResponseSchema.parse({ data: { items } }));
  } catch (error) {
    return errorResponse(c, error);
  }
});

wishlistRoutes.post('/wishlist', async (c) => {
  try {
    const user = await requireUser(c);
    const body = wishlistRequestSchema.parse(await c.req.json());
    await addWishlistItem(user.id, body.productSlug);
    const items = await listWishlist(user.id);

    return c.json(wishlistResponseSchema.parse({ data: { items } }));
  } catch (error) {
    return errorResponse(c, error);
  }
});

wishlistRoutes.delete('/wishlist/:slug', async (c) => {
  try {
    const user = await requireUser(c);
    await removeWishlistItem(user.id, c.req.param('slug'));

    return c.json({ data: {} });
  } catch (error) {
    return errorResponse(c, error);
  }
});
