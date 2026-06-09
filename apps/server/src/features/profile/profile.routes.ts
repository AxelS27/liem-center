import { profileUpdateRequestSchema, userProfileResponseSchema } from '@repo/types';
import { Hono } from 'hono';

import { requireUser } from '../../lib/auth';
import { errorResponse } from '../../lib/errors';
import { getProfileByUserId, getProfileByUsername, updateProfile } from './profile.service';

export const profileRoutes = new Hono();

profileRoutes.get('/users/me', async (c) => {
  try {
    const user = await requireUser(c);
    const profile = await getProfileByUserId(user.id);

    return c.json(userProfileResponseSchema.parse({ data: profile }));
  } catch (error) {
    return errorResponse(c, error);
  }
});

profileRoutes.patch('/users/me', async (c) => {
  try {
    const user = await requireUser(c);
    const body = profileUpdateRequestSchema.parse(await c.req.json());
    const profile = await updateProfile(user.id, body);

    return c.json(userProfileResponseSchema.parse({ data: profile }));
  } catch (error) {
    return errorResponse(c, error);
  }
});

profileRoutes.get('/users/:username', async (c) => {
  try {
    const profile = await getProfileByUsername(c.req.param('username'));

    return c.json(userProfileResponseSchema.parse({ data: profile }));
  } catch (error) {
    return errorResponse(c, error);
  }
});
