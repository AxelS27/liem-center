import { buttonVariants, cn } from '@repo/ui';

import { StatusPill, type StatusTone } from '@/components/shared/status-pill';
import { getAdminCodes, type AdminCode } from '@/features/admin';

const statusTone: Record<AdminCode['status'], StatusTone> = {
  active: 'success',
  redeemed: 'neutral',
  expired: 'warning',
  revoked: 'danger',
};

const kindLabels: Record<AdminCode['kind'], string> = {
  gift: 'Gift',
  promo: 'Promo',
  admin: 'Admin',
};

export default function AdminCodesPage() {
  const codes = getAdminCodes();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Codes</h2>
        <button type="button" className={cn(buttonVariants({ size: 'sm' }))}>
          Generate codes
        </button>
      </div>

      <div className="mt-4 overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-secondary/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Code</th>
              <th className="px-4 py-3 font-medium">Kind</th>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {codes.map((code) => (
              <tr key={code.code} className="transition-colors hover:bg-secondary/30">
                <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-foreground">
                  {code.code}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{kindLabels[code.kind]}</td>
                <td className="px-4 py-3 text-muted-foreground">{code.product}</td>
                <td className="px-4 py-3">
                  <StatusPill tone={statusTone[code.status]}>{code.status}</StatusPill>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                  {code.createdAt}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <button
                    type="button"
                    disabled={code.status !== 'active'}
                    className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
                  >
                    Revoke
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
