import { buttonVariants, cn } from '@repo/ui';

import { StatusPill, type StatusTone } from '@/components/shared/status-pill';
import { formatPrice } from '@/features/catalog';
import { orderStatusLabels, type OrderStatus } from '@/features/orders';
import { getOrders } from '@/services/api';

const statusTone: Record<OrderStatus, StatusTone> = {
  awaiting_payment: 'warning',
  cancelled: 'neutral',
  draft: 'neutral',
  paid: 'success',
  refunded: 'danger',
};

export default async function AdminOrdersPage() {
  const orders = await getOrders();

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
                  {order.items[0]?.product.name ?? 'No items'}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {order.recipientType === 'gift' ? 'Gift' : 'Self'}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                  {order.createdAt}
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
