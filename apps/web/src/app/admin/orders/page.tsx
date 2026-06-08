import { buttonVariants, cn } from '@repo/ui';

import { StatusPill, type StatusTone } from '@/components/shared/status-pill';
import { formatPrice, getProduct } from '@/features/catalog';
import { getOrders, orderStatusLabels, type OrderStatus } from '@/features/orders';

const statusTone: Record<OrderStatus, StatusTone> = {
  paid: 'success',
  awaiting_payment: 'warning',
  refunded: 'danger',
  cancelled: 'neutral',
};

export default function AdminOrdersPage() {
  const orders = getOrders();

  return (
    <div>
      <h2 className="text-sm font-semibold text-foreground">Orders</h2>

      <div className="mt-4 overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-secondary/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Total</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((order) => (
              <tr key={order.id} className="transition-colors hover:bg-secondary/30">
                <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-foreground">
                  {order.id}
                </td>
                <td className="px-4 py-3 text-foreground">
                  {getProduct(order.items[0]?.productSlug ?? '')?.name ?? '—'}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {order.recipientType === 'gift' ? 'Gift' : 'Self'}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                  {order.placedAt}
                </td>
                <td className="px-4 py-3">
                  <StatusPill tone={statusTone[order.status]}>
                    {orderStatusLabels[order.status]}
                  </StatusPill>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right font-medium text-foreground">
                  {formatPrice(order.totalIdr)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <button
                    type="button"
                    disabled={order.status !== 'paid'}
                    className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
                  >
                    Refund
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
