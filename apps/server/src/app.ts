import { healthResponseSchema } from '@repo/types';
import { Hono } from 'hono';

export const app = new Hono().basePath('/api/v1');

app.get('/health', (c) => c.json(healthResponseSchema.parse({ data: { status: 'ok' } })));
