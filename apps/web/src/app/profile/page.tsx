import type { Metadata } from 'next';

import { PlaceholderPage } from '@/components/shared/placeholder-page';

export const metadata: Metadata = {
  title: 'Profile',
};

export default function ProfilePage() {
  return (
    <PlaceholderPage
      eyebrow="Profile"
      title="Developer profile is coming next"
      description="Showcase owned products, tier progress, badges, and public profile details once account data is wired."
    />
  );
}
