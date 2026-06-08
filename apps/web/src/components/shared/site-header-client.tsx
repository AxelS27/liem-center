'use client';

import { buttonVariants, cn } from '@repo/ui';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, type FormEvent, type ReactNode } from 'react';

import logo from '@/app/icon.png';
import { useCart } from '@/hooks/use-cart';

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
  { label: 'Orders', href: '/orders' },
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
    <form role="search" onSubmit={onSubmit} className="hidden min-w-0 flex-1 justify-center px-4 lg:flex">
      <div className="relative w-full max-w-md">
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
          className="h-9 w-full rounded-md border border-border bg-secondary/60 pl-9 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        />
      </div>
    </form>
  );
}

export function SiteHeaderClient({ role, userEmail }: { role: NavRole; userEmail: string | null }) {
  const pathname = usePathname();
  const { count: cartCount } = useCart();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const primaryNavItems = getPrimaryNavItems(role);
  const utilityNavItems = getUtilityNavItems(role);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-6">
        <div className="flex items-center gap-6 lg:gap-8">
          <a href="/" className="flex shrink-0 items-center gap-2 font-semibold tracking-tight">
            <Image src={logo} alt="" width={32} height={32} priority className="h-8 w-8 rounded-md" />
            <span className="text-base">Liem Center</span>
          </a>

          <nav aria-label="Primary navigation" className="hidden items-center gap-5 text-sm lg:flex">
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
        </div>

        <HeaderSearch />

        <div className="hidden items-center gap-2 md:flex">
          <nav aria-label="Utility navigation" className="flex items-center gap-1">
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

          {role === 'guest' ? (
            <>
              <a
                href="/signin"
                className="px-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Sign in
              </a>
              <a href="/signup" className={cn(buttonVariants({ size: 'sm' }))}>
                Create account
              </a>
            </>
          ) : (
            <form action="/auth/signout" method="post" className="flex items-center gap-2">
              <span className="hidden max-w-40 truncate text-sm text-muted-foreground xl:inline">
                {userEmail}
              </span>
              <button
                type="submit"
                className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
              >
                Sign out
              </button>
            </form>
          )}
        </div>

        <details className="group relative md:hidden">
          <summary className="flex h-10 cursor-pointer list-none items-center rounded-md border border-border px-3 text-sm font-medium marker:hidden [&::-webkit-details-marker]:hidden">
            Menu
          </summary>
          <nav
            aria-label="Mobile navigation"
            className="absolute right-0 z-10 mt-3 w-60 rounded-md border border-border bg-background p-2 shadow-sm"
          >
            {[...primaryNavItems, ...utilityNavItems].map((item) => (
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
                <form action="/auth/signout" method="post">
                  <button
                    type="submit"
                    className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'w-full')}
                  >
                    Sign out
                  </button>
                </form>
              )}
            </div>
          </nav>
        </details>
      </div>
    </header>
  );
}
