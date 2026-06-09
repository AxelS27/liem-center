import { productResponseSchema, productsQuerySchema, productsResponseSchema } from '@repo/types';
import { Hono } from 'hono';

import { errorResponse } from '../../lib/errors';
import { getProductBySlug, listProducts } from './catalog.service';

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
