import { StatusPill, type StatusTone } from '@/components/shared/status-pill';
import { getAdminMetrics } from '@/features/admin';
import { formatPrice, getProduct } from '@/features/catalog';
import { getOrders, orderStatusLabels, type OrderStatus } from '@/features/orders';

const statusTone: Record<OrderStatus, StatusTone> = {
  paid: 'success',
  awaiting_payment: 'warning',
  refunded: 'danger',
  cancelled: 'neutral',
};

export default function AdminOverviewPage() {
  const metrics = getAdminMetrics();
  const recentOrders = getOrders().slice(0, 5);

  return (
    <div>
      <dl className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-lg border border-border bg-card p-5">
            <dt className="text-sm text-muted-foreground">{metric.label}</dt>
            <dd className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
              {metric.value}
            </dd>
            {metric.hint ? <p className="mt-1 text-xs text-muted-foreground">{metric.hint}</p> : null}
          </div>
        ))}
      </dl>

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Recent orders</h2>
          <a
            href="/admin/orders"
            className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            View all
          </a>
        </div>

        <div className="mt-4 overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentOrders.map((order) => (
                <tr key={order.id} className="transition-colors hover:bg-secondary/30">
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-foreground">
                    {order.id}
                  </td>
                  <td className="px-4 py-3 text-foreground">
                    {getProduct(order.items[0]?.productSlug ?? '')?.name ?? '—'}
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
