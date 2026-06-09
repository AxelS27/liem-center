import type { Metadata } from 'next';

import { StatusPill, type StatusTone } from '@/components/shared/status-pill';
import { formatPrice } from '@/features/catalog';
import { orderStatusLabels, type OrderStatus } from '@/features/orders';
import { getOrders } from '@/services/api';

export const metadata: Metadata = {
  title: 'Order history',
};

const statusTone: Record<OrderStatus, StatusTone> = {
  awaiting_payment: 'warning',
  cancelled: 'neutral',
  draft: 'neutral',
  paid: 'success',
  refunded: 'danger',
};

function summarizeItems(names: string[]): string {
  const [first, ...rest] = names;

  if (!first) {
    return 'No items';
  }

  return rest.length > 0 ? `${first} +${rest.length} more` : first;
}

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-16 sm:py-20">
      <p className="text-sm font-medium text-muted-foreground">Account</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        Order history
      </h1>
      <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">
        Purchases, gifts, and redemptions with their payment status. Open an order for the full
        receipt.
      </p>

      {orders.length === 0 ? (
        <div className="mt-10 rounded-lg border border-dashed border-border px-6 py-16 text-center">
          <p className="text-base font-medium text-foreground">No orders yet</p>
          <p className="mt-2 text-sm text-muted-foreground">Your purchases will show up here.</p>
        </div>
      ) : (
        <ul className="mt-10 divide-y divide-border border-y border-border">
          {orders.map((order) => (
            <li key={order.id}>
              <a
                href={`/orders/${order.id}`}
                className="flex flex-col gap-3 py-5 transition-colors hover:bg-secondary/40 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-2"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-sm font-medium text-foreground">
                      {order.id}
                    </span>
                    {order.recipientType === 'gift' ? (
                      <span className="rounded-md bg-secondary px-1.5 py-0.5 text-xs font-medium text-secondary-foreground">
                        Gift
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {summarizeItems(order.items.map((item) => item.product.name))} ·{' '}
                    {order.createdAt}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-6 sm:justify-end">
                  <StatusPill tone={statusTone[order.status]}>
                    {orderStatusLabels[order.status]}
                  </StatusPill>
                  <span className="text-sm font-semibold text-foreground">
                    {formatPrice(order.totalIdr)}
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
