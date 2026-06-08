import type { Metadata } from 'next';

import { PlaceholderPage } from '@/components/shared/placeholder-page';

export const metadata: Metadata = {
  title: 'Settings',
};

export default function SettingsPage() {
  return (
    <PlaceholderPage
      eyebrow="Settings"
      title="Account settings are coming next"
      description="Manage profile details, connected accounts, notification preferences, and account security."
    />
  );
}
