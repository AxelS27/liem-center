import { buttonVariants, cn } from '@repo/ui';

import { StatusPill } from '@/components/shared/status-pill';
import { getAdminUsers } from '@/features/admin';

export default function AdminUsersPage() {
  const users = getAdminUsers();

  return (
    <div>
      <h2 className="text-sm font-semibold text-foreground">Users</h2>

      <div className="mt-4 overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-secondary/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Tier</th>
              <th className="px-4 py-3 font-medium">Products</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user) => (
              <tr key={user.id} className="transition-colors hover:bg-secondary/30">
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground">@{user.username}</p>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{user.tier}</td>
                <td className="px-4 py-3 text-muted-foreground">{user.products}</td>
                <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{user.joined}</td>
                <td className="px-4 py-3">
                  {user.status === 'active' ? (
                    <StatusPill tone="success">Active</StatusPill>
                  ) : (
                    <StatusPill tone="danger">Suspended</StatusPill>
                  )}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
                    >
                      Grant
                    </button>
                    <button
                      type="button"
                      className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
                    >
                      {user.status === 'active' ? 'Suspend' : 'Restore'}
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
