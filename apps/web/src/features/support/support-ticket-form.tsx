'use client';

import { buttonVariants, cn } from '@repo/ui';
import { supportTicketResponseSchema } from '@repo/types';
import { useEffect, useState } from 'react';

import { useAuthGate } from '@/features/auth';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';

const DRAFT_KEY = 'liem.support.draft';

const categories = [
  { value: 'payment', label: 'Payment succeeded but product missing' },
  { value: 'github_invite', label: 'GitHub invite failed' },
  { value: 'redeem', label: 'Redeem code invalid' },
  { value: 'refund', label: 'Refund request' },
  { value: 'other', label: 'Other' },
];

type Draft = { category: string; subject: string; message: string; orderRef: string };

const emptyDraft: Draft = { category: 'payment', subject: '', message: '', orderRef: '' };

const inputClass =
  'h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1';

/**
 * Public new-ticket form. Guests can fill it in; only Submit is auth-gated. The draft is kept
 * across the sign-in hop via sessionStorage (docs/product/UI_UX.md "Auth Gating Model").
 */
export function SupportTicketForm() {
  const gate = useAuthGate();
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const stored = window.sessionStorage.getItem(DRAFT_KEY);

    if (stored) {
      try {
        setDraft({ ...emptyDraft, ...(JSON.parse(stored) as Partial<Draft>) });
      } catch {
        // Ignore a corrupt draft.
      }
    }
  }, []);

  function update<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (draft.subject.trim().length < 3 || draft.message.trim().length < 10) {
      setError('Add a short subject and a message of at least 10 characters.');
      return;
    }

    setPending(true);

    try {
      window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));

      const authed = await gate('/support/new');

      if (!authed) {
        return;
      }

      const supabase = createSupabaseBrowserClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setError('Sign in again before submitting this ticket.');
        return;
      }

      const response = await fetch(`${API_URL}/support/tickets`, {
        body: JSON.stringify({
          category: draft.category,
          message: draft.message,
          subject: draft.subject,
        }),
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Support ticket failed.');
      }

      supportTicketResponseSchema.parse(await response.json());
      window.sessionStorage.removeItem(DRAFT_KEY);
      setSubmitted(true);
    } catch {
      setError('Unable to submit this ticket.');
    } finally {
      setPending(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">Ticket received</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Thanks. Your ticket is open and you will get a notification and email when support replies.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="/support" className={cn(buttonVariants())}>
            Back to support
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="grid gap-5">
        <label className="grid gap-2 text-sm font-medium text-foreground">
          Topic
          <select
            value={draft.category}
            onChange={(event) => update('category', event.target.value)}
            className={inputClass}
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm font-medium text-foreground">
          Subject
          <input
            value={draft.subject}
            onChange={(event) => update('subject', event.target.value)}
            placeholder="Short summary of the issue"
            className={inputClass}
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-foreground">
          Order or product reference <span className="font-normal text-muted-foreground">(optional)</span>
          <input
            value={draft.orderRef}
            onChange={(event) => update('orderRef', event.target.value)}
            placeholder="e.g. order id or product name"
            className={inputClass}
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-foreground">
          Message
          <textarea
            value={draft.message}
            onChange={(event) => update('message', event.target.value)}
            rows={6}
            placeholder="Describe what happened and what you expected."
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          />
        </label>
      </div>

      {error ? (
        <p className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className={cn(buttonVariants({ size: 'lg' }), 'mt-5 w-full')}
      >
        {pending ? 'Checking your account...' : 'Submit ticket'}
      </button>

      <p className="mt-4 text-xs leading-5 text-muted-foreground">
        You can write your ticket without signing in. We will ask you to sign in only when you
        submit, then bring you right back with your draft intact.
      </p>
    </form>
  );
}
