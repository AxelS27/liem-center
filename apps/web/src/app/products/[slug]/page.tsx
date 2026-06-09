import { buttonVariants, cn } from '@repo/ui';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import {
  categoryLabels,
  getProductCover,
  ProductTabs,
  PurchasePanel,
} from '@/features/catalog';
import { getLibrary, getProduct } from '@/services/api';

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug).catch(() => null);

  if (!product) {
    return { title: 'Product not found' };
  }

  return { title: product.name, description: product.tagline };
}

export default async function ProductDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProduct(slug).catch(() => null);

  if (!product) {
    notFound();
  }

  const owned = await getLibrary()
    .then((entitlements) =>
      entitlements.some((entitlement) => entitlement.product.slug === product.slug),
    )
    .catch(() => false);

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-12 sm:py-16">
      <a
        href="/products"
        className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), '-ml-2 gap-1.5')}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
        Back to products
      </a>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        <div>
          <span className="rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
            {categoryLabels[product.category]}
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {product.name}
          </h1>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-muted-foreground">
            {product.tagline}
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Version {product.version ?? 'Unversioned'} · Updated {product.updatedAt}
          </p>

          <div className="mt-8 overflow-hidden rounded-lg border border-border bg-secondary">
            <Image
              src={getProductCover(product)}
              alt={`${product.name} preview`}
              className="aspect-[16/9] w-full object-cover"
              priority
            />
          </div>

          <div className="mt-12">
            <ProductTabs product={product} owned={owned} />
          </div>
        </div>

        <aside className="lg:sticky lg:top-24">
          <PurchasePanel product={product} />
        </aside>
      </div>
    </section>
  );
}
