'use client';

import { cn } from '@repo/ui';
import { useState } from 'react';

import { authedRequest } from '@/services/client-api';

import { getNotificationCategory, type AppNotification } from './notifications-data';

/**
 * Client notification center. The in-app feed is the durable record (it is never muted by
 * preferences). Mark-as-read is optimistic and persisted via the read endpoints.
 */
export function NotificationsView({ initial }: { initial: AppNotification[] }) {
  const [items, setItems] = useState(initial);
  const unread = items.filter((item) => !item.isRead).length;

  function markAll() {
    setItems((current) => current.map((item) => ({ ...item, isRead: true })));
    void authedRequest('/notifications/read-all', { method: 'POST' }).catch(() => undefined);
  }

  function markOne(id: string) {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, isRead: true } : item)),
    );
    void authedRequest(`/notifications/${id}/read`, { method: 'POST' }).catch(() => undefined);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {unread > 0 ? `${unread} unread` : 'All caught up'}
        </p>
        <button
          type="button"
          onClick={markAll}
          disabled={unread === 0}
          className="text-sm font-medium text-primary transition-colors hover:text-primary/80 disabled:text-muted-foreground"
        >
          Mark all as read
        </button>
      </div>

      <ul className="mt-4 divide-y divide-border border-y border-border">
        {items.map((item) => {
          const Tag = item.linkUrl ? 'a' : 'div';

          return (
            <li key={item.id}>
              <Tag
                {...(item.linkUrl ? { href: item.linkUrl } : {})}
                onClick={() => markOne(item.id)}
                className={cn(
                  'flex gap-3 py-4 transition-colors sm:px-2',
                  item.linkUrl ? 'hover:bg-secondary/40' : '',
                )}
              >
                <span
                  className={cn(
                    'mt-1.5 h-2 w-2 shrink-0 rounded-full',
                    item.isRead ? 'bg-transparent' : 'bg-primary',
                  )}
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-secondary px-1.5 py-0.5 text-xs font-medium text-secondary-foreground">
                      {getNotificationCategory(item.type)}
                    </span>
                    <span
                      className={cn(
                        'text-sm',
                        item.isRead ? 'font-medium text-foreground' : 'font-semibold text-foreground',
                      )}
                    >
                      {item.title}
                    </span>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.message}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.createdAt}</p>
                </div>
              </Tag>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
