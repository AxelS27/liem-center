'use client';

import { buttonVariants, cn } from '@repo/ui';
import { checkoutResponseSchema, productResponseSchema, type Product } from '@repo/types';
import { useEffect, useState } from 'react';

import { formatPrice, productTypeLabels } from '@/features/catalog';
import { useCart } from '@/hooks/use-cart';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1';

/**
 * Client checkout/cart, backed by the shared cart store. Product and order data comes from the
 * backend; Midtrans Snap remains disabled until server keys are configured.
 */
export function CheckoutView({ isGift }: { isGift: boolean }) {
  const cart = useCart();
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadItems() {
      setLoading(true);
      setError(null);

      try {
        const products = await Promise.all(
          cart.items.map(async (slug) => {
            const response = await fetch(`${API_URL}/products/${slug}`);

            if (!response.ok) {
              return null;
            }

            return productResponseSchema.parse(await response.json()).data;
          }),
        );

        if (!cancelled) {
          setItems(products.filter((product): product is Product => Boolean(product)));
        }
      } catch {
        if (!cancelled) {
          setError('Unable to load your cart items.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadItems();

    return () => {
      cancelled = true;
    };
  }, [cart.items]);

  const subtotal = items.reduce((sum, product) => sum + product.priceIdr, 0);
  const total = subtotal;

  async function pay() {
    setPaying(true);
    setError(null);

    try {
      const supabase = createSupabaseBrowserClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setError('Sign in again before checkout.');
        return;
      }

      const response = await fetch(`${API_URL}/checkout`, {
        body: JSON.stringify({
          items: items.map((product) => product.slug),
          recipient: { type: isGift ? 'gift' : 'self' },
        }),
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Checkout failed.');
      }

      const result = checkoutResponseSchema.parse(await response.json()).data;
      cart.clear();
      setOrderId(result.order.id);
    } catch {
      setError('Unable to start checkout.');
    } finally {
      setPaying(false);
    }
  }

  if (orderId) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center shadow-sm">
        <h2 className="text-xl font-semibold text-foreground">Order created</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          Your order is saved as awaiting payment. Midtrans Snap will open here once the server
          keys are configured.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <a href="/library" className={cn(buttonVariants())}>
            Go to library
          </a>
          <a href={`/orders/${orderId}`} className={cn(buttonVariants({ variant: 'outline' }))}>
            View order
          </a>
          <a href="/products" className={cn(buttonVariants({ variant: 'outline' }))}>
            Keep browsing
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-lg border border-border px-6 py-16 text-center">
        <p className="text-base font-medium text-foreground">Loading cart</p>
        <p className="mt-2 text-sm text-muted-foreground">Checking current product data.</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border px-6 py-16 text-center">
        <p className="text-base font-medium text-foreground">Your cart is empty</p>
        <p className="mt-2 text-sm text-muted-foreground">Add a product to get started.</p>
        <a href="/products" className={cn(buttonVariants(), 'mt-6')}>
          Browse products
        </a>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-start">
      <ul className="divide-y divide-border border-y border-border">
        {items.map((product) => (
          <li key={product.slug} className="flex items-center justify-between gap-4 py-4">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">{product.name}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {productTypeLabels[product.type]}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-foreground">
                {formatPrice(product.priceIdr)}
              </span>
              <button
                type="button"
                onClick={() => cart.remove(product.slug)}
                className="text-xs font-medium text-muted-foreground transition-colors hover:text-destructive"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        {isGift ? (
          <p className="mb-4 rounded-md border border-border bg-secondary px-3 py-2 text-xs text-foreground">
            Gift purchase. On payment you get a redeem code to share.
          </p>
        ) : null}

        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Subtotal</dt>
            <dd className="text-foreground">{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
            <dt>Total</dt>
            <dd>{formatPrice(total)}</dd>
          </div>
        </dl>
        {error ? (
          <p className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <button
          type="button"
          onClick={pay}
          disabled={paying}
          className={cn(buttonVariants({ size: 'lg' }), 'mt-6 w-full')}
        >
          {paying ? 'Starting payment...' : 'Pay with Midtrans'}
        </button>
        <p className="mt-3 text-xs leading-5 text-muted-foreground">
          One-time payment. You own the product permanently after checkout.
        </p>
      </div>
    </div>
  );
}
