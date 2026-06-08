import { NextResponse, type NextRequest } from 'next/server';

import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/library';

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.redirect(
        new URL(`/signin?error=${encodeURIComponent(error.message)}`, requestUrl.origin),
      );
    }
  }

  return NextResponse.redirect(
    new URL(next.startsWith('/') ? next : '/library', requestUrl.origin),
  );
}
