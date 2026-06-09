'use client';

import type { Product } from '@repo/types';

import { ProductCard } from '@/features/catalog';
import { usePinnedProducts } from '@/hooks/use-pinned-products';

/**
 * Profile showcase, driven by the same pinned-products store the library writes to. Pinning a
 * product in the library makes it appear here.
 */
export function PinnedShowcase({ ownedProducts }: { ownedProducts: Product[] }) {
  const { pinned } = usePinnedProducts();

  const products = pinned
    .map((slug) => ownedProducts.find((product) => product.slug === slug))
    .filter((product): product is NonNullable<typeof product> => Boolean(product));

  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border px-6 py-10 text-center">
        <p className="text-sm font-medium text-foreground">No pinned products yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Pin products from your{' '}
          <a href="/library" className="font-medium text-primary hover:text-primary/80">
            library
          </a>{' '}
          to feature them here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </div>
  );
}
