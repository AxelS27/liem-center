'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import { createSupabaseBrowserClient } from '@/lib/supabase/browser';

/**
 * Action-level auth gate for public pages (redeem, support, product purchase). The page itself
 * renders for guests; only the confirm/submit action calls this. If the visitor is signed out
 * it routes them to /signin?next=<here> and returns false so the caller stops; if signed in it
 * returns true so the caller proceeds. See docs/product/UI_UX.md "Auth Gating Model".
 */
export function useAuthGate() {
  const router = useRouter();

  return useCallback(
    async (next: string): Promise<boolean> => {
      const supabase = createSupabaseBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push(`/signin?next=${encodeURIComponent(next)}`);
        return false;
      }

      return true;
    },
    [router],
  );
}
