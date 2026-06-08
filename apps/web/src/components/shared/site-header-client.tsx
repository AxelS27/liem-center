'use client';

import { buttonVariants, cn } from '@repo/ui';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, type FormEvent, type ReactNode } from 'react';

import logo from '@/app/icon.png';
import { useCart } from '@/hooks/use-cart';

import { LanguageSwitcher, ThemeSwitcher } from './header-controls';

export type NavRole = 'admin' | 'guest' | 'user';

type NavItem = {
  label: string;
  href: string;
  icon?: ReactNode;
};

const guestPrimaryNavItems: NavItem[] = [
  { label: 'Products', href: '/products' },
  { label: 'Redeem', href: '/redeem' },
  { label: 'Support', href: '/support' },
];

const userPrimaryNavItems: NavItem[] = [
  { label: 'Products', href: '/products' },
  { label: 'Library', href: '/library' },
  { label: 'Redeem', href: '/redeem' },
  { label: 'Support', href: '/support' },
];

const adminPrimaryNavItems: NavItem[] = [
  ...userPrimaryNavItems,
  { label: 'Admin', href: '/admin' },
];

const wishlistIcon = (
  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
);

const cartIcon = (
  <>
    <circle cx="8" cy="21" r="1" />
    <circle cx="19" cy="21" r="1" />
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h7.72a2 2 0 0 0 2-1.61L20 7H5.12" />
  </>
);

const notificationsIcon = (
  <>
    <path d="M10.27 21a2 2 0 0 0 3.46 0" />
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 7-3 7h18s-3 0-3-7" />
  </>
);

const profileIcon = (
  <>
    <path d="M20 21a8 8 0 0 0-16 0" />
    <circle cx="12" cy="7" r="4" />
  </>
);

// Account-specific entries. Order history lives here (not in the primary nav); Library stays in
// the primary nav and is intentionally not duplicated.
const accountMenuItems: NavItem[] = [
  { label: 'Profile', href: '/profile' },
  { label: 'Order history', href: '/orders' },
  { label: 'Settings', href: '/settings' },
];

const guestUtilityNavItems: NavItem[] = [{ label: 'Cart', href: '/checkout', icon: cartIcon }];

const userUtilityNavItems: NavItem[] = [
  { label: 'Wishlist', href: '/wishlist', icon: wishlistIcon },
  { label: 'Cart', href: '/checkout', icon: cartIcon },
  { label: 'Notifications', href: '/notifications', icon: notificationsIcon },
  { label: 'Profile', href: '/profile', icon: profileIcon },
];

function getPrimaryNavItems(role: NavRole) {
  if (role === 'admin') {
    return adminPrimaryNavItems;
  }

  if (role === 'user') {
    return userPrimaryNavItems;
  }

  return guestPrimaryNavItems;
}

function getUtilityNavItems(role: NavRole) {
  if (role === 'guest') {
    return guestUtilityNavItems;
  }

  return userUtilityNavItems;
}

function NavIcon({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function HeaderSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    router.push(trimmed ? `/products?q=${encodeURIComponent(trimmed)}` : '/products');
  }

  return (
    <form role="search" onSubmit={onSubmit} className="flex min-w-0 flex-1">
      <div className="relative w-full">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="search"
          name="q"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search products"
          aria-label="Search products"
          className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        />
      </div>
    </form>
  );
}

