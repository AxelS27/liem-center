// Mock library entitlements for the frontend build. Each entitlement references a catalog
// product by slug; the view resolves product details from the catalog feature. Replaced by a
// typed fetch once the backend lands.

export type EntitlementSource = 'purchase' | 'gift' | 'redeem' | 'free_claim' | 'admin_grant';
export type AccessStatus = 'active' | 'revoked';
export type InviteStatus = 'pending' | 'invited' | 'accepted' | 'failed' | 'revoked';

export type Entitlement = {
  id: string;
  productSlug: string;
  source: EntitlementSource;
  ownedSince: string;
  access: AccessStatus;
  invite?: InviteStatus;
};

export const sourceLabels: Record<EntitlementSource, string> = {
  purchase: 'Purchase',
  gift: 'Gift',
  redeem: 'Redeem',
  free_claim: 'Free claim',
  admin_grant: 'Admin grant',
};

export const inviteLabels: Record<InviteStatus, string> = {
  pending: 'Invite pending',
  invited: 'Invited',
  accepted: 'Accepted',
  failed: 'Invite failed',
  revoked: 'Revoked',
};

const entitlements: Entitlement[] = [
  {
    id: 'ent_1',
    productSlug: 'liem-monorepo',
    source: 'purchase',
    ownedSince: '2026-05-29',
    access: 'active',
    invite: 'accepted',
  },
  {
    id: 'ent_2',
    productSlug: 'liem-ai-plugin',
    source: 'purchase',
    ownedSince: '2026-05-31',
    access: 'active',
    invite: 'failed',
  },
  {
    id: 'ent_3',
    productSlug: 'liem-ui-kit',
    source: 'gift',
    ownedSince: '2026-05-12',
    access: 'active',
  },
  {
    id: 'ent_4',
    productSlug: 'liem-starter-docs',
    source: 'free_claim',
    ownedSince: '2026-04-23',
    access: 'active',
  },
];

export function getEntitlements(): Entitlement[] {
  return entitlements;
}
