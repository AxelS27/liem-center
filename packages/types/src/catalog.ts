import { z } from 'zod';

export const productTypeSchema = z.enum(['free', 'github', 'download', 'bundle']);
export const productCategorySchema = z.enum([
  'repos',
  'apps',
  'prompts',
  'skills',
  'templates',
  'bundle',
]);

export const changelogEntrySchema = z.object({
  id: z.string().uuid(),
  version: z.string(),
  date: z.string(),
  changes: z.array(z.string()),
});

export const roadmapItemSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  status: z.enum(['planned', 'in_progress', 'completed']),
  detail: z.string().nullable(),
});

export const reviewSchema = z.object({
  id: z.string().uuid(),
  author: z.string(),
  tier: z.string(),
  rating: z.number().int().min(1).max(5),
  title: z.string(),
  body: z.string(),
});

export const productSchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  name: z.string(),
  tagline: z.string(),
  type: productTypeSchema,
  category: productCategorySchema,
  priceIdr: z.number().int().nonnegative(),
  version: z.string().nullable(),
  updatedAt: z.string(),
  coverUrl: z.string().nullable(),
  overview: z.array(z.string()),
  features: z.array(z.string()),
  howToUse: z.array(z.string()),
  requires: z.array(z.string()),
  dependencies: z.array(z.object({ slug: z.string(), name: z.string() })),
  githubRepo: z.string().nullable(),
  changelog: z.array(changelogEntrySchema),
  roadmap: z.array(roadmapItemSchema),
  reviews: z.array(reviewSchema),
});

export const reviewRequestSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().max(120).optional().default(''),
  body: z.string().min(10).max(4000),
});

export const reviewResponseSchema = z.object({
  data: reviewSchema,
});

export const productsQuerySchema = z.object({
  search: z.string().optional(),
  type: productTypeSchema.optional(),
  category: productCategorySchema.optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(24),
});

export const productsResponseSchema = z.object({
  data: z.object({
    items: z.array(productSchema),
    nextCursor: z.string().nullable(),
  }),
});

export const productResponseSchema = z.object({
  data: productSchema,
});

export type ProductType = z.infer<typeof productTypeSchema>;
export type ProductCategory = z.infer<typeof productCategorySchema>;
export type ChangelogEntry = z.infer<typeof changelogEntrySchema>;
export type RoadmapItem = z.infer<typeof roadmapItemSchema>;
export type Review = z.infer<typeof reviewSchema>;
export type Product = z.infer<typeof productSchema>;
export type ProductsResponse = z.infer<typeof productsResponseSchema>;
export type ProductResponse = z.infer<typeof productResponseSchema>;
export type ReviewRequest = z.infer<typeof reviewRequestSchema>;
export type ReviewResponse = z.infer<typeof reviewResponseSchema>;
