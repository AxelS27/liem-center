import type { Metadata } from 'next';

import { CheckoutView } from '@/features/checkout';

export const metadata: Metadata = {
  title: 'Checkout',
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function readParam(params: Awaited<SearchParams>, key: string) {
  const value = params[key];

  return typeof value === 'string' ? value : undefined;
}

export default async function CheckoutPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const product = readParam(params, 'product');
  const isGift = readParam(params, 'gift') === '1';

  // Seed the cart from the product the user came from; fall back to a sample item.
  const initialSlugs = product ? [product] : ['liem-monorepo'];

  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-16 sm:py-20">
      <p className="text-sm font-medium text-muted-foreground">Checkout</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        Review and pay
      </h1>
      <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">
        Confirm your items, apply a coupon if you have one, and continue to payment.
      </p>

      <div className="mt-10">
        <CheckoutView initialSlugs={initialSlugs} isGift={isGift} />
      </div>
    </section>
  );
}
