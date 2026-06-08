import { buttonVariants, cn } from '@repo/ui';

import { getProduct, productTypeLabels } from '@/features/catalog';

import { sourceLabels, type Entitlement } from './library-data';

function EntitlementRow({ entitlement }: { entitlement: Entitlement }) {
  const product = getProduct(entitlement.productSlug);

  if (!product) {
    return null;
  }

  const isGithub = product.type === 'github';
  const invite = entitlement.invite;

  return (
    <li className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={`/products/${product.slug}`}
            className="text-sm font-semibold text-foreground transition-colors hover:text-foreground/70"
          >
            {product.name}
          </a>
          <span className="rounded-md bg-secondary px-1.5 py-0.5 text-xs font-medium text-secondary-foreground">
            {productTypeLabels[product.type]}
          </span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {sourceLabels[entitlement.source]} · Owned since {entitlement.ownedSince}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
        {entitlement.access === 'revoked' ? (
          <span className="text-xs text-muted-foreground">Access revoked</span>
        ) : isGithub ? (
          invite === 'accepted' ? (
            <a
              href={`https://github.com/${product.githubRepo}`}
              className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
            >
              Open repository
            </a>
          ) : invite === 'failed' || invite === 'pending' ? (
            <button type="button" className={cn(buttonVariants({ size: 'sm' }))}>
              Retry invite
            </button>
          ) : (
            <button type="button" className={cn(buttonVariants({ size: 'sm' }))}>
              Connect GitHub
            </button>
          )
        ) : product.type === 'download' ? (
          <button type="button" className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>
            Download
          </button>
        ) : (
          <a
            href={`/products/${product.slug}`}
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
          >
            View
          </a>
        )}
      </div>
    </li>
  );
}

export function LibraryView({ entitlements }: { entitlements: Entitlement[] }) {
  if (entitlements.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border px-6 py-16 text-center">
        <p className="text-base font-medium text-foreground">Nothing here yet</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Products you claim, buy, redeem, or receive will appear here.
        </p>
        <a href="/products" className={cn(buttonVariants(), 'mt-6')}>
          Browse products
        </a>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-border border-y border-border">
      {entitlements.map((entitlement) => (
        <EntitlementRow key={entitlement.id} entitlement={entitlement} />
      ))}
    </ul>
  );
}
