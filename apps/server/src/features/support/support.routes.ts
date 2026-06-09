import {
  createSupportTicketRequestSchema,
  supportTicketResponseSchema,
  supportTicketsResponseSchema,
} from '@repo/types';
import { Hono } from 'hono';

import { requireUser } from '../../lib/auth';
import { errorResponse } from '../../lib/errors';
import { createSupportTicket, getSupportTicket, listSupportTickets } from './support.service';

export const supportRoutes = new Hono();

supportRoutes.get('/support/tickets', async (c) => {
  try {
    const user = await requireUser(c);
    const items = await listSupportTickets(user.id);

    return c.json(supportTicketsResponseSchema.parse({ data: { items } }));
  } catch (error) {
    return errorResponse(c, error);
  }
});

supportRoutes.post('/support/tickets', async (c) => {
  try {
    const user = await requireUser(c);
    const body = createSupportTicketRequestSchema.parse(await c.req.json());
    const ticket = await createSupportTicket({ ...body, userId: user.id });

    return c.json(supportTicketResponseSchema.parse({ data: ticket }), 201);
  } catch (error) {
    return errorResponse(c, error);
  }
});

supportRoutes.get('/support/tickets/:id', async (c) => {
  try {
    const user = await requireUser(c);
    const ticket = await getSupportTicket(user.id, c.req.param('id'));

    return c.json(supportTicketResponseSchema.parse({ data: ticket }));
  } catch (error) {
    return errorResponse(c, error);
  }
});
