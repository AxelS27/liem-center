import type { Metadata } from 'next';

import { getNotifications, NotificationsView } from '@/features/notifications';

export const metadata: Metadata = {
  title: 'Notifications',
};

export default function NotificationsPage() {
  const notifications = getNotifications();

  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-16 sm:py-20">
      <p className="text-sm font-medium text-muted-foreground">Activity</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        Notifications
      </h1>
      <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">
        A durable record of purchases, GitHub invites, badges, tier changes, product updates, and
        support replies.
      </p>

      <div className="mt-10">
        <NotificationsView initial={notifications} />
      </div>
    </section>
  );
}
