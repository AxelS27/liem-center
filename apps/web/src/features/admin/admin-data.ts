import { formatPrice } from '@/features/catalog';

export type AdminMetric = { label: string; value: string; hint?: string };

export function getAdminMetrics({
  openTickets,
  orders,
  products,
  revenue,
}: {
  openTickets: number;
  orders: number;
  products: number;
  revenue: number;
}): AdminMetric[] {
  return [
    { label: 'Total revenue', value: formatPrice(revenue), hint: 'Paid orders' },
    { label: 'Orders', value: String(orders), hint: 'Visible to this admin' },
    { label: 'Products', value: String(products), hint: 'Published catalog' },
    { label: 'Open tickets', value: String(openTickets), hint: 'Needs reply' },
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

export type AdminCode = {
  code: string;
  kind: 'gift' | 'promo' | 'admin';
  product: string;
  uses: number;
  status: 'active' | 'redeemed' | 'expired' | 'revoked';
  redeemedBy?: string;
  createdAt: string;
};

export type AdminTicket = {
  id: string;
  subject: string;
  user: string;
  category: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'normal' | 'high';
  updatedAt: string;
};

export type AdminInvite = {
  user: string;
  product: string;
  repo: string;
  status: 'pending' | 'invited' | 'accepted' | 'failed' | 'revoked';
  attempts: number;
};

export type AdminReview = {
  id: string;
  product: string;
  user: string;
  rating: number;
  body: string;
  hidden: boolean;
};

export function getAdminUsers(): AdminUser[] {
  return [];
}

export function getAdminCodes(): AdminCode[] {
  return [];
}

export function getAdminTickets(): AdminTicket[] {
  return [];
}

export function getAdminInvites(): AdminInvite[] {
  return [];
}

export function getAdminReviews(): AdminReview[] {
  return [];
}
