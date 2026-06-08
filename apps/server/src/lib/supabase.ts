import type { Database } from '@repo/types';
import { createClient } from '@supabase/supabase-js';

import { getServerEnv } from './env';

let serviceClient: ReturnType<typeof createClient<Database>> | undefined;

export function createSupabaseServiceClient() {
  const { NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = getServerEnv();

  serviceClient ??= createClient<Database>(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return serviceClient;
}
