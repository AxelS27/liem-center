import {
  adminGenerateCodeRequestSchema,
  adminGenerateCodeResponseSchema,
  codeRedeemRequestSchema,
  redeemResponseSchema,
} from '@repo/types';
import { Hono } from 'hono';

import { requireAdmin, requireUser } from '../../lib/auth';
import { errorResponse } from '../../lib/errors';
import { generateCode, redeemCode } from './codes.service';

export const codesRoutes = new Hono();

codesRoutes.post('/codes/redeem', async (c) => {
  try {
    const user = await requireUser(c);
    const body = codeRedeemRequestSchema.parse(await c.req.json());
    const products = await redeemCode(user.id, body.code);

    return c.json(redeemResponseSchema.parse({ data: { products } }), 201);
  } catch (error) {
    return errorResponse(c, error);
  }
});

codesRoutes.post('/admin/codes', async (c) => {
  try {
    const admin = await requireAdmin(c);
    const body = adminGenerateCodeRequestSchema.parse(await c.req.json());
    const code = await generateCode(admin.id, body);

    return c.json(adminGenerateCodeResponseSchema.parse({ data: code }), 201);
  } catch (error) {
    return errorResponse(c, error);
  }
});
