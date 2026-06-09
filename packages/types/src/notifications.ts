import { z } from 'zod';

export const notificationSchema = z.object({
  id: z.string().uuid(),
  type: z.string(),
  title: z.string(),
  message: z.string(),
  linkUrl: z.string().nullable(),
  isRead: z.boolean(),
  createdAt: z.string(),
});

export const notificationsResponseSchema = z.object({
  data: z.object({
    items: z.array(notificationSchema),
    nextCursor: z.string().nullable(),
  }),
});

export const unreadCountResponseSchema = z.object({
  data: z.object({ count: z.number().int().nonnegative() }),
});

export type AppNotification = z.infer<typeof notificationSchema>;
