import type { Metadata } from 'next';

import { PlaceholderPage } from '@/components/shared/placeholder-page';

export const metadata: Metadata = {
  title: 'Ecosystem',
};

export default function FeaturesPage() {
  return (
    <PlaceholderPage
      eyebrow="Features"
      title="Liem Center connects product ownership"
      description="Catalog, checkout, library, GitHub access, notifications, support, tiers, and profiles are planned as one account-based product hub."
    />
  );
}
