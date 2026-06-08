'use client';

import { cn } from '@repo/ui';
import { useMemo, useState } from 'react';

import { categoryLabels, type Product, type ProductCategory } from './catalog-data';
import { ProductCard } from './product-card';

type Filter = ProductCategory | 'all';

const filters: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'repos', label: categoryLabels.repos },
  { value: 'apps', label: categoryLabels.apps },
  { value: 'prompts', label: categoryLabels.prompts },
  { value: 'skills', label: categoryLabels.skills },
  { value: 'templates', label: categoryLabels.templates },
  { value: 'bundle', label: 'Bundles' },
];

/**
 * Client catalog browser: search + type filter + responsive grid. Receives products as a prop and
 * only filters them in memory (UI renders data, it never creates it).
 */
export function CatalogBrowser({
  products,
  initialQuery = '',
}: {
  products: Product[];
  initialQuery?: string;
}) {
  const [active, setActive] = useState<Filter>('all');
  const [query, setQuery] = useState(initialQuery);

  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory = active === 'all' || product.category === active;
      const matchesQuery =
        normalized === '' ||
        product.name.toLowerCase().includes(normalized) ||
        product.tagline.toLowerCase().includes(normalized);

      return matchesCategory && matchesQuery;
    });
  }, [active, products, query]);

  return (
    <div>
      <div className="relative mb-5 max-w-md">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search products"
          aria-label="Search products"
          className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm text-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        />
      </div>

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
          <p className="text-base font-medium text-foreground">No products found</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try a different search or filter.
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
