import { healthResponseSchema } from '@repo/types';
import { Hono } from 'hono';

import { catalogRoutes } from './features/catalog/catalog.routes';
import { codesRoutes } from './features/codes/codes.routes';
import { libraryRoutes } from './features/library/library.routes';
import { notificationsRoutes } from './features/notifications/notifications.routes';
import { ordersRoutes } from './features/orders/orders.routes';
import { paymentsRoutes } from './features/payments/payments.routes';
import { profileRoutes } from './features/profile/profile.routes';
import { supportRoutes } from './features/support/support.routes';
import { wishlistRoutes } from './features/wishlist/wishlist.routes';

export const app = new Hono().basePath('/api/v1');

app.get('/health', (c) => c.json(healthResponseSchema.parse({ data: { status: 'ok' } })));

app.route('/', catalogRoutes);
app.route('/', libraryRoutes);
app.route('/', ordersRoutes);
app.route('/', wishlistRoutes);
app.route('/', notificationsRoutes);
app.route('/', profileRoutes);
app.route('/', supportRoutes);
app.route('/', codesRoutes);
app.route('/', paymentsRoutes);
