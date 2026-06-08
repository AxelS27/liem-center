import type { Metadata } from 'next';

import { WishlistView } from '@/features/wishlist';

export const metadata: Metadata = {
  title: 'Wishlist',
};

export default function WishlistPage() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
      <p className="text-sm font-medium text-muted-foreground">Saved</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        Your wishlist
      </h1>
      <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">
        Products you want to revisit. We will let you know when a saved product goes on sale.
      </p>

      <div className="mt-10">
        <WishlistView initialSlugs={['liem-starter-bundle', 'liem-ui-kit', 'liem-ai-plugin']} />
      </div>
    </section>
  );
}
