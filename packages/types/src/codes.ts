import { z } from 'zod';

export const codeRedeemRequestSchema = z.object({
  code: z.string().min(4).max(40),
});

export const redeemResponseSchema = z.object({
  data: z.object({
    products: z.array(z.object({ slug: z.string(), name: z.string() })),
  }),
});

export const adminGenerateCodeRequestSchema = z.object({
  productSlugs: z.array(z.string()).min(1),
  mode: z.enum(['random', 'custom']),
  code: z.string().max(40).optional(),
  prefix: z.string().max(20).optional(),
  uses: z.number().int().min(1).max(100000).default(1),
});

export const adminCodeSchema = z.object({
  code: z.string(),
  kind: z.enum(['gift', 'promo', 'admin']),
  uses: z.number().int(),
  product: z.string(),
});

export const adminGenerateCodeResponseSchema = z.object({
  data: adminCodeSchema,
});

export type CodeRedeemRequest = z.infer<typeof codeRedeemRequestSchema>;
export type RedeemResponse = z.infer<typeof redeemResponseSchema>;
export type AdminGenerateCodeRequest = z.infer<typeof adminGenerateCodeRequestSchema>;
export type AdminGeneratedCode = z.infer<typeof adminCodeSchema>;
