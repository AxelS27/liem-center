'use client';

import { buttonVariants, cn } from '@repo/ui';
import { useMemo, useState } from 'react';

import { formatPrice, getProduct, productTypeLabels } from '@/features/catalog';
import { useCart } from '@/hooks/use-cart';

const COUPONS: Record<string, number> = { LIEM10: 0.1, LAUNCH50: 0.5 };

/**
 * Client checkout/cart, backed by the shared cart store. Coupon and pay are mock interactions for
 * the frontend build; real payment goes through the Midtrans flow in apps/server once the backend
 * lands (docs/engineering/PAYMENTS.md).
 */
export function CheckoutView({ isGift }: { isGift: boolean }) {
  const cart = useCart();
  const [coupon, setCoupon] = useState('');
  const [appliedRate, setAppliedRate] = useState(0);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [done, setDone] = useState(false);

  const items = useMemo(
    () =>
      cart.items
        .map((slug) => getProduct(slug))
        .filter((product): product is NonNullable<typeof product> => Boolean(product)),
    [cart.items],
  );

  const subtotal = items.reduce((sum, product) => sum + product.priceIdr, 0);
  const discount = Math.round(subtotal * appliedRate);
  const total = subtotal - discount;

  function applyCoupon() {
    const code = coupon.trim().toUpperCase();
    const rate = COUPONS[code];

    if (!rate) {
      setAppliedRate(0);
      setCouponError('That code is not valid.');
      return;
    }

    setCouponError(null);
    setAppliedRate(rate);
  }

  function pay() {
    setPaying(true);
    window.setTimeout(() => {
      cart.clear();
      setPaying(false);
      setDone(true);
    }, 700);
  }

  if (done) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center shadow-sm">
        <h2 className="text-xl font-semibold text-foreground">Payment started</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          In the live product this opens Midtrans and, once paid, adds the product to your library
          with permanent ownership.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <a href="/library" className={cn(buttonVariants())}>
            Go to library
          </a>
          <a href="/products" className={cn(buttonVariants({ variant: 'outline' }))}>
            Keep browsing
          </a>
        </div>
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

        <div className="flex gap-2">
          <input
            value={coupon}
            onChange={(event) => setCoupon(event.target.value)}
            placeholder="Coupon code"
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm uppercase text-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          />
          <button
            type="button"
            onClick={applyCoupon}
            className={cn(buttonVariants({ variant: 'outline' }))}
          >
            Apply
          </button>
        </div>
        {couponError ? <p className="mt-2 text-xs text-destructive">{couponError}</p> : null}
        {appliedRate > 0 ? (
          <p className="mt-2 text-xs text-success">Coupon applied.</p>
        ) : null}

        <dl className="mt-6 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Subtotal</dt>
            <dd className="text-foreground">{formatPrice(subtotal)}</dd>
          </div>
          {discount > 0 ? (
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Discount</dt>
              <dd className="text-foreground">-{formatPrice(discount)}</dd>
            </div>
          ) : null}
          <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
            <dt>Total</dt>
            <dd>{formatPrice(total)}</dd>
          </div>
        </dl>

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
