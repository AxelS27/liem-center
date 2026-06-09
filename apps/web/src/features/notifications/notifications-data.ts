export type { AppNotification } from '@repo/types';

export function getNotificationCategory(type: string) {
  if (type.includes('github')) {
    return 'GitHub';
  }

  if (type.includes('purchase') || type.includes('payment')) {
    return 'Purchase';
  }

  if (type.includes('redeem')) {
    return 'Redeem';
  }

  if (type.includes('badge')) {
    return 'Badge';
  }

  if (type.includes('tier')) {
    return 'Tier';
  }

  if (type.includes('support')) {
    return 'Support';
  }

  return 'Product';
}
