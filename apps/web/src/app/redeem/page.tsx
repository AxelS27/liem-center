import type { Metadata } from 'next';

import { RedeemForm } from '@/features/redeem';

export const metadata: Metadata = {
  title: 'Redeem',
};

export default function RedeemPage() {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-16 sm:py-20">
      <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Redeem</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Have a gift or promo code?
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
            Enter a code to add the matching Liem product to your library. Gift codes come from
            someone who bought the product for you; promo codes come from Liem.
          </p>

          <dl className="mt-8 grid gap-5 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-medium text-foreground">Permanent ownership</dt>
              <dd className="mt-1 text-muted-foreground">
                A redeemed product is yours for good, just like a purchase.
              </dd>
            </div>
            <div>
              <dt className="font-medium text-foreground">GitHub products</dt>
              <dd className="mt-1 text-muted-foreground">
                If the product ships through GitHub, we prompt you to connect it after redeeming.
              </dd>
            </div>
          </dl>
        </div>

        <RedeemForm />
      </div>
    </section>
  );
}
