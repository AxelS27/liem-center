import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import type { ReactNode } from 'react';

import { SiteFooter } from '@/components/shared/site-footer';
import { SiteHeader } from '@/components/shared/site-header';

import '../styles/globals.css';

/**
 * Real typeface, wired once. The template must never fall back to the browser default
 * (Times/serif) or a bland system stack - that is an instant generic-AI tell and the most
 * common cause of a "weird font" landing page.
 *
 * This loads a deliberate modern sans and binds it to the `--font-sans` token that
 * tailwind.config.ts and globals.css already consume. To give a product its own type
 * identity, swap this one import for another next/font family (one or two families total, no
 * decorative serif-italic) and keep the `--font-sans` variable. See docs/engineering/FRONTEND.md
 * (Typography) and the shadcn-ui skill.
 */
const fontSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Liem Monorepo',
    template: '%s | Liem Monorepo',
  },
  description: 'An opinionated monorepo starter for building consistent, production-ready products.',
};

/**
 * Persistent public shell. The header and footer live here so every route (including stubs
 * and the not-found page) shares the same navigation and endcap, and the shell stays mounted
 * while only the page content swaps. A product that adds signed-in or auth areas should split
 * these into route-group layouts (public / app / auth) per docs/engineering/FRONTEND.md.
 */
export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={fontSans.variable}>
      <body className="font-sans antialiased">
        <div className="flex min-h-dvh flex-col bg-background text-foreground">
          <SiteHeader />
          <main className="flex flex-1 flex-col">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
