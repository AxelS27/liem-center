import { buttonVariants, cn } from '@repo/ui';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home',
};

const navItems = [
  { label: 'Features', href: '/features' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Sign in', href: '/signin' },
];

const foundations = [
  'Plan the product before the first screen',
  'Keep every page consistent as it grows',
  'Launch with a clear next step',
];

export default function HomePage() {
  return (
    <main className="bg-background text-foreground">
      <header className="container flex items-center justify-between py-5 sm:py-6">
        <a href="/" className="text-base font-semibold tracking-tight">
          Liem
        </a>
        <nav aria-label="Primary navigation" className="hidden items-center gap-6 text-sm md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <details className="group relative md:hidden">
          <summary className="flex h-10 cursor-pointer list-none items-center rounded-md border border-border px-3 text-sm font-medium marker:hidden [&::-webkit-details-marker]:hidden">
            Menu
          </summary>
          <nav
            aria-label="Mobile navigation"
            className="absolute right-0 z-10 mt-3 w-48 rounded-md border border-border bg-background p-2 shadow-sm"
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block rounded-sm px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </details>
      </header>

      <section className="container grid gap-8 py-12 sm:py-16 md:grid-cols-[1fr_0.8fr] md:items-end md:gap-10 md:py-24">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-muted-foreground">Product starter</p>
          <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            A starter that keeps agents aligned from spec to ship.
          </h1>
          <p className="mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Liem gives every new product a clear plan, a consistent interface, and a focused path
            from first idea to first release.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a href="/features" className={cn(buttonVariants({ size: 'lg' }), 'w-full sm:w-auto')}>
              Explore features
            </a>
            <a
              href="/pricing"
              className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'w-full sm:w-auto')}
            >
              View pricing
            </a>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-5 text-card-foreground sm:p-6">
          <p className="text-sm font-medium text-muted-foreground">Starter standard</p>
          <ul className="mt-5 space-y-4">
            {foundations.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <footer className="container flex flex-col gap-3 pb-8 pt-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span>Built to stay consistent from the first route onward.</span>
        <a href="/features" className="font-medium text-foreground hover:text-muted-foreground">
          See what is included
        </a>
      </footer>
    </main>
  );
}
