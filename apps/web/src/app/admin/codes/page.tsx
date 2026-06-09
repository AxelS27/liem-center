import { CodesManager, getAdminCodes } from '@/features/admin';
import { getProducts } from '@/services/api';

export default async function AdminCodesPage() {
  const codes = getAdminCodes();
  const products = (await getProducts()).map((product) => ({ slug: product.slug, name: product.name }));

  return <CodesManager initialCodes={codes} products={products} />;
}
