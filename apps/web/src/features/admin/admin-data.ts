// Mock admin data for the frontend build. Orders and products are reused from their own feature
// modules; users, codes, tickets, invites, reviews, and metrics are mocked here. Replaced by
// admin API calls once the backend lands.

import { formatPrice } from '@/features/catalog';

export type AdminMetric = { label: string; value: string; hint?: string };

export function getAdminMetrics(): AdminMetric[] {
  return [
    { label: 'Total revenue', value: formatPrice(12_430_000), hint: 'All time' },
    { label: 'Revenue this month', value: formatPrice(3_180_000), hint: 'June 2026' },
    { label: 'Product sales', value: '48', hint: 'Paid orders' },
    { label: 'Active users', value: '312', hint: 'Last 30 days' },
    { label: 'Open tickets', value: '3', hint: 'Needs reply' },
    { label: 'Pending invites', value: '2', hint: 'GitHub' },
  ];
}

export type AdminUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  tier: string;
  products: number;
  joined: string;
  status: 'active' | 'suspended';
};

export function getAdminUsers(): AdminUser[] {
  return [
    { id: 'u1', name: 'Farrell Axel', username: 'farrellaxel', email: 'farrell@example.com', tier: 'Diamond', products: 4, joined: '2026-05-29', status: 'active' },
    { id: 'u2', name: 'Maya Putri', username: 'mayap', email: 'maya@example.com', tier: 'Gold', products: 2, joined: '2026-05-22', status: 'active' },
    { id: 'u3', name: 'Reza Hadi', username: 'rezah', email: 'reza@example.com', tier: 'Silver', products: 1, joined: '2026-05-18', status: 'active' },
    { id: 'u4', name: 'Dewi Lestari', username: 'dewil', email: 'dewi@example.com', tier: 'Bronze', products: 1, joined: '2026-05-10', status: 'suspended' },
    { id: 'u5', name: 'Bagus Saputra', username: 'bagussa', email: 'bagus@example.com', tier: 'Platinum', products: 3, joined: '2026-04-30', status: 'active' },
  ];
}

export type AdminCode = {
  code: string;
  kind: 'gift' | 'promo' | 'admin';
  product: string;
  uses: number;
  status: 'active' | 'redeemed' | 'expired' | 'revoked';
  redeemedBy?: string;
  createdAt: string;
};

export function getAdminCodes(): AdminCode[] {
  return [
    { code: 'LIEM-GIFT-7F2A', kind: 'gift', product: 'Liem UI Kit', uses: 1, status: 'redeemed', redeemedBy: 'mayap', createdAt: '2026-05-12' },
    { code: 'LAUNCH50', kind: 'promo', product: 'All products', uses: 100, status: 'active', createdAt: '2026-05-01' },
    { code: 'LIEM-GIFT-91BC', kind: 'gift', product: 'Liem Monorepo', uses: 1, status: 'active', createdAt: '2026-05-28' },
    { code: 'BETA-ACCESS-04', kind: 'admin', product: 'Liem AI Plugin', uses: 1, status: 'expired', createdAt: '2026-04-15' },
  ];
}

export type AdminTicket = {
  id: string;
  subject: string;
  user: string;
  category: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'normal' | 'high';
  updatedAt: string;
};

export function getAdminTickets(): AdminTicket[] {
  return [
    { id: 'T-1042', subject: 'Paid but product missing', user: 'rezah', category: 'Payment', status: 'open', priority: 'high', updatedAt: '2 hours ago' },
    { id: 'T-1041', subject: 'GitHub invite never arrived', user: 'bagussa', category: 'GitHub invite', status: 'in_progress', priority: 'normal', updatedAt: 'Yesterday' },
    { id: 'T-1038', subject: 'Redeem code says invalid', user: 'dewil', category: 'Redeem', status: 'open', priority: 'normal', updatedAt: '2 days ago' },
    { id: 'T-1031', subject: 'Refund request for UI Kit', user: 'mayap', category: 'Refund', status: 'resolved', priority: 'low', updatedAt: '5 days ago' },
  ];
}

export type AdminInvite = {
  user: string;
  product: string;
  repo: string;
  status: 'pending' | 'invited' | 'accepted' | 'failed' | 'revoked';
  attempts: number;
};

export function getAdminInvites(): AdminInvite[] {
  return [
    { user: 'farrellaxel', product: 'Liem Monorepo', repo: 'liem/monorepo', status: 'accepted', attempts: 1 },
    { user: 'farrellaxel', product: 'Liem AI Plugin', repo: 'liem/ai-plugin', status: 'failed', attempts: 2 },
    { user: 'bagussa', product: 'Liem Monorepo', repo: 'liem/monorepo', status: 'pending', attempts: 1 },
    { user: 'rezah', product: 'Liem Agent Skills', repo: 'liem/agent-skills', status: 'invited', attempts: 1 },
  ];
}

export type AdminReview = {
  id: string;
  product: string;
  user: string;
  rating: number;
  body: string;
  hidden: boolean;
};

export function getAdminReviews(): AdminReview[] {
  return [
    { id: 'r1', product: 'Liem Monorepo', user: 'farrellaxel', rating: 5, body: 'Saved a week of monorepo plumbing.', hidden: false },
    { id: 'r2', product: 'Liem UI Kit', user: 'mayap', rating: 4, body: 'Great patterns, want a data-table next.', hidden: false },
    { id: 'r3', product: 'Liem Prompt Pack', user: 'spam_user', rating: 1, body: 'Buy followers at cheap-site dot com', hidden: true },
  ];
}
