import { describe, expect, it } from 'vitest';

import { app } from './app';

describe('health route', () => {
  it('returns the shared health envelope', async () => {
    const response = await app.request('/api/v1/health');

    await expect(response.json()).resolves.toEqual({ data: { status: 'ok' } });
    expect(response.status).toBe(200);
  });
});
