import type { TaskPriority, TicketStatus } from './common';

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  category: 'reader' | 'author' | 'publisher';
  priority: TaskPriority;
  status: TicketStatus;
  assignee: string | null;
  createdAt: string;
}

export interface TicketNote {
  id: string;
  ticketId: string;
  content: string;
  isInternal: boolean;
  author: string;
  createdAt: string;
}
