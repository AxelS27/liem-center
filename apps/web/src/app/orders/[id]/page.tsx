import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { StatusPill, type StatusTone } from '@/components/shared/status-pill';
import { formatPrice, getProduct, productTypeLabels } from '@/features/catalog';
import { getOrder, getOrders, orderStatusLabels, type OrderStatus } from '@/features/orders';

type Params = Promise<{ id: string }>;

const statusTone: Record<OrderStatus, StatusTone> = {
  paid: 'success',
  awaiting_payment: 'warning',
  refunded: 'danger',
  cancelled: 'neutral',
};

export function generateStaticParams() {
  return getOrders().map((order) => ({ id: order.id }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;

  return { title: `Order ${id}` };
}

export default async function OrderDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const order = getOrder(id);

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
            Placed {order.placedAt} · {order.recipientType === 'gift' ? 'Gift purchase' : 'For your account'}
          </p>
        </div>
        <StatusPill tone={statusTone[order.status]}>{orderStatusLabels[order.status]}</StatusPill>
      </div>

      <ul className="mt-8 divide-y divide-border border-y border-border">
        {order.items.map((item) => {
          const product = getProduct(item.productSlug);

          return (
            <li key={item.productSlug} className="flex items-center justify-between gap-4 py-4">
              <div>
                <a
                  href={`/products/${item.productSlug}`}
                  className="text-sm font-semibold text-foreground transition-colors hover:text-foreground/70"
                >
                  {product?.name ?? item.productSlug}
                </a>
                {product ? (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {productTypeLabels[product.type]}
                  </p>
                ) : null}
              </div>
              <span className="text-sm font-medium text-foreground">
                {formatPrice(item.priceIdr)}
              </span>
            </li>
          );
        })}
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

      {order.paymentMethod ? (
        <p className="mt-6 text-xs text-muted-foreground">Paid via {order.paymentMethod}.</p>
      ) : null}
    </section>
  );
}
