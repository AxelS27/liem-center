import { buttonVariants, cn } from '@repo/ui';
import type { ReactNode } from 'react';

/**
 * A complete-feeling page body for routes that are scaffolded but not built yet, and for the
 * not-found page. It fills the available height and centers its content so the shared footer
 * reads as a natural page end instead of appearing under sparse content. Replace these stubs
 * with real pages as the product grows.
 */
export function PlaceholderPage({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <section className="flex flex-1 items-center justify-center px-6 py-24">
      <div className="mx-auto w-full max-w-xl text-center">
        {eyebrow ? <p className="text-sm font-medium text-muted-foreground">{eyebrow}</p> : null}
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>
        <p className="mt-4 text-base text-muted-foreground">{description}</p>
        <div className="mt-8 flex justify-center">
          {action ?? (
            <a href="/" className={cn(buttonVariants({ variant: 'outline' }))}>
              Back to home
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
