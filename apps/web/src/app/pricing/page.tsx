import type { Metadata } from 'next';

import { PlaceholderPage } from '@/components/shared/placeholder-page';

export const metadata: Metadata = {
  title: 'Pricing',
};

export default function PricingPage() {
  return (
    <PlaceholderPage
      eyebrow="Pricing"
      title="Pricing goes here"
      description="This route is scaffolded so the primary navigation points somewhere real. Replace it with the product's pricing page."
    />
  );
}
