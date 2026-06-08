import { buttonVariants, cn } from '@repo/ui';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Home',
};

const featuredProducts = [
  {
    name: 'Liem Monorepo',
    type: 'GitHub',
    price: 'Rp799.000',
    version: 'v1.0',
    summary: 'A production-grade TypeScript monorepo foundation for serious product builds.',
  },
  {
    name: 'Liem UI Kit',
    type: 'Download',
    price: 'Rp499.000',
    version: 'v0.8',
    summary: 'Reusable interface patterns tuned for calm, premium developer products.',
  },
  {
    name: 'Liem Starter Docs',
    type: 'Free',
    price: 'Free',
    version: 'v1.1',
    summary: 'The public documentation starter for planning and operating a Liem project.',
  },
];

const ecosystemPoints = [
  {
    title: 'Acquire products from one account',
    detail:
      'Claim free releases, buy premium tools, redeem codes, and keep every entitlement tied to your library.',
  },
  {
    title: 'Activate GitHub products on demand',
    detail:
      'Source-code products use repository invites, so access feels native to a developer workflow.',
  },
  {
    title: 'Stay informed without chasing DMs',
    detail:
      'Notifications, email, and support tickets keep purchase, invite, and product-update events traceable.',
  },
  {
    title: 'Show what you own',
    detail:
      'Profiles, tiers, badges, and pinned products make the library feel like part of a real ecosystem.',
  },
];

function ProductCard({
  product,
}: {
  product: {
    name: string;
    type: string;
    price: string;
    version: string;
    summary: string;
  };
}) {
  return (
    <article className="rounded-lg border border-border bg-card p-5 transition-transform duration-150 hover:-translate-y-1 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background">
      <div className="flex items-center justify-between gap-4">
        <span className="rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
          {product.type}
        </span>
        <span className="text-xs font-medium text-muted-foreground">{product.version}</span>
      </div>
      <h3 className="mt-5 text-lg font-semibold tracking-tight text-foreground">
        <a href="/products" className="focus-visible:outline-none">
          {product.name}
        </a>
      </h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{product.summary}</p>
      <div className="mt-6 flex items-center justify-between gap-4">
        <span className="text-sm font-semibold text-foreground">{product.price}</span>
        <a
          href="/products"
          className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          View product
        </a>
      </div>
    </article>
  );
}

function SectionIcon({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export default function HomePage() {
  return (
    <>
      <section className="mx-auto w-full max-w-6xl px-6 pt-20 text-center sm:pt-28">
        <p className="text-sm font-medium text-muted-foreground">Official Liem developer hub</p>
        <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Every Liem product. One account.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
          Discover, claim, purchase, and manage permanent access to Liem products from a calm
          developer library built around ownership.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a href="/products" className={cn(buttonVariants({ size: 'lg' }), 'w-full sm:w-auto')}>
            Browse products
          </a>
          <a
            href="/signin"
            className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'w-full sm:w-auto')}
          >
            Sign in
          </a>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-28">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-muted-foreground">Featured products</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Discover the core Liem stack.
            </h2>
          </div>
          <a
            href="/products"
            className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            View all products
          </a>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.map((product) => (
            <ProductCard key={product.name} product={product} />
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-secondary/30">
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-20 sm:py-28 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Ecosystem, not a store</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Ownership, access, and communication live in the same place.
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Liem Center is the operating surface for the Liem ecosystem. It is where developers
              find products, own them permanently, activate GitHub access, get notified, and ask for
              help without leaving the account hub.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2">
            {ecosystemPoints.map((point) => (
              <div key={point.title} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-background text-primary">
                  <SectionIcon>
                    <path d="M20 6 9 17l-5-5" />
                  </SectionIcon>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{point.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{point.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-28">
        <div className="rounded-lg bg-foreground px-8 py-14 text-center text-background sm:px-16">
          <h2 className="mx-auto max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">
            Build your permanent Liem library.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-background/70">
            Browse products now, then sign in when you are ready to claim, buy, or activate a
            repository invite.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="/products"
              className={cn(buttonVariants({ variant: 'inverse', size: 'lg' }), 'w-full sm:w-auto')}
            >
              Browse products
            </a>
            <a
              href="/library"
              className={cn(
                buttonVariants({ variant: 'inverseOutline', size: 'lg' }),
                'w-full sm:w-auto',
              )}
            >
              Go to library
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
