import type { Metadata } from 'next';

import { CatalogBrowser, getProducts } from '@/features/catalog';

export const metadata: Metadata = {
  title: 'Products',
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const query = typeof params.q === 'string' ? params.q : '';
  const products = getProducts();

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-16 sm:py-20">
      <div className="max-w-2xl">
        <p className="text-sm font-medium text-muted-foreground">Catalog</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Every Liem product, in one place.
        </h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          Claim free releases, buy premium tools, and activate GitHub products on demand. Each
          purchase stays in your library permanently.
        </p>
      </div>

      <div className="mt-10">
        <CatalogBrowser products={products} initialQuery={query} />
      </div>
    </section>
  );
}
