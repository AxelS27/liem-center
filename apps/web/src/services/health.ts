import { healthResponseSchema, type HealthResponse } from '@repo/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1';

export async function getHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_URL}/health`, {
    headers: { Accept: 'application/json' },
    next: { revalidate: 30 },
  });

  if (!response.ok) {
    throw new Error('Health check failed.');
  }

  return healthResponseSchema.parse(await response.json());
}
