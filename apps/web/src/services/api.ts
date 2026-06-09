import {
  checkoutResponseSchema,
  libraryResponseSchema,
  notificationsResponseSchema,
  orderResponseSchema,
  ordersResponseSchema,
  productResponseSchema,
  productsResponseSchema,
  supportTicketResponseSchema,
  supportTicketsResponseSchema,
  unreadCountResponseSchema,
  userProfileResponseSchema,
  wishlistResponseSchema,
  type CheckoutRequest,
} from '@repo/types';

import { createSupabaseServerClient } from '@/lib/supabase/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1';

async function getServerAccessToken() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session?.access_token ?? null;
}

async function apiFetch(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  headers.set('Accept', 'application/json');

  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
}

async function authedApiFetch(path: string, init: RequestInit = {}) {
  const token = await getServerAccessToken();

  if (!token) {
    throw new Error('Authentication is required.');
  }

  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${token}`);

  return apiFetch(path, { ...init, headers });
}

export async function getProducts(search?: string) {
  const query = search ? `?search=${encodeURIComponent(search)}` : '';

  return productsResponseSchema.parse(await apiFetch(`/products${query}`, { cache: 'no-store' }))
    .data.items;
}

export async function getProduct(slug: string) {
  return productResponseSchema.parse(await apiFetch(`/products/${slug}`, { cache: 'no-store' }))
    .data;
}

export async function getLibrary() {
  return libraryResponseSchema.parse(await authedApiFetch('/library', { cache: 'no-store' })).data
    .items;
}

export async function getOrders() {
  return ordersResponseSchema.parse(await authedApiFetch('/orders', { cache: 'no-store' })).data
    .items;
}

export async function getOrder(id: string) {
  return orderResponseSchema.parse(await authedApiFetch(`/orders/${id}`, { cache: 'no-store' }))
    .data;
}

export async function createCheckout(request: CheckoutRequest) {
  return checkoutResponseSchema.parse(
    await authedApiFetch('/checkout', {
      body: JSON.stringify(request),
      method: 'POST',
    }),
  ).data;
}

export async function getWishlist() {
  return wishlistResponseSchema.parse(await authedApiFetch('/wishlist', { cache: 'no-store' }))
    .data.items;
}

export async function getNotifications() {
  return notificationsResponseSchema.parse(
    await authedApiFetch('/notifications', { cache: 'no-store' }),
  ).data.items;
}

export async function getUnreadCount() {
  return unreadCountResponseSchema.parse(
    await authedApiFetch('/notifications/unread-count', { cache: 'no-store' }),
  ).data.count;
}

export async function getMyProfile() {
  return userProfileResponseSchema.parse(await authedApiFetch('/users/me', { cache: 'no-store' }))
    .data;
}

export async function getSupportTickets() {
  return supportTicketsResponseSchema.parse(
    await authedApiFetch('/support/tickets', { cache: 'no-store' }),
  ).data.items;
}

export async function createSupportTicket(input: {
  category: string;
  message: string;
  orderId?: string;
  subject: string;
}) {
  return supportTicketResponseSchema.parse(
    await authedApiFetch('/support/tickets', {
      body: JSON.stringify(input),
      method: 'POST',
    }),
  ).data;
}
