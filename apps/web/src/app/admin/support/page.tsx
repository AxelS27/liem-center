import { StatusPill, type StatusTone } from '@/components/shared/status-pill';
import { getAdminTickets, type AdminTicket } from '@/features/admin';

const statusTone: Record<AdminTicket['status'], StatusTone> = {
  open: 'warning',
  in_progress: 'info',
  resolved: 'success',
  closed: 'neutral',
};

const statusLabels: Record<AdminTicket['status'], string> = {
  open: 'Open',
  in_progress: 'In progress',
  resolved: 'Resolved',
  closed: 'Closed',
};

const priorityTone: Record<AdminTicket['priority'], StatusTone> = {
  low: 'neutral',
  normal: 'info',
  high: 'danger',
};

export default function AdminSupportPage() {
  const tickets = getAdminTickets();

  return (
    <div>
      <h2 className="text-sm font-semibold text-foreground">Support queue</h2>

      <div className="mt-4 overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-secondary/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Ticket</th>
              <th className="px-4 py-3 font-medium">Subject</th>
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Priority</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="transition-colors hover:bg-secondary/30">
                <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-foreground">
                  {ticket.id}
                </td>
                <td className="px-4 py-3 text-foreground">{ticket.subject}</td>
                <td className="px-4 py-3 text-muted-foreground">@{ticket.user}</td>
                <td className="px-4 py-3 text-muted-foreground">{ticket.category}</td>
                <td className="px-4 py-3">
                  <StatusPill tone={priorityTone[ticket.priority]}>{ticket.priority}</StatusPill>
                </td>
                <td className="px-4 py-3">
                  <StatusPill tone={statusTone[ticket.status]}>
                    {statusLabels[ticket.status]}
                  </StatusPill>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                  {ticket.updatedAt}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
