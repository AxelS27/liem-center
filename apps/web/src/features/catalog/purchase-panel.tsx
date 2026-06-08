'use client';

import { buttonVariants, cn } from '@repo/ui';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useAuthGate } from '@/features/auth';

import { formatPrice, productTypeLabels, type Product } from './catalog-data';

/**
 * Sticky purchase panel on the product detail page. The page is public; the Buy / Claim / Gift /
 * Wishlist actions are auth-gated (see docs/product/UI_UX.md "Auth Gating Model"). A signed-out
 * visitor is routed to sign-in and returned here or to the next step after authenticating.
 */
export function PurchasePanel({ product }: { product: Product }) {
  const router = useRouter();
  const gate = useAuthGate();
  const [pending, setPending] = useState<string | null>(null);

  const isFree = product.type === 'free';
  const here = `/products/${product.slug}`;

  async function run(action: string, authedDestination: string) {
    setPending(action);

    try {
      const authed = await gate(here);

      if (authed) {
        router.push(authedDestination);
      }
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <span className="rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
          {productTypeLabels[product.type]}
        </span>
        <span className="text-xs font-medium text-muted-foreground">{product.version}</span>
      </div>

      <p className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
        {formatPrice(product.priceIdr)}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        One-time purchase. Permanent ownership, no subscription.
      </p>

      <div className="mt-6 grid gap-3">
        {isFree ? (
          <button
            type="button"
            onClick={() => run('claim', '/library')}
            disabled={pending !== null}
            className={cn(buttonVariants({ size: 'lg' }), 'w-full')}
          >
            {pending === 'claim' ? 'Checking your account...' : 'Claim'}
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => run('buy', `/checkout?product=${product.slug}`)}
              disabled={pending !== null}
              className={cn(buttonVariants({ size: 'lg' }), 'w-full')}
            >
              {pending === 'buy' ? 'Checking your account...' : 'Buy now'}
            </button>
            <button
              type="button"
              onClick={() => run('gift', `/checkout?product=${product.slug}&gift=1`)}
              disabled={pending !== null}
              className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'w-full')}
            >
              Buy as gift
            </button>
          </>
        )}
        <button
          type="button"
          onClick={() => run('wishlist', '/wishlist')}
          disabled={pending !== null}
          className={cn(buttonVariants({ variant: 'ghost' }), 'w-full')}
        >
          Add to wishlist
        </button>
      </div>

      {product.requires && product.requires.length > 0 ? (
        <p className="mt-5 rounded-md border border-border bg-secondary/50 px-3 py-2 text-xs leading-5 text-muted-foreground">
          Requires {product.requires.join(', ')}. Checkout will let you add it if you do not own it
          yet.
        </p>
      ) : null}

      {product.githubRepo ? (
        <p className="mt-4 text-xs leading-5 text-muted-foreground">
          GitHub product. Connect GitHub once and a repository invitation is sent automatically.
        </p>
      ) : null}
    </div>
  );
}
