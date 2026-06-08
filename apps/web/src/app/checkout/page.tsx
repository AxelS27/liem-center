import type { Metadata } from 'next';

import { PlaceholderPage } from '@/components/shared/placeholder-page';

export const metadata: Metadata = {
  title: 'Checkout',
};

export default function CheckoutPage() {
  return (
    <PlaceholderPage
      eyebrow="Checkout"
      title="Checkout is coming next"
      description="Review the selected Liem product, confirm access requirements, and continue to payment."
    />
  );
}
