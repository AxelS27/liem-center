'use client';

import { cn } from '@repo/ui';
import { useState } from 'react';

import type { Product, RoadmapStatus } from './catalog-data';

type TabKey = 'overview' | 'changelog' | 'roadmap' | 'reviews';

const roadmapColumns: { status: RoadmapStatus; label: string }[] = [
  { status: 'planned', label: 'Planned' },
  { status: 'in_progress', label: 'In progress' },
  { status: 'completed', label: 'Completed' },
];

/**
 * Product detail tabs: Overview, Changelog, Roadmap, Reviews. An underline strip, not boxed tab
 * containers (docs/product/UI_UX.md). Content is rendered from the product prop only.
 */
export function ProductTabs({ product }: { product: Product }) {
  const [tab, setTab] = useState<TabKey>('overview');

  const tabs: { key: TabKey; label: string; count?: number }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'changelog', label: 'Changelog', count: product.changelog.length },
    { key: 'roadmap', label: 'Roadmap', count: product.roadmap.length },
    { key: 'reviews', label: 'Reviews', count: product.reviews.length },
  ];

  return (
    <div>
      <div role="tablist" aria-label="Product details" className="flex gap-6 border-b border-border">
        {tabs.map((item) => {
          const isActive = item.key === tab;

          return (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setTab(item.key)}
              className={cn(
                '-mb-px border-b-2 px-1 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                isActive
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground',
              )}
            >
              {item.label}
              {typeof item.count === 'number' && item.count > 0 ? (
                <span className="ml-1.5 text-xs text-muted-foreground">{item.count}</span>
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="pt-8">
        {tab === 'overview' ? (
          <div className="max-w-2xl">
            <div className="space-y-4 text-base leading-7 text-muted-foreground">
              {product.overview.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <h3 className="mt-8 text-sm font-semibold text-foreground">What is included</h3>
            <ul className="mt-4 space-y-3">
              {product.features.map((feature) => (
                <li key={feature} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                    aria-hidden="true"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {tab === 'changelog' ? (
          <ol className="max-w-2xl space-y-8">
            {product.changelog.map((entry) => (
              <li key={entry.version} className="border-l-2 border-border pl-5">
                <div className="flex items-baseline gap-3">
                  <h3 className="text-base font-semibold text-foreground">{entry.version}</h3>
                  <span className="text-xs font-medium text-muted-foreground">{entry.date}</span>
                </div>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
                  {entry.changes.map((change) => (
                    <li key={change}>{change}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        ) : null}

        {tab === 'roadmap' ? (
          <div className="grid gap-6 sm:grid-cols-3">
            {roadmapColumns.map((column) => {
              const items = product.roadmap.filter((item) => item.status === column.status);

              return (
                <div key={column.status}>
                  <h3 className="text-sm font-semibold text-foreground">{column.label}</h3>
                  <ul className="mt-4 space-y-3">
                    {items.length === 0 ? (
                      <li className="text-sm text-muted-foreground">Nothing here yet.</li>
                    ) : (
                      items.map((item) => (
                        <li
                          key={item.title}
                          className="rounded-md border border-border bg-card p-3 text-sm"
                        >
                          <p className="font-medium text-foreground">{item.title}</p>
                          {item.detail ? (
                            <p className="mt-1 text-xs leading-5 text-muted-foreground">
                              {item.detail}
                            </p>
                          ) : null}
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              );
            })}
          </div>
        ) : null}

        {tab === 'reviews' ? (
          product.reviews.length === 0 ? (
            <div className="max-w-2xl rounded-lg border border-dashed border-border px-6 py-12 text-center">
              <p className="text-base font-medium text-foreground">No reviews yet</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Only verified owners can review. Be the first once you own this product.
              </p>
            </div>
          ) : (
            <ul className="max-w-2xl space-y-6">
              {product.reviews.map((review) => (
                <li key={review.title} className="border-b border-border pb-6 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{review.author}</span>
                    <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                      {review.tier}
                    </span>
                    <span className="text-xs font-medium text-primary" aria-label={`${review.rating} out of 5`}>
                      {'★'.repeat(review.rating)}
                      <span className="text-muted-foreground">{'★'.repeat(5 - review.rating)}</span>
                    </span>
                  </div>
                  <h3 className="mt-2 text-sm font-semibold text-foreground">{review.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{review.body}</p>
                </li>
              ))}
            </ul>
          )
        ) : null}
      </div>
    </div>
  );
}
