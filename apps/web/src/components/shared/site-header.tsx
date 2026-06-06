'use client';

import { buttonVariants, cn } from '@repo/ui';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

import logo from '@/app/icon.png';

const navItems = [
  { label: 'Features', href: '/features' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Sign in', href: '/signin' },
];

/**
 * Public navbar. It is route-aware: the link for the current page gets a visible active
 * treatment and `aria-current="page"` so it is announced to screen readers, not signalled by
 * color alone. Desktop and mobile share the same items and the same active state, including
 * the "Get started" CTA, so the two never drift. The page that renders this stays a server
 * component; only this small nav is a client island (it needs `usePathname`).
 */
export function SiteHeader() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <a href="/" className="flex items-center gap-2.5 font-semibold tracking-tight">
          <Image src={logo} alt="" width={32} height={32} priority className="h-8 w-8 rounded-md" />
          <span className="text-base">Liem Monorepo</span>
        </a>

        <nav aria-label="Primary navigation" className="hidden items-center gap-6 text-sm md:flex">
          {navItems.map((item) => (
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
          <a href="/signup" className={cn(buttonVariants({ size: 'sm' }))}>
            Get started
          </a>
        </nav>

        <details className="group relative md:hidden">
          <summary className="flex h-10 cursor-pointer list-none items-center rounded-md border border-border px-3 text-sm font-medium marker:hidden [&::-webkit-details-marker]:hidden">
            Menu
          </summary>
          <nav
            aria-label="Mobile navigation"
            className="absolute right-0 z-10 mt-3 w-52 rounded-md border border-border bg-background p-2 shadow-sm"
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={cn(
                  'block rounded-sm px-3 py-2 text-sm transition-colors',
                  isActive(item.href)
                    ? 'bg-secondary font-medium text-foreground'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                )}
              >
                {item.label}
              </a>
            ))}
            <a
              href="/signup"
              className={cn(buttonVariants({ size: 'sm' }), 'mt-1 w-full')}
            >
              Get started
            </a>
          </nav>
        </details>
      </div>
    </header>
  );
}
