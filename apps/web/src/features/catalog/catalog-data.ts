import type { Product, ProductCategory, ProductType } from '@repo/types';

export type { ChangelogEntry, Product, ProductCategory, ProductType, Review } from '@repo/types';

export const productTypeLabels: Record<ProductType, string> = {
  free: 'Free',
  github: 'GitHub',
  download: 'Download',
  bundle: 'Bundle',
};

export const categoryLabels: Record<ProductCategory, string> = {
  repos: 'GitHub',
  apps: 'Apps',
  prompts: 'Prompts',
  skills: 'Skills',
  templates: 'Templates',
  bundle: 'Bundle',
};

export function formatPrice(priceIdr: number): string {
  if (priceIdr === 0) {
    return 'Free';
  }

  return new Intl.NumberFormat('id-ID', {
    currency: 'IDR',
    maximumFractionDigits: 0,
    style: 'currency',
  }).format(priceIdr);
}

export function getProductCover(product: Pick<Product, 'coverUrl'>) {
  return product.coverUrl ?? '/icon.png';
}
