'use client';

import { buttonVariants, cn } from '@repo/ui';
import { useMemo, useState } from 'react';

import { StatusPill, type StatusTone } from '@/components/shared/status-pill';
import { getProduct, productTypeLabels } from '@/features/catalog';

import {
  inviteLabels,
  sourceLabels,
  type Entitlement,
  type EntitlementSource,
  type InviteStatus,
} from './library-data';

type Filter = EntitlementSource | 'all';

const filters: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'purchase', label: 'Purchases' },
  { value: 'gift', label: 'Gifts' },
  { value: 'redeem', label: 'Redeemed' },
  { value: 'free_claim', label: 'Claimed' },
];

const inviteTone: Record<InviteStatus, StatusTone> = {
  pending: 'warning',
  invited: 'info',
  accepted: 'success',
  failed: 'danger',
  revoked: 'danger',
};

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
          <StatusPill tone="danger">Access revoked</StatusPill>
        ) : (
          <StatusPill tone="success">Active</StatusPill>
        )}

        {isGithub && invite ? (
          <StatusPill tone={inviteTone[invite]}>{inviteLabels[invite]}</StatusPill>
        ) : null}

        {isGithub ? (
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
  const [active, setActive] = useState<Filter>('all');

  const visible = useMemo(
    () =>
      active === 'all'
        ? entitlements
        : entitlements.filter((entitlement) => entitlement.source === active),
    [active, entitlements],
  );

  return (
    <div>
      <div role="tablist" aria-label="Filter by source" className="flex flex-wrap gap-2">
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
        <div className="mt-8 rounded-lg border border-dashed border-border px-6 py-16 text-center">
          <p className="text-base font-medium text-foreground">Nothing here yet</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Products you acquire this way will appear here.
          </p>
          <a href="/products" className={cn(buttonVariants(), 'mt-6')}>
            Browse products
          </a>
        </div>
      ) : (
        <ul className="mt-6 divide-y divide-border border-y border-border">
          {visible.map((entitlement) => (
            <EntitlementRow key={entitlement.id} entitlement={entitlement} />
          ))}
        </ul>
      )}
    </div>
  );
}
