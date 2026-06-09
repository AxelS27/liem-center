import type { OrderStatus } from '@repo/types';

export type { Order, OrderStatus } from '@repo/types';

export const orderStatusLabels: Record<OrderStatus, string> = {
  awaiting_payment: 'Awaiting payment',
  cancelled: 'Cancelled',
  draft: 'Draft',
  paid: 'Paid',
  refunded: 'Refunded',
};
