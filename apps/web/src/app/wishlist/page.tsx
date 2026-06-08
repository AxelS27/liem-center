import type { Metadata } from 'next';

import { PlaceholderPage } from '@/components/shared/placeholder-page';

export const metadata: Metadata = {
  title: 'Wishlist',
};

export default function WishlistPage() {
  return (
    <PlaceholderPage
      eyebrow="Wishlist"
      title="Saved products will live here"
      description="Keep an eye on Liem products you want to claim, buy, gift, or revisit later."
    />
  );
}
