import type { Metadata } from 'next';

import { PlaceholderPage } from '@/components/shared/placeholder-page';

export const metadata: Metadata = {
  title: 'Admin',
};

export default function AdminPage() {
  return (
    <PlaceholderPage
      eyebrow="Admin"
      title="Admin dashboard is coming next"
      description="Operate products, orders, users, GitHub access, support tickets, codes, campaigns, and launch analytics."
    />
  );
}
