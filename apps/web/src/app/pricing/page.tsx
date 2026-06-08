import type { Metadata } from 'next';

import { PlaceholderPage } from '@/components/shared/placeholder-page';

export const metadata: Metadata = {
  title: 'Pricing model',
};

export default function PricingPage() {
  return (
    <PlaceholderPage
      eyebrow="Pricing"
      title="One-time ownership, no subscriptions"
      description="Paid Liem products use one-time IDR pricing. Free products are still claimed to your permanent account library."
    />
  );
}
