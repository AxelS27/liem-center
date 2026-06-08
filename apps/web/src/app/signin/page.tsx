import { buttonVariants, cn } from '@repo/ui';
import type { Metadata } from 'next';

import { GitHubIcon, GoogleIcon } from '@/components/shared/provider-icons';
import { signInWithOAuth, signInWithPassword } from '@/features/auth';

export const metadata: Metadata = {
  title: 'Sign in',
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function readParam(searchParams: Awaited<SearchParams>, key: string) {
  const value = searchParams[key];

  return typeof value === 'string' ? value : undefined;
}

export default async function SignInPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const error = readParam(params, 'error');
  const message = readParam(params, 'message');
  const next = readParam(params, 'next');

  return (
    <section className="flex flex-1 items-center justify-center px-6 py-20">
      <div className="grid w-full max-w-5xl gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Account</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Sign in to your Liem library.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
            Access owned products, GitHub activation, notifications, support tickets, and profile
            status from one account.
          </p>
          <div className="mt-8 grid gap-4 text-sm text-muted-foreground sm:grid-cols-2">
            <div>
              <p className="font-medium text-foreground">Permanent ownership</p>
              <p className="mt-1">Every claim, purchase, gift, and redeem stays tied to you.</p>
            </div>
            <div>
              <p className="font-medium text-foreground">GitHub-native access</p>
              <p className="mt-1">Repository invites start when a product actually needs them.</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          {error ? (
            <p className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}
          {message ? (
            <p className="mb-4 rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground">
              {message}
            </p>
          ) : null}

          {next ? (
            <p className="mb-4 rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground">
              Sign in to continue. We will bring you right back.
            </p>
          ) : null}

          <form action={signInWithPassword} className="grid gap-4">
            {next ? <input type="hidden" name="next" value={next} /> : null}
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
                autoComplete="current-password"
                className="h-10 rounded-md border border-input bg-background px-3 text-sm font-normal text-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              />
            </label>
            <button type="submit" className={cn(buttonVariants({ size: 'lg' }), 'w-full')}>
              Sign in
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
              {next ? <input type="hidden" name="next" value={next} /> : null}
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
              {next ? <input type="hidden" name="next" value={next} /> : null}
              <button
                type="submit"
                className={cn(buttonVariants({ variant: 'outline' }), 'w-full')}
              >
                <GitHubIcon className="h-4 w-4" />
                Continue with GitHub
              </button>
            </form>
          </div>

          <div className="mt-6 flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <a href="/forgot-password" className="font-medium text-primary hover:text-primary/80">
              Forgot password?
            </a>
            <span>
              New here?{' '}
              <a href="/signup" className="font-medium text-primary hover:text-primary/80">
                Create account
              </a>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
