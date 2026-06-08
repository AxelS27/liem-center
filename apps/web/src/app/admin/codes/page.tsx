import { CodesManager, getAdminCodes } from '@/features/admin';
import { getProducts } from '@/features/catalog';

export default function AdminCodesPage() {
  const codes = getAdminCodes();
  const products = getProducts().map((product) => ({ slug: product.slug, name: product.name }));

  return <CodesManager initialCodes={codes} products={products} />;
}
