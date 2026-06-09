/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiError, assertFound } from '../../lib/errors';
import { createSupabaseServiceClient } from '../../lib/supabase';

function mapTicket(row: any) {
  return {
    id: row.id,
    subject: row.subject,
    category: row.category,
    status: row.status,
    priority: row.priority,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    messages: Array.isArray(row.support_messages)
      ? row.support_messages.map((message: any) => ({
          id: message.id,
          senderRole: message.sender_role,
          message: message.message,
          createdAt: message.created_at,
        }))
      : [],
  };
}

export async function listSupportTickets(userId: string) {
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from('support_tickets')
    .select('*, support_messages(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .order('created_at', { ascending: true, foreignTable: 'support_messages' });

  if (error) {
    throw new ApiError('SERVER_ERROR', 'Unable to load support tickets.');
  }

  return (data ?? []).map(mapTicket);
}

export async function getSupportTicket(userId: string, id: string) {
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from('support_tickets')
    .select('*, support_messages(*)')
    .eq('user_id', userId)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw new ApiError('SERVER_ERROR', 'Unable to load this support ticket.');
  }

  return mapTicket(assertFound(data, 'No support ticket was found for this id.'));
}

export async function createSupportTicket({
  category,
  message,
  orderId,
  subject,
  userId,
}: {
  category: string;
  message: string;
  orderId?: string;
  subject: string;
  userId: string;
}) {
  const supabase = createSupabaseServiceClient();
  const { data: ticket, error: ticketError } = await supabase
    .from('support_tickets')
    .insert({
      category,
      related_order_id: orderId ?? null,
      subject,
      user_id: userId,
    })
    .select()
    .single();

  if (ticketError) {
    throw new ApiError('SERVER_ERROR', 'Unable to create the support ticket.');
  }

  const { error: messageError } = await supabase.from('support_messages').insert({
    message,
    sender_id: userId,
    sender_role: 'user',
    ticket_id: ticket.id,
  });

  if (messageError) {
    throw new ApiError('SERVER_ERROR', 'Unable to create the support message.');
  }

  return getSupportTicket(userId, ticket.id);
}
