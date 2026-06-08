'use client';

import { buttonVariants, cn } from '@repo/ui';

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="flex flex-1 items-center justify-center px-6 py-24">
      <div className="mx-auto w-full max-w-xl text-center">
        <p className="text-sm font-medium text-muted-foreground">Something went wrong</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          We could not load this page
        </h1>
        <p className="mt-4 text-base text-muted-foreground">
          Try again, or return home and continue from the product hub.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button type="button" onClick={reset} className={cn(buttonVariants())}>
            Try again
          </button>
          <a href="/" className={cn(buttonVariants({ variant: 'outline' }))}>
            Back to home
          </a>
        </div>
      </div>
    </section>
  );
}
