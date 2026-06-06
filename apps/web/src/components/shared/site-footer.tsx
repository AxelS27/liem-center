import Image from 'next/image';

import logo from '@/app/icon.png';

const footerSections = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '/features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Changelog', href: '/changelog' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: '/docs' },
      { label: 'Guides', href: '/guides' },
      { label: 'Blog', href: '/blog' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
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
            <a href="/" className="flex items-center gap-2.5 font-semibold tracking-tight">
              <Image src={logo} alt="" width={28} height={28} className="h-7 w-7 rounded-md" />
              <span>Liem Monorepo</span>
            </a>
            <p className="mt-4 text-sm text-muted-foreground">
              An opinionated monorepo starter for building consistent, production-ready products
              without the boilerplate.
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
          <span>© {new Date().getFullYear()} Liem Monorepo. All rights reserved.</span>
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
