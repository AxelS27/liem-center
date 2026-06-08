import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import {
  getProduct,
  getProducts,
  productTypeLabels,
  ProductTabs,
  PurchasePanel,
} from '@/features/catalog';

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return getProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    return { title: 'Product not found' };
  }

  return { title: product.name, description: product.tagline };
}

export default async function ProductDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    notFound();
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-12 sm:py-16">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <a href="/products" className="transition-colors hover:text-foreground">
          Products
        </a>
        <span className="px-2" aria-hidden="true">
          /
        </span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        <div>
          <span className="rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
            {productTypeLabels[product.type]}
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {product.name}
          </h1>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-muted-foreground">
            {product.tagline}
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Version {product.version} · Updated {product.updatedAt}
          </p>

          <div className="mt-8 overflow-hidden rounded-lg border border-border bg-secondary">
            <Image
              src={product.cover}
              alt={`${product.name} preview`}
              className="aspect-[16/9] w-full object-cover"
              priority
            />
          </div>

          <div className="mt-12">
            <ProductTabs product={product} />
          </div>
        </div>

        <aside className="lg:sticky lg:top-24">
          <PurchasePanel product={product} />
        </aside>
      </div>
    </section>
  );
}