export function SiteHeaderClient({ role, userName }: { role: NavRole; userName: string | null }) {
  const pathname = usePathname();
  const { count: cartCount } = useCart();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const primaryNavItems = getPrimaryNavItems(role);
  // Profile lives in the top utility bar (the account name links there), so keep it out of the
  // main-row icon cluster to avoid duplication.
  const utilityNavItems = getUtilityNavItems(role).filter((item) => item.href !== '/profile');

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      {/* Top utility row: primary navigation + account. No divider/background so the two rows
          read as one header. */}
      <div className="hidden pt-2 sm:block">
        <div className="mx-auto flex h-9 w-full max-w-7xl items-center justify-between gap-6 px-6 text-sm">
          <nav aria-label="Primary navigation" className="flex shrink-0 items-center gap-4">
            {primaryNavItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={cn(
                  'transition-colors',
                  isActive(item.href)
                    ? 'font-medium text-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-3">
            <LanguageSwitcher />
            <ThemeSwitcher />
            <span className="text-border" aria-hidden="true">
              |
            </span>
            {role === 'guest' ? (
              <>
                <a
                  href="/signin"
                  className="font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Sign in
                </a>
                <span className="text-border" aria-hidden="true">
                  |
                </span>
                <a
                  href="/signup"
                  className="font-medium text-foreground transition-colors hover:text-foreground/70"
                >
                  Create account
                </a>
              </>
            ) : (
              <div className="group relative">
                <a
                  href="/profile"
                  className="flex items-center gap-1.5 font-medium text-muted-foreground transition-colors hover:text-foreground group-hover:text-foreground"
                >
                  <NavIcon>{profileIcon}</NavIcon>
                  <span className="max-w-32 truncate">{userName ?? 'Account'}</span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.75}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3.5 w-3.5"
                    aria-hidden="true"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </a>
                <div className="absolute right-0 top-full z-20 hidden pt-2 group-hover:block group-focus-within:block">
                  <div className="w-48 rounded-md border border-border bg-background p-1 shadow-sm">
                    {accountMenuItems.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        className="flex items-center rounded-sm px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                      >
                        {item.label}
                      </a>
                    ))}
                    <div className="my-1 border-t border-border" />
                    <form action="/auth/signout" method="post">
                      <button
                        type="submit"
                        className="flex w-full items-center rounded-sm px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                      >
                        Sign out
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main row: brand + search + utility icons */}
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-3 px-6 sm:gap-6">
        <a href="/" className="flex shrink-0 items-center gap-2 font-semibold tracking-tight">
          <Image src={logo} alt="" width={32} height={32} priority className="h-8 w-8 rounded-md" />
          <span className="hidden text-base sm:inline">Liem Center</span>
        </a>

        <HeaderSearch />

        <nav aria-label="Utility navigation" className="hidden items-center gap-1 sm:flex">
          {utilityNavItems.map((item) => {
            const showCart = item.href === '/checkout' && cartCount > 0;

            return (
              <a
                key={item.href}
                href={item.href}
                aria-label={showCart ? `${item.label}, ${cartCount} items` : item.label}
                title={item.label}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={cn(
                  'relative flex h-9 w-9 items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98]',
                  isActive(item.href)
                    ? 'bg-secondary text-foreground'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                )}
              >
                <NavIcon>{item.icon}</NavIcon>
                {showCart ? (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                    {cartCount}
                  </span>
                ) : null}
              </a>
            );
          })}
        </nav>

        <details className="group relative shrink-0 sm:hidden">
          <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-md border border-border marker:hidden [&::-webkit-details-marker]:hidden">
            <NavIcon>
              <>
                <path d="M4 6h16" />
                <path d="M4 12h16" />
                <path d="M4 18h16" />
              </>
            </NavIcon>
            <span className="sr-only">Menu</span>
          </summary>
          <nav
            aria-label="Mobile navigation"
            className="absolute right-0 z-10 mt-3 w-60 rounded-md border border-border bg-background p-2 shadow-sm"
          >
            {[...primaryNavItems, ...getUtilityNavItems(role)].map((item) => (
              <a
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-2 rounded-sm px-3 py-2 text-sm transition-colors',
                  isActive(item.href)
                    ? 'bg-secondary font-medium text-foreground'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                )}
              >
                {item.icon ? <NavIcon>{item.icon}</NavIcon> : null}
                {item.label}
              </a>
            ))}
            <div className="mt-2 grid gap-2 border-t border-border pt-2">
              {role === 'guest' ? (
                <>
                  <a
                    href="/signin"
                    className="rounded-sm px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    Sign in
                  </a>
                  <a href="/signup" className={cn(buttonVariants({ size: 'sm' }), 'w-full')}>
                    Create account
                  </a>
                </>
              ) : (
                <>
                  <span className="px-3 py-1 text-xs text-muted-foreground">
                    Signed in as {userName ?? 'your account'}
                  </span>
                  <form action="/auth/signout" method="post">
                    <button
                      type="submit"
                      className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'w-full')}
                    >
                      Sign out
                    </button>
                  </form>
                </>
              )}
            </div>
          </nav>
        </details>
      </div>
    </header>
  );
}
