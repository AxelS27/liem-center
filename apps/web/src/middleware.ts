import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { User } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';

// Routes that redirect to sign-in on entry when signed out.
const protectedRoutes = [
  '/admin',
  '/checkout',
  '/library',
  '/notifications',
  '/orders',
  '/profile',
  '/settings',
  '/wishlist',
];

// /redeem and /support (incl. /support/new) are intentionally PUBLIC: the page renders for
// guests and only the confirm/submit action gates to sign-in (see docs/product/UI_UX.md
// "Auth Gating Model"). A specific support ticket (/support/<id>) is still private and guards
// itself in its own page, so it is matched explicitly here.
function isProtectedRoute(pathname: string) {
  if (protectedRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))) {
    return true;
  }

  // /support/<id> is protected, but /support and /support/new are not.
  return /^\/support\/(?!new$)[^/]+$/.test(pathname);
}

function isAdmin(user: User) {
  const metadata = user.app_metadata as Record<string, unknown>;
  const role = metadata.role;
  const roles = metadata.roles;

  return role === 'admin' || (Array.isArray(roles) && roles.includes('admin'));
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; options: CookieOptions; value: string }[]) {
        cookiesToSet.forEach(({ name, options, value }) => {
          request.cookies.set(name, value);
          response = NextResponse.next({ request });
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  if (isProtectedRoute(pathname) && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/signin';
    redirectUrl.searchParams.set('next', pathname);

    return NextResponse.redirect(redirectUrl);
  }

  if (pathname.startsWith('/admin') && user && !isAdmin(user)) {
    return NextResponse.redirect(new URL('/library', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.png).*)'],
};
