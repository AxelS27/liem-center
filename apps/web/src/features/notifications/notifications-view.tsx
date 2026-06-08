'use client';

import { cn } from '@repo/ui';
import { useState } from 'react';

import { categoryLabels, type AppNotification } from './notifications-data';

/**
 * Client notification center. The in-app feed is the durable record (it is never muted by
 * preferences). Mark-as-read is local here; the real feed reads/writes the notifications API.
 */
export function NotificationsView({ initial }: { initial: AppNotification[] }) {
  const [items, setItems] = useState(initial);
  const unread = items.filter((item) => !item.read).length;

  function markAll() {
    setItems((current) => current.map((item) => ({ ...item, read: true })));
  }

  function markOne(id: string) {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, read: true } : item)),
    );
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
          const Tag = item.href ? 'a' : 'div';

          return (
            <li key={item.id}>
              <Tag
                {...(item.href ? { href: item.href } : {})}
                onClick={() => markOne(item.id)}
                className={cn(
                  'flex gap-3 py-4 transition-colors sm:px-2',
                  item.href ? 'hover:bg-secondary/40' : '',
                )}
              >
                <span
                  className={cn(
                    'mt-1.5 h-2 w-2 shrink-0 rounded-full',
                    item.read ? 'bg-transparent' : 'bg-primary',
                  )}
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-secondary px-1.5 py-0.5 text-xs font-medium text-secondary-foreground">
                      {categoryLabels[item.category]}
                    </span>
                    <span
                      className={cn(
                        'text-sm',
                        item.read ? 'font-medium text-foreground' : 'font-semibold text-foreground',
                      )}
                    >
                      {item.title}
                    </span>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.message}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.date}</p>
                </div>
              </Tag>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
