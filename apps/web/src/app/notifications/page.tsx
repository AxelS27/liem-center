import type { Metadata } from 'next';

import { PlaceholderPage } from '@/components/shared/placeholder-page';

export const metadata: Metadata = {
  title: 'Notifications',
};

export default function NotificationsPage() {
  return (
    <PlaceholderPage
      eyebrow="Notifications"
      title="Product activity will appear here"
      description="Purchases, GitHub invites, badge awards, tier changes, and support replies will have a durable in-app record."
    />
  );
}
