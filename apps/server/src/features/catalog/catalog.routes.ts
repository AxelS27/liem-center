import {
  productResponseSchema,
  productsQuerySchema,
  productsResponseSchema,
  reviewRequestSchema,
  reviewResponseSchema,
} from '@repo/types';
import { Hono } from 'hono';

import { requireUser } from '../../lib/auth';
import { errorResponse } from '../../lib/errors';
import { createReview, getProductBySlug, listProducts } from './catalog.service';

export const catalogRoutes = new Hono();

catalogRoutes.get('/products', async (c) => {
  try {
    const query = productsQuerySchema.parse(c.req.query());
    const items = await listProducts(query);

    return c.json(productsResponseSchema.parse({ data: { items, nextCursor: null } }));
  } catch (error) {
    return errorResponse(c, error);
  }
});

catalogRoutes.get('/products/:slug', async (c) => {
  try {
    const product = await getProductBySlug(c.req.param('slug'));

    return c.json(productResponseSchema.parse({ data: product }));
  } catch (error) {
    return errorResponse(c, error);
  }
});

catalogRoutes.post('/products/:slug/reviews', async (c) => {
  try {
    const user = await requireUser(c);
    const body = reviewRequestSchema.parse(await c.req.json());
    const review = await createReview(user.id, c.req.param('slug'), body);

    return c.json(reviewResponseSchema.parse({ data: review }), 201);
  } catch (error) {
    return errorResponse(c, error);
  }
});
