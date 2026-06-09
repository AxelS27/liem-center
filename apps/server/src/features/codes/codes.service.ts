/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AdminGenerateCodeRequest, AdminGeneratedCode } from '@repo/types';

import { ApiError } from '../../lib/errors';
import { createSupabaseServiceClient } from '../../lib/supabase';

const RANDOM_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function randomSegment(length = 4): string {
  let out = '';
  for (let index = 0; index < length; index += 1) {
    out += RANDOM_CHARS[Math.floor(Math.random() * RANDOM_CHARS.length)];
  }
  return out;
}

function productLabel(names: string[]): string {
  if (names.length <= 2) {
    return names.join(', ');
  }
  return `${names[0]} +${names.length - 1} more`;
}

export async function redeemCode(userId: string, rawCode: string) {
  const code = rawCode.trim().toUpperCase();
  const supabase = createSupabaseServiceClient();

  const { data: codeRow, error } = await supabase
    .from('codes')
    .select('id, status, uses, uses_count, expires_at, code_products(product_id)')
    .eq('code', code)
    .maybeSingle();

  if (error) {
    throw new ApiError('SERVER_ERROR', 'Unable to redeem this code.');
  }

  if (!codeRow) {
    throw new ApiError('NOT_FOUND', 'That code was not found.');
  }

  if (codeRow.status === 'revoked') {
    throw new ApiError('BAD_REQUEST', 'That code has been revoked.');
  }

  if (codeRow.status === 'redeemed' || codeRow.uses_count >= codeRow.uses) {
    throw new ApiError('BAD_REQUEST', 'That code has already been fully redeemed.');
  }

  if (codeRow.expires_at && new Date(codeRow.expires_at).getTime() < Date.now()) {
    throw new ApiError('BAD_REQUEST', 'That code has expired.');
  }

  const productIds = (codeRow.code_products ?? []).map((row: any) => row.product_id);

  if (productIds.length === 0) {
    throw new ApiError('BAD_REQUEST', 'That code does not grant any product.');
  }

  // Create one entitlement per granted product (idempotent on user_id, product_id).
  const entitlementRows = productIds.map((productId: string) => ({
    code_id: codeRow.id,
    product_id: productId,
    source: 'redeem',
    user_id: userId,
  }));

  const { error: entError } = await supabase
    .from('entitlements')
    .upsert(entitlementRows, { onConflict: 'user_id,product_id', ignoreDuplicates: true });

  if (entError) {
    throw new ApiError('SERVER_ERROR', 'Unable to add the product to your library.');
  }

  const nextCount = codeRow.uses_count + 1;
  await supabase
    .from('codes')
    .update({
      status: nextCount >= codeRow.uses ? 'redeemed' : 'active',
      uses_count: nextCount,
    })
    .eq('id', codeRow.id);

  const { data: products } = await supabase
    .from('products')
    .select('slug, name')
    .in('id', productIds);

  return (products ?? []).map((product: any) => ({ name: product.name, slug: product.slug }));
}

export async function generateCode(
  adminId: string,
  input: AdminGenerateCodeRequest,
): Promise<AdminGeneratedCode> {
  const supabase = createSupabaseServiceClient();

  const { data: products, error: productError } = await supabase
    .from('products')
    .select('id, name')
    .in('slug', input.productSlugs);

  if (productError || !products || products.length === 0) {
    throw new ApiError('BAD_REQUEST', 'Select at least one valid product.');
  }

  let code: string;
  if (input.mode === 'custom') {
    code = (input.code ?? '').trim().toUpperCase();
    if (code.length < 4) {
      throw new ApiError('BAD_REQUEST', 'Custom code must be at least 4 characters.');
    }
  } else {
    const prefix = (input.prefix?.trim() || 'LIEM').toUpperCase().replace(/[^A-Z0-9]/g, '');
    code = `${prefix}-${randomSegment()}-${randomSegment()}`;
  }

  const kind = input.uses > 1 ? 'promo' : 'gift';

  const { data: codeRow, error } = await supabase
    .from('codes')
    .insert({ code, created_by: adminId, kind, uses: input.uses })
    .select('id')
    .single();

  if (error || !codeRow) {
    if ((error as any)?.code === '23505') {
      throw new ApiError('CONFLICT', 'That code already exists.');
    }
    throw new ApiError('SERVER_ERROR', 'Unable to generate the code.');
  }

  const { error: linkError } = await supabase
    .from('code_products')
    .insert(products.map((product: any) => ({ code_id: codeRow.id, product_id: product.id })));

  if (linkError) {
    throw new ApiError('SERVER_ERROR', 'Unable to attach products to the code.');
  }

  return {
    code,
    kind,
    product: productLabel(products.map((product: any) => product.name)),
    uses: input.uses,
  };
}
