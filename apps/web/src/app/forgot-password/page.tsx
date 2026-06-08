import { buttonVariants, cn } from '@repo/ui';
import type { Metadata } from 'next';

import { requestPasswordReset } from '@/features/auth';

export const metadata: Metadata = {
  title: 'Forgot password',
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function readParam(searchParams: Awaited<SearchParams>, key: string) {
  const value = searchParams[key];

  return typeof value === 'string' ? value : undefined;
}

export default async function ForgotPasswordPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const error = readParam(params, 'error');

  return (
    <section className="flex flex-1 items-center justify-center px-6 py-20">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-sm">
        <p className="text-sm font-medium text-muted-foreground">Account recovery</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
          Reset your password
        </h1>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          Enter the email tied to your Liem account. We will send a reset link if the account
          exists.
        </p>

        {error ? (
          <p className="mt-5 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <form action={requestPasswordReset} className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm font-medium text-foreground">
            Email
            <input
              required
              name="email"
              type="email"
              autoComplete="email"
              className="h-10 rounded-md border border-input bg-background px-3 text-sm font-normal text-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            />
          </label>
          <button type="submit" className={cn(buttonVariants({ size: 'lg' }), 'w-full')}>
            Send reset link
          </button>
        </form>

        <p className="mt-6 text-sm text-muted-foreground">
          Remembered it?{' '}
          <a href="/signin" className="font-medium text-primary hover:text-primary/80">
            Sign in
          </a>
        </p>
      </div>
    </section>
  );
}
