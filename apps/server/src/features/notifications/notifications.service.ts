/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiError } from '../../lib/errors';
import { createSupabaseServiceClient } from '../../lib/supabase';

function mapNotification(row: any) {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    message: row.message,
    linkUrl: row.link_url,
    isRead: Boolean(row.is_read),
    createdAt: row.created_at,
  };
}

export async function listNotifications(userId: string) {
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    throw new ApiError('SERVER_ERROR', 'Unable to load notifications.');
  }

  return (data ?? []).map(mapNotification);
}

export async function unreadCount(userId: string) {
  const supabase = createSupabaseServiceClient();
  const { count, error } = await supabase
    .from('notifications')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_read', false);

  if (error) {
    throw new ApiError('SERVER_ERROR', 'Unable to load notification count.');
  }

  return count ?? 0;
}

export async function markNotificationRead(userId: string, id: string) {
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('id', id);

  if (error) {
    throw new ApiError('SERVER_ERROR', 'Unable to update this notification.');
  }
}

export async function markAllNotificationsRead(userId: string) {
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('is_read', false);

  if (error) {
    throw new ApiError('SERVER_ERROR', 'Unable to update notifications.');
  }
}
