import { buttonVariants, cn } from '@repo/ui';
import type { Metadata } from 'next';

import { createSupabaseServerClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Support',
};

const commonTopics = [
  {
    title: 'Payment succeeded but product missing',
    detail: 'If an order is paid but the product is not in your library, open a ticket with the order reference.',
  },
  {
    title: 'GitHub invite failed',
    detail: 'We can re-send a repository invitation or help you connect the right GitHub account.',
  },
  {
    title: 'Redeem code invalid',
    detail: 'Send us the code and where you got it, and we will check its status.',
  },
  {
    title: 'Refund request',
    detail: 'Tell us the order and the reason. Refunds follow the order and payment state.',
  },
];

async function getUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export default async function SupportPage() {
  const user = await getUser();

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
      <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Support</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Get help, tracked in one place.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
            Keep payment, GitHub invite, redeem, and account issues in a traceable thread instead of
            scattered messages. You can write a ticket without signing in and confirm at the end.
          </p>

          <div className="mt-8">
            <a href="/support/new" className={cn(buttonVariants({ size: 'lg' }))}>
              File a ticket
            </a>
          </div>

          <h2 className="mt-12 text-sm font-semibold text-foreground">Common topics</h2>
          <ul className="mt-4 divide-y divide-border border-y border-border">
            {commonTopics.map((topic) => (
              <li key={topic.title} className="py-4">
                <p className="text-sm font-medium text-foreground">{topic.title}</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{topic.detail}</p>
              </li>
            ))}
          </ul>
        </div>

        <aside className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-sm font-semibold text-foreground">Your tickets</h2>
          {user ? (
            <div className="mt-4 rounded-md border border-dashed border-border px-4 py-8 text-center">
              <p className="text-sm font-medium text-foreground">No tickets yet</p>
              <p className="mt-2 text-sm text-muted-foreground">
                When you file a ticket it shows here with its status.
              </p>
            </div>
          ) : (
            <div className="mt-4">
              <p className="text-sm leading-6 text-muted-foreground">
                Sign in to see tickets you have filed and their replies.
              </p>
              <a
                href="/signin?next=/support"
                className={cn(buttonVariants({ variant: 'outline' }), 'mt-4 w-full')}
              >
                Sign in
              </a>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
