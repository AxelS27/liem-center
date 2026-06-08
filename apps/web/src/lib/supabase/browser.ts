import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@repo/types';

let browserClient: ReturnType<typeof createBrowserClient<Database>> | undefined;

function getSupabaseBrowserEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error('Supabase browser environment variables are not configured.');
  }

  return { anonKey, url };
}

export function createSupabaseBrowserClient() {
  const { anonKey, url } = getSupabaseBrowserEnv();

  browserClient ??= createBrowserClient<Database>(url, anonKey);

  return browserClient;
}
