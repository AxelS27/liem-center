import { claimResponseSchema, libraryResponseSchema } from '@repo/types';
import { Hono } from 'hono';

import { requireUser } from '../../lib/auth';
import { errorResponse } from '../../lib/errors';
import { claimFreeProduct, listEntitlements } from './library.service';

export const libraryRoutes = new Hono();

libraryRoutes.get('/library', async (c) => {
  try {
    const user = await requireUser(c);
    const items = await listEntitlements(user.id);

    return c.json(libraryResponseSchema.parse({ data: { items } }));
  } catch (error) {
    return errorResponse(c, error);
  }
});

libraryRoutes.post('/products/:slug/claim', async (c) => {
  try {
    const user = await requireUser(c);
    const entitlement = await claimFreeProduct(user.id, c.req.param('slug'));

    return c.json(claimResponseSchema.parse({ data: entitlement }), 201);
  } catch (error) {
    return errorResponse(c, error);
  }
});
