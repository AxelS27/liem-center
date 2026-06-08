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

function parseBound(value: string, fallback: number): number {
  const parsed = Number(value);
  return value.trim() === '' || Number.isNaN(parsed) ? fallback : parsed;
}

/**
 * Client catalog browser: search + a left filter rail (category checkboxes, a user-entered price
 * range, free toggle) + grid. Receives products as a prop and only filters in memory.
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
  const [freeOnly, setFreeOnly] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const hasFilters =
    categories.length > 0 ||
    freeOnly ||
    minPrice !== '' ||
    maxPrice !== '' ||
    query.trim() !== '';

  function toggleCategory(value: ProductCategory) {
    setCategories((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    );
  }

  function clearAll() {
    setCategories([]);
    setFreeOnly(false);
    setMinPrice('');
    setMaxPrice('');
    setQuery('');
  }

  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const min = parseBound(minPrice, 0);
    const max = parseBound(maxPrice, Number.POSITIVE_INFINITY);

    return products.filter((product) => {
      const matchesCategory = categories.length === 0 || categories.includes(product.category);
      const matchesPrice = freeOnly
        ? product.priceIdr === 0
        : product.priceIdr >= min && product.priceIdr <= max;
      const matchesQuery =
        normalized === '' ||
        product.name.toLowerCase().includes(normalized) ||
        product.tagline.toLowerCase().includes(normalized);

      return matchesCategory && matchesPrice && matchesQuery;
    });
  }, [categories, freeOnly, minPrice, maxPrice, products, query]);

  const priceInputClass =
    'h-9 w-full rounded-md border border-input bg-background px-2.5 text-sm text-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50';

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

            <label className="mt-3 flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
              <input
                type="checkbox"
                checked={freeOnly}
                onChange={(event) => setFreeOnly(event.target.checked)}
                className="h-4 w-4 rounded border-input accent-primary"
              />
              Free
            </label>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <label className="grid gap-1 text-xs font-medium text-muted-foreground">
                Min (Rp)
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={50000}
                  value={minPrice}
                  disabled={freeOnly}
                  onChange={(event) => setMinPrice(event.target.value)}
                  placeholder="0"
                  className={priceInputClass}
                />
              </label>
              <label className="grid gap-1 text-xs font-medium text-muted-foreground">
                Max (Rp)
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={50000}
                  value={maxPrice}
                  disabled={freeOnly}
                  onChange={(event) => setMaxPrice(event.target.value)}
                  placeholder="Any"
                  className={priceInputClass}
                />
              </label>
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
