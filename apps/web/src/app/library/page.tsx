import type { Metadata } from 'next';

import { PlaceholderPage } from '@/components/shared/placeholder-page';

export const metadata: Metadata = {
  title: 'Library',
};

export default function LibraryPage() {
  return (
    <PlaceholderPage
      eyebrow="Library"
      title="Your owned products will live here"
      description="After you claim, buy, redeem, or receive a Liem product, it appears here with its access status."
    />
  );
}
