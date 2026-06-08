import type { Metadata } from 'next';

import { getEntitlements, LibraryView } from '@/features/library';

export const metadata: Metadata = {
  title: 'Library',
};

export default function LibraryPage() {
  const entitlements = getEntitlements();

  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-16 sm:py-20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Your library</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Everything you own.
          </h1>
          <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">
            Permanent access to every product you have claimed, purchased, redeemed, or received.
          </p>
        </div>
        <a
          href="/products"
          className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          Browse products
        </a>
      </div>

      <div className="mt-10">
        <LibraryView entitlements={entitlements} />
      </div>
    </section>
  );
}
