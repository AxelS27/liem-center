/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Product } from '@repo/types';

import { ApiError, assertFound } from '../../lib/errors';
import { createSupabaseServiceClient } from '../../lib/supabase';

type ProductRow = Record<string, any>;

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function mapProduct(row: ProductRow): Product {
  const dependencies = asStringArray(row.requires).map((name) => ({ name, slug: name }));
  const dbDependencies = Array.isArray(row.product_dependencies)
    ? row.product_dependencies
        .map((item: any) => item.required_product)
        .filter(Boolean)
        .map((product: any) => ({ name: product.name, slug: product.slug }))
    : [];

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tagline: row.tagline ?? '',
    type: row.type,
    category: row.category,
    priceIdr: Number(row.price_idr ?? 0),
    version: row.version,
    updatedAt: row.updated_at,
    coverUrl: row.cover_url,
    overview: asStringArray(row.overview),
    features: asStringArray(row.features),
    howToUse: asStringArray(row.how_to_use),
    requires: dbDependencies.map((item) => item.name).concat(dependencies.map((item) => item.name)),
    dependencies: dbDependencies,
    githubRepo: row.github_repo,
    changelog: Array.isArray(row.changelog_entries)
      ? row.changelog_entries.map((entry: any) => ({
          id: entry.id,
          version: entry.version,
          date: entry.released_at,
          changes: asStringArray(entry.changes),
        }))
      : [],
    roadmap: Array.isArray(row.roadmap_items)
      ? row.roadmap_items.map((item: any) => ({
          id: item.id,
          title: item.title,
          status: item.status,
          detail: item.body_md,
        }))
      : [],
    reviews: Array.isArray(row.reviews)
      ? row.reviews.map((review: any) => ({
          id: review.id,
          author: 'Verified owner',
          tier: 'Member',
          rating: Number(review.rating),
          title: review.title ?? '',
          body: review.body_md ?? '',
        }))
      : [],
  };
}

const productSelect = `
  *,
  changelog_entries(id, version, released_at, changes),
  roadmap_items(id, title, body_md, status, position),
  reviews(id, rating, title, body_md, hidden, created_at),
  product_dependencies(required_product:required_product_id(slug, name))
`;

export async function listProducts({
  category,
  limit,
  search,
  type,
}: {
  category?: string;
  limit: number;
  search?: string;
  type?: string;
}) {
  const supabase = createSupabaseServiceClient();
  let query = supabase
    .from('products')
    .select(productSelect)
    .eq('status', 'published')
    .order('published_at', { ascending: false, nullsFirst: false })
    .limit(limit);

  if (type) {
    query = query.eq('type', type);
  }

  if (category) {
    query = query.eq('category', category);
  }

  if (search?.trim()) {
    query = query.or(`name.ilike.%${search.trim()}%,tagline.ilike.%${search.trim()}%`);
  }

  const { data, error } = await query;

  if (error) {
    throw new ApiError('SERVER_ERROR', 'Unable to load products.');
  }

  return (data ?? []).map(mapProduct);
}

export async function getProductBySlug(slug: string) {
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from('products')
    .select(productSelect)
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (error) {
    throw new ApiError('SERVER_ERROR', 'Unable to load this product.');
  }

  return mapProduct(assertFound(data as ProductRow | null, 'No product was found for this slug.'));
}

export async function getPublishedProductsBySlugs(slugs: string[]) {
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from('products')
    .select(productSelect)
    .eq('status', 'published')
    .in('slug', slugs);

  if (error) {
    throw new ApiError('SERVER_ERROR', 'Unable to load products.');
  }

  return (data ?? []).map(mapProduct);
}
