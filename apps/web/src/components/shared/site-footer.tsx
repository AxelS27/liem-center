import Image from 'next/image';

import logo from '@/app/icon.png';

const footerSections = [
  {
    title: 'Products',
    links: [
      { label: 'Browse products', href: '/products' },
      { label: 'Library', href: '/library' },
      { label: 'Redeem code', href: '/redeem' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Profile', href: '/profile' },
      { label: 'Orders', href: '/orders' },
      { label: 'Settings', href: '/settings' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Support tickets', href: '/support' },
      { label: 'Notifications', href: '/notifications' },
      { label: 'Legal', href: '/terms' },
    ],
  },
];

/**
 * Public footer endcap: a surface band with a top border, a brand block, structured link
 * columns, and a bottom bar with copyright and legal links. It reads as a deliberate page
 * ending, not stray muted text, and stays consistent across every public route.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="mx-auto w-full max-w-6xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <a href="/" className="flex items-center gap-2 font-semibold tracking-tight">
              <Image src={logo} alt="" width={28} height={28} className="h-7 w-7 rounded-md" />
              <span>Liem Center</span>
            </a>
            <p className="mt-4 text-sm text-muted-foreground">
              The official hub for discovering, owning, and managing every Liem developer product.
            </p>
          </div>
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-foreground">{section.title}</h3>
              <ul className="mt-4 space-y-3 text-sm">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>Copyright {new Date().getFullYear()} Liem Center. All rights reserved.</span>
          <nav aria-label="Legal" className="flex gap-6">
            <a href="/privacy" className="transition-colors hover:text-foreground">
              Privacy
            </a>
            <a href="/terms" className="transition-colors hover:text-foreground">
              Terms
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
