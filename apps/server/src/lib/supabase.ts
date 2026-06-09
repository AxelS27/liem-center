import { createClient } from '@supabase/supabase-js';

import { getServerEnv } from './env';

// The generated Supabase Database type is empty until this migration is applied and
// `pnpm db:types` is rerun, so the service client is intentionally loose in this slice.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let serviceClient: any;

export function createSupabaseServiceClient() {
  const { NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = getServerEnv();

  serviceClient ??= createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return serviceClient;
}
