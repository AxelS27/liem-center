/* eslint-disable @typescript-eslint/no-explicit-any */
import { createHash } from 'node:crypto';

import type { PaymentNotification } from '@repo/types';

import { ApiError } from '../../lib/errors';
import { createSupabaseServiceClient } from '../../lib/supabase';

type PaymentStatus = 'pending' | 'paid' | 'failed' | 'expired' | 'cancelled' | 'refunded';

function mapStatus(transactionStatus: string, fraudStatus?: string): PaymentStatus {
  switch (transactionStatus) {
    case 'settlement':
      return 'paid';
    case 'capture':
      return fraudStatus === 'challenge' ? 'pending' : 'paid';
    case 'pending':
      return 'pending';
    case 'deny':
    case 'failure':
      return 'failed';
    case 'cancel':
      return 'cancelled';
    case 'expire':
      return 'expired';
    default:
      return 'pending';
  }
}

// Webhook is the source of truth: verify the signature, update payment + order state, and grant
// entitlements once paid. Idempotent and safe to retry (see docs/engineering/PAYMENTS.md).
export async function handlePaymentNotification(payload: PaymentNotification) {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;

  if (!serverKey) {
    throw new ApiError('SERVER_ERROR', 'Payments are not configured.');
  }

  const expected = createHash('sha512')
    .update(payload.order_id + payload.status_code + payload.gross_amount + serverKey)
    .digest('hex');

  if (expected !== payload.signature_key) {
    throw new ApiError('UNAUTHORIZED', 'Invalid notification signature.');
  }

  const supabase = createSupabaseServiceClient();
  const { data: payment, error } = await supabase
    .from('payments')
    .select('id, order_id, status')
    .eq('provider', 'midtrans')
    .eq('provider_order_id', payload.order_id)
    .maybeSingle();

  if (error) {
    throw new ApiError('SERVER_ERROR', 'Unable to process the notification.');
  }

  if (!payment) {
    throw new ApiError('NOT_FOUND', 'No payment was found for this order.');
  }

  const status = mapStatus(payload.transaction_status, payload.fraud_status);

  await supabase
    .from('payments')
    .update({
      provider_transaction_id: payload.transaction_id ?? null,
      raw_payload: payload,
      signature_verified: true,
      status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', payment.id);

  if (status === 'paid') {
    await markOrderPaid(payment.order_id);
  } else if (status === 'cancelled' || status === 'expired') {
    await supabase.from('orders').update({ status }).eq('id', payment.order_id);
  }

  return { status };
}

async function markOrderPaid(orderId: string) {
  const supabase = createSupabaseServiceClient();

  const { data: order } = await supabase
    .from('orders')
    .select('id, user_id, status, total_idr, order_items(product_id)')
    .eq('id', orderId)
    .maybeSingle();

  if (!order || order.status === 'paid') {
    return;
  }

  await supabase.from('orders').update({ status: 'paid' }).eq('id', orderId);

  const entitlementRows = (order.order_items ?? []).map((item: any) => ({
    order_id: orderId,
    product_id: item.product_id,
    source: 'purchase',
    user_id: order.user_id,
  }));

  if (entitlementRows.length > 0) {
    await supabase
      .from('entitlements')
      .upsert(entitlementRows, { onConflict: 'user_id,product_id', ignoreDuplicates: true });
  }

  // Bump lifetime spend so membership tiers reflect the purchase.
  const { data: profile } = await supabase
    .from('profiles')
    .select('lifetime_spend_idr')
    .eq('id', order.user_id)
    .maybeSingle();

  if (profile) {
    await supabase
      .from('profiles')
      .update({ lifetime_spend_idr: Number(profile.lifetime_spend_idr ?? 0) + Number(order.total_idr ?? 0) })
      .eq('id', order.user_id);
  }
}
