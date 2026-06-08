'use client';

import { cn } from '@repo/ui';
import { useMemo, useState } from 'react';

import { productTypeLabels, type Product, type ProductType } from './catalog-data';
import { ProductCard } from './product-card';

type Filter = ProductType | 'all';

const filters: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'github', label: productTypeLabels.github },
  { value: 'download', label: productTypeLabels.download },
  { value: 'free', label: productTypeLabels.free },
  { value: 'bundle', label: productTypeLabels.bundle },
];

/**
 * Client catalog browser: type filter + responsive grid. Receives products as a prop and only
 * filters them in memory (UI renders data, it never creates it).
 */
export function CatalogBrowser({ products }: { products: Product[] }) {
  const [active, setActive] = useState<Filter>('all');

  const visible = useMemo(
    () => (active === 'all' ? products : products.filter((product) => product.type === active)),
    [active, products],
  );

  return (
    <div>
      <div
        role="tablist"
        aria-label="Filter products by type"
        className="flex flex-wrap items-center gap-2"
      >
        {filters.map((filter) => {
          const isActive = filter.value === active;

          return (
            <button
              key={filter.value}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(filter.value)}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98]',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/70',
              )}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <div className="mt-10 rounded-lg border border-dashed border-border px-6 py-16 text-center">
          <p className="text-base font-medium text-foreground">No products in this category yet</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try another type, or browse everything from the All tab.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
