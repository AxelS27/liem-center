import { buttonVariants, cn } from '@repo/ui';

import { categoryLabels, formatPrice } from '@/features/catalog';
import { getProducts } from '@/services/api';

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Products</h2>
        <button type="button" className={cn(buttonVariants({ size: 'sm' }))}>
          New product
        </button>
      </div>

      <div className="mt-4 overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-secondary/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Version</th>
              <th className="px-4 py-3 text-right font-medium">Price</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((product) => (
              <tr key={product.slug} className="transition-colors hover:bg-secondary/30">
                <td className="px-4 py-3 font-medium text-foreground">{product.name}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {categoryLabels[product.category]}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                  {product.version ?? 'Unversioned'}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right text-foreground">
                  {formatPrice(product.priceIdr)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
                    >
                      Archive
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
