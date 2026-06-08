import { buttonVariants, cn } from '@repo/ui';

import { StatusPill } from '@/components/shared/status-pill';
import { getAdminReviews } from '@/features/admin';

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-sm" aria-label={`${rating} out of 5`}>
      <span className="text-warning">{'★'.repeat(rating)}</span>
      <span className="text-muted-foreground/30">{'★'.repeat(5 - rating)}</span>
    </span>
  );
}

export default function AdminReviewsPage() {
  const reviews = getAdminReviews();

  return (
    <div>
      <h2 className="text-sm font-semibold text-foreground">Reviews</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Moderate verified-owner reviews. Hide spam or abusive content; restore if needed.
      </p>

      <ul className="mt-4 divide-y divide-border rounded-lg border border-border">
        {reviews.map((review) => (
          <li key={review.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-foreground">{review.product}</span>
                <span className="text-xs text-muted-foreground">@{review.user}</span>
                <Stars rating={review.rating} />
                {review.hidden ? <StatusPill tone="danger">Hidden</StatusPill> : null}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{review.body}</p>
            </div>
            <button
              type="button"
              className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'shrink-0')}
            >
              {review.hidden ? 'Restore' : 'Hide'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
