import { buttonVariants, cn } from '@repo/ui';

import { StatusPill, type StatusTone } from '@/components/shared/status-pill';
import { getAdminInvites, type AdminInvite } from '@/features/admin';

const statusTone: Record<AdminInvite['status'], StatusTone> = {
  pending: 'warning',
  invited: 'info',
  accepted: 'success',
  failed: 'danger',
  revoked: 'danger',
};

export default function AdminGithubPage() {
  const invites = getAdminInvites();

  return (
    <div>
      <h2 className="text-sm font-semibold text-foreground">GitHub access</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Repository invitations across all entitlements. Retry failed or pending invites, or revoke
        access.
      </p>

      <div className="mt-4 overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-secondary/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Repository</th>
              <th className="px-4 py-3 font-medium">Attempts</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {invites.map((invite, index) => (
              <tr key={`${invite.user}-${index}`} className="transition-colors hover:bg-secondary/30">
                <td className="px-4 py-3 text-foreground">@{invite.user}</td>
                <td className="px-4 py-3 text-muted-foreground">{invite.product}</td>
                <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-muted-foreground">
                  {invite.repo}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{invite.attempts}</td>
                <td className="px-4 py-3">
                  <StatusPill tone={statusTone[invite.status]}>{invite.status}</StatusPill>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      disabled={invite.status === 'accepted' || invite.status === 'revoked'}
                      className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
                    >
                      Retry
                    </button>
                    <button
                      type="button"
                      disabled={invite.status === 'revoked'}
                      className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
                    >
                      Revoke
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
