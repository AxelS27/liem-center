/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Entitlement, Product } from '@repo/types';

import { ApiError } from '../../lib/errors';
import { createSupabaseServiceClient } from '../../lib/supabase';
import { getProductBySlug } from '../catalog/catalog.service';

function pickProduct(product: Product) {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    tagline: product.tagline,
    type: product.type,
    category: product.category,
    priceIdr: product.priceIdr,
    version: product.version,
    coverUrl: product.coverUrl,
    githubRepo: product.githubRepo,
  };
}

function mapEntitlement(row: any, product: Product): Entitlement {
  const invite = Array.isArray(row.github_invites) ? row.github_invites[0] : null;

  return {
    id: row.id,
    source: row.source,
    ownedSince: row.acquired_at,
    access: row.revoked_at ? 'revoked' : 'active',
    invite: invite?.status ?? null,
    product: pickProduct(product),
  };
}

export async function listEntitlements(userId: string) {
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from('entitlements')
    .select('*, products(slug), github_invites(status)')
    .eq('user_id', userId)
    .order('acquired_at', { ascending: false });

  if (error) {
    throw new ApiError('SERVER_ERROR', 'Unable to load your library.');
  }

  const items = await Promise.all(
    (data ?? []).map(async (row: any) => {
      const slug = row.products?.slug;
      if (!slug) {
        return null;
      }

      return mapEntitlement(row, await getProductBySlug(slug));
    }),
  );

  return items.filter((item): item is Entitlement => Boolean(item));
}

export async function claimFreeProduct(userId: string, slug: string) {
  const product = await getProductBySlug(slug);

  if (product.type !== 'free') {
    throw new ApiError('BAD_REQUEST', 'Only free products can be claimed.');
  }

  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from('entitlements')
    .upsert(
      { product_id: product.id, source: 'free_claim', user_id: userId },
      { onConflict: 'user_id,product_id' },
    )
    .select('*, github_invites(status)')
    .single();

  if (error) {
    throw new ApiError('SERVER_ERROR', 'Unable to claim this product.');
  }

  return mapEntitlement(data, product);
}
