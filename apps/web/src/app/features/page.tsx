import type { Metadata } from 'next';

import { PlaceholderPage } from '@/components/shared/placeholder-page';

export const metadata: Metadata = {
  title: 'Features',
};

export default function FeaturesPage() {
  return (
    <PlaceholderPage
      eyebrow="Features"
      title="Features go here"
      description="This route is scaffolded so the primary navigation points somewhere real. Replace it with the product's features page."
    />
  );
}
