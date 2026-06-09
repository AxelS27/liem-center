import { notificationsResponseSchema, unreadCountResponseSchema } from '@repo/types';
import { Hono } from 'hono';

import { requireUser } from '../../lib/auth';
import { errorResponse } from '../../lib/errors';
import {
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  unreadCount,
} from './notifications.service';

export const notificationsRoutes = new Hono();

notificationsRoutes.get('/notifications', async (c) => {
  try {
    const user = await requireUser(c);
    const items = await listNotifications(user.id);

    return c.json(notificationsResponseSchema.parse({ data: { items, nextCursor: null } }));
  } catch (error) {
    return errorResponse(c, error);
  }
});

notificationsRoutes.get('/notifications/unread-count', async (c) => {
  try {
    const user = await requireUser(c);
    const count = await unreadCount(user.id);

    return c.json(unreadCountResponseSchema.parse({ data: { count } }));
  } catch (error) {
    return errorResponse(c, error);
  }
});

notificationsRoutes.post('/notifications/:id/read', async (c) => {
  try {
    const user = await requireUser(c);
    await markNotificationRead(user.id, c.req.param('id'));

    return c.json({ data: {} });
  } catch (error) {
    return errorResponse(c, error);
  }
});

notificationsRoutes.post('/notifications/read-all', async (c) => {
  try {
    const user = await requireUser(c);
    await markAllNotificationsRead(user.id);

    return c.json({ data: {} });
  } catch (error) {
    return errorResponse(c, error);
  }
});
