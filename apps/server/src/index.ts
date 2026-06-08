import { serve } from '@hono/node-server';

import { loadEnvFile } from './lib/load-env';

async function main() {
  loadEnvFile();

  const { app } = await import('./app');
  const port = Number(process.env.PORT ?? 3000);

  serve({
    fetch: app.fetch,
    port,
  });
}

void main();
