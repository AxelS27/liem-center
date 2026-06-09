/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Order, Product } from '@repo/types';

import { ApiError, assertFound } from '../../lib/errors';
import { createSupabaseServiceClient } from '../../lib/supabase';
import { getPublishedProductsBySlugs } from '../catalog/catalog.service';

function mapOrder(row: any): Order {
  return {
    id: row.id,
    status: row.status,
    subtotalIdr: Number(row.subtotal_idr ?? 0),
    discountIdr: Number(row.discount_idr ?? 0),
    totalIdr: Number(row.total_idr ?? 0),
    recipientType: row.recipient_type,
    createdAt: row.created_at,
    items: Array.isArray(row.order_items)
      ? row.order_items.map((item: any) => ({
          id: item.id,
          unitPriceIdr: Number(item.unit_price_idr ?? 0),
          quantity: Number(item.quantity ?? 1),
          product: {
            id: item.products.id,
            slug: item.products.slug,
            name: item.products.name,
            type: item.products.type,
            coverUrl: item.products.cover_url,
          },
        }))
      : [],
  };
}

export async function createCheckoutOrder({
  recipientType,
  slugs,
  userId,
}: {
  recipientType: 'self' | 'gift';
  slugs: string[];
  userId: string;
}) {
  const uniqueSlugs = [...new Set(slugs)];
  const products: Product[] = await getPublishedProductsBySlugs(uniqueSlugs);

  if (products.length !== uniqueSlugs.length) {
    throw new ApiError('BAD_REQUEST', 'One or more products are not available.');
  }

  const subtotal = products.reduce((sum: number, product: Product) => sum + product.priceIdr, 0);
  const supabase = createSupabaseServiceClient();

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      discount_idr: 0,
      recipient_type: recipientType,
      status: 'awaiting_payment',
      subtotal_idr: subtotal,
      total_idr: subtotal,
      user_id: userId,
    })
    .select()
    .single();

  if (orderError) {
    throw new ApiError('SERVER_ERROR', 'Unable to create the order.');
  }

  const { error: itemsError } = await supabase.from('order_items').insert(
    products.map((product: Product) => ({
      order_id: order.id,
      product_id: product.id,
      quantity: 1,
      unit_price_idr: product.priceIdr,
    })),
  );

  if (itemsError) {
    throw new ApiError('SERVER_ERROR', 'Unable to create the order items.');
  }

  const { error: paymentError } = await supabase.from('payments').insert({
    gross_amount_idr: subtotal,
    order_id: order.id,
    provider: 'midtrans',
    provider_order_id: order.id,
    status: 'pending',
  });

  if (paymentError) {
    throw new ApiError('SERVER_ERROR', 'Unable to create the payment record.');
  }

  return getOrder(userId, order.id);
}

export async function listOrders(userId: string) {
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*, products(id, slug, name, type, cover_url))')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    throw new ApiError('SERVER_ERROR', 'Unable to load your orders.');
  }

  return (data ?? []).map(mapOrder);
}

export async function getOrder(userId: string, id: string) {
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*, products(id, slug, name, type, cover_url))')
    .eq('user_id', userId)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw new ApiError('SERVER_ERROR', 'Unable to load this order.');
  }

  return mapOrder(assertFound(data, 'No order was found for this id.'));
}
