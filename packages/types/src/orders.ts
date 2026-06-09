import { z } from 'zod';

import { productSchema } from './catalog';

export const orderStatusSchema = z.enum([
  'draft',
  'awaiting_payment',
  'paid',
  'cancelled',
  'refunded',
]);

export const orderItemSchema = z.object({
  id: z.string().uuid(),
  unitPriceIdr: z.number().int().nonnegative(),
  quantity: z.number().int().positive(),
  product: productSchema.pick({ id: true, slug: true, name: true, type: true, coverUrl: true }),
});

export const orderSchema = z.object({
  id: z.string().uuid(),
  status: orderStatusSchema,
  subtotalIdr: z.number().int().nonnegative(),
  discountIdr: z.number().int().nonnegative(),
  totalIdr: z.number().int().nonnegative(),
  recipientType: z.enum(['self', 'gift']),
  createdAt: z.string(),
  items: z.array(orderItemSchema),
});

export const checkoutRequestSchema = z.object({
  items: z.array(z.string()).min(1),
  couponCode: z.string().optional(),
  recipient: z.object({ type: z.enum(['self', 'gift']) }).optional(),
});

export const checkoutResponseSchema = z.object({
  data: z.object({
    order: orderSchema,
    snapToken: z.string().nullable(),
    redirectUrl: z.string().nullable(),
    paymentStatus: z.literal('not_configured').or(z.literal('pending')),
  }),
});

export const ordersResponseSchema = z.object({
  data: z.object({
    items: z.array(orderSchema),
    nextCursor: z.string().nullable(),
  }),
});

export const orderResponseSchema = z.object({
  data: orderSchema,
});

// Midtrans HTTP notification (webhook) body. Extra fields are allowed and ignored.
export const paymentNotificationSchema = z
  .object({
    order_id: z.string(),
    status_code: z.string(),
    gross_amount: z.string(),
    signature_key: z.string(),
    transaction_status: z.string(),
    fraud_status: z.string().optional(),
    transaction_id: z.string().optional(),
    payment_type: z.string().optional(),
  })
  .passthrough();

export type OrderStatus = z.infer<typeof orderStatusSchema>;
export type PaymentNotification = z.infer<typeof paymentNotificationSchema>;
export type Order = z.infer<typeof orderSchema>;
export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>;
export type CheckoutResponse = z.infer<typeof checkoutResponseSchema>;
