'use client';

import { buttonVariants, cn } from '@repo/ui';

import { categoryLabels } from '@/features/catalog';
import { usePinnedProducts } from '@/hooks/use-pinned-products';

import { sourceLabels, type Entitlement } from './library-data';

function PinIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M12 17v5" />
      <path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z" />
    </svg>
  );
}

function PinButton({
  pinned,
  disabled,
  onToggle,
}: {
  pinned: boolean;
  disabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      aria-pressed={pinned}
      title={
        pinned
          ? 'Unpin from profile'
          : disabled
            ? 'Pin limit reached'
            : 'Pin to your profile showcase'
      }
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98] disabled:opacity-40',
        pinned
          ? 'text-primary'
          : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
      )}
    >
      <PinIcon filled={pinned} />
      <span className="sr-only">{pinned ? 'Unpin from profile' : 'Pin to profile'}</span>
    </button>
  );
}

function EntitlementRow({
  entitlement,
  pinned,
  pinDisabled,
  onTogglePin,
}: {
  entitlement: Entitlement;
  pinned: boolean;
  pinDisabled: boolean;
  onTogglePin: () => void;
}) {
  const product = entitlement.product;

  const isGithub = product.type === 'github';
  const invite = entitlement.invite;

  return (
    <li className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <PinButton pinned={pinned} disabled={pinDisabled} onToggle={onTogglePin} />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={`/products/${product.slug}`}
              className="text-sm font-semibold text-foreground transition-colors hover:text-foreground/70"
            >
              {product.name}
            </a>
            <span className="rounded-md bg-secondary px-1.5 py-0.5 text-xs font-medium text-secondary-foreground">
              {categoryLabels[product.category]}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {sourceLabels[entitlement.source]} · Owned since {entitlement.ownedSince}
          </p>
        </div>
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
  const { isPinned, isFull, toggle } = usePinnedProducts();

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

  // Pinned products float to the top so the showcase order is visible at a glance.
  const ordered = [...entitlements].sort(
    (a, b) => Number(isPinned(b.product.slug)) - Number(isPinned(a.product.slug)),
  );

  return (
    <>
      <p className="text-xs text-muted-foreground">
        Use the pin to feature a product on your profile. Pinned products move to the top.
      </p>
      <ul className="mt-3 divide-y divide-border border-y border-border">
        {ordered.map((entitlement) => {
          const pinned = isPinned(entitlement.product.slug);

          return (
            <EntitlementRow
              key={entitlement.id}
              entitlement={entitlement}
              pinned={pinned}
              pinDisabled={!pinned && isFull}
              onTogglePin={() => toggle(entitlement.product.slug)}
            />
          );
        })}
      </ul>
    </>
  );
}
