'use client';

import { cn } from '@repo/ui';
import { usePathname } from 'next/navigation';

const sections = [
  { label: 'Overview', href: '/admin' },
  { label: 'Products', href: '/admin/products' },
  { label: 'Orders', href: '/admin/orders' },
  { label: 'Users', href: '/admin/users' },
  { label: 'Codes', href: '/admin/codes' },
  { label: 'GitHub', href: '/admin/github' },
  { label: 'Reviews', href: '/admin/reviews' },
  { label: 'Support', href: '/admin/support' },
];

/**
 * Admin sub-navigation strip. Per docs/product/UI_UX.md the admin area uses top tabs, not a
 * sidebar; it sits under the global header.
 */
export function AdminNav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav aria-label="Admin sections" className="-mb-px flex gap-5 overflow-x-auto border-b border-border">
      {sections.map((section) => {
        const active = isActive(section.href);

        return (
          <a
            key={section.href}
            href={section.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'shrink-0 border-b-2 px-1 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              active
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            {section.label}
          </a>
        );
      })}
    </nav>
  );
}
