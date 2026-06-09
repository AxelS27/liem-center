import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { StatusPill, type StatusTone } from '@/components/shared/status-pill';
import { formatPrice, productTypeLabels } from '@/features/catalog';
import { orderStatusLabels, type OrderStatus } from '@/features/orders';
import { getOrder } from '@/services/api';

type Params = Promise<{ id: string }>;

const statusTone: Record<OrderStatus, StatusTone> = {
  awaiting_payment: 'warning',
  cancelled: 'neutral',
  draft: 'neutral',
  paid: 'success',
  refunded: 'danger',
};

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;

  return { title: `Order ${id}` };
}

export default async function OrderDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const order = await getOrder(id).catch(() => null);

  if (!order) {
    notFound();
  }

  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-16 sm:py-20">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <a href="/orders" className="transition-colors hover:text-foreground">
          Orders
        </a>
        <span className="px-2" aria-hidden="true">
          /
        </span>
        <span className="font-mono text-foreground">{order.id}</span>
      </nav>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-mono text-2xl font-semibold tracking-tight text-foreground">
            {order.id}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Placed {order.createdAt} ·{' '}
            {order.recipientType === 'gift' ? 'Gift purchase' : 'For your account'}
          </p>
        </div>
        <StatusPill tone={statusTone[order.status]}>{orderStatusLabels[order.status]}</StatusPill>
      </div>

      <ul className="mt-8 divide-y divide-border border-y border-border">
        {order.items.map((item) => (
          <li key={item.id} className="flex items-center justify-between gap-4 py-4">
            <div>
              <a
                href={`/products/${item.product.slug}`}
                className="text-sm font-semibold text-foreground transition-colors hover:text-foreground/70"
              >
                {item.product.name}
              </a>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {productTypeLabels[item.product.type]}
              </p>
            </div>
            <span className="text-sm font-medium text-foreground">
              {formatPrice(item.unitPriceIdr)}
            </span>
          </li>
        ))}
      </ul>

      <dl className="mt-6 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Subtotal</dt>
          <dd className="text-foreground">{formatPrice(order.subtotalIdr)}</dd>
        </div>
        {order.discountIdr > 0 ? (
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Discount</dt>
            <dd className="text-foreground">-{formatPrice(order.discountIdr)}</dd>
          </div>
        ) : null}
        <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
          <dt>Total</dt>
          <dd>{formatPrice(order.totalIdr)}</dd>
        </div>
      </dl>

      <p className="mt-6 text-xs text-muted-foreground">
        Payment is confirmed by the server-side payment webhook.
      </p>
    </section>
  );
}
