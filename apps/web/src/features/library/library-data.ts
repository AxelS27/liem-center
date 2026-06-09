import type { Entitlement, EntitlementSource, InviteStatus } from '@repo/types';

export type { Entitlement, EntitlementSource, InviteStatus } from '@repo/types';

export const sourceLabels: Record<EntitlementSource, string> = {
  admin_grant: 'Admin grant',
  free_claim: 'Free claim',
  gift: 'Gift',
  purchase: 'Purchase',
  redeem: 'Redeem',
};

export const inviteLabels: Record<InviteStatus, string> = {
  accepted: 'Accepted',
  failed: 'Invite failed',
  invited: 'Invited',
  pending: 'Invite pending',
  revoked: 'Revoked',
};

export function getPinnedSlug(entitlement: Entitlement) {
  return entitlement.product.slug;
}
