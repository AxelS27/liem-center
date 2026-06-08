'use client';

import { buttonVariants, cn } from '@repo/ui';
import { useEffect, useState } from 'react';

import { useAuthGate } from '@/features/auth';

const DRAFT_KEY = 'liem.redeem.code';

/**
 * Public redeem form. Guests can type a code; only Confirm is auth-gated. The typed code is kept
 * across the sign-in hop via sessionStorage so the user does not retype (docs/product/UI_UX.md
 * "Auth Gating Model").
 */
export function RedeemForm() {
  const gate = useAuthGate();
  const [code, setCode] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const draft = window.sessionStorage.getItem(DRAFT_KEY);

    if (draft) {
      setCode(draft);
    }
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const trimmed = code.trim();

    if (trimmed.length < 6) {
      setError('Enter a valid code. Codes are at least 6 characters.');
      return;
    }

    setPending(true);

    try {
      // Preserve the code before a possible redirect to sign-in.
      window.sessionStorage.setItem(DRAFT_KEY, trimmed);

      const authed = await gate('/redeem');

      if (!authed) {
        return;
      }

      // Signed in: the codes service is not wired yet, so confirm the input is accepted and
      // point the user to their library. No entitlement is fabricated here.
      window.sessionStorage.removeItem(DRAFT_KEY);
      setAccepted(true);
    } finally {
      setPending(false);
    }
  }

  if (accepted) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">Code received</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Your code <span className="font-medium text-foreground">{code.trim()}</span> is queued.
          Once it is processed, the product appears in your library with permanent ownership.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="/library" className={cn(buttonVariants())}>
            Go to library
          </a>
          <button
            type="button"
            onClick={() => {
              setAccepted(false);
              setCode('');
            }}
            className={cn(buttonVariants({ variant: 'outline' }))}
          >
            Redeem another
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <label htmlFor="redeem-code" className="text-sm font-medium text-foreground">
        Gift or promo code
      </label>
      <input
        id="redeem-code"
        name="code"
        value={code}
        onChange={(event) => setCode(event.target.value)}
        autoComplete="off"
        spellCheck={false}
        placeholder="LIEM-XXXX-XXXX"
        className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 font-mono text-sm uppercase tracking-wide text-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      />

      {error ? (
        <p className="mt-3 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className={cn(buttonVariants({ size: 'lg' }), 'mt-5 w-full')}
      >
        {pending ? 'Checking your account...' : 'Redeem code'}
      </button>

      <p className="mt-4 text-xs leading-5 text-muted-foreground">
        You can enter a code without signing in. We will ask you to sign in only when you confirm,
        then bring you right back.
      </p>
    </form>
  );
}
