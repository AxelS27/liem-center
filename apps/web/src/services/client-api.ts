import { createSupabaseBrowserClient } from '@/lib/supabase/browser';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1';

/**
 * Authenticated browser-side request to the API. Attaches the current Supabase session token.
 * For client mutations (wishlist, notifications). Server components use src/services/api.ts.
 */
export async function authedRequest(path: string, init: RequestInit = {}): Promise<Response> {
  const supabase = createSupabaseBrowserClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('NOT_AUTHENTICATED');
  }

  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${session.access_token}`);

  if (init.body) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_URL}${path}`, { ...init, headers });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response;
}
