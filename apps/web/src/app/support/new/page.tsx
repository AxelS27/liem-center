import type { Metadata } from 'next';

import { SupportTicketForm } from '@/features/support';

export const metadata: Metadata = {
  title: 'New ticket',
};

export default function NewSupportTicketPage() {
  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-16 sm:py-20">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <a href="/support" className="transition-colors hover:text-foreground">
          Support
        </a>
        <span className="px-2" aria-hidden="true">
          /
        </span>
        <span className="text-foreground">New ticket</span>
      </nav>

      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        Open a support ticket
      </h1>
      <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">
        Give us enough detail to help on the first reply. You can write everything now and sign in
        only when you submit.
      </p>

      <div className="mt-8">
        <SupportTicketForm />
      </div>
    </section>
  );
}
