import type { Metadata } from 'next';

import { PlaceholderPage } from '@/components/shared/placeholder-page';

export const metadata: Metadata = {
  title: 'Orders',
};

export default function OrdersPage() {
  return (
    <PlaceholderPage
      eyebrow="Orders"
      title="Order history is coming next"
      description="Track purchases, gifts, redemptions, payment status, and invoice details from one account view."
    />
  );
}
