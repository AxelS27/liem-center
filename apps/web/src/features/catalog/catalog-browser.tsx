'use client';

import { useMemo, useState } from 'react';

import { categoryLabels, type Product, type ProductCategory } from './catalog-data';
import { ProductCard } from './product-card';

const categoryOptions: { value: ProductCategory; label: string }[] = [
  { value: 'repos', label: categoryLabels.repos },
  { value: 'apps', label: categoryLabels.apps },
  { value: 'prompts', label: categoryLabels.prompts },
  { value: 'skills', label: categoryLabels.skills },
  { value: 'templates', label: categoryLabels.templates },
  { value: 'bundle', label: 'Bundles' },
];

type PriceRange = 'all' | 'free' | 'under250' | '250to500' | 'over500';

const priceOptions: { value: PriceRange; label: string }[] = [
  { value: 'all', label: 'All prices' },
  { value: 'free', label: 'Free' },
  { value: 'under250', label: 'Under Rp250.000' },
  { value: '250to500', label: 'Rp250.000 – Rp500.000' },
  { value: 'over500', label: 'Over Rp500.000' },
];

function matchesPrice(priceIdr: number, range: PriceRange): boolean {
  switch (range) {
    case 'free':
      return priceIdr === 0;
    case 'under250':
      return priceIdr > 0 && priceIdr < 250000;
    case '250to500':
      return priceIdr >= 250000 && priceIdr <= 500000;
    case 'over500':
      return priceIdr > 500000;
    default:
      return true;
  }
}

/**
 * Client catalog browser: search + a left filter rail (category checkboxes, price range) + grid.
 * Receives products as a prop and only filters them in memory (UI renders data, never creates it).
 */
export function CatalogBrowser({
  products,
  initialQuery = '',
}: {
  products: Product[];
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [price, setPrice] = useState<PriceRange>('all');

  const hasFilters = categories.length > 0 || price !== 'all' || query.trim() !== '';

  function toggleCategory(value: ProductCategory) {
    setCategories((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    );
  }

  function clearAll() {
    setCategories([]);
    setPrice('all');
    setQuery('');
  }

  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory = categories.length === 0 || categories.includes(product.category);
      const matchesQuery =
        normalized === '' ||
        product.name.toLowerCase().includes(normalized) ||
        product.tagline.toLowerCase().includes(normalized);

      return matchesCategory && matchesPrice(product.priceIdr, price) && matchesQuery;
    });
  }, [categories, price, products, query]);

  return (
    <div>
      <div className="relative">
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
          className="h-10 w-full max-w-xl rounded-md border border-input bg-background pl-9 pr-3 text-sm text-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Filters</h2>
            {hasFilters ? (
              <button
                type="button"
                onClick={clearAll}
                className="text-xs font-medium text-primary transition-colors hover:text-primary/80"
              >
                Clear
              </button>
            ) : null}
          </div>

          <fieldset className="mt-5">
            <legend className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Category
            </legend>
            <div className="mt-3 space-y-2.5">
              {categoryOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <input
                    type="checkbox"
                    checked={categories.includes(option.value)}
                    onChange={() => toggleCategory(option.value)}
                    className="h-4 w-4 rounded border-input accent-primary"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-6">
            <legend className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Price
            </legend>
            <div className="mt-3 space-y-2.5">
              {priceOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <input
                    type="radio"
                    name="price"
                    checked={price === option.value}
                    onChange={() => setPrice(option.value)}
                    className="h-4 w-4 border-input accent-primary"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </fieldset>
        </aside>

        <div>
          <p className="text-sm text-muted-foreground">
            {visible.length} {visible.length === 1 ? 'product' : 'products'}
          </p>

          {visible.length === 0 ? (
            <div className="mt-6 rounded-lg border border-dashed border-border px-6 py-16 text-center">
              <p className="text-base font-medium text-foreground">No products found</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Try a different search or adjust your filters.
              </p>
            </div>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {visible.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
