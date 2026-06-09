import {
  checkoutRequestSchema,
  checkoutResponseSchema,
  orderResponseSchema,
  ordersResponseSchema,
} from '@repo/types';
import { Hono } from 'hono';

import { requireUser } from '../../lib/auth';
import { errorResponse } from '../../lib/errors';
import { createCheckoutOrder, getOrder, listOrders } from './orders.service';

export const ordersRoutes = new Hono();

ordersRoutes.post('/checkout', async (c) => {
  try {
    const user = await requireUser(c);
    const body = checkoutRequestSchema.parse(await c.req.json());
    const order = await createCheckoutOrder({
      recipientType: body.recipient?.type ?? 'self',
      slugs: body.items,
      userId: user.id,
    });

    return c.json(
      checkoutResponseSchema.parse({
        data: {
          order,
          paymentStatus: 'not_configured',
          redirectUrl: null,
          snapToken: null,
        },
      }),
      201,
    );
  } catch (error) {
    return errorResponse(c, error);
  }
});

ordersRoutes.get('/orders', async (c) => {
  try {
    const user = await requireUser(c);
    const items = await listOrders(user.id);

    return c.json(ordersResponseSchema.parse({ data: { items, nextCursor: null } }));
  } catch (error) {
    return errorResponse(c, error);
  }
});

ordersRoutes.get('/orders/:id', async (c) => {
  try {
    const user = await requireUser(c);
    const order = await getOrder(user.id, c.req.param('id'));

    return c.json(orderResponseSchema.parse({ data: order }));
  } catch (error) {
    return errorResponse(c, error);
  }
});
