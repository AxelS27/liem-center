import { paymentNotificationSchema } from '@repo/types';
import { Hono } from 'hono';

import { errorResponse } from '../../lib/errors';
import { handlePaymentNotification } from './payments.service';

export const paymentsRoutes = new Hono();

// Public route: Midtrans calls this server-to-server. It is verified by signature hash, not by a
// Bearer token (see docs/engineering/PAYMENTS.md and ADR-012).
paymentsRoutes.post('/payments/notification', async (c) => {
  try {
    const body = paymentNotificationSchema.parse(await c.req.json());
    await handlePaymentNotification(body);

    return c.json({ data: { received: true } });
  } catch (error) {
    return errorResponse(c, error);
  }
});
