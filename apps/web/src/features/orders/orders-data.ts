// Mock order history for the frontend build. Items reference catalog products by slug.

export type OrderStatus = 'paid' | 'awaiting_payment' | 'refunded' | 'cancelled';

export type OrderItem = {
  productSlug: string;
  priceIdr: number;
};

export type Order = {
  id: string;
  placedAt: string;
  status: OrderStatus;
  recipientType: 'self' | 'gift';
  items: OrderItem[];
  subtotalIdr: number;
  discountIdr: number;
  totalIdr: number;
  paymentMethod?: string;
};

export const orderStatusLabels: Record<OrderStatus, string> = {
  paid: 'Paid',
  awaiting_payment: 'Awaiting payment',
  refunded: 'Refunded',
  cancelled: 'Cancelled',
};

const orders: Order[] = [
  {
    id: 'LIEM-2026-0241',
    placedAt: '2026-05-29',
    status: 'paid',
    recipientType: 'self',
    items: [{ productSlug: 'liem-monorepo', priceIdr: 799000 }],
    subtotalIdr: 799000,
    discountIdr: 0,
    totalIdr: 799000,
    paymentMethod: 'Midtrans',
  },
  {
    id: 'LIEM-2026-0233',
    placedAt: '2026-05-31',
    status: 'paid',
    recipientType: 'self',
    items: [{ productSlug: 'liem-ai-plugin', priceIdr: 649000 }],
    subtotalIdr: 649000,
    discountIdr: 0,
    totalIdr: 649000,
    paymentMethod: 'Midtrans',
  },
  {
    id: 'LIEM-2026-0210',
    placedAt: '2026-05-12',
    status: 'paid',
    recipientType: 'gift',
    items: [{ productSlug: 'liem-ui-kit', priceIdr: 499000 }],
    subtotalIdr: 499000,
    discountIdr: 0,
    totalIdr: 499000,
    paymentMethod: 'Midtrans',
  },
  {
    id: 'LIEM-2026-0198',
    placedAt: '2026-04-30',
    status: 'refunded',
    recipientType: 'self',
    items: [{ productSlug: 'liem-ui-kit', priceIdr: 499000 }],
    subtotalIdr: 499000,
    discountIdr: 0,
    totalIdr: 499000,
    paymentMethod: 'Midtrans',
  },
];

export function getOrders(): Order[] {
  return orders;
}

export function getOrder(id: string): Order | undefined {
  return orders.find((order) => order.id === id);
}
