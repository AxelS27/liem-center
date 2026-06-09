'use client';

import { buttonVariants, cn } from '@repo/ui';
import type { Product } from '@repo/types';
import Image from 'next/image';
import { useState } from 'react';

import { formatPrice, getProductCover, productTypeLabels } from '@/features/catalog';
import { authedRequest } from '@/services/client-api';

/**
 * Client wishlist grid. Cards are not full-card links here because each needs its own Remove and
 * View actions, so the name links to the product and the actions sit in the footer.
 */
export function WishlistView({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  async function remove(slug: string) {
    const previous = products;
    setProducts((current) => current.filter((item) => item.slug !== slug));

    try {
      await authedRequest(`/wishlist/${slug}`, { method: 'DELETE' });
    } catch {
      setProducts(previous);
    }
  }

  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border px-6 py-16 text-center">
        <p className="text-base font-medium text-foreground">Your wishlist is empty</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Save products you want to revisit, claim, or buy later.
        </p>
        <a href="/products" className={cn(buttonVariants(), 'mt-6')}>
          Browse products
        </a>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <article
          key={product.slug}
          className="flex flex-col overflow-hidden rounded-lg border border-border bg-card"
        >
          <div className="relative aspect-[16/10] bg-secondary">
            <Image
              src={getProductCover(product)}
              alt=""
              fill
              sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-1 flex-col p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                {productTypeLabels[product.type]}
              </span>
              <span className="text-sm font-semibold text-foreground">
                {formatPrice(product.priceIdr)}
              </span>
            </div>
            <h3 className="mt-3 text-base font-semibold tracking-tight text-foreground">
              <a
                href={`/products/${product.slug}`}
                className="transition-colors hover:text-foreground/70"
              >
                {product.name}
              </a>
            </h3>
            <p className="mt-1 flex-1 text-sm leading-6 text-muted-foreground">{product.tagline}</p>
            <div className="mt-4 flex items-center gap-3">
              <a
                href={`/products/${product.slug}`}
                className={cn(buttonVariants({ size: 'sm' }), 'flex-1')}
              >
                View product
              </a>
              <button
                type="button"
                onClick={() => remove(product.slug)}
                className="text-xs font-medium text-muted-foreground transition-colors hover:text-destructive"
              >
                Remove
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
