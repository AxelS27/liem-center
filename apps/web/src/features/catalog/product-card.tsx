import Image from 'next/image';

import { categoryLabels, formatPrice, getProductCover, type Product } from './catalog-data';

/**
 * Shared catalog card: the one card surface in the product browsing experience. Used by the
 * catalog grid and the related-products strip. Everything else in the app stays open per the
 * surface budget in docs/product/UI_UX.md.
 */
export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-transform duration-150 hover:-translate-y-1 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background">
      <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
        <Image
          src={getProductCover(product)}
          alt=""
          fill
          sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-4">
          <span className="rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
            {categoryLabels[product.category]}
          </span>
          <span className="text-xs font-medium text-muted-foreground">{product.version}</span>
        </div>
        <h3 className="mt-4 text-lg font-semibold tracking-tight text-foreground">
          <a
            href={`/products/${product.slug}`}
            className="outline-none after:absolute after:inset-0 focus-visible:underline"
          >
            {product.name}
          </a>
        </h3>
        <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{product.tagline}</p>
        <div className="mt-6 flex items-center justify-between gap-4">
          <span className="text-sm font-semibold text-foreground">
            {formatPrice(product.priceIdr)}
          </span>
          <span className="text-sm font-medium text-primary transition-colors group-hover:text-primary/80">
            View product
          </span>
        </div>
      </div>
    </article>
  );
}
