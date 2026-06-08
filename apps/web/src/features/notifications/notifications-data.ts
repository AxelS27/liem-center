// Mock in-app notifications for the frontend build.

export type NotificationCategory =
  | 'purchase'
  | 'redeem'
  | 'github'
  | 'product'
  | 'badge'
  | 'tier'
  | 'support';

export type AppNotification = {
  id: string;
  category: NotificationCategory;
  title: string;
  message: string;
  date: string;
  read: boolean;
  href?: string;
};

export const categoryLabels: Record<NotificationCategory, string> = {
  purchase: 'Purchase',
  redeem: 'Redeem',
  github: 'GitHub',
  product: 'Product',
  badge: 'Badge',
  tier: 'Tier',
  support: 'Support',
};

const notifications: AppNotification[] = [
  {
    id: 'n1',
    category: 'github',
    title: 'GitHub invitation failed',
    message: 'We could not send the invite for Liem AI Plugin. Retry from your library.',
    date: '2 hours ago',
    read: false,
    href: '/library',
  },
  {
    id: 'n2',
    category: 'tier',
    title: 'You reached Diamond tier',
    message: 'Your lifetime spend unlocked the Diamond membership tier.',
    date: 'Yesterday',
    read: false,
    href: '/profile',
  },
  {
    id: 'n3',
    category: 'purchase',
    title: 'Purchase completed',
    message: 'Liem Monorepo was added to your library.',
    date: '3 days ago',
    read: true,
    href: '/library',
  },
  {
    id: 'n4',
    category: 'badge',
    title: 'Badge earned: Founding Member',
    message: 'You are one of the first members of Liem Center.',
    date: '1 week ago',
    read: true,
    href: '/profile',
  },
  {
    id: 'n5',
    category: 'product',
    title: 'Liem Monorepo v2.1 released',
    message: 'GitHub App invites, Docker improvements, and docs updates.',
    date: '1 week ago',
    read: true,
    href: '/products/liem-monorepo',
  },
];

export function getNotifications(): AppNotification[] {
  return notifications;
}
