import { buttonVariants, cn } from '@repo/ui';
import type { Metadata } from 'next';

import { GitHubIcon, GoogleIcon } from '@/components/shared/provider-icons';
import { signInWithOAuth, signUpWithPassword } from '@/features/auth';

export const metadata: Metadata = {
  title: 'Sign up',
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function readParam(searchParams: Awaited<SearchParams>, key: string) {
  const value = searchParams[key];

  return typeof value === 'string' ? value : undefined;
}

export default async function SignUpPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const error = readParam(params, 'error');

  return (
    <section className="flex flex-1 items-center justify-center px-6 py-20">
      <div className="grid w-full max-w-5xl gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Create account</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Own every Liem product from one account.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
            Start with low-friction sign up. GitHub can be connected later when you activate a
            GitHub-based product.
          </p>
          <div className="mt-8 rounded-lg border border-border bg-secondary/30 p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">What your account unlocks</p>
            <ul className="mt-3 grid gap-2">
              <li>Permanent library for claims, purchases, gifts, and redeems.</li>
              <li>Profile tiers, badges, and pinned product showcase.</li>
              <li>Notifications and support tickets for important product events.</li>
            </ul>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          {error ? (
            <p className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}

          <form action={signUpWithPassword} className="grid gap-4">
            <label className="grid gap-2 text-sm font-medium text-foreground">
              Display name
              <input
                name="displayName"
                type="text"
                autoComplete="name"
                className="h-10 rounded-md border border-input bg-background px-3 text-sm font-normal text-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              />
            </label>
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
            <label className="grid gap-2 text-sm font-medium text-foreground">
              Password
              <input
                required
                name="password"
                type="password"
                minLength={8}
                autoComplete="new-password"
                className="h-10 rounded-md border border-input bg-background px-3 text-sm font-normal text-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              />
            </label>
            <button type="submit" className={cn(buttonVariants({ size: 'lg' }), 'w-full')}>
              Create account
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-medium text-muted-foreground">or continue with</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <form action={signInWithOAuth}>
              <input type="hidden" name="provider" value="google" />
              <button
                type="submit"
                className={cn(buttonVariants({ variant: 'outline' }), 'w-full')}
              >
                <GoogleIcon className="h-4 w-4" />
                Continue with Google
              </button>
            </form>
            <form action={signInWithOAuth}>
              <input type="hidden" name="provider" value="github" />
              <button
                type="submit"
                className={cn(buttonVariants({ variant: 'outline' }), 'w-full')}
              >
                <GitHubIcon className="h-4 w-4" />
                Continue with GitHub
              </button>
            </form>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            Already have an account?{' '}
            <a href="/signin" className="font-medium text-primary hover:text-primary/80">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
