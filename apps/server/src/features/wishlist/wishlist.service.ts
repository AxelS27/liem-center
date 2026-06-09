/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiError } from '../../lib/errors';
import { createSupabaseServiceClient } from '../../lib/supabase';
import { getProductBySlug } from '../catalog/catalog.service';

export async function listWishlist(userId: string) {
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from('wishlist_items')
    .select('products(slug)')
    .eq('user_id', userId)
    .order('added_at', { ascending: false });

  if (error) {
    throw new ApiError('SERVER_ERROR', 'Unable to load your wishlist.');
  }

  const products = await Promise.all(
    (data ?? []).map((row: any) => row.products?.slug).filter(Boolean).map(getProductBySlug),
  );

  return products;
}

export async function addWishlistItem(userId: string, productSlug: string) {
  const product = await getProductBySlug(productSlug);
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase
    .from('wishlist_items')
    .upsert({ product_id: product.id, user_id: userId }, { onConflict: 'user_id,product_id' });

  if (error) {
    throw new ApiError('SERVER_ERROR', 'Unable to update your wishlist.');
  }

  return product;
}

export async function removeWishlistItem(userId: string, productSlug: string) {
  const product = await getProductBySlug(productSlug);
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase
    .from('wishlist_items')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', product.id);

  if (error) {
    throw new ApiError('SERVER_ERROR', 'Unable to update your wishlist.');
  }
}
