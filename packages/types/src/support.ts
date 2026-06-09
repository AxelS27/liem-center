import { z } from 'zod';

export const ticketStatusSchema = z.enum(['open', 'in_progress', 'resolved', 'closed']);
export const ticketPrioritySchema = z.enum(['low', 'normal', 'high']);

export const supportMessageSchema = z.object({
  id: z.string().uuid(),
  senderRole: z.enum(['user', 'admin']),
  message: z.string(),
  createdAt: z.string(),
});

export const supportTicketSchema = z.object({
  id: z.string().uuid(),
  subject: z.string(),
  category: z.string(),
  status: ticketStatusSchema,
  priority: ticketPrioritySchema,
  createdAt: z.string(),
  updatedAt: z.string(),
  messages: z.array(supportMessageSchema),
});

export const createSupportTicketRequestSchema = z.object({
  subject: z.string().min(3).max(120),
  category: z.string().min(2).max(80),
  message: z.string().min(10).max(5000),
  orderId: z.string().uuid().optional(),
});

export const supportTicketsResponseSchema = z.object({
  data: z.object({ items: z.array(supportTicketSchema) }),
});

export const supportTicketResponseSchema = z.object({
  data: supportTicketSchema,
});

export type SupportTicket = z.infer<typeof supportTicketSchema>;
