'use client';

import { buttonVariants, cn } from '@repo/ui';
import { useState } from 'react';

import type { Product, Review } from './catalog-data';

type TabKey = 'overview' | 'changelog' | 'reviews';

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-sm" aria-label={`${rating} out of 5`}>
      <span className="text-warning">{'★'.repeat(rating)}</span>
      <span className="text-muted-foreground/30">{'★'.repeat(5 - rating)}</span>
    </span>
  );
}

function StarInput({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;

  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(star)}
          className="text-xl leading-none transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <span className={star <= shown ? 'text-warning' : 'text-muted-foreground/30'}>★</span>
        </button>
      ))}
    </div>
  );
}

function ReviewForm({ onSubmit }: { onSubmit: (review: Review) => void }) {
  const [rating, setRating] = useState(0);
  const [body, setBody] = useState('');
  const [error, setError] = useState<string | null>(null);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (rating === 0 || body.trim().length < 10) {
      setError('Pick a star rating and a comment of at least 10 characters.');
      return;
    }

    onSubmit({ author: 'You', tier: 'Member', rating, title: '', body: body.trim() });
    setRating(0);
    setBody('');
    setError(null);
  }

  return (
    <form onSubmit={submit} className="rounded-lg border border-border bg-card p-5">
      <p className="text-sm font-semibold text-foreground">Write a review</p>
      <div className="mt-3">
        <StarInput value={rating} onChange={setRating} />
      </div>
      <textarea
        value={body}
        onChange={(event) => setBody(event.target.value)}
        rows={4}
        placeholder="Share your experience with this product"
        className="mt-4 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      />
      {error ? (
        <p className="mt-3 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <button type="submit" className={cn(buttonVariants(), 'mt-4')}>
        Submit review
      </button>
    </form>
  );
}

/**
 * Product detail tabs: Overview, Changelog, Reviews. An underline strip, not boxed tab containers
 * (docs/product/UI_UX.md). Reviews can only be written by owners (`owned`), matching the
 * verified-owner rule in docs/product/FEATURES.md.
 */
export function ProductTabs({ product, owned }: { product: Product; owned: boolean }) {
  const [tab, setTab] = useState<TabKey>('overview');
  const [reviews, setReviews] = useState<Review[]>(product.reviews);

  const tabs: { key: TabKey; label: string; count?: number }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'changelog', label: 'Changelog', count: product.changelog.length },
    { key: 'reviews', label: 'Reviews', count: reviews.length },
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

            <h3 className="mt-8 text-sm font-semibold text-foreground">How to use</h3>
            <ol className="mt-4 space-y-3">
              {product.howToUse.map((step, index) => (
                <li key={step} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-foreground">
                    {index + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
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

        {tab === 'reviews' ? (
          <div className="max-w-2xl">
            {owned ? (
              <ReviewForm onSubmit={(review) => setReviews((current) => [review, ...current])} />
            ) : null}

            <div className={owned ? 'mt-8' : ''}>
              {reviews.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border px-6 py-12 text-center">
                  <p className="text-base font-medium text-foreground">No reviews yet</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Be the first owner to review this product.
                  </p>
                </div>
              ) : (
                <ul className="space-y-6">
                  {reviews.map((review, index) => (
                    <li
                      key={`${review.title}-${index}`}
                      className="border-b border-border pb-6 last:border-0"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">
                          {review.author}
                        </span>
                        <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                          {review.tier}
                        </span>
                        <Stars rating={review.rating} />
                      </div>
                      {review.title ? (
                        <h3 className="mt-2 text-sm font-semibold text-foreground">
                          {review.title}
                        </h3>
                      ) : null}
                      <p
                        className={cn(
                          'text-sm leading-6 text-muted-foreground',
                          review.title ? 'mt-1' : 'mt-2',
                        )}
                      >
                        {review.body}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
